import express from 'express';
import {
  index as userIndex,
  create as userCreate,
  update as userUpdate,
  remove as userRemove,
} from './controllers/UsersController.js';
import {
  index as expIndex,
  create as expCreate,
  update as expUpdate,
  remove as expRemove,
} from './controllers/ExpensesController.js';

// eslint-disable-next-line new-cap
const routes = express.Router();
const API_V1 = '/api/v1';

routes.get('/', (request, response) => response.json({ message: 'Tá on' }));

/** ** v1 routes */

routes.get('/api/v1/', (request, response) => response.json({ apiVersion: 1 }));

/** * Users */
routes.get(`${API_V1}/users`, userIndex);
routes.get(`${API_V1}/users/:id`, userIndex);
routes.post(`${API_V1}/users`, userCreate);
routes.put(`${API_V1}/users/:id`, userUpdate);
routes.delete(`${API_V1}/users/:id`, userRemove);

/** * Expenses */
routes.get(`${API_V1}/expenses`, expIndex);
routes.post(`${API_V1}/expenses`, expCreate);
routes.put(`${API_V1}/expenses/:id`, expUpdate);
routes.delete(`${API_V1}/expenses/:id`, expRemove);

export default routes;
