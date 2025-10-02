-- Add buyer information and reservation ID to purchases table
ALTER TABLE purchases
ADD COLUMN IF NOT EXISTS buyer_name TEXT,
ADD COLUMN IF NOT EXISTS buyer_phone TEXT,
ADD COLUMN IF NOT EXISTS buyer_state TEXT,
ADD COLUMN IF NOT EXISTS reservation_id TEXT UNIQUE;

-- Add index on reservation_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_purchases_reservation_id ON purchases(reservation_id);

-- Add comments to document the columns
COMMENT ON COLUMN purchases.buyer_name IS 'Buyer name for guest purchases';
COMMENT ON COLUMN purchases.buyer_phone IS 'Buyer phone number';
COMMENT ON COLUMN purchases.buyer_state IS 'Buyer state/region';
COMMENT ON COLUMN purchases.reservation_id IS 'Unique reservation identifier (e.g., TKT-923498-VY3)';
