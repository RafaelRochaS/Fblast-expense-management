/* eslint-disable require-jsdoc */
import db from '../database/connection.js';

async function checkIdExists(id) {
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

async function checkUsernameExists(name) {
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

export async function index(request, response) {
  let usernameQuery;

  if (request.params.id != null) {
    const exists = await checkIdExists(request.params.id);

    if (!exists) {
      return response.status(404).json({ error: 'UserId not found' });
    }
  }

  if (request.query.user != null) {
    usernameQuery = request.query.user;
    const exists = await checkUsernameExists(usernameQuery);

    if (!exists) {
      return response.status(404).json({ error: 'Username not found' });
    }
  }

  let users;

  try {
    await db('users')
      .select('*')
      .modify((queryBuilder) => {
        if (request.params.id != null) {
          queryBuilder.where({ id: request.params.id });
        }
        if (usernameQuery != null) {
          queryBuilder.where({ username: usernameQuery });
        }
      })
      .then((data) => {
        users = data;
      });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal server error' });
  }

  return response.status(200).json(users);
}

export async function create(request, response) {
  const {
    username,
    firstName,
    lastName,
    email,
    password,
  } = request.body;

  const usernameExists = await checkUsernameExists(username);

  if (usernameExists) {
    return response.status(400).json({ error: 'Username already exists' });
  }

  const trx = await db.transaction();

  try {
    await trx('users').insert({
      username,
      firstName,
      lastName,
      email,
      password,
    });

    await trx.commit();

    response.status(201).send();
  } catch (err) {
    await trx.rollback();
    console.error(err);
    response
      .status(400)
      .json({ error: 'Unexpected error while creating new user' });
  }
}

export async function update(request, response) {
  const exists = await checkIdExists(request.params.id);

  if (!exists) {
    return response.status(404).json({ error: 'UserId not found' });
  }

  const {
    username,
    firstName,
    lastName,
    email,
  } = request.body;

  const trx = await db.transaction();

  try {
    await trx('users')
      .where({ id: request.params.id })
      .update({
        username,
        firstName,
        lastName,
        email,
        updated_at: db.fn.now(),
      });

    await trx.commit();

    response.status(200).json({ update: 'sucessful' });
  } catch (err) {
    await trx.rollback();
    console.error(err);
    response.status(400).json({ error: 'Unexpected error while updating user' });
  }
}

export async function remove(request, response) {
  const exists = await checkIdExists(request.params.id);

  if (!exists) {
    return response.status(404).json({ error: 'UserId not found' });
  }

  const trx = await db.transaction();

  try {
    await trx('users')
      .where({ id: request.params.id })
      .del();

    await trx.commit();

    response.status(200).json({ remove: 'sucessful' });
  } catch (err) {
    await trx.rollback();
    console.error(err);
    response.status(400).json({ error: 'Unexpected error while deleting user' });
  }
}
