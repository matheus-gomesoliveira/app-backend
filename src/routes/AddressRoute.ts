import { Router } from 'express';
import AddressController from 'controllers/AddressController';
import { authentication } from 'middlewares/auth';

const routes = Router();
const addressController = new AddressController();

routes.get('/', addressController.getAll);
routes.get('/:id', addressController.get);
routes.put('/',authentication, addressController.update);
routes.delete('/:id', addressController.delete);

export default routes;
