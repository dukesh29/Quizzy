import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const rootPath = __dirname;

const config = {
  port: parseInt(process.env.PORT || '8000'),
  rootPath,
  publicPath: path.join(rootPath, 'public'),
  db: process.env.MONGO_DB || 'mongodb://localhost/Quizzy',
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  jwt: {
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'jwt-secret-3.14',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'jwt-refresh-secret-3.14',
  },
  clientURL: process.env.CLIENT_URL || 'http://localhost:3000',
};

export default config;
