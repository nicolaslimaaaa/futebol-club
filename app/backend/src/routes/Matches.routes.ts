import { Router } from 'express';
import Matche from '../controllers/Matche.controller';

const router = Router();
const matcheController = new Matche();

router.get('/', (req, res) => matcheController.getAll(req, res));

export default router;
