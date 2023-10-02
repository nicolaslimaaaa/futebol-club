import { Router } from 'express';
import team from './Team.routes';
import user from './User.routes';
import matche from './Matches.routes';

const router = Router();

router.use('/teams', team);
router.use('/login', user);
router.use('/login/role', user);
router.use('/matches', matche);
router.use('/matches/:id/finish', matche);
router.use('/matches/:id', matche);

export default router;
