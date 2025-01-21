import { config } from '@config';
import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { RecordingSessionPayload } from '@interfaces/livepeer.webhook.interface';
import {
  eVisibilty,
  ISession,
  ProcessingStatus,
  SessionType,
} from '@interfaces/session.interface';
import {
  StateStatus,
  StateType,
  TranscriptionStatus,
} from '@interfaces/state.interface';
import { IUploadSession } from '@interfaces/upload.session.interface';
import Event from '@models/event.model';
import Organization from '@models/organization.model';
import Session from '@models/session.model';
import Stage from '@models/stage.model';
import State from '@models/state.model';
import { ChatAPI } from '@utils/ai.chat';
import { getAsset, getDownloadUrl, getStreamRecordings } from '@utils/livepeer';
import { refreshAccessToken } from '@utils/oauth';
import { sessionTranscriptionsQueue, videoUploadQueue } from '@utils/redis';
import { Types } from 'mongoose';
import MarkerService from './marker.service';
import { IMarker } from '@interfaces/marker.interface';
import PineconeService from './pinecone.service';

interface AIHighlight {
  start: number;
  end: number;
  title: string;
}

export default class SessionService {
  private path: string;
  private controller: BaseController<ISession>;
  constructor() {
    this.path = 'sessions';
    this.controller = new BaseController<ISession>('db', Session);
  }

  async create(data: ISession): Promise<ISession> {
    let eventId = '';
    let eventSlug = '';
    let stageId = '';
    if (data.stageId == undefined || data.stageId.toString().length === 0) {
      stageId = new Types.ObjectId().toString();
    } else {
      let stage = await Stage.findById(data.stageId);
      stageId = stage._id;
    }
    if (data.eventId == undefined || data.eventId.toString().length === 0) {
      eventId = new Types.ObjectId().toString();
      if (data.speakers == undefined || data.speakers.length == 0)
        data.speakers = [];
      if (data.speakers.length > 0)
        data.speakers.map((speaker) => (speaker.eventId = eventId));
    } else {
      let event = await Event.findById(data.eventId);
      eventId = event._id;
      eventSlug = event.slug;
    }
    return this.controller.store.create(
      data.name,
      {
        ...data,
        eventSlug: eventSlug,
        eventId: eventId,
        stageId: stageId,
        type: data.type,
        processingStatus: data?.processingStatus ?? ProcessingStatus.pending,
      },
      `${this.path}/${eventId}`,
    );
  }

  async update(sessionId: string, session: ISession): Promise<ISession> {
    return await this.controller.store.update(sessionId, session, session.name);
  }

  async findOne(query: {}): Promise<ISession> {
    return await this.controller.store.findOne(query);
  }

  async get(sessionId: string): Promise<ISession> {
    const findSession = await this.controller.store.findById(sessionId);
    if (!findSession) throw new HttpException(404, 'Session not found');
    return findSession;
  }

  async getAll(d: {
    event: string;
    organizationId: string;
    speaker: string;
    stageId: string;
    assetId: string;
    onlyVideos: boolean;
    size: number;
    page: number;
    published: string;
    type: string;
    itemStatus: string;
    itemDate: string; // unix timestamp
    clipable: boolean;
  }): Promise<{
    sessions: Array<ISession>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      limit: number;
    };
  }> {
    let filter: {} = {};

    // Only exclude animations and editor clips if no specific type is requested and no stageId is provided
    if (d.type === undefined && d.stageId === undefined) {
      console.log('No type or stageId specified, excluding animations and editor clips');
      filter = {
        type: { $nin: [SessionType.animation, SessionType.editorClip] },
      };
    } else if (d.type !== undefined) {
      console.log('Type specified:', d.type);
      filter = { type: d.type };
    }

    if (d.published != undefined) {
      filter = { ...filter, published: d.published };
    }
    if (d.itemStatus != undefined) {
      filter = { ...filter, processingStatus: d.itemStatus };
    }
    if (d.itemDate != undefined) {
      const itemDateNumber = Number(d.itemDate);
      const startOfDay = new Date(itemDateNumber);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(itemDateNumber);
      endOfDay.setHours(23, 59, 59, 999);

      filter = { ...filter, createdAt: { $gte: startOfDay, $lte: endOfDay } };
    }
    if (d.clipable) {
      // its clippable if createdAt not older than 7 days and processingStatus is completed and type is livestream
      const clipableDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      filter = {
        ...filter,
        createdAt: { $gte: clipableDate },
        processingStatus: ProcessingStatus.completed,
        type: SessionType.livestream,
      };
    }
    if (d.event != undefined) {
      let query = this.queryByIdOrSlug(d.event);
      let event = await Event.findOne(query);
      filter = { ...filter, eventId: event?._id };
    }
    if (d.organizationId != undefined) {
      filter = { ...filter, organizationId: d.organizationId };
    }
    if (d.onlyVideos) {
      filter = {
        ...filter,
        $or: [
          { playbackId: { $ne: '' } },
          { assetId: { $ne: '' } },
          { type: SessionType.animation },
        ],
      };
    }
    if (d.assetId != undefined) {
      filter = { ...filter, assetId: d.assetId };
    }
    if (d.stageId != undefined) {
      let query = this.queryByIdOrSlug(d.stageId);
      let stage = await Stage.findOne(query);
      filter = { ...filter, stageId: stage?._id };
    }

    const pageSize = Number(d.size) || 0;
    const pageNumber = Number(d.page) || 0;
    const skip = pageSize * pageNumber - pageSize;

    const sessions = await this.controller.store.findAll(
      filter,
      {},
      this.path,
      skip,
      pageSize,
    );

    const totalItems = await this.controller.store.countDocuments(filter);
    return {
      sessions: sessions,
      pagination: {
        totalItems: totalItems,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalItems / pageSize),
        limit: pageSize,
      },
    };
  }

  async deleteOne(sessionId: string): Promise<void> {
    await this.get(sessionId);
    return await this.controller.store.delete(sessionId);
  }

  async createMetadata(sessionId: string) {
    let session = await Session.findById(sessionId);
    let animation = await getDownloadUrl(session.assetId);
    console.log('animation_url:', animation);
    let metadata = {
      name: session.name,
      description: session.description,
      external_url: `${config.baseUrl}/watch?event=${session.eventSlug}&session=${session._id}`,
      animation_url: await getDownloadUrl(session.assetId),
      image: session.coverImage,
      attributes: [
        {
          start: session.start,
          end: session.end,
          stageId: session.stageId,
          speakers: session.speakers,
          source: session.source,
          playbackId: session.playbackId,
          assetId: session.assetId,
          eventId: session.eventId,
          track: session.track,
          coverImage: session.coverImage,
          slug: session.slug,
          organizationId: session.organizationId,
          eventSlug: session.eventSlug,
          createdAt: session.createdAt,
          aiDescription: session.aiDescription,
          autoLabels: session.autoLabels,
          videoTranscription: session.videoTranscription,
        },
      ],
    };
    return metadata;
  }

  async getOrgEventSessions(organizationId: string): Promise<Array<ISession>> {
    let sessions = [];
    const events = await Event.find({ organizationId: organizationId });
    for (const event of events) {
      let session = await this.getAll({
        event: event._id,
        published: eVisibilty.public,
        onlyVideos: true,
      } as any);
      sessions.push(session.sessions);
    }
    return sessions;
  }

  async filterSessions(
    query: string,
    organizationId?: string,
  ): Promise<Array<ISession>> {
    console.time('filterSessionsExecutionTime');
    console.log(query);
    const sessions = await this.controller.store.findAll(
      {
        name: { $regex: query, $options: 'i' },
        organizationId: organizationId ? organizationId : '',
      },
      {},
      this.path,
      0,
      10,
    );
    console.timeEnd('filterSessionsExecutionTime');
    return sessions;
  }

  async createStreamRecordings(payload: RecordingSessionPayload) {
    let stage = await Stage.findOne({
      'streamSettings.streamId': payload.parentId,
    });
    const asset = await getAsset(payload.assetId);
    const session = await this.create({
      name: `${stage.name}-Recording ${stage.recordingIndex}`.trim(),
      description: payload.name,
      start: payload.createdAt,
      end: payload.lastSeen,
      playbackId: payload.playbackId,
      videoUrl: payload.recordingUrl,
      organizationId: stage.organizationId,
      assetId: payload.assetId,
      stageId: stage._id.toString(),
      type: SessionType.livestream,
      playback: {
        videoUrl: payload.recordingUrl,
        format: asset.videoSpec?.format ?? '',
        duration: asset.videoSpec?.duration ?? 0,
      },
      processingStatus: ProcessingStatus.completed,
    });
    await stage.updateOne({ $inc: { recordingIndex: 1 } });
    await this.sessionTranscriptions({
      organizationId: session.organizationId,
      sessionId: session._id.toString(),
    });
  }

  async sessionTranscriptions(
    data: Pick<IUploadSession, 'organizationId' | 'sessionId'>,
  ) {
    const session = await this.get(data.sessionId.toString());
    const queue = await sessionTranscriptionsQueue();
    await queue.add({
      ...data,
      session: {
        id: session._id,
        videoUrl: session.videoUrl,
        slug: session.slug,
        name: session.name,
      },
    });
    await this.update(data.sessionId.toString(), {
      //@ts-ignore
      ...session.toObject(),
      transcripts: {
        ...(session.transcripts || {}),
        status: TranscriptionStatus.processing,
      },
    });
  }

  async uploadSessionToSocials(data: IUploadSession) {
    const session = await this.get(data.sessionId.toString());
    if (!session.assetId || !session.videoUrl) {
      throw new HttpException(400, 'Asset Id or video Url does not exist');
    }
    let token;
    if (data.socialId) {
      const org = await Organization.findOne({
        _id: data.organizationId,
        'socials._id': data.socialId,
      });
      token = org.socials.find(
        (e) => e.type == data.type && e._id == data.socialId,
      );
    }
    if (data.type == 'youtube') {
      data.token = {
        secret: await refreshAccessToken(token?.refreshToken),
      };
    }
    if (data.type == 'twitter') {
      if (session.playback.duration > 140) {
        throw new HttpException(
          400,
          'Twitter only supports videos less than 2 minutes',
        );
      }
      data.token = { key: token.accessToken, secret: token.refreshToken };
    }
    const queue = await videoUploadQueue();
    await queue.add({
      ...data,
      session: {
        videoUrl: session.videoUrl,
        slug: session.slug,
        name: session.name,
        description: session.description,
        coverImage: session.coverImage,
        published: session.published,
      },
    });
    const state = await State.findOne({
      sessionId: data.sessionId,
      type: StateType.social,
      socialType: data.type,
    });
    if (state) {
      await state.updateOne({ status: StateStatus.pending });
    } else {
      await State.create({
        organizationId: data.organizationId,
        sessionId: data.sessionId,
        status: StateStatus.pending,
        type: StateType.social,
        socialType: data.type,
      });
    }
  }

  private async createMultipleStreamRecordings(streamId: string) {
    const recordings = await getStreamRecordings(streamId);
    for (const recording of recordings) {
      let stage = await Stage.findOne({ 'streamSettings.streamId': streamId });
      await this.create({
        name: recording.name,
        description: recording.name,
        start: recording.createdAt,
        end: recording.lastSeen,
        playbackId: recording.playbackId,
        videoUrl: recording.recordingUrl,
        organizationId: stage.organizationId,
        type: SessionType.livestream,
      });
    }
  }

  private queryByIdOrSlug(id: string) {
    const isObjectId = /[0-9a-f]{24}/i.test(id);
    const query = isObjectId ? { _id: id } : { slug: id };
    return query;
  }

  async extractHighlights(
    stageId: string,
    sessionId: string,
    prompt?: string,
  ): Promise<IMarker[]> {
    const session = await this.get(sessionId);
    if (!session.transcripts) {
      console.log('Session has no transcripts');
      throw new HttpException(400, 'Session has no transcripts');
    }

    const chat = new ChatAPI();
    const chunks = session.transcripts.chunks;

    const pineconeService = new PineconeService(session._id.toString());
    if (!(await pineconeService.namespaceHasData())) {
      const phrases = await pineconeService.wordsToPhrases(chunks);
      await pineconeService.embed(phrases);
    }

    const queries = [
      'thank you, thank you',
      'APLAUSE',
      'please take a seat',
      'we are going to start',
      'alright thank you so much',
      'Welcome to',
      'Next up, we have',
      'Please give it up for',
      "Let's get started with",
      "We're excited to welcome",
      "We're honored to present",
      'time is unfortunately up',
      'Thank you for your time',
      'Thank you for your attention',
      'Thank you for your time',
      'Thank you for your attention',
      'a round of applause for',
      'thank you all to our panelists',
      'hi everyone',
      'Excited to have',
      'Four our next panel',
      'please welcome',
      'please give it up for',
      'I thnik we will move on to our ',
      'I wanted to welcome to the stage',
      'going to hand over to',
      'welcome to the stage ',
    ];

    let similarityScores = await pineconeService.query(queries);

    console.log('similarityScores', similarityScores);
    similarityScores = similarityScores.filter((score) => score.score > 0.9);
    // if b < a + 15, remove b, if not keep and and b and evaluate c
    // for (let i = 0; i < similarityScores.length; i++) {
    //   if (
    //     similarityScores[i + 1] &&
    //     Number(similarityScores[i + 1].metadata.start) <
    //       Number(similarityScores[i].metadata.start) + 15
    //   ) {
    //     similarityScores.splice(i + 1, 1);
    //   }
    // }

    const words = similarityScores.map((score) => {
      // return all words 10 seconds before and after the score
      const start = Number(score.metadata.start);
      const end = Number(score.metadata.end) + 120;
      const chunkss = chunks.filter(
        (chunk) => chunk.start >= start && chunk.end <= end,
      );
      return {
        ...score,
        chunks: chunkss,
        text: chunkss.map((chunk) => chunk.word).join(' '),
      };
    });

    console.log('words', words);

    const markerService = new MarkerService();

    const highlights = await chat.chat([
      {
        role: 'system',
        content: `
        Task Description:
          You are an AI assistant specializing in analyzing transcripts of livestreams to identify and structure key segments.
          Your task is to extract full speaker presentations or panel discussions based on specific markers and content cues,
          ensuring logical and complete coverage of each segment.
          A prior analysis has been done on the transcript to identify posible speaker or 
          panel introductions or stage transitions using cosine similarity based on the following queries: ${queries}
          We have then extracted 60 seconds before and after the text that generated the similarity score.
          Finally we have prepared a data structure that you need to analyze and return the start and end timestamps of the speaker presentations or panel discussions.

          Data structure input:
          [{
            "start": number, // start timestamp of the text
            "end": number, // end timestamp of the text
            "text": string, // text that was used to generate the similarity score
            "chunks": [{ // 120 seconds after the text
              "start": number, // start timestamp of the word
              "end": number, // end timestamp of the word
              "word": string // word
            }
            ...  
            ]
          }
          ...          
          ]

          Instructions:
          Analyze the provided transcript segments to identify start and end timestamps for full speaker presentations or panels. 
          Use context markers such as:
          Introductions: Phrases like "Thank you, thank you," "Welcome to," "Next up, we have," "Please give it up for," etc.
          Transitions: Indicators such as "discussion on," "presentation about," "closing remarks on," or similar cues that suggest a shift in the event's focus.
          You may have to infer or use logic to determine the start and end of the segment. For example: 
          DataStructure[0]
          {
            "start": 100,
            "text": "So now lets bring up on stage xyz person",
            "chunks": [{
              "start": 10,
              "end": 120,
              "word": "Thank"
            }
              ...
            ]
          }

          DataStructure[1]
          {
            "start": 300,
            "text": "Thank you xyz person, now we will move on to our next speaker Peter",
            "chunks": [{
              "start": 10,
              "end": 120,
              "word": "Thank"
            }
              ...
            ]
          }

          You should use logic to determine the following output:
          [{
            "start": 100,
            "end": 300,
            "title": "XYZ Person presentation"
          },
          {
            "start": 300,
            "end": ...
            "title": "Peter presentation"
          }]

          Output Format:
          Return a JSON array with each object representing a speaker presentation or panel. 
          Use the following structure exactly:
            [{
              "start": number,    // Timestamp (in seconds) where the segment begins
              "end": number,      // Timestamp (in seconds) where the segment ends
              "title": string     // A clear and descriptive title summarizing the segment
            }
              ...
            ]


          Constraints:
          Talsk or panel discussions usually last 10-30 minutes
          If not explicitly stated, never return clips shorter than 10 minutes
          Ensure that titles accurately summarize the segment content without repetition.
          Do not return anything other than an array of objects.
          Clip timestamps must be precise and aligned with the transcript.
          Never return null attribute value

          Notes:
          Use your expertise to identify clear transitions and logical breaks in the event.
          Handle any edge cases or ambiguity by aiming for completeness and consistency.
        `,
      },
      {
        role: 'user',
        content: ` Here is the data structure: ${JSON.stringify(words)}
       ${prompt ? `Here is the prompt provided by the user: ${prompt}` : ''}
      `,
      },
    ]);

    const parsedHighlights: unknown = JSON.parse(highlights);
    console.log('parsedHighlights', parsedHighlights);
    // Type guard function to validate the structure
    const isValidHighlight = (item: unknown): item is AIHighlight => {
      return (
        typeof item === 'object' &&
        item !== null &&
        'start' in item &&
        'end' in item &&
        'title' in item &&
        typeof (item as AIHighlight).start === 'number' &&
        typeof (item as AIHighlight).end === 'number' &&
        typeof (item as AIHighlight).title === 'string'
      );
    };

    // Validate array and its contents
    if (
      !Array.isArray(parsedHighlights) ||
      !parsedHighlights.every(isValidHighlight)
    ) {
      throw new HttpException(500, 'AI returned invalid highlight format');
    }

    if (parsedHighlights.length === 0) {
      return [];
    }

    const markerPromises = await Promise.all(
      parsedHighlights.map(
        async (highlight) =>
          await markerService.create({
            name: highlight.title,
            start: Number(highlight.start),
            end: Number(highlight.end),
            stageId: stageId,
            sessionId: session._id,
            organizationId: session.organizationId.toString(),
            date: session.createdAt.toString(),
            color: '#000000',
            startClipTime: Number(highlight.start),
            endClipTime: Number(highlight.end),
          }),
      ),
    );

    return markerPromises;
  }
}
