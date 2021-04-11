import * as dotenv from 'dotenv';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({path: path.resolve(__dirname, '..', '.env')});

export const PORT = process.env.PORT;
export const LOG_FORMAT = process.env.REQUEST_LOG_FORMAT || 'common';
