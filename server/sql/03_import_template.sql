-- Шаблон этапа staging-импорта (рекомендованный вариант).
-- 1) Загружаем исходные CSV/XLSX в staging-таблицы.
-- 2) Нормализуем и переносим данные в целевые таблицы.

CREATE TABLE IF NOT EXISTS staging_product_raw (
  title TEXT,
  category_name TEXT,
  description TEXT,
  manufacturer_name TEXT,
  supplier_name TEXT,
  price_text TEXT,
  unit TEXT,
  stock_text TEXT,
  discount_text TEXT,
  image_path TEXT
);

-- Пример нормализации из staging_product_raw в product.
-- Этот блок адаптируется после получения финального формата import-файлов.
