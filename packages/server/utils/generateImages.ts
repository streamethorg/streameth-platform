import { extractFirstFrame } from "./video";
import SessionController from "../controller/session";
import Session from "../model/session";
import fs from "fs";
import path from "path";

const eventId = "base_event";

async function main() {
  const sessionController = new SessionController();
  const sessions = await sessionController.getAllSessions({
    eventId,
  });
  console.log("sessions", sessions.length);

  const dirPath = await Session.getSessionImageDirectory(eventId);
  if (!fs.existsSync(dirPath)) {
    console.log("Dir does not exists, creating it now.");
    fs.mkdirSync(dirPath, { recursive: true });
  }
  for (const session of sessions) {
    try {
      const filePath = await Session.getSessionImagePath(eventId, session.id);

      if (!session.videoUrl) {
        console.error("No video url found for session " + session.id);
        continue;
      }

      await extractFirstFrame(session.videoUrl, path.join(`../../images/sessions/${eventId}`, filePath));
    } catch (error) {
      console.log("error", session.videoUrl, error);
    }
  }
}

main();
