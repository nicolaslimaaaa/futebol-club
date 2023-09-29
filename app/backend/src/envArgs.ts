const jwtSecret = process.env.JWT_SECRET || 'jwt_secret';

if (!jwtSecret) {
  throw new Error('MISSING_JWT_SECRET');
}

export default { jwtSecret };
