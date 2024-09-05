import amqp from "amqplib";
import { config } from "dotenv";
import { logger } from "./logger";
config();

async function createConnection() {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.MQ_HOST,
      port: Number(process.env.MQ_PORT),
      username: process.env.MQ_USERNAME,
      password: process.env.MQ_SECRET,
      vhost: "/",
    });

    connection.on("error", (e) => {
      logger.error("RabbitMQ connection error:", e);
    });

    return connection;
  } catch (error) {
    logger.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
}

const connection = createConnection();
export default connection;
