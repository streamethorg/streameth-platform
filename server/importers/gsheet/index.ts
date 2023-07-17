import BaseImporter from "../baseImporter";
import { google } from "googleapis";
import Event, { IDataImporter } from "../../model/event";
import { generateId } from "../../utils";
import { ISpeaker } from "../../model/speaker";
// Constants
const SPEAKER_SHEET = "Speakers";
const SPEAKER_DATA_RANGE = "D3:H";
const SESSION_SHEET = "Sessions";
const SESSION_DATA_RANGE = "A3:P";

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
      range: `Presentation Schedule!${range}`,
    });
    const rows = response.data.values;
    return rows ?? [];
  }

  public override async generateSpeakers(): Promise<any> {
    let allSpeakers: ISpeaker;

    const data = await this.getDataForRange(SPEAKER_SHEET, SPEAKER_DATA_RANGE);

    const speakerNames = [...new Set(data.flat().filter(Boolean))];

    for (const name of speakerNames) {
      const speaker = {
        id: name as string, // assuming the name is unique and can be used as an id
        name: name as string,
        bio: "No description",
        eventId: this.event.id,
      };

      try {
        await this.speakerController.createSpeaker(speaker).catch((e) => {
          console.error(e);
        });
      } catch (e) {
        console.error(speaker);
      }
    }

    return allSpeakers;
  }

  public override async generateStages(): Promise<void> {
    const stage = {
      name: "Farabeuf Amphitheater",
      eventId: this.event.id,
      streamSettings: {
        streamId: "0e577125-8b01-45bd-b058-c6f2731f73f9",
      },
    };
    await this.stageController.createStage(stage).catch((e) => {
      console.error(e, stage);
    });
  }

  private getEndTime(time: string, duration: string) {
    const [startHours, startMinutes] = time.split(":").map(Number);
    const [durationHours, durationMinutes] = duration.split(":").map(Number);

    let endHours = startHours + durationHours;
    let endMinutes = startMinutes + durationMinutes;

    if (endMinutes >= 60) {
      endHours += Math.floor(endMinutes / 60);
      endMinutes = endMinutes % 60;
    }

    const endTime = `${String(endHours).padStart(2, "0")}:${String(
      endMinutes
    ).padStart(2, "0")}`;

    return endTime;
  }

  public override async generateSessions(): Promise<void> {
    await Promise.all([this.generateStages(), this.generateSpeakers()]);

    const data = await this.getDataForRange(SESSION_SHEET, SESSION_DATA_RANGE);
    for (const row of data) {
      const [
        Time,
        date,
        Talk,
        Speaker1,
        Speaker2,
        Speaker3,
        Speaker4,
        Speaker5,
        EM,
        Duration,
        Track,
        Flow,
        Video,
        startCut,
        endCut,
        Description,
      ] = row;

      // Skip the row if Talk is empty
      if (!Talk || Talk.trim() === "") {
        continue;
      }

      const speakerIdsRaw = [Speaker1, Speaker2, Speaker3, Speaker4, Speaker5];
      const speakerIds = speakerIdsRaw.map((speakerId) => {
        if (!speakerId) return null;
        return generateId(speakerId.replace("speaker_", "").replace("_", " "));
      });

      const speakerPromises = speakerIds
        .filter((speakerId) => !!speakerId)
        .map((speakerId) =>
          this.speakerController.getSpeaker(speakerId, this.event.id)
        );

      const [speakers, stage] = await Promise.all([
        Promise.all(speakerPromises),
        this.stageController.getStage("farabeuf_amphitheater", this.event.id),
      ]);

      const endTime = this.getEndTime(Time, Duration);

      const session = {
        name: Talk,
        description: Description ?? "",
        stageId: stage.id,
        eventId: this.event.id,
        organizationId: this.event.organizationId,
        speakers: speakers,
        start: new Date(`${date} ${Time}`),
        end: new Date(`${date} ${endTime}`),
        videoUrl: Video,
        startCut,
        endCut,
      };

      try {
        const item = await this.sessionController.createSession(session);
        await this.sessionController.generateVideoFrame(item.id, item.eventId);
      } catch (e) {
        console.error(e);
      }
    }
  }
}
