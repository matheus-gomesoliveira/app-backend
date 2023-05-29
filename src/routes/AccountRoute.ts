import { Router } from 'express';
import AccountController from 'controllers/AccountController';
import { authentication }from 'middlewares/auth'

const routes = Router();
const accountController = new AccountController;

// routes.get('/', accountController.getAll);
routes.get('/', authentication, accountController.getBalance);
routes.put('/:id', accountController.updateBalance);
routes.delete('/', authentication, accountController.delete);

export default routes;