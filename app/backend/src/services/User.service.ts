import { ModelStatic } from 'sequelize';
// import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import IUserLogin from '../Interfaces/users/UserLogin';
import UserModel from '../database/models/UserModel';
import { LoginResponse } from '../Interfaces/ServiceResponse';
import env from '../envArgs';

export default class UserService {
  constructor(
    private _teamModel: ModelStatic<UserModel> = UserModel,
  ) {}

  async login(dataUser: IUserLogin): Promise<LoginResponse> {
    const user = await this._teamModel.findOne({ where: { email: dataUser.email } });

    if (!user) {
      return { status: 'NOT_FOUND', data: { message: 'Not found user' } };
    }

    // const isValidPassword = await bcrypt.compareSync(password, user.password);

    // if(!isValidPassword) {
    //   return {}
    // }

    const payloadForToken = {
      id: user?.id,
      role: user?.role,
    };

    const token = jwt.sign(payloadForToken, env.jwtSecret);

    return { status: 'SUCCESSFUL', data: { token } };
  }
}
