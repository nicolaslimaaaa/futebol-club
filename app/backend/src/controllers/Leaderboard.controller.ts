import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import Leaderboard from '../services/Leaderboard.service';

export default class LeaderboardController {
  constructor(
    private _leaderboardService = new Leaderboard(),
  ) {}

  async getInfosHomeTeam(req: Request, res: Response) {
    const { status, data } = await this._leaderboardService.getInfosHomeTeam();

    return res.status(mapStatusHTTP(status)).json(data);
  }
}
