import { Code } from '../utils/mapStatusHTTP';

export default interface ServiceResponse<T> {
  status: Code,
  data: { message: string } | T
}

export interface LoginResponse {
  status: Code,
  data: { message: string } | { token: string }
}
