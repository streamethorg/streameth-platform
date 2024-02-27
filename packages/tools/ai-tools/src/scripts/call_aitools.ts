import SessionService from "../../../../server/src/services/session.service";
import startAITools from "../main";

export async function callAITools() {
  const sessionService = new SessionService();
  const { sessions } = await sessionService.getAll({} as any);

  for (const session of sessions) {
    if (session.assetId) {
      await startAITools(session.assetId).catch((err) => {
        console.log(err);
      });
    }
  }
}

callAITools()
  .then(() => {
    console.log("Finished executing the script...");
  })
  .catch((err) => {
    console.log(err);
  });

export default callAITools;
