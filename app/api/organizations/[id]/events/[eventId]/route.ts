import { NextResponse } from "next/server";
import EventController from "@/server/controller/event";

export async function GET(
  request: Request,
  { params }: { params: { id: string; eventId: string } }
) {
  const eventController = new EventController();
  try {
    const data = await eventController.getEvent(params.eventId, params.id);
    return NextResponse.json(data);
  } catch (e) {
    console.log(e);
    return NextResponse.json({});
  }
}
