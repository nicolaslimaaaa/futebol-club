import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import TeamService from '../services/Team.service';

export default class Team {
  constructor(
    private _teamService = new TeamService(),
  ) {}

  async getAll(req: Request, res: Response) {
    const { status, data } = await this._teamService.getAll();

    return res.status(mapStatusHTTP(status)).json(data);
  }

  async getById(req: Request, res: Response) {
    const { status, data } = await this._teamService.getById(Number(req.params.id));

    return res.status(mapStatusHTTP(status)).json(data);
  }
}
