import { Router } from 'express';

import Student from './app/models/Students';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
routes.get('/', async (req, res) => {
  const student = await Student.create({
    name: 'Aluno 1',
    email: 'aluno@gmail.com',
    password_hash: '123456',
    age: '21',
    weight: '65.1',
    height: '1.75',
  });
  return res.json(student);
});

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

export default routes;
