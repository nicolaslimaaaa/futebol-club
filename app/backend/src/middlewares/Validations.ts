import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import envArgs from '../envArgs';

export default class Validations {
  static validateLogin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'All fields must be filled' });

    next();
  }

  static authMiddleware(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: 'Token not found' });

    const token = authorization.split(' ')[1];

    try {
      const decoded = jwt.verify(token, envArgs.jwtSecret);
      req.body = {
        ...req.body,
        payload: decoded,
      };
      next();
    } catch (_error) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }
  }

  static validateEqualTeams(req: Request, res: Response, next: NextFunction) {
    const { homeTeamId, awayTeamId } = req.body;

    if (homeTeamId === awayTeamId) {
      return res.status(422).json(
        { message: 'It is not possible to create a match with two equal teams' },
      );
    }

    next();
  }
}
