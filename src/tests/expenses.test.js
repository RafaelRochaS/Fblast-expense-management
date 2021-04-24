import supertest from 'supertest';
import app from '../server.js';
import db from '../database/connection.js';

const api = supertest(app);

const EXPENSES_API = '/api/v1/expenses';
const DEFAULT_EXPENSES_LENGTH = 4;

describe('/api/v1/expenses', () => {

  afterAll(done => {
    db.destroy();
    done();
  });

  test('returns default expenses', async () => {

    await api.get(EXPENSES_API)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .then(response => {
        expect(response.body.length).toBe(DEFAULT_EXPENSES_LENGTH);
      });
  });
});