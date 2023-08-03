import { NextResponse } from "next/server";
import SessionController from "@/server/controller/session";
export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { id: string; eventId: string; sessionId: string };
  }
) {
  const sessionController = new SessionController();
  try {
    const data = await sessionController.getSession(
      params.sessionId,
      params.eventId
    );
    return NextResponse.json(data);
  } catch (e) {
    console.log(e);
    return NextResponse.json({});
  }
}
