-- Add customer information columns to purchases table
ALTER TABLE purchases
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS customer_state TEXT,
ADD COLUMN IF NOT EXISTS ticket_id TEXT;

-- Add index on ticket_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_purchases_ticket_id ON purchases(ticket_id);

-- Add comment to document the columns
COMMENT ON COLUMN purchases.customer_name IS 'Customer name for guest purchases';
COMMENT ON COLUMN purchases.customer_phone IS 'Customer phone number';
COMMENT ON COLUMN purchases.customer_state IS 'Customer state/region';
COMMENT ON COLUMN purchases.ticket_id IS 'Unique ticket identifier (e.g., TKT-2025-123456)';
