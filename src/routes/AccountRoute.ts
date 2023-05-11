import { ROuter } from 'express';
import AccountController from 'controllers/UserController';

const routes = Router();
const accountController = new AccountController;

routes.post('/', accountController.create);
routes.get('/', accountController.getAll);
routes.get('/:id', accountController.get);
routes.put('/:id', accountController.update);
routes.delete('/:id', accountController.delete);

export default routes;