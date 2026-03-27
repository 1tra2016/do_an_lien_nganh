import { useNavigate } from "react-router-dom";
import '../css/Giohang.css';
import Myheader from "./Myheader";
import Footer from "./Footer";

import axios from "axios";
import { useEffect, useState } from "react";    

const cartAPI = axios.create({
  baseURL: "http://localhost:8080/api/carts"
});

const Giohang = () => {

    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

      const fetchCart = async () => {

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          setLoading(false);
          navigate("/login");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        try {
          const response = await cartAPI.get(`/${parsedUser.id}`);
          const cart = response.data.data;
          setCartItems(cart.items || []);
        } catch (err) {
          console.error("Lỗi load cart:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchCart();
    }, []);

    const reloadCart = async () => {
      try {
        const response = await cartAPI.get(`/${user.id}`);
        const cart = response.data.data;
        setCartItems(cart.items || []);
      } catch (err) {
         console.error("Reload cart error:", err);
      }
    };

    const increaseQuantity = async (laptopId) => {
      try {
        await cartAPI.patch(`/${user.id}/${laptopId}?delta=1`);
        reloadCart(); // reload lại giỏ hàng
      } catch (err) {
        console.error(err);
      }
    };

    const decreaseQuantity = async (laptopId) => {
      try {
        await cartAPI.patch(`/${user.id}/${laptopId}?delta=-1`);
        reloadCart();
      } catch (err) {
        console.error(err);
      }
    };

    const removeItem = async (laptopId) => {
      if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
      try {
        await cartAPI.delete(`/${user.id}/${laptopId}`);
        reloadCart(); // load lại giỏ hàng
      } catch (err) {
        console.error("Error removing:", err);
      }
    };

    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const totalItems = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const handleCheckout = () => {

        if (cartItems.length === 0) {

            alert("Giỏ hàng trống!");
            return;

        }

        navigate("/ThanhToan");

    };

    return (
        <div className="giohang-page">
            <Myheader />
            <div className="giohang-container">
                <h1 className="giohang-title">
                    <i className="fas fa-shopping-cart"></i> Giỏ hàng của bạn
                </h1>

                {loading ? (
                    <div className="giohang-loading">
                        <p>Đang tải giỏ hàng...</p>
                    </div>
                ) : !user ? (
                    <div className="giohang-empty">
                        <img src="../images/cart_no_item.jpg" alt="Chưa đăng nhập" />
                        <h2>Bạn chưa đăng nhập</h2>
                        <p>Hãy đăng nhập để xem giỏ hàng của bạn</p>
                        <a href="/Dangnhap" className="giohang-btn-primary">Đăng nhập ngay</a>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="giohang-empty">
                        <img src="../images/cart_no_item.jpg" alt="Giỏ hàng trống" />
                        <h2>Giỏ hàng trống</h2>
                        <p>Hãy tìm sản phẩm ưng ý và thêm vào giỏ hàng nhé!</p>
                        <a href="/DanhmucSanpham" className="giohang-btn-primary">Mua sắm ngay</a>
                    </div>
                ) : (
                    <div className="giohang-content">
                        <div className="giohang-items">
                            <div className="giohang-header-row">
                                <span className="gh-col-product">Sản phẩm</span>
                                <span className="gh-col-price">Đơn giá</span>
                                <span className="gh-col-qty">Số lượng</span>
                                <span className="gh-col-total">Thành tiền</span>
                                <span className="gh-col-action">Thao tác</span>
                            </div>

                            {cartItems.map((item) => (
                                <div key={item.id} className="giohang-item">
                                    <div className="gh-col-product gh-product-info">
                                        <a href={`/ChitietSanpham/${item.id}`}>
                                            <img
                                                src={item.imageMain}
                                                alt={item.laptopName}
                                                className="gh-product-img"
                                            />
                                        </a>
                                        <div className="gh-product-detail">
                                            <a href={`/ChitietSanpham/${item.id}`} className="gh-product-name">
                                                {item.laptopName}
                                            </a>
                                            <p className="gh-product-remain">Còn {item.remain} sản phẩm</p>
                                        </div>
                                    </div>
                                    <div className="gh-col-price">
                                        <span className="gh-price">{item.price.toLocaleString("vi-VN")}₫</span>
                                    </div>
                                    <div className="gh-col-qty">
                                        <div className="gh-qty-controls">
                                            <button
                                                onClick={() => decreaseQuantity(item.laptopId)}
                                                disabled={updating || item.quantity <= 1}
                                                className="gh-qty-btn"
                                            >−</button>
                                            <span className="gh-qty-value">{item.quantity}</span>
                                            <button
                                                onClick={() => increaseQuantity(item.laptopId)}
                                                disabled={updating}
                                                className="gh-qty-btn"
                                            >+</button>
                                        </div>
                                    </div>
                                    <div className="gh-col-total">
                                        <span className="gh-subtotal">
                                            {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                                        </span>
                                    </div>
                                    <div className="gh-col-action">
                                        <button
                                            onClick={() => removeItem(item.laptopId)}
                                            disabled={updating}
                                            className="gh-remove-btn"
                                            title="Xóa sản phẩm"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="giohang-summary">
                            <div className="giohang-summary-card">
                                <h3>Tóm tắt đơn hàng</h3>
                                <div className="summary-row">
                                    <span>Số lượng sản phẩm:</span>
                                    <span>{totalItems}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Tạm tính:</span>
                                    <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
                                </div>
                                <div className="summary-row">
                                    <span>Phí vận chuyển:</span>
                                    <span className="free-ship">Miễn phí</span>
                                </div>
                                <div className="summary-divider"></div>
                                <div className="summary-row summary-total">
                                    <span>Tổng cộng:</span>
                                    <span className="total-price">{totalPrice.toLocaleString("vi-VN")}₫</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="giohang-checkout-btn"
                                    disabled={updating}
                                >
                                    <i className="fas fa-credit-card"></i> Tiến hành thanh toán
                                </button>
                                <a href="/DanhmucSanpham" className="giohang-continue-btn">
                                    <i className="fas fa-arrow-left"></i> Tiếp tục mua sắm
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Giohang;
