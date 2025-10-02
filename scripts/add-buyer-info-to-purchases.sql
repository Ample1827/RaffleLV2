-- Add buyer information columns to purchases table
ALTER TABLE purchases
ADD COLUMN IF NOT EXISTS buyer_name TEXT,
ADD COLUMN IF NOT EXISTS buyer_phone TEXT,
ADD COLUMN IF NOT EXISTS buyer_state TEXT;

-- Add comment to explain the columns
COMMENT ON COLUMN purchases.buyer_name IS 'Full name of the buyer (first name + last name)';
COMMENT ON COLUMN purchases.buyer_phone IS 'Phone number of the buyer';
COMMENT ON COLUMN purchases.buyer_state IS 'State/region where the buyer is located';
