import { jobs } from '@utils/pulse.cron';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import createError from 'http-errors';
import { connect, disconnect, set } from 'mongoose';
import morgan from 'morgan';
import 'reflect-metadata';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import { dbConnection } from './databases';
import errorMiddleware from './middlewares/error.middleware';
import { RegisterRoutes } from './routes/routes';
import * as swaggerDocument from './swagger/swagger.json';
import { logger } from './utils/logger';

class App {
  public app: express.Application;
  private env: string;
  private port: string | number;

  constructor() {
    this.app = express();
    this.env = config.appEnv || 'development';
    this.port = config.port || 3400;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeErrorHandling();
    this.initializeJobs();
  }

  listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  async closeDatabaseConnection(): Promise<void> {
    try {
      await disconnect();
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }

  getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    if (this.env !== 'production') {
      set('debug', true);
    }

    await connect(dbConnection.url);
    logger.info('Db connected');
  }

  private initializeMiddlewares() {
    this.app.use(morgan('dev'));
    this.app.use(
      cors({
        origin: config.cors.origin.trim().split(','),
        credentials: config.cors.credentials,
      }),
    );
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    RegisterRoutes(this.app);
  }

  private initializeJobs() {
    return jobs();
  }

  private initializeSwagger() {
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  private initializeErrorHandling() {
    this.app.use((req, res, next) => {
      next(createError(404));
    });
    this.app.use(errorMiddleware);
  }
}

export default App;
