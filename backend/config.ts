import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const rootPath = __dirname;

const config = {
  port: parseInt(process.env.PORT || '8000'),
  rootPath,
  publicPath: path.join(rootPath, 'public'),
  db: process.env.MONGO_DB || 'mongodb://localhost/Quizzy',
};

export default config;
