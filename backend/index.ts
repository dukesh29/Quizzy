import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config';
import usersRouter from './routers/users';
import { globalErrorHandler } from './middlewares/error-middleware';
import categoriesRouter from './routers/categories';

const app = express();

app.use(cors({ origin: config.clientURL, credentials: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);
app.use(globalErrorHandler);

const run = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(config.db);

  app.listen(config.port, () => {
    console.log('We are live on ' + config.port);
  });
  process.on('exit', () => {
    void mongoose.disconnect();
  });
};

run().catch(console.error);
