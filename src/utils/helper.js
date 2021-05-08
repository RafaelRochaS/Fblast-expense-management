import db from '../database/connection.js';

export async function checkIdExists(id) {
  let hasId;
  let exists = false;
  const numId = parseInt(id, 10);

  await db('users')
    .select('id')
    .then((data) => hasId = data);

  for (let i = 0; i < hasId.length; i += 1) {
    if (hasId[i].id === numId) {
      exists = true;
      break;
    }
  }

  return exists;
}

export async function checkUsernameExists(name) {
  let hasId;
  let exists = false;

  await db('users')
    .select('username')
    .then((data) => hasId = data);

  for (let i = 0; i < hasId.length; i += 1) {
    if (hasId[i].username === name) {
      exists = true;
      break;
    }
  }

  return exists;
}

export async function checkExpenseIdExists(id) {
  let hasId;
  let exists = false;
  const numId = parseInt(id, 10);

  await db('expenses')
    .select('id')
    .then((data) => hasId = data);

  for (let i = 0; i < hasId.length; i += 1) {
    if (hasId[i].id === numId) {
      exists = true;
      break;
    }
  }

  return exists;
}

export async function getInvalidUserId() {
  let invalidId;

  await db('users')
    .select('id')
    .orderBy('id', 'desc')
    .first()
    .then((data) => invalidId = data);

  invalidId = invalidId.id + 1;

  return invalidId;
}

export async function getDefaultId() {
  let defaultId;

  await db('users')
    .select('id')
    .where({ username: 'JoedaQuebrada' })
    .then((data) => {
      defaultId = data[0].id;
    });

  return defaultId;
}

export async function checkExpenseNameExists(exp, id) {
  let values;

  await db('expenses')
    .select('userId', 'item')
    .where({ userId: id })
    .andWhere({ item: exp })
    .then((data) => values = data);

  return values.length > 0;
}
