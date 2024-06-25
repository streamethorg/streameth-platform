import { config } from '@config';
import amqp from 'amqplib';
import { logger } from './logger';

const RETRY_INTERVAL = 5000; // 5 seconds
const MAX_RETRIES = 5;
async function connectToRabbitMQ(retries = 0) {
  try {
    const connection = await amqp.connect(config.mq);
    logger.info('RabbitMQ connected', connection);

    connection.on('error', (e) => {
      logger.error('RabbitMQ connection error:', e);
      if (e.message !== 'Connection closing') {
        reconnectToRabbitMQ();
      }
    });

    connection.on('close', () => {
      logger.warn('RabbitMQ connection closed');
      reconnectToRabbitMQ();
    });

    return connection;
  } catch (e) {
    if (retries < MAX_RETRIES) {
      logger.warn(
        `RabbitMQ connection failed. Retrying in ${RETRY_INTERVAL / 1000} seconds...`,
      );
      setTimeout(() => connectToRabbitMQ(retries + 1), RETRY_INTERVAL);
    } else {
      logger.error('Max retries reached. Could not connect to RabbitMQ:', e);
      return;
    }
  }
}

function reconnectToRabbitMQ() {
  logger.info(
    `Reconnecting to RabbitMQ in ${RETRY_INTERVAL / 1000} seconds...`,
  );
  setTimeout(() => connectToRabbitMQ(), RETRY_INTERVAL);
}
const connection = connectToRabbitMQ();
export default connection;
