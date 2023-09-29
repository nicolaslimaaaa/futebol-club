import { Router } from 'express';
import User from '../controllers/User.controller';
import Validations from '../middlewares/Validations';

const router = Router();
const userController = new User();

router.post(
  '/',
  Validations.validateLogin,
  (req, res) => userController.login(req, res),
);

router.get(
  '/role',
  Validations.authMiddleware,
  (req, res) => User.loginRole(req, res),
);
export default router;
