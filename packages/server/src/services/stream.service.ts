import { StateStatus, StateType } from '@interfaces/state.interface';
import { ICreateClip } from '@interfaces/stream.interface';
import Session from '@models/session.model';
import State from '@models/state.model';
import connection from '@utils/rabbitmq';

export default class StreamService {
  async createClip(data: ICreateClip): Promise<void> {
    const queue = 'clipping-engine';
    const channel = await (await connection).createChannel();
    channel.assertQueue(queue, {
      durable: true,
    });
    const session = await Session.findById(data.sessionId);
    const payload = {
      name: session.name,
      description: session.description,
      start: data.start,
      end: data.end,
      organizationId: data.organizationId,
      stageId: session.stageId,
      speakers: session.speakers,
      sessionId: session._id.toString(),
      m3u8Url: data.m3u8Url,
      fileName: `${session.slug}.mp4`,
    };
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
      persistent: true,
    });
    const state = await State.findOne({
      sessionId: session._id.toString(),
      type: StateType.video,
    });
    if (state) {
      await state.updateOne({
        status: StateStatus.pending,
      });
    } else {
      await State.create({
        sessionId: session._id.toString(),
        sessionSlug: session.slug,
        organizationId: session.organizationId.toString(),
        type: StateType.video,
        status: StateStatus.pending,
      });
    }
  }
}
