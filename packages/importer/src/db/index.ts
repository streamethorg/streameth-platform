import { config } from '../config';
const { host } = config.db;
export const dbConnection = {
  url: host,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
