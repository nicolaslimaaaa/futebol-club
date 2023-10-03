import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import MatcheService from '../services/Matche.service';

export default class MatcheController {
  constructor(
    private _matchService = new MatcheService(),
  ) {}

  async getAll(req: Request, res: Response) {
    const { inProgress } = req.query;

    const { status, data } = await this._matchService.getAll(String(inProgress));

    return res.status(mapStatusHTTP(status)).json(data);
  }

  async endGame(req: Request, res: Response) {
    const { id } = req.params;

    const { status, data } = await this._matchService.endGame(Number(id));

    return res.status(mapStatusHTTP(status)).json(data);
  }

  async changesMatchResult(req: Request, res: Response) {
    const { id } = req.params;

    const newResult = {
      id: Number(id),
      ...req.body,
    };

    const { status, data } = await this._matchService.changesMatchResult(newResult);

    return res.status(mapStatusHTTP(status)).json(data);
  }
}