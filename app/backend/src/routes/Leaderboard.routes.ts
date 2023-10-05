import { Router } from 'express';
import Leaderboard from '../controllers/Leaderboard.controller';

const router = Router();
const leaderboardController = new Leaderboard();

router.get('/home', (req, res) => leaderboardController.getInfosHomeTeam(req, res));

export default router;
