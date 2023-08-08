import BaseImporter from "../baseImporter";
import { google } from "googleapis";
import Event, { IDataImporter } from "../../model/event";
import { generateId } from "../../utils";

// Constants
const SPEAKER_SHEET = "Speakers";
const SPEAKER_DATA_RANGE = "A3:D";
const STAGE_SHEET = "Stages";
const STAGE_DATA_RANGE = "A3:D";
const SESSION_SHEET = "Sessions";
const SESSION_DATA_RANGE = "A3:M";

// Setting up a queue for the Google Sheets API
// const API_QUEUE = new PQueue({ concurrency: 1, interval: 1500 });

export default class Importer extends BaseImporter {
  sheetId: string;
  apiKey: string;
  connection: any;

  constructor({ importer, event }: { importer: IDataImporter; event: Event }) {
    super(event);
    if (importer.type !== "gsheet")
      throw new Error("Invalid importer type for gsheet module");
    if (!importer.config.sheetId)
      throw new Error("No valid sheetId set for gsheet module");
    if (!importer.config.apiKey)
      throw new Error(
        "gsheet module requires a valid 'GOOGLE_API_KEY' env variable"
      );

    this.sheetId = importer.config.sheetId;
    this.apiKey = importer.config.apiKey;
    this.connection = this.connectToGoogleSheets();
  }

  private connectToGoogleSheets() {
    const sheets = google.sheets({
      version: "v4",
      auth: this.apiKey,
    });

    return sheets;
  }

  private async getDataForRange(
    sheetName: string,
    range: string
  ): Promise<any> {
    // const response = (await API_QUEUE.add(() =>
    //   this.connection.spreadsheets.values.get({
    //     spreadsheetId: this.sheetId,
    //     range: `${sheetName}!${range}`,
    //   })
    // )) as any;
    const response = await this.connection.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: `${sheetName}!${range}`,
    });
    const rows = response.data.values;
    return rows ?? [];
  }

  public override async generateSpeakers(): Promise<void> {
    const data = await this.getDataForRange(SPEAKER_SHEET, SPEAKER_DATA_RANGE);
    for (const row of data) {
      const [name, description, twitterHandle, avatar] = row;
      const speaker = {
        name,
        bio: "No description",
        photo: avatar == "" ? undefined : avatar,
        twitter: twitterHandle,
        eventId: this.event.id,
      };

      try {
        if (speaker) {
          await this.speakerController.createSpeaker(speaker);
        }
      } catch (e) {
        console.error(speaker);
      }
    }
  }

  public override async generateStages(): Promise<void> {
    const data = await this.getDataForRange(STAGE_SHEET, STAGE_DATA_RANGE);
    for (const row of data) {
      const [name, streamId, image] = row;
      const stage = {
        name,
        eventId: this.event.id,
        streamSettings: {
          streamId,
        },
      };
      try {
        await this.stageController.createStage(stage);
      } catch (e) {
        console.error(stage);
      }
    }
  }

  public override async generateSessions(): Promise<void> {
    await Promise.all([this.generateStages(), this.generateSpeakers()]);

    const data = await this.getDataForRange(SESSION_SHEET, SESSION_DATA_RANGE);
    for (const row of data) {
      try {
        const [
          Name,
          Description,
          stageId,
          Day,
          Start,
          End,
          Speaker1,
          Speaker2,
          Speaker3,
          Speaker4,
          Speaker5,
          Video,
        ] = row;

        const speakerIdsRaw = [
          Speaker1,
          Speaker2,
          Speaker3,
          Speaker4,
          Speaker5,
        ];
        const speakerPromises = speakerIdsRaw
          .filter(Boolean)
          .map((speakerId) => {
            return this.speakerController.getSpeaker(
              generateId(speakerId),
              this.event.id
            );
          });

        const [speakers, stage] = await Promise.all([
          Promise.all(speakerPromises),
          this.stageController.getStage(generateId(stageId), this.event.id),
        ]);

        const session = {
          name: Name,
          description: Description,
          stageId: stage.id,
          eventId: this.event.id,
          organizationId: this.event.organizationId,
          speakers: speakers,
          start: new Date(`${Day} ${Start}`),
          end: new Date(`${Day} ${End}`),
          videoUrl: Video,
        };

        await this.sessionController.createSession(session);
      } catch (e) {
        console.error(e);
      }
    }
  }
}
