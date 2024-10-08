import { config } from 'dotenv';
import { MongoClient } from 'mongodb';
config();

const client = new MongoClient(process.env.DB_HOST);
const db = client.db(process.env.DB_NAME);
export default db;
