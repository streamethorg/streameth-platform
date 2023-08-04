import { extractFirstFrame } from "./utils/video";
import SessionController from "./controller/session";
import Session from "./model/session";

const eventId = "ethBerlin_2022";

async function main() {
  // const eventController = new EventController();
  // const event = await eventController.getEvent(eventId, organizationId);
  const sessionController = new SessionController();
  const sessions = await sessionController.getAllSessionsForEvent(eventId);

  for (const session of sessions) {
    try {
      const path = await Session.getSessionImagePath(session.id);
      if (!session.videoUrl) {
        throw new Error("No video url found for session " + session.id);
      }
      await extractFirstFrame(session.videoUrl, path);
    } catch (error) {
      console.log("error",session.videoUrl, error);
    }
    return
  }
}

main();
