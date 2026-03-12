DROP TRIGGER IF EXISTS trigger_create_cart ON users;
DROP FUNCTION IF EXISTS create_cart_for_user();

CREATE OR REPLACE FUNCTION create_cart_for_user()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
INSERT INTO carts(id, updated_at)
VALUES (NEW.id, NOW());
RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_create_cart
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_cart_for_user();