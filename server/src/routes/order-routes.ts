import { Router } from 'express';
import {
  createOrder,
  deleteOrder,
  listOrders,
  listStatuses,
  updateOrder,
} from '../controllers/order-controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const orderRoutes = Router();

orderRoutes.get('/', requireAuth, requireRole(['manager', 'admin']), listOrders);
orderRoutes.get('/statuses', requireAuth, requireRole(['manager', 'admin']), listStatuses);
orderRoutes.post('/', requireAuth, requireRole(['admin']), createOrder);
orderRoutes.put('/:id', requireAuth, requireRole(['admin']), updateOrder);
orderRoutes.delete('/:id', requireAuth, requireRole(['admin']), deleteOrder);
