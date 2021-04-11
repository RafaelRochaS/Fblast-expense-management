import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import {default as logger} from 'morgan';
import {LOG_FORMAT} from './utils/config.js';
import * as util from 'util';

const app = express();

app.use(express.json());
app.use(cors());
app.use(logger(LOG_FORMAT));
app.use(routes);

process.on('uncaughtException', function(err) {
  console.error(`I've crashed!!! - ${(err.stack || err)}`);
});

process.on('unhandledRejection', (reason, p) => {
  console.error(`Unhandled Rejection at: ${util.inspect(p)} reason: ${reason}`);
});

export default app;
