-- Reset all tickets to available first
UPDATE tickets 
SET is_available = true;

-- Then mark only the tickets that are actually in purchases as unavailable
UPDATE tickets 
SET is_available = false 
WHERE ticket_number IN (
  SELECT UNNEST(ticket_numbers) 
  FROM purchases 
  WHERE status = 'pending' OR status = 'approved'
);

-- Verify the fix
SELECT 
  COUNT(*) FILTER (WHERE is_available = true) as available_tickets,
  COUNT(*) FILTER (WHERE is_available = false) as sold_tickets,
  COUNT(*) as total_tickets
FROM tickets;
