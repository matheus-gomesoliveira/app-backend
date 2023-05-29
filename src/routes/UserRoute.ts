import { Router } from 'express';
import UserController from 'controllers/UserController';
import { authentication }from 'middlewares/auth'


const routes = Router();
const userController = new UserController();

routes.post('/', userController.login);
// routes.get('/', userController.getAll);
routes.get('/',authentication, userController.get);
routes.put('/', authentication, userController.updateUser);
routes.put('/password', authentication, userController.updateSenha)
routes.delete('/:id', userController.delete);

export default routes;
