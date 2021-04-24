import express from 'express';
import {
  index as userIndex,
  create as userCreate,
  update as userUpdate,
  remove as userRemove,
} from './controllers/UsersController.js';

// eslint-disable-next-line new-cap
const routes = express.Router();

routes.get('/', (request, response) => {
  return response.json({message: 'Tá on'});
});

/** ** v1 routes */

routes.get('/api/v1/', (request, response) => {
  return response.json({apiVersion: 1});
});

/** * Users */
routes.get('/api/v1/users', userIndex);
routes.get('/api/v1/users/:id', userIndex);
routes.post('/api/v1/users', userCreate);
routes.put('/api/v1/users/:id', userUpdate);
routes.delete('/api/v1/users/:id', userRemove);

export default routes;
