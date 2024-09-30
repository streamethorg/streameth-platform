import { clipVideo } from './utils/clipping';
import { logger } from './utils/logger';
import connection from './utils/mq';

async function clippingEngineQueue() {
  logger.info('Clipping Engine Queue is running');
  try {
    const queue = 'clipping-engine';
    const channel = await (await connection).createChannel();
    let data;
    channel.assertQueue(queue, {
      durable: true,
    });
    channel.consume(
      queue,
      async (msg) => {
        try {
          const payload = Buffer.from(msg.content).toString();
          data = JSON.parse(payload);
          console.log('data', data);
          await clipVideo(data);
        } catch (error) {
          logger.error('Error processing message:', error);
          channel.ack(msg);
        }
      },
      {
        noAck: true,
      },
    );
  } catch (e) {
    logger.error({
      message: e.message,
    });
  }
}

clippingEngineQueue();
