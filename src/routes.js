import express from 'express';

// eslint-disable-next-line new-cap
const routes = express.Router();

routes.get('/', (request, response) => {
  return response.json({message: 'Tá on'});
});

export default routes;
