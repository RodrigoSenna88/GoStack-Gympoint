import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import Help_OrderController from './app/controllers/Help_OrderController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.post('/checkins', CheckinController.store);
routes.get('/checkins', CheckinController.index);

routes.get('/help_orders/:id', Help_OrderController.index);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.put('/users', UserController.update);
routes.put('/students', StudentController.update);
routes.get('/students', StudentController.index);

routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.post('/registrations', RegistrationController.store);
routes.get('/registrations', RegistrationController.index);
routes.put('/registrations/:id', RegistrationController.update);
routes.delete('/registrations/:id', RegistrationController.delete);

export default routes;
