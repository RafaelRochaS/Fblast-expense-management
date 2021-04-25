import supertest from 'supertest';
import app from '../server.js';
import db from '../database/connection.js';

const api = supertest(app);

let defaultId = await getDefaultId();

const EXPENSES_API = '/api/v1/expenses';
const DEFAULT_EXPENSES_LENGTH = 4;
const TEST_EXPENSE = {
  userId: defaultId,
  item: 'TestItem',
  value: 500,
  dateDue: new Date(2022, 3, 5)
};
const TEST_VALUE = 700;

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

  test('adds test expense successfully', async () => {

    await api.post(EXPENSES_API)
      .send(TEST_EXPENSE)
      .expect(201);
  });

  test('updates test expense successfully', async () => {

    let testId = await getTestId();

    await api.put(`${EXPENSES_API}/${testId[0].id}`)
      .send({ value: TEST_VALUE })
      .expect(200);
  });

  test('deletes test expense', async () => {

    let testId = await getTestId();

    await api.delete(`${EXPENSES_API}/${testId[0].id}`)
      .expect(200);
  });
});

async function getDefaultId() {

  let defaultId;

  await db('users')
    .select('id')
    .where({ username: 'Joe da Quebrada' })
    .then(data => {
      defaultId = data[0].id;
    });

  return defaultId;
}

async function getTestId() {
  let testId;

  await db('expenses')
    .select('id')
    .where({ item: 'TestItem' })
    .then(data => {
      testId = data;
    });
  
  return testId;
}