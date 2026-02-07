
-- 1. Insert the Donation Product safely
-- We use a DO block or simple INSERT with WHERE NOT EXISTS to avoid "ON CONFLICT" errors if no unique constraint exists.
INSERT INTO products (display_name, price, current_inventory_count, image_name)
SELECT 'Donation', 7.00, 10000, NULL
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE display_name = 'Donation'
);

-- 2. Create the reset function
CREATE OR REPLACE FUNCTION reset_donation_inventory()
RETURNS TRIGGER AS $$
DECLARE
    donation_id uuid;
BEGIN
    -- Find the ID of the 'Donation' product to be safe
    SELECT id INTO donation_id FROM products WHERE display_name = 'Donation' LIMIT 1;
    
    -- If the sold item is the donation product, reset its stock
    IF NEW.product_id = donation_id THEN
        UPDATE products
        SET current_inventory_count = 10000
        WHERE id = donation_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create the Trigger
DROP TRIGGER IF EXISTS trigger_reset_donation_inventory ON sales;

CREATE TRIGGER trigger_reset_donation_inventory
AFTER INSERT ON sales
FOR EACH ROW
EXECUTE FUNCTION reset_donation_inventory();
