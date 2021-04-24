import db from '../database/connection.js';

export async function index(request, response) {
  let expn;

  try {
    await db('expenses')
      .select('*')
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
  return response.status(500);
}

export async function update(request, response) {
  return response.status(500);
}

export async function remove(request, response) {
  return response.status(500);
}
