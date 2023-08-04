import BaseController from "./baseController";
import { extractFirstFrame } from "../utils/video";
import Session, { ISession } from "../model/session";
import LivepeerService from "../services/livepeer";
import LoggerService from "../services/logger";
export default class SessionController {
  private controller: BaseController<ISession>;

  constructor() {
    this.controller = new BaseController<ISession>("fs");
  }

  public async getSession(
    sessionId: ISession["id"],
    eventId: ISession["eventId"]
  ): Promise<Session> {
    const sessionQuery = await Session.getSessionPath(eventId, sessionId);
    const data = await this.controller.get(sessionQuery);
    return new Session({ ...data });
  }

  public async createSession(session: Omit<ISession, "id">): Promise<Session> {
    const ses = new Session({ ...session });
    const sessionQuery = await Session.getSessionPath(ses.eventId, ses.id);
    await this.controller.create(sessionQuery, ses);
    return ses;
  }

  public async getAllSessionsForEvent(
    eventId: ISession["eventId"]
  ): Promise<Session[]> {
    const sessions: Session[] = [];
    const sessionQuery = await Session.getSessionPath(eventId);
    const data = await this.controller.getAll(sessionQuery);
    for (const ses of data) {
      sessions.push(new Session({ ...ses }));
    }
    return sessions;
  }

  public async generateVideoFrame(
    sessionId: ISession["id"],
    eventId: ISession["eventId"]
  ): Promise<void> {
    try {
      const session = await this.getSession(sessionId, eventId);
      const path = await Session.getSessionImagePath(sessionId);
      if (!session.videoUrl) {
        throw new Error("No video url found for session " + sessionId);
      }
      await extractFirstFrame(session.videoUrl, path);
    } catch (error) {
      console.log(error);
      const logger = new LoggerService();
      logger.logError(sessionId + " " + error);
    }
  }
}
