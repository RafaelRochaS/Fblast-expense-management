import express from 'express';
import { index, create } from './controllers/UsersController.js';

// eslint-disable-next-line new-cap
const routes = express.Router();

routes.get('/', (request, response) => {
  return response.json({message: 'Tá on'});
});

/**** v1 routes */

routes.get('/api/v1/', (request, response) => {
  return response.json({ apiVersion: 1 });
});

/*** Users */
routes.get('/api/v1/users', index);
routes.put('/api/v1/users', create);

export default routes;
