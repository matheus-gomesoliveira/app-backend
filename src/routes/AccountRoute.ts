import { Router } from 'express';
import AccountController from 'controllers/AccountController';
import { authentication }from 'middlewares/auth'
import { validacaoAdmin } from 'middlewares/AccountValidation';

const routes = Router();
const accountController = new AccountController;

// routes.get('/', accountController.getAll);
routes.get('/', authentication, accountController.getBalance);
routes.put('/:id', validacaoAdmin, accountController.updateBalance);
routes.delete('/:id', accountController.delete);

export default routes;