import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  listProductMeta,
  listProducts,
  listSuppliers,
  updateProduct,
} from '../controllers/product-controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const productRoutes = Router();

productRoutes.get('/', listProducts);
productRoutes.get('/suppliers', listSuppliers);
productRoutes.get('/meta', listProductMeta);

productRoutes.post('/', requireAuth, requireRole(['admin']), createProduct);
productRoutes.put('/:id', requireAuth, requireRole(['admin']), updateProduct);
productRoutes.delete('/:id', requireAuth, requireRole(['admin']), deleteProduct);
