import { Router } from 'express';
import UserController from 'controllers/UserController';
import { authentication }from 'middlewares/auth'


const routes = Router();
const userController = new UserController();

routes.post('/', userController.login);
// routes.get('/', userController.getAll);
routes.get('/',authentication, userController.get);
// routes.put('/:id', userController.update);
routes.delete('/:id', userController.delete);

export default routes;
