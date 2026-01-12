-- SACCO Initial Data
INSERT OR IGNORE INTO sacco (id, name, email, phone, address, currency, default_interest_rate, default_loan_duration, share_price, registration_fee, created_at)
VALUES ('sacco-01', 'kzApp SACCO', 'support@kzapp-sacco.com', '+256 700 000 000', 'Plot 45, Kampala Road', 'UGX', 5.0, 6, 20000, 10000, '2026-01-12');

-- Super Admin User (Initial Bootstrap)
-- Identifier: admin@sacco.com
-- Password: password123
INSERT OR IGNORE INTO users (id, identifier, password, role, status, created_at)
VALUES ('user_admin_01', 'admin@sacco.com', 'b9dab4b905215e91e4c5eb0fa66349c2:a6feb3f7a68d76e5a383ab459678ba3cc19f7f662706d351aa8df0234bc432bb', 'super_admin', 'active', CURRENT_TIMESTAMP);

-- Initialize Members
INSERT OR IGNORE INTO members (id, sacco_id, full_name, member_number, status, created_at) VALUES 
('mbr_mukasa', 'sacco-01', 'Mukasa Patrick', 'MBR1001', 'active', CURRENT_TIMESTAMP),
('mbr_kirabo', 'sacco-01', 'Kirabo Mark', 'MBR1002', 'active', CURRENT_TIMESTAMP),
('mbr_tendo', 'sacco-01', 'Tendo Faith', 'MBR1003', 'active', CURRENT_TIMESTAMP),
('mbr_kitimbo', 'sacco-01', 'Kitimbo John', 'MBR1004', 'active', CURRENT_TIMESTAMP),
('mbr_ziwa', 'sacco-01', 'Ziwa Paul', 'MBR1005', 'active', CURRENT_TIMESTAMP);
