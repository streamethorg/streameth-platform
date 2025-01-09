import { config } from '@config';
const { host, user, name, password } = config.db;

console.log('Database connection details:');
console.log('Host:', host);
console.log('User:', user);
console.log('Database:', name);
console.log('Password length:', password?.length);

export const dbConnection = {
  //rl: `mongodb://${user}:${password}@${host}/${name}?authSource=admin&retryWrites=true&w=majority`,
  // For local development use this url
  url: `mongodb+srv://${user}:${password}@${host}/${name}?authSource=admin`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
};
