export type Code = 'CONFLICT' | 'CREATED' | 'INVALID_DATA' | 'INVALID_VALUES'
| 'NOT_FOUND' | 'SUCCESSFUL' | 'UNAUTHORIZED';

export default function mapStatusHTTP(status: Code): number {
  switch (status) {
    case 'CONFLICT': return 409;
    case 'CREATED': return 201;
    case 'INVALID_DATA': return 400;
    case 'INVALID_VALUES': return 401;
    case 'NOT_FOUND': return 404;
    case 'SUCCESSFUL': return 200;
    case 'UNAUTHORIZED': return 200;
    default: return 500;
  }
}