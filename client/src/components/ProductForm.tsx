import { useState } from 'react';
import type { Category, Manufacturer, Product, Supplier } from '../lib/types';

interface ProductFormProps {
  categories: Category[];
  manufacturers: Manufacturer[];
  suppliers: Supplier[];
  initial?: Product;
  onSave: (payload: {
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
  }) => Promise<void>;
  onClose: () => void;
}

export function ProductForm({
  categories,
  manufacturers,
  suppliers,
  initial,
  onSave,
  onClose,
}: ProductFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? categories[0]?.id ?? 1);
  const [description, setDescription] = useState(initial?.description ?? '');
  const [manufacturerId, setManufacturerId] = useState(initial?.manufacturer_id ?? manufacturers[0]?.id ?? 1);
  const [supplierId, setSupplierId] = useState(initial?.supplier_id ?? suppliers[0]?.id ?? 1);
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [unit, setUnit] = useState(initial?.unit ?? 'пара');
  const [stock, setStock] = useState(initial?.stock ?? 0);
  const [discountPercent, setDiscountPercent] = useState(initial?.discount_percent ?? 0);
  const [imagePath, setImagePath] = useState(initial?.image_path ?? '/picture.svg');

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setTitle(event.target.value);
  }

  function handleCategoryChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    setCategoryId(Number(event.target.value));
  }

  function handleDescriptionChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    setDescription(event.target.value);
  }

  function handleManufacturerChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    setManufacturerId(Number(event.target.value));
  }

  function handleSupplierChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    setSupplierId(Number(event.target.value));
  }

  function handlePriceChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setPrice(Number(event.target.value));
  }

  function handleUnitChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setUnit(event.target.value);
  }

  function handleStockChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setStock(Number(event.target.value));
  }

  function handleDiscountChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setDiscountPercent(Number(event.target.value));
  }

  function handleImagePathChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setImagePath(event.target.value);
  }

  function handleSaveClick(): void {
    void onSave({
      title,
      description,
      price,
      unit,
      stock,
      discountPercent,
      imagePath,
      categoryId,
      manufacturerId,
      supplierId,
    });
  }

  return (
    <div className="modal-backdrop">
      <section className="modal">
        <h2>{initial ? 'Редактирование товара' : 'Добавление товара'}</h2>
        {initial && (
          <label>
            ID
            <input value={initial.id} readOnly disabled />
          </label>
        )}
        <label>
          Наименование
          <input value={title} onChange={handleTitleChange} />
        </label>
        <label>
          Категория
          <select value={categoryId} onChange={handleCategoryChange}>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Описание
          <textarea value={description} onChange={handleDescriptionChange} />
        </label>
        <label>
          Производитель
          <select value={manufacturerId} onChange={handleManufacturerChange}>
            {manufacturers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Поставщик
          <select value={supplierId} onChange={handleSupplierChange}>
            {suppliers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Цена
          <input
            type="number"
            min={0}
            step={0.01}
            value={price}
            onChange={handlePriceChange}
          />
        </label>
        <label>
          Единица
          <input value={unit} onChange={handleUnitChange} />
        </label>
        <label>
          Количество на складе
          <input
            type="number"
            min={0}
            value={stock}
            onChange={handleStockChange}
          />
        </label>
        <label>
          Скидка, %
          <input
            type="number"
            min={0}
            max={100}
            value={discountPercent}
            onChange={handleDiscountChange}
          />
        </label>
        <label>
          Путь к изображению
          <input value={imagePath} onChange={handleImagePathChange} />
        </label>
        <div className="modal-actions">
          <button type="button" onClick={handleSaveClick}>
            Сохранить
          </button>
          <button type="button" onClick={onClose}>
            Отмена
          </button>
        </div>
      </section>
    </div>
  );
}
