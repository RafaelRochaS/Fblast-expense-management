import supertest from 'supertest';
import app from '../server.js';
import db from '../database/connection.js';
import { getInvalidUserId, getDefaultId } from '../utils/helper.js';

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

  test('gets test expense by id', async () => {

    let testId = await getTestId();

    await api.get(`${EXPENSES_API}/${testId[0].id}`)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .then(response => {
        expect(expect(response.body).toMatchObject([{ item: 'TestItem' }]));
      });
  });

  test('updates test expense successfully', async () => {

    let testId = await getTestId();

    await api.put(`${EXPENSES_API}/${testId[0].id}`)
      .send({ value: TEST_VALUE })
      .expect(200);
  });

  test('update with empty body returns 400', async () => {

    let testId = await getTestId();

    await api.put(`${EXPENSES_API}/${testId[0].id}`)
      .expect(400);
  });

  test('returns updated test expense successfully', async () => {

    let testId = await getTestId();

    await api.get(`${EXPENSES_API}/${testId[0].id}`)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .then(response => {
        expect(expect(response.body).toMatchObject([{ value: TEST_VALUE }]));
      });
  })

  test('deletes test expense', async () => {

    let testId = await getTestId();

    await api.delete(`${EXPENSES_API}/${testId[0].id}`)
      .expect(200);
  });

  test('returns 404 on invalid expense id', async () => {

    let invalidId = await getInvalidExpenseId();

    await api.get(`${EXPENSES_API}/${invalidId}`)
      .expect(404);
  });

  test('returns 404 on creating expense with invalid userId', async () => {

    let invalidExpense = await getInvalidExpense();

    await api.post(`${EXPENSES_API}`)
      .send(invalidExpense)
      .expect(404);
  });

  test('returns 400 on creating expense missing necessary values', async () => {

    let missingExpense = TEST_EXPENSE;
    delete missingExpense.value;

    await api.post(`${EXPENSES_API}`)
      .send(missingExpense)
      .expect(400);
  });

  test('returns 404 on updating invalid expense', async () => {

    let invalidExpenseId = await getInvalidExpenseId();

    await api.put(`${EXPENSES_API}/${invalidExpenseId}`)
      .send({ item: 'InvalidTest' })
      .expect(404);
  });
});

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

async function getInvalidExpenseId() {
  let invalidId;

  await db('expenses')
    .select('id')
    .orderBy('id', 'desc')
    .first()
    .then(data => invalidId = data);

  invalidId = invalidId.id + 1;

  return invalidId;
}

async function getInvalidExpense() {

  let invalidUserId = await getInvalidUserId();

  const TEST_EXPENSE_INVALID_ID = {
    userId: invalidUserId,
    item: 'TestItem',
    value: 500,
    dateDue: new Date(2022, 3, 5)
  };

  return TEST_EXPENSE_INVALID_ID;
}