import { Router } from 'express';
import UserController from 'controllers/UserController';
import { validacaoUsuario }from 'middlewares/onboardingValidation'


const routes = Router();
const onboardingController = new UserController();

routes.post('/', validacaoUsuario, onboardingController.create);

export default routes;