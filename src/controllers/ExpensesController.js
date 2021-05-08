import db from '../database/connection.js';
import { checkIdExists, checkExpenseIdExists, checkExpenseNameExists } from '../utils/helper.js';

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

export async function indexUser(request, response) {
  if (request.params.id != null) {
    const exists = await checkIdExists(request.params.id);

    if (!exists) {
      return response.status(404).json({ error: 'UserId not found' });
    }
  }

  let expn;

  try {
    await db('expenses')
      .select('*')
      .where({ userId: request.params.id })
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

  console.log(request.body);

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

  if (item == null && value == null && dateDue == null) {
    return response.status(400).json({ error: 'Mandatory value missing!' });
  }

  const trx = await db.transaction();

  try {
    await trx('expenses')
      .where({ id: request.params.id })
      .update({
        item,
        value,
        dateDue,
        updatedAt: db.fn.now(),
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
  let userIdQuery;
  let expenseNameQuery;

  if (request.params.id != null) {
    const exists = await checkExpenseIdExists(request.params.id);

    if (!exists) {
      return response.status(404).json({ error: 'ExpenseId not found' });
    }
  }

  if (request.query.id != null && request.query.expense != null) {
    userIdQuery = decodeURI(request.query.id);
    expenseNameQuery = decodeURI(request.query.expense);
    const exists = await checkExpenseNameExists(expenseNameQuery, userIdQuery);

    if (!exists) {
      return response.status(404).json({ error: 'Expense not found for that user id' });
    }
  }

  const trx = await db.transaction();

  try {
    await trx('expenses')
      .modify((queryBuilder) => {
        if (request.params.id != null) {
          queryBuilder.where({ id: request.params.id });
        }
        if (request.query.id != null && request.query.expense != null) {
          queryBuilder.where({ userId: request.query.id });
          queryBuilder.andWhere({ item: request.query.expense });
        }
      })
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
