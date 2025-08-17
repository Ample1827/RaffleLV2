-- Update the default admin user with proper authentication
-- This should be run after the admin user signs up with email: admin@rafflepro.com and password: 1827RomLV

-- First, let's make sure the admin user exists in auth.users
-- This will be handled by the signup process

-- Update the users table to mark the admin user as admin
UPDATE users 
SET is_admin = TRUE, name = 'Rvega21'
WHERE email = 'admin@rafflepro.com';

-- If the user doesn't exist yet, insert them
INSERT INTO users (email, name, is_admin)
VALUES ('admin@rafflepro.com', 'Rvega21', TRUE)
ON CONFLICT (email) DO UPDATE SET
  is_admin = TRUE,
  name = 'Rvega21';
