-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_email = 'Adalromero99@gmail.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin policy for purchases table
CREATE POLICY "Admin can view all purchases" ON purchases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND is_admin(auth.users.email)
    )
  );

-- Create admin policy for updating purchases
CREATE POLICY "Admin can update all purchases" ON purchases
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND is_admin(auth.users.email)
    )
  );
