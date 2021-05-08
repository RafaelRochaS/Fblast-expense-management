/* eslint-disable require-jsdoc */
import db from '../database/connection.js';
import { checkIdExists, checkUsernameExists } from '../utils/helper.js';

export async function index(request, response) {
  let usernameQuery;

  if (request.params.id != null) {
    const exists = await checkIdExists(request.params.id);

    if (!exists) {
      return response.status(404).json({ error: 'UserId not found' });
    }
  }

  if (request.query.user != null) {
    usernameQuery = decodeURI(request.query.user);
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
    income,
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
      income,
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
      .json({ error: 'Error while creating new user. Please check input values' });
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
    income,
    email,
  } = request.body;

  if (username == null
    && firstName == null
    && lastName == null
    && email == null
    && income == null) {
    return response.status(400).json({ error: 'Mandatory value missing!' });
  }

  const trx = await db.transaction();

  try {
    await trx('users')
      .where({ id: request.params.id })
      .update({
        username,
        firstName,
        lastName,
        income,
        email,
        updated_at: db.fn.now(),
      });

    await trx.commit();

    response.status(200).json({ update: 'sucessful' });
  } catch (err) {
    await trx.rollback();
    console.error(err);
    response.status(500).json({ error: 'Unexpected error while updating user' });
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
