import { Router } from 'express';
import TransferController from 'controllers/TransferController';
import { authentication } from 'middlewares/auth';

const routes = Router();
const transferController = new TransferController();

routes.post('/', authentication, transferController.transfer);
routes.get('/:id_transferencia', authentication, transferController.getTransfer);
routes.get('/', authentication, transferController.getExtrato)
// routes.get('/:id', transferController.get);

export default routes;