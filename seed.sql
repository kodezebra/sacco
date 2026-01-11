-- Initialize SACCO
INSERT INTO sacco (id, name, created_at, currency, default_interest_rate) 
VALUES ('sacco-01', 'Mukasa Coders SACCO', CURRENT_TIMESTAMP, 'UGX', 5.0);

-- Initialize Members
INSERT INTO members (id, sacco_id, full_name, member_number, status, created_at) VALUES 
('mbr_mukasa', 'sacco-01', 'Mukasa Patrick', 'MBR1001', 'active', CURRENT_TIMESTAMP),
('mbr_kirabo', 'sacco-01', 'Kirabo Mark', 'MBR1002', 'active', CURRENT_TIMESTAMP),
('mbr_tendo', 'sacco-01', 'Tendo Faith', 'MBR1003', 'active', CURRENT_TIMESTAMP),
('mbr_kitimbo', 'sacco-01', 'Kitimbo John', 'MBR1004', 'active', CURRENT_TIMESTAMP),
('mbr_ziwa', 'sacco-01', 'Ziwa Paul', 'MBR1005', 'active', CURRENT_TIMESTAMP);
