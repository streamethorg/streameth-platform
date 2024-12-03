import { config } from '@config';
import amqp from 'amqplib';
import { logger } from './logger';
const { host, port, username, secret } = config.mq;

const RETRY_INTERVAL = 5000; // 5 seconds
const MAX_RETRIES = 5;

async function connectToRabbitMQ(retries = 0): Promise<amqp.Connection | undefined> {
  try {
    logger.info(`Attempting to connect to RabbitMQ at ${host}:${port} with username ${username}`);
    
    const connection = await amqp.connect({
      protocol: 'amqp',
      hostname: host,
      port: port,
      username: username,
      password: secret,
      vhost: '/',
    });
    
    logger.info('RabbitMQ connected successfully');

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

    // Create a channel to test the connection
    try {
      const channel = await connection.createChannel();
      logger.info('RabbitMQ channel created successfully');
      await channel.close();
    } catch (channelError) {
      logger.error('Failed to create RabbitMQ channel:', channelError);
      throw channelError;
    }

    return connection;
  } catch (e) {
    logger.error('RabbitMQ connection error details:', {
      error: e,
      host,
      port,
      username,
      retryCount: retries
    });

    if (retries < MAX_RETRIES) {
      logger.warn(
        `RabbitMQ connection failed. Retrying in ${RETRY_INTERVAL / 1000} seconds... (Attempt ${retries + 1}/${MAX_RETRIES})`,
      );
      return new Promise((resolve) => {
        setTimeout(async () => {
          const result = await connectToRabbitMQ(retries + 1);
          resolve(result);
        }, RETRY_INTERVAL);
      });
    } else {
      logger.error(`Max retries (${MAX_RETRIES}) reached. Could not connect to RabbitMQ`);
      return undefined;
    }
  }
}

function reconnectToRabbitMQ() {
  logger.info(
    `Scheduling RabbitMQ reconnection in ${RETRY_INTERVAL / 1000} seconds...`,
  );
  setTimeout(() => connectToRabbitMQ(), RETRY_INTERVAL);
}

// Initialize connection
const connection = connectToRabbitMQ().catch(err => {
  logger.error('Failed to initialize RabbitMQ connection:', err);
  process.exit(1); // Exit if we can't establish initial connection
});

export default connection;
