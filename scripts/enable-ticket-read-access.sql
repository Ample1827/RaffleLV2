-- Enable Row Level Security on tickets table
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read tickets
CREATE POLICY "Anyone can view tickets"
ON tickets
FOR SELECT
TO public
USING (true);

-- Create policy to allow service role to do everything
CREATE POLICY "Service role can do everything"
ON tickets
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
