import express from 'express';
import cors from 'cors';
// eslint-disable-next-line import/no-named-default
import { default as logger } from 'morgan';
import * as util from 'util';
import routes from './routes.js';
import { LOG_FORMAT } from './utils/config.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(logger(LOG_FORMAT));
app.use(routes);

process.on('uncaughtException', (err) => {
  console.error(`I've crashed!!! - ${(err.stack || err)}`);
});

process.on('unhandledRejection', (reason, p) => {
  console.error(`Unhandled Rejection at: ${util.inspect(p)} reason: ${reason}`);
});

export default app;
