import { Router } from 'express';
import { guest, login } from '../controllers/auth-controller.js';

export const authRoutes = Router();

authRoutes.post('/login', login);
authRoutes.get('/guest', guest);
