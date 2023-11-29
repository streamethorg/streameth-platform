import { NextResponse } from 'next/server'
import StageController from '../../../../../../../../server/controller/stage';
export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { id: string; eventId: string }
  }
) {
  const stageController = new StageController()
  try {
    const data = await stageController.getAllStagesForEvent(
      params.eventId
    )
    return NextResponse.json(data)
  } catch (e) {
    console.log(e)
    return NextResponse.json({})
  }
}
