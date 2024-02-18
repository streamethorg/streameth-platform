import BaseImporter from '..';
import moment from 'moment-timezone';

export default class PretalxImporter extends BaseImporter {
  async generateSpeakers(sheetId: string, eventId: string): Promise<void> {
    let request = await fetch(`${'dd00'}/speakers/`);
    if (!request.ok) {
      throw new Error('Network response was not ok');
    }
    let data: any = await request.json();
    let speakers = data.results;

    while (data.next) {
      request = await fetch(data.next);
      if (!request.ok) {
        throw new Error('Network response was not ok');
      }
      data = await request.json();
      speakers = [...speakers, ...data.results];
    }
    speakers.forEach(async (speaker: any) => {
      const newSpeaker = {
        name: speaker.name,
        bio: speaker.biography,
        photo: speaker.avatar,
        twitter: speaker.twitter_handle,
        github: speaker.github_handle,
        website: speaker.website,
        eventId: eventId,
        organizationId: '',
      };

      try {
        if (speaker) {
          await this.speakerService.create(newSpeaker);
        }
      } catch (e) {
        console.log(e);
      }
    });
  }

  async generateStages(sheetId: string, eventId: string): Promise<void> {
    let request = await fetch(`${''}/rooms/`);
    if (!request.ok) {
      throw new Error('Network response was not ok');
    }
    let data: any = await request.json();
    let stages = data.results;

    while (data.next) {
      request = await fetch(data.next, { method: 'GET' });
      if (!request.ok) {
        throw new Error('Network response was not ok');
      }
      data = await request.json();
      stages = [...stages, ...data.results];
    }
    stages.forEach(async (stage: any) => {
      const newStage = {
        name: stage.name.en,
        eventId: eventId,
        streamSettings: {
          streamId: '',
        },
        order: stage.position + 1,
        organizationId: '',
      };

      try {
        if (stage) {
          await this.stageService.create(newStage);
        }
      } catch (e) {
        console.log(e);
      }
    });
  }

  async generateSessions(d: {
    sheetId: string;
    eventId: string;
    organizationId: string;
    timezone: string;
  }): Promise<void> {
    const sheetId = d.sheetId;
    const eventId = d.eventId;
    const [speakers, stage] = await Promise.all([
      Promise.all(''),
      this.stageService.findStageForEvent(this.generateId(sheetId), eventId),
    ]);
    let request = await fetch(`${''}/talks/`);
    if (!request.ok) {
      throw new Error('Network response was not ok');
    }
    let data: any = await request.json();
    let sessions = data.results;
    while (data.next) {
      request = await fetch(data.next);
      if (!request.ok) {
        throw new Error('Network response was not ok');
      }
      data = await request.json();
      sessions = [...sessions, ...data.results];
    }
    sessions.forEach(async (session: any) => {
      const speakers = session.speakers.map(async (speaker: any) => {
        return await this.speakerService.findSpeakerForEvent(
          this.generateId(speaker.name),
          eventId,
        );
      });
      const newSession = {
        name: session.title,
        description: session.abstract,
        start: moment.tz(new Date(session.slot.start), d.timezone).valueOf(),
        end: moment.tz(new Date(session.slot.end), d.timezone).valueOf(),
        eventId: d.eventId,
        speakers: await Promise.all(speakers),
        stageId: this.generateId(session.slot.room.en),
        organizationId: '',
      };

      try {
        if (session) {
          await this.sessionService.create(newSession);
        }
      } catch (e) {
        console.log(e);
      }
    });
  }
}
