import bcrypt from 'bcryptjs';
import type { Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db } from '../config/db.js';
import { env } from '../config/env.js';
import { ApiError } from '../middleware/error-handler.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';

const loginSchema = z.object({
  login: z.string().min(1),
  password: z.string().min(1),
});

export async function login(req: AuthenticatedRequest, res: Response): Promise<void> {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, 'Некорректный формат логина или пароля');
  }

  const userResult = await db.query(
    `SELECT id, full_name, login, password_hash, role
     FROM app_user
     WHERE login = $1`,
    [result.data.login],
  );

  const user = userResult.rows[0];
  if (!user) {
    throw new ApiError(401, 'Неверный логин или пароль');
  }

  const isValid = await bcrypt.compare(result.data.password, user.password_hash);
  if (!isValid) {
    throw new ApiError(401, 'Неверный логин или пароль');
  }

  const token = jwt.sign(
    { id: user.id, fullName: user.full_name, role: user.role },
    env.jwtSecret,
    { expiresIn: '12h' },
  );

  res.json({
    token,
    user: {
      id: user.id,
      fullName: user.full_name,
      role: user.role,
    },
  });
}

export function guest(_req: AuthenticatedRequest, res: Response): void {
  res.json({
    user: {
      id: 0,
      fullName: 'Гость',
      role: 'guest',
    },
  });
}
