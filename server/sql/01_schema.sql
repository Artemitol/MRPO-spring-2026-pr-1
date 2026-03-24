CREATE TABLE role_type (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE app_user (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  login VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(120) NOT NULL,
  role VARCHAR(20) NOT NULL REFERENCES role_type(name)
);

CREATE TABLE category (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE manufacturer (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) UNIQUE NOT NULL
);

CREATE TABLE supplier (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) UNIQUE NOT NULL
);

CREATE TABLE product (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  category_id INTEGER NOT NULL REFERENCES category(id),
  description TEXT NOT NULL DEFAULT '',
  manufacturer_id INTEGER NOT NULL REFERENCES manufacturer(id),
  supplier_id INTEGER NOT NULL REFERENCES supplier(id),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  unit VARCHAR(20) NOT NULL,
  stock INTEGER NOT NULL CHECK (stock >= 0),
  discount_percent INTEGER NOT NULL DEFAULT 0 CHECK (discount_percent BETWEEN 0 AND 100),
  image_path TEXT NOT NULL DEFAULT '/picture.svg'
);

CREATE TABLE order_status (
  id SERIAL PRIMARY KEY,
  name VARCHAR(40) UNIQUE NOT NULL
);

CREATE TABLE shop_order (
  id SERIAL PRIMARY KEY,
  article VARCHAR(50) NOT NULL,
  status_id INTEGER NOT NULL REFERENCES order_status(id),
  pickup_address TEXT NOT NULL,
  order_date DATE NOT NULL,
  issue_date DATE NOT NULL,
  CHECK (issue_date >= order_date)
);

CREATE TABLE order_item (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES shop_order(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  UNIQUE (order_id, product_id)
);
