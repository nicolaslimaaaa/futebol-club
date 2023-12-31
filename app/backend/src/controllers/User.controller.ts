import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import UserService from '../services/User.service';

export default class UserController {
  constructor(
    private _userService = new UserService(),
  ) {}

  async login(req: Request, res: Response) {
    const { status, data } = await this._userService.login(req.body);

    return res.status(mapStatusHTTP(status)).json(data);
  }

  static async loginRole(req: Request, res: Response) {
    const { payload } = req.body;
    const { status, data } = await UserService.loginRole(payload);

    return res.status(mapStatusHTTP(status)).json(data);
  }
}
