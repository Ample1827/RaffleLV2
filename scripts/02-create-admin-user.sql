-- Create default admin user
INSERT INTO users (email, name, is_admin)
VALUES ('admin@rafflepro.com', 'Rvega21', TRUE)
ON CONFLICT (email) DO UPDATE SET
  is_admin = TRUE,
  name = 'Rvega21';
