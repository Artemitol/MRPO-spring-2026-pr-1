import type { Response } from 'express';
import { z } from 'zod';
import { db } from '../config/db.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { ApiError } from '../middleware/error-handler.js';

const productSchema = z.object({
  title: z.string().min(2),
  categoryId: z.number().int().positive(),
  description: z.string().default(''),
  manufacturerId: z.number().int().positive(),
  supplierId: z.number().int().positive(),
  price: z.number().nonnegative(),
  unit: z.string().min(1),
  stock: z.number().int().nonnegative(),
  discountPercent: z.number().int().min(0).max(100),
  imagePath: z.string().default('/picture.svg'),
});

export async function listProducts(req: AuthenticatedRequest, res: Response): Promise<void> {
  const role = req.user?.role ?? 'guest';
  const canUseFilters = role === 'manager' || role === 'admin';

  const search = canUseFilters ? String(req.query.search ?? '').trim() : '';
  const supplierId = canUseFilters ? Number(req.query.supplierId ?? 0) : 0;
  const stockSort = canUseFilters ? String(req.query.stockSort ?? 'none') : 'none';

  const conditions: string[] = [];
  const params: Array<string | number> = [];

  if (search) {
    params.push(`%${search.toLowerCase()}%`);
    const index = params.length;
    conditions.push(
      `(LOWER(p.title) LIKE $${index} OR LOWER(p.description) LIKE $${index} OR LOWER(c.name) LIKE $${index} OR LOWER(m.name) LIKE $${index} OR LOWER(s.name) LIKE $${index})`,
    );
  }

  if (!Number.isNaN(supplierId) && supplierId > 0) {
    params.push(supplierId);
    conditions.push(`p.supplier_id = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  let orderBy = 'ORDER BY p.id';
  if (stockSort === 'asc') {
    orderBy = 'ORDER BY p.stock ASC, p.id ASC';
  }
  if (stockSort === 'desc') {
    orderBy = 'ORDER BY p.stock DESC, p.id ASC';
  }

    const query = `
      SELECT p.id, p.title, p.description, p.price::float8 AS price, p.unit, p.stock, p.discount_percent, p.image_path,
          p.category_id, p.manufacturer_id,
           c.name AS category_name, m.name AS manufacturer_name, s.id AS supplier_id, s.name AS supplier_name
    FROM product p
    JOIN category c ON c.id = p.category_id
    JOIN manufacturer m ON m.id = p.manufacturer_id
    JOIN supplier s ON s.id = p.supplier_id
    ${where}
    ${orderBy}
  `;

  const result = await db.query(query, params);
  res.json(result.rows);
}

export async function listSuppliers(_req: AuthenticatedRequest, res: Response): Promise<void> {
  const result = await db.query('SELECT id, name FROM supplier ORDER BY name');
  res.json(result.rows);
}

export async function listProductMeta(_req: AuthenticatedRequest, res: Response): Promise<void> {
  const [categories, manufacturers, suppliers] = await Promise.all([
    db.query('SELECT id, name FROM category ORDER BY name'),
    db.query('SELECT id, name FROM manufacturer ORDER BY name'),
    db.query('SELECT id, name FROM supplier ORDER BY name'),
  ]);

  res.json({
    categories: categories.rows,
    manufacturers: manufacturers.rows,
    suppliers: suppliers.rows,
  });
}

export async function createProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, 'Некорректные данные товара');
  }

  const p = parsed.data;
  const result = await db.query(
    `INSERT INTO product
      (title, category_id, description, manufacturer_id, supplier_id, price, unit, stock, discount_percent, image_path)
     VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id`,
    [
      p.title,
      p.categoryId,
      p.description,
      p.manufacturerId,
      p.supplierId,
      p.price,
      p.unit,
      p.stock,
      p.discountPercent,
      p.imagePath,
    ],
  );

  res.status(201).json({ id: result.rows[0].id });
}

export async function updateProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
  const productId = Number(req.params.id);
  if (Number.isNaN(productId)) {
    throw new ApiError(400, 'Некорректный ID товара');
  }

  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, 'Некорректные данные товара');
  }

  const p = parsed.data;
  const result = await db.query(
    `UPDATE product
     SET title = $1,
         category_id = $2,
         description = $3,
         manufacturer_id = $4,
         supplier_id = $5,
         price = $6,
         unit = $7,
         stock = $8,
         discount_percent = $9,
         image_path = $10
     WHERE id = $11`,
    [
      p.title,
      p.categoryId,
      p.description,
      p.manufacturerId,
      p.supplierId,
      p.price,
      p.unit,
      p.stock,
      p.discountPercent,
      p.imagePath,
      productId,
    ],
  );

  if ((result.rowCount ?? 0) === 0) {
    throw new ApiError(404, 'Товар не найден');
  }

  res.status(204).send();
}

export async function deleteProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
  const productId = Number(req.params.id);
  if (Number.isNaN(productId)) {
    throw new ApiError(400, 'Некорректный ID товара');
  }

  const orderUsage = await db.query(
    'SELECT 1 FROM order_item WHERE product_id = $1 LIMIT 1',
    [productId],
  );

  if ((orderUsage.rowCount ?? 0) > 0) {
    throw new ApiError(409, 'Товар нельзя удалить, так как он используется в заказе');
  }

  const result = await db.query('DELETE FROM product WHERE id = $1', [productId]);
  if ((result.rowCount ?? 0) === 0) {
    throw new ApiError(404, 'Товар не найден');
  }

  res.status(204).send();
}
