import { Code } from '../utils/mapStatusHTTP';

export default interface ServiceResponse<T> {
  status: Code,
  data: { message: string } | T
}

export interface LoginResponse {
  status: Code,
  data: { message: string } | { token: string }
}

export const invalidValuesResponse: LoginResponse = {
  status: 'INVALID_VALUES',
  data: { message: 'Invalid email or password' },
};
