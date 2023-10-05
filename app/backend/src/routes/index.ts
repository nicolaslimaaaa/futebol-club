import { Router } from 'express';
import team from './Team.routes';
import user from './User.routes';
import matche from './Matches.routes';
import leaderboard from './Leaderboard.routes';

const router = Router();

router.use('/teams', team);
router.use('/login', user);
router.use('/matches', matche);
router.use('/leaderboard', leaderboard);

export default router;
