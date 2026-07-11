-- Pill Pal / AuraMed database schema
-- Import: mysql -u root conference < config/schema.sql
-- NOTE: This mirrors the real 'conference' database structure.
--
-- MIGRATING AN EXISTING DATABASE:
-- If you set up your `products` table before the `price` column was added,
-- run this once in phpMyAdmin's SQL tab (or via mysql CLI) against your
-- existing database instead of re-importing everything:
--   ALTER TABLE products ADD COLUMN price DECIMAL(10,2) DEFAULT 0.00 AFTER product_name;
--
-- If your `bundles` table exists but doesn't have `stock_quantity` yet
-- (older schema), add it the same way:
--   ALTER TABLE bundles ADD COLUMN stock_quantity INT DEFAULT 0 AFTER bundle_price;
--
-- Optional but recommended: older `bundles` tables also predate `created_at`.
-- auth/bundles.php works fine without it, but if you want an "Added" date
-- like products have:
--   ALTER TABLE bundles ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
--
-- To pull the two curated bundles from the Products & Bundles page into the
-- admin dashboard's Bundle tab, seed them once with:
--   INSERT INTO bundles (bundle_name, bundle_price, stock_quantity) VALUES
--     ('Pill Pal Buddy Home Bundle', 2299.00, 25),
--     ('Pill Pal Buddy Traveler Bundle', 1650.00, 25);

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    user_email VARCHAR(100) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    gender ENUM('male','female') DEFAULT 'male',
    phone INT(11) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_email VARCHAR(100) NOT NULL UNIQUE,
    admin_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    username VARCHAR(50) DEFAULT '',
    gender VARCHAR(20) DEFAULT '',
    phone VARCHAR(20) DEFAULT '',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) DEFAULT 0.00,
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bundles (
    bundle_id INT AUTO_INCREMENT PRIMARY KEY,
    bundle_name VARCHAR(255) NOT NULL,
    bundle_price DECIMAL(10,2) DEFAULT 0.00,
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed the two curated bundles shown on the Products & Bundles page so they
-- also appear in the admin dashboard's Bundle tab out of the box.
INSERT INTO bundles (bundle_name, bundle_price, stock_quantity)
SELECT * FROM (SELECT 'Pill Pal Buddy Home Bundle' AS bundle_name, 2299.00 AS bundle_price, 25 AS stock_quantity) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM bundles WHERE bundle_name = 'Pill Pal Buddy Home Bundle');

INSERT INTO bundles (bundle_name, bundle_price, stock_quantity)
SELECT * FROM (SELECT 'Pill Pal Buddy Traveler Bundle' AS bundle_name, 1650.00 AS bundle_price, 25 AS stock_quantity) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM bundles WHERE bundle_name = 'Pill Pal Buddy Traveler Bundle');

CREATE TABLE IF NOT EXISTS carts (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_products (
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    PRIMARY KEY (cart_id, product_id),
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_quantity INT DEFAULT 0,
    order_price DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_products (
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    reminder_time TIME NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
