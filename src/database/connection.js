import knex from 'knex';
import path from 'path';
import { dirnameUtil, ENVIRONMENT } from '../utils/config.js';

let db;

if (ENVIRONMENT === 'dev') {
  db = knex({
    client: 'sqlite3',
    connection: {
      filename: path.resolve(dirnameUtil, '..', 'database', 'database.sqlite')
    },
    useNullAsDefault: true,
  });
}

export default db;
