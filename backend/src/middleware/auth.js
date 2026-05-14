import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from './errors.js';

export function signToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

export function requireAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw new HttpError(401, 'Missing or invalid Authorization header');
  }
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    throw new HttpError(401, 'Invalid or expired token');
  }
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) throw new HttpError(401, 'Not authenticated');
    if (!roles.includes(req.user.role)) {
      throw new HttpError(403, 'Forbidden — insufficient role');
    }
    next();
  };
}
