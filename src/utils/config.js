import * as dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

export const dirnameUtil = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(dirnameUtil, '..', '.env') });

export const PORT = process.env.PORT || 3000;
export const LOG_FORMAT = process.env.REQUEST_LOG_FORMAT || 'common';
export const ENVIRONMENT = process.env.ENVIRONMENT || 'dev';
