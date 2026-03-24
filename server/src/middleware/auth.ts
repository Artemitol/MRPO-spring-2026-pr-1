import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { AuthUser, UserRole } from '../types/auth.js';

type AuthenticatedRequest = Request & { user?: AuthUser };

interface TokenPayload {
  id: number;
  fullName: string;
  role: UserRole;
}

export function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    next();
    return;
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, env.jwtSecret) as TokenPayload;
  } catch {
    req.user = undefined;
  }

  next();
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    res.status(401).json({ message: 'Требуется авторизация' });
    return;
  }

  next();
}

export function requireRole(roles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Недостаточно прав' });
      return;
    }

    next();
  };
}

export type { AuthenticatedRequest };
