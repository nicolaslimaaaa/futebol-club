import { Router } from 'express';
import team from './Team.routes';
import user from './User.routes';

const router = Router();

router.use('/teams', team);
router.use('/login', user);
router.use('/login/role', user);

export default router;
