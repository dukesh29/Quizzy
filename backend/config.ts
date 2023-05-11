import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const rootPath = __dirname;

const config = {
  port: parseInt(process.env.PORT || '8000'),
  rootPath,
  publicPath: path.join(rootPath, 'public'),
  db: process.env.MONGO_DB || 'mongodb://localhost/Quizzy',
  jwt: {
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'jwt-secret-3.22',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'jwt-refresh-secret-3.22',
  },
  clientURL: process.env.CLIENT_URL || 'https://www.google.com',
};

export default config;
