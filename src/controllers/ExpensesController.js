import db from '../database/connection.js';
import { checkIdExists, checkExpenseIdExists } from '../utils/helper.js';

export async function index(request, response) {
  if (request.params.id != null) {
    const exists = await checkExpenseIdExists(request.params.id);

    if (!exists) {
      return response.status(404).json({ error: 'ExpenseId not found' });
    }
  }

  let expn;

  try {
    await db('expenses')
      .select('*')
      .modify((queryBuilder) => {
        if (request.params.id != null) {
          queryBuilder.where({ id: request.params.id });
        }
      })
      .then((data) => {
        expn = data;
      });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal server error' });
  }
  return response.status(200).json(expn);
}

export async function create(request, response) {
  const {
    userId,
    item,
    value,
    dateDue,
  } = request.body;

  const exists = await checkIdExists(userId);

  if (!exists) {
    return response.status(404).json({ error: 'UserId not found' });
  }

  const trx = await db.transaction();

  try {
    await trx('expenses').insert({
      userId,
      item,
      value,
      dateDue,
    });

    await trx.commit();
    response.status(201).send();
  } catch (err) {
    await trx.rollback();
    console.error(err);
    response
      .status(400)
      .json({ error: 'Unexpected error while creating new expense' });
  }
}

export async function update(request, response) {
  const exists = await checkExpenseIdExists(request.params.id);

  if (!exists) {
    return response.status(404).json({ error: 'ExpenseId not found' });
  }

  const {
    item,
    value,
    dateDue,
  } = request.body;

  const trx = await db.transaction();

  try {
    await trx('expenses')
      .where({ id: request.params.id })
      .update({
        item,
        value,
        dateDue,
      });

    await trx.commit();
    response.status(200).json({ update: 'sucessful' });
  } catch (err) {
    await trx.rollback();
    console.error(err);
    response
      .status(400)
      .json({ error: 'Unexpected error while updating expense' });
  }
}

export async function remove(request, response) {
  const exists = await checkExpenseIdExists(request.params.id);

  if (!exists) {
    return response.status(404).json({ error: 'ExpenseId not found' });
  }

  const trx = await db.transaction();

  try {
    await trx('expenses')
      .where({ id: request.params.id })
      .del();

    await trx.commit();
    response.status(200).json({ remove: 'sucessful' });
  } catch (err) {
    await trx.rollback();
    console.error(err);
    response
      .status(400)
      .json({ error: 'Unexpected error while creating updating expense' });
  }
}
