import React from "react";

function CartSidebar({ user, cartItems, cartTotal, closeCart }) {

  return (
    <div className="cart-overlay" onClick={closeCart}>
      <div className="cart" onClick={(e) => e.stopPropagation()}>

        <h2>Giỏ hàng</h2>

        {user ? (
          <p>Xin chào, {user.name}!</p>
        ) : (
          <p>Bạn chưa đăng nhập</p>
        )}

        {cartItems.length > 0 ? (
          <div className="cart-sidebar-items">

            {cartItems.map(item => (
              <div key={item.id} className="cart-sidebar-item">
                <img
                  src={item.imageMain}
                  alt={item.laptopName}
                  className="cart-sidebar-img"
                />

                <div className="cart-sidebar-info">
                  <p className="cart-sidebar-name">{item.laptopName}</p>

                  <p className="cart-sidebar-price">
                    {item.price.toLocaleString("vi-VN")}₫ × {item.quantity}
                  </p>
                </div>

              </div>
            ))}

            <div className="cart-sidebar-total">
              <span>Tổng cộng:</span>
              <span className="cart-sidebar-total-price">
                {cartTotal.toLocaleString("vi-VN")}₫
              </span>
            </div>

            <a href="/Giohang" className="cart-sidebar-btn cart-sidebar-btn-primary">
              Xem giỏ hàng
            </a>

            <a href="/ThanhToan" className="cart-sidebar-btn cart-sidebar-btn-checkout">
              Thanh toán ngay
            </a>

          </div>
        ) : (
          <div>
            <img src="../images/cart_no_item.jpg" alt="Empty Cart" />
            <p className="cart-empty-text">Giỏ hàng chưa có gì!</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default CartSidebar;