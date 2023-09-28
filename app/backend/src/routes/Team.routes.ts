import { Router } from 'express';
import Team from '../controllers/Team.controller';

const router = Router();
const teamsController = new Team();

router.get('/', (req, res) => teamsController.getAll(req, res));
router.get('/:id', (req, res) => teamsController.getById(req, res));

export default router;
