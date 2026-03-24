import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProductForm } from '../components/ProductForm';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth-context';
import type { Category, Manufacturer, Product, Supplier } from '../lib/types';

export function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [search, setSearch] = useState('');
  const [supplierId, setSupplierId] = useState('all');
  const [stockSort, setStockSort] = useState<'none' | 'asc' | 'desc'>('none');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const canManage = user?.role === 'admin';
  const canFilter = user?.role === 'manager' || user?.role === 'admin';

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setSearch(event.target.value);
  }

  function handleSupplierChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    setSupplierId(event.target.value);
  }

  function handleStockSortChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    setStockSort(event.target.value as 'none' | 'asc' | 'desc');
  }

  function handleOpenCreateModal(): void {
    setIsCreateOpen(true);
  }

  function handleCloseCreateModal(): void {
    setIsCreateOpen(false);
  }

  function handleCloseEditModal(): void {
    setEditingProduct(null);
  }

  function handleEditProduct(product: Product): void {
    setEditingProduct(product);
  }

  function handleProductImageError(event: React.SyntheticEvent<HTMLImageElement>): void {
    event.currentTarget.src = '/picture.svg';
  }

  async function handleDeleteProduct(productId: number): Promise<void> {
    try {
      await api.deleteProduct(productId);
      await loadProducts();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось удалить товар');
    }
  }

  function createDeleteProductHandler(productId: number): () => void {
    return () => {
      void handleDeleteProduct(productId);
    };
  }

  function createEditProductHandler(product: Product): () => void {
    return () => {
      handleEditProduct(product);
    };
  }

  async function handleCreateProduct(payload: {
    title: string;
    categoryId: number;
    description: string;
    manufacturerId: number;
    supplierId: number;
    price: number;
    unit: string;
    stock: number;
    discountPercent: number;
    imagePath: string;
  }): Promise<void> {
    await api.createProduct(payload);
    setIsCreateOpen(false);
    await loadProducts();
  }

  async function handleUpdateProduct(payload: {
    title: string;
    categoryId: number;
    description: string;
    manufacturerId: number;
    supplierId: number;
    price: number;
    unit: string;
    stock: number;
    discountPercent: number;
    imagePath: string;
  }): Promise<void> {
    if (!editingProduct) {
      return;
    }

    await api.updateProduct(editingProduct.id, payload);
    setEditingProduct(null);
    await loadProducts();
  }

  const loadProducts = useCallback(async (): Promise<void> => {
    try {
      const params = new URLSearchParams();
      if (canFilter) {
        if (search.trim()) params.set('search', search.trim());
        if (supplierId !== 'all') params.set('supplierId', supplierId);
        if (stockSort !== 'none') params.set('stockSort', stockSort);
      }
      const data = await api.getProducts(params);
      setProducts(data);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось загрузить товары');
    }
  }, [canFilter, search, stockSort, supplierId]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    void api.getProductMeta().then((meta) => {
      setSuppliers(meta.suppliers);
      setCategories(meta.categories);
      setManufacturers(meta.manufacturers);
    });
  }, []);

  const title = useMemo(() => {
    if (user?.role === 'guest') return 'Список товаров (гость)';
    if (user?.role === 'client') return 'Список товаров (клиент)';
    if (user?.role === 'manager') return 'Список товаров (менеджер)';
    return 'Список товаров (администратор)';
  }, [user?.role]);

  return (
    <section>
      <h2>{title}</h2>

      {canFilter && (
        <div className="toolbar">
          <input
            placeholder="Поиск по текстовым полям"
            value={search}
            onChange={handleSearchChange}
          />
          <select value={supplierId} onChange={handleSupplierChange}>
            <option value="all">Все поставщики</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
          <select value={stockSort} onChange={handleStockSortChange}>
            <option value="none">Без сортировки</option>
            <option value="asc">Остаток: возрастание</option>
            <option value="desc">Остаток: убывание</option>
          </select>
          {canManage && (
            <button type="button" onClick={handleOpenCreateModal}>
              Добавить товар
            </button>
          )}
        </div>
      )}

      {errorMessage && <div className="error-box">{errorMessage}</div>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Фото</th>
              <th>Наименование</th>
              <th>Категория</th>
              <th>Описание</th>
              <th>Производитель</th>
              <th>Поставщик</th>
              <th>Цена</th>
              <th>Ед.</th>
              <th>Остаток</th>
              <th>Скидка</th>
              {canManage && <th>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const finalPrice = product.price * (1 - product.discount_percent / 100);
              const rowClass = product.stock === 0 ? 'row-out-of-stock' : product.discount_percent > 15 ? 'row-big-discount' : '';

              return (
                <tr key={product.id} className={rowClass}>
                  <td>
                    <img
                      src={product.image_path || '/picture.svg'}
                      alt={product.title}
                      className="product-image"
                      onError={handleProductImageError}
                    />
                  </td>
                  <td>{product.title}</td>
                  <td>{product.category_name}</td>
                  <td>{product.description}</td>
                  <td>{product.manufacturer_name}</td>
                  <td>{product.supplier_name}</td>
                  <td>
                    {product.discount_percent > 0 ? (
                      <>
                        <span className="old-price">{product.price.toFixed(2)}</span>{' '}
                        <span>{finalPrice.toFixed(2)}</span>
                      </>
                    ) : (
                      <span>{product.price.toFixed(2)}</span>
                    )}
                  </td>
                  <td>{product.unit}</td>
                  <td>{product.stock}</td>
                  <td>{product.discount_percent}%</td>
                  {canManage && (
                    <td>
                      <button type="button" onClick={createEditProductHandler(product)}>
                        Редактировать
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={createDeleteProductHandler(product.id)}
                      >
                        Удалить
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isCreateOpen && (
        <ProductForm
          categories={categories}
          manufacturers={manufacturers}
          suppliers={suppliers}
          onSave={handleCreateProduct}
          onClose={handleCloseCreateModal}
        />
      )}

      {editingProduct && (
        <ProductForm
          categories={categories}
          manufacturers={manufacturers}
          suppliers={suppliers}
          initial={editingProduct}
          onSave={handleUpdateProduct}
          onClose={handleCloseEditModal}
        />
      )}
    </section>
  );
}
