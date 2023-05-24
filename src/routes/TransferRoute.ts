import { Router } from 'express';
import TransferController from 'controllers/Transfer.Controller';
import { authentication } from 'middlewares/auth';

const routes = Router();
const transferController = new TransferController();

routes.post('/', authentication, transferController.transfer);
// routes.get('/', transferController.getAll);
// routes.get('/:id', transferController.get);

export default routes;