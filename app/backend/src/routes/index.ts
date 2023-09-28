import { Router } from 'express';
import team from './Team.routes';

const router = Router();

router.use('/teams', team);

export default router;
