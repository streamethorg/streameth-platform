import { config } from '@config';
const { host, port } = config.db;
export const dbConnection = {
  url:
    config.appEnv === 'production'
      ? host
      : `mongodb://${host}:${port}/${'streameth'}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
