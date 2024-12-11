import { config } from '@config';
const { host, user, name, password } = config.db;
export const dbConnection = {
  url: `mongodb+srv://${user}:${password}@${host}/${name}?authSource=admin`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
