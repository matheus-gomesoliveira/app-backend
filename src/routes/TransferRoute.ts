import { Router } from 'express';
import TransferController from 'controllers/Transfer.Controller';

const routes = Router();
const transferController = new TransferController();

routes.post('/', transferController.create);
routes.get('/', transferController.getAll);
routes.get('/:id', transferController.get);

export default routes;