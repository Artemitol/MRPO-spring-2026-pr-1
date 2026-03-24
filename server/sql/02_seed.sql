INSERT INTO role_type(name)
VALUES ('guest'), ('client'), ('manager'), ('admin');

INSERT INTO app_user(full_name, login, password_hash, role)
VALUES
  ('Гость Системы', 'guest', '$2b$10$VgGck228B4as/g44AwyGbeh567T5MmLfl9jraLQcNKiwS41KLFWPi', 'guest'),
  ('Иванов Иван Иванович', 'client', '$2b$10$VgGck228B4as/g44AwyGbeh567T5MmLfl9jraLQcNKiwS41KLFWPi', 'client'),
  ('Петров Петр Петрович', 'manager', '$2b$10$VgGck228B4as/g44AwyGbeh567T5MmLfl9jraLQcNKiwS41KLFWPi', 'manager'),
  ('Сидоров Сидор Сидорович', 'admin', '$2b$10$VgGck228B4as/g44AwyGbeh567T5MmLfl9jraLQcNKiwS41KLFWPi', 'admin');

INSERT INTO category(name)
VALUES ('Ботинки'), ('Туфли'), ('Кроссовки');

INSERT INTO manufacturer(name)
VALUES ('Rieker'), ('ECCO'), ('Tamaris');

INSERT INTO supplier(name)
VALUES ('Поставщик А'), ('Поставщик Б'), ('Поставщик В');

INSERT INTO product(title, category_id, description, manufacturer_id, supplier_id, price, unit, stock, discount_percent, image_path)
VALUES
  ('Черные ботинки', 1, 'Кожаные ботинки на шнуровке', 2, 1, 7990.00, 'пара', 12, 10, '/uploads/shoe-1.png'),
  ('Коричневые туфли', 2, 'Повседневные туфли', 1, 2, 6590.00, 'пара', 0, 20, '/uploads/shoe-2.png'),
  ('Желтые кроссовки', 3, 'Треккинговые кроссовки', 2, 3, 8990.00, 'пара', 7, 5, '/uploads/shoe-3.png');

INSERT INTO order_status(name)
VALUES ('Новый'), ('Собирается'), ('Готов к выдаче'), ('Выдан');

INSERT INTO shop_order(article, status_id, pickup_address, order_date, issue_date)
VALUES
  ('ORD-1001', 1, 'г. Москва, ул. Пушкина, 1', '2026-03-15', '2026-03-18'),
  ('ORD-1002', 3, 'г. Москва, ул. Ленина, 5', '2026-03-12', '2026-03-16');

INSERT INTO order_item(order_id, product_id, quantity)
VALUES
  (1, 1, 1),
  (1, 3, 2),
  (2, 2, 1);
