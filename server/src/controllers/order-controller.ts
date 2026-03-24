import type { Response } from 'express';
import { z } from 'zod';
import { db } from '../config/db.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { ApiError } from '../middleware/error-handler.js';

const orderSchema = z.object({
  article: z.string().min(1),
  statusId: z.number().int().positive(),
  pickupAddress: z.string().min(4),
  orderDate: z.string().date(),
  issueDate: z.string().date(),
});

export async function listOrders(_req: AuthenticatedRequest, res: Response): Promise<void> {
  const result = await db.query(
    `SELECT o.id, o.article, o.pickup_address, o.order_date, o.issue_date,
            s.id AS status_id, s.name AS status_name
     FROM shop_order o
     JOIN order_status s ON s.id = o.status_id
     ORDER BY o.id DESC`,
  );

  res.json(result.rows);
}

export async function listStatuses(_req: AuthenticatedRequest, res: Response): Promise<void> {
  const result = await db.query('SELECT id, name FROM order_status ORDER BY id');
  res.json(result.rows);
}

export async function createOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, 'Некорректные данные заказа');
  }

  const o = parsed.data;
  const result = await db.query(
    `INSERT INTO shop_order (article, status_id, pickup_address, order_date, issue_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [o.article, o.statusId, o.pickupAddress, o.orderDate, o.issueDate],
  );

  res.status(201).json({ id: result.rows[0].id });
}

export async function updateOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
  const orderId = Number(req.params.id);
  if (Number.isNaN(orderId)) {
    throw new ApiError(400, 'Некорректный ID заказа');
  }

  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, 'Некорректные данные заказа');
  }

  const o = parsed.data;
  const result = await db.query(
    `UPDATE shop_order
     SET article = $1,
         status_id = $2,
         pickup_address = $3,
         order_date = $4,
         issue_date = $5
     WHERE id = $6`,
    [o.article, o.statusId, o.pickupAddress, o.orderDate, o.issueDate, orderId],
  );

  if ((result.rowCount ?? 0) === 0) {
    throw new ApiError(404, 'Заказ не найден');
  }

  res.status(204).send();
}

export async function deleteOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
  const orderId = Number(req.params.id);
  if (Number.isNaN(orderId)) {
    throw new ApiError(400, 'Некорректный ID заказа');
  }

  await db.query('DELETE FROM order_item WHERE order_id = $1', [orderId]);
  const result = await db.query('DELETE FROM shop_order WHERE id = $1', [orderId]);

  if ((result.rowCount ?? 0) === 0) {
    throw new ApiError(404, 'Заказ не найден');
  }

  res.status(204).send();
}
