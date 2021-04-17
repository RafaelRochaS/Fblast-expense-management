import knex from 'knex';
import path from 'path';
import { __dirname, ENVIRONMENT } from '../utils/config.js';

let db;

if (ENVIRONMENT === 'dev') {
  db = knex({
    client: 'sqlite3',
    connection: {
      filename: '/home/rafael/FinancialBlast/exp-mgmt-svc/src/database/database.sqlite',
    },
    useNullAsDefault: true,
  });
}

export default db;
