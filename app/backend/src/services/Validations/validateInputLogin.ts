import { LoginResponse } from '../../Interfaces/ServiceResponse';
import IUserLogin from '../../Interfaces/users/UserLogin';
import loginSchema from './Schemas';

function validateInputLogin(userLogin: IUserLogin): LoginResponse | undefined {
  const { error } = loginSchema.validate(userLogin);

  if (error) return { status: 'INVALID_VALUES', data: { message: error.message } };
}

export default validateInputLogin;
