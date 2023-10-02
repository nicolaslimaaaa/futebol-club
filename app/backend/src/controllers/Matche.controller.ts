import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import MatcheService from '../services/Matche.service';

export default class MatcheController {
  constructor(
    private _matchService = new MatcheService(),
  ) {}

  async getAll(req: Request, res: Response) {
    const { status, data } = await this._matchService.getAll();

    return res.status(mapStatusHTTP(status)).json(data);
  }
}
