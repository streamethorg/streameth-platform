// import amqp, { Connection } from "amqplib";
// import { config } from "dotenv";
// import { logger } from "./logger";
// config();

// let connection: Connection | null = null;

// export async function getConnection() {
//   if (connection) return connection;

//   try {
//     connection = await amqp.connect({
//       protocol: "amqp",
//       hostname: process.env.MQ_HOST,
//       port: Number(process.env.MQ_PORT),
//       username: process.env.MQ_USERNAME,
//       password: process.env.MQ_SECRET,
//       vhost: "/",
//     });

//     connection.on("error", (e) => {
//       logger.error("RabbitMQ connection error:", e);
//       connection = null;  // Reset connection on error
//     });

//     connection.on("close", () => {
//       logger.info("RabbitMQ connection closed");
//       connection = null;  // Reset connection when closed
//     });

//     return connection;
//   } catch (error) {
//     logger.error("Failed to connect to RabbitMQ:", error);
//     throw error;
//   }
// }

// export default {
//   getConnection
// };
