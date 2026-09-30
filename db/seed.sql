INSERT INTO companies (name, tax_id, email, phone, address, city, country, created_by)
VALUES ('Mizan Demo Company', '1234567890', 'admin@mizan.local', '966500000000', 'Riyadh', 'Riyadh', 'Saudi Arabia', 1);

INSERT INTO users (company_id, email, name, password_hash, role)
VALUES 
  (1, 'admin@mizan.local', 'System Admin', '$2a$10$Q4u8m6pKQclT7vNz8t3S9.e9E1mnR4TnU7sXt4m4sQvIYbP3N5WGi', 'admin'),
  (1, 'accountant@mizan.local', 'Accountant', '$2a$10$Q4u8m6pKQclT7vNz8t3S9.e9E1mnR4TnU7sXt4m4sQvIYbP3N5WGi', 'accountant'),
  (1, 'sales@mizan.local', 'Sales Manager', '$2a$10$Q4u8m6pKQclT7vNz8t3S9.e9E1mnR4TnU7sXt4m4sQvIYbP3N5WGi', 'sales');

INSERT INTO periods (company_id, period_name, start_date, end_date, is_closed)
VALUES (1, '2026-09', '2026-09-01', '2026-09-30', false);
