-- Fixed to match actual database schema: ticket_number as integer, is_available as boolean
INSERT INTO tickets (ticket_number, is_available)
SELECT 
  generate_series as ticket_number,
  true as is_available
FROM generate_series(0, 9999)
ON CONFLICT (ticket_number) DO NOTHING;
