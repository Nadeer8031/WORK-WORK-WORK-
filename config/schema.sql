-- Minimal schema matching what auth/register.php and auth/login.php expect.
-- Import this into the "SmartMedicineCabinet" database referenced in config/db.php
-- before testing registration/login, e.g.:
--   mysql -u root SmartMedicineCabinet < config/schema.sql

CREATE TABLE IF NOT EXISTS users (
    u_id INT AUTO_INCREMENT PRIMARY KEY,
    u_email VARCHAR(255) NOT NULL UNIQUE,
    u_password VARCHAR(255) NOT NULL,
    u_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
