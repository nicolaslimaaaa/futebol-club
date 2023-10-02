import { Router } from 'express';
import Matche from '../controllers/Matche.controller';
import Validations from '../middlewares/Validations';

const router = Router();
const matcheController = new Matche();

router.get('/', (req, res) => matcheController.getAll(req, res));
router.patch(
  '/:id/finish',
  Validations.authMiddleware,
  (req, res) => matcheController.endGame(req, res),
);
router.patch(
  '/:id',
  Validations.authMiddleware,
  (req, res) => matcheController.changesMatchResult(req, res),
);

export default router;
