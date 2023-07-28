import { Router } from 'express';
import AccountController from 'controllers/AccountController';
import { authentication }from 'middlewares/auth'

const routes = Router();
const accountController = new AccountController;

// routes.get('/', accountController.getAll);
routes.get('/', authentication, accountController.getBalance);
routes.delete('/', authentication, accountController.delete);
routes.put('/transaction-password', authentication, accountController.updateTransactionPassword)
routes.post('/',authentication, accountController.getDestinyAccountData)

export default routes;