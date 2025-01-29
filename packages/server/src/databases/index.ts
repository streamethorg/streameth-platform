import { config } from '@config';
const { host, user, name, password } = config.db;

export const dbConnection = {
  url:
    process.env.NODE_ENV === 'development'
      ? `mongodb+srv://${user}:${password}@${host}/${name}?authSource=admin`
      : `mongodb://${user}:${password}@${host}/${name}?authSource=admin&retryWrites=true&w=majority`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
};
