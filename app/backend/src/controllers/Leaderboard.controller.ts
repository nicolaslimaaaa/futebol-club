import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import Leaderboard from '../services/Leaderboard.service';

export default class LeaderboardController {
  constructor(
    private _leaderboardService = new Leaderboard(),
  ) {}

  async getInfosTeams(req: Request, res: Response) {
    const typeTeam = req.url.replace('/', '');
    const { status, data } = await this._leaderboardService.getInfosTeams(typeTeam);

    return res.status(mapStatusHTTP(status)).json(data);
  }
}
