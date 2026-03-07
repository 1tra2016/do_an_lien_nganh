-- Câu lệnh 1: Dọn dẹp cũ
DROP TRIGGER IF EXISTS trigger_create_cart ON users $$
DROP FUNCTION IF EXISTS create_cart_for_user() $$

-- Câu lệnh 2: Tạo hàm (Chú ý dấu $$ ở cuối cùng)
CREATE OR REPLACE FUNCTION create_cart_for_user()
RETURNS TRIGGER AS $BODY$
BEGIN
INSERT INTO carts(user_id, updated_at)
VALUES (NEW.id, NOW());
RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql $$

-- Câu lệnh 3: Tạo trigger
CREATE TRIGGER trigger_create_cart
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_cart_for_user() $$