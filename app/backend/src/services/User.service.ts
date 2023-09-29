import { ModelStatic } from 'sequelize';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import IUserLogin from '../Interfaces/users/UserLogin';
import UserModel from '../database/models/UserModel';
import { LoginResponse, invalidValuesResponse } from '../Interfaces/ServiceResponse';
import env from '../envArgs';
import validateInputLogin from './Validations/validateInputLogin';

export default class UserService {
  constructor(
    private _teamModel: ModelStatic<UserModel> = UserModel,
  ) {}

  async login(dataUser: IUserLogin): Promise<LoginResponse> {
    const error = validateInputLogin(dataUser);
    if (error) return { status: error.status, data: error.data };

    const user = await this._teamModel.findOne({ where: { email: dataUser.email } });
    if (!user) return invalidValuesResponse;

    const isValidPassword = await bcrypt.compareSync(dataUser.password, user.password);
    if (!isValidPassword) return invalidValuesResponse;

    const payloadForToken = {
      id: user.id,
      role: user.role,
    };

    const token = jwt.sign(payloadForToken, env.jwtSecret);

    return { status: 'SUCCESSFUL', data: { token } };
  }
}
