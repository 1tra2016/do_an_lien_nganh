import './../css/header.css';
import './../css/responsive.css';
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import CartSidebar from "../components/CartSidebar";

function Myheader() {
  const cartAPI = axios.create({ baseURL: "http://localhost:8080/api/carts", });

  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load user from localStorage and sync cart from server
  const refreshUser = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    try {
      const response = await cartAPI.get(`/${parsedUser.id}`);
      const cart = response.data.data;
      setCartItems(cart.items || []);
      setCartCount(cart.totalItems || 0);
    } catch (err) {
      console.error("Không load được cart:", err);
    }
  };

  useEffect(() => {
    refreshUser();
    // Listen for cartUpdated events from add-to-cart actions
    const handleCartUpdate = () => refreshUser();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);


  function dangxuat() {
    alert("Đăng xuất")
    if (user == 'null'){
      navigate("/")
    }
    else {
      localStorage.removeItem("user");
      navigate("/Dangnhap");
    }
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <div className='headerFake'></div>
      <header id='header-all'>
        <div className="header-banner">
          <img alt="Khuyến mãi đặc biệt" src="../images/top_banner.webp" />
        </div>
        <div className='header'>
          <div className='logo'>
            <a href='/'> <img id='logo' alt='Logo' src='../images/pnk1.jpg'></img></a>
          </div>
          <div className='main-header'>
            <div className="top-header">
              <div className="left-top-header">
                <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) navigate(`/DanhmucSanpham?keyword=${encodeURIComponent(searchQuery.trim())}`); else navigate('/DanhmucSanpham'); }} style={{ position: 'relative' }}>
                  <input type="text" placeholder="Tìm kiếm sản phẩm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}></input>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="search-clear-btn"
                      style={{
                        position: 'absolute',
                        right: '75px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#999',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: '2px',
                        zIndex: 1
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                  <button type="submit"><i className="fas fa-search"></i> Tìm</button>
                </form>
              </div>
              <div className="right-top-header">
                {user && (
                  <a href="/Profile" className="login-btn">
                    <i className="fas fa-id-card"></i> Tài khoản
                  </a>
                )}
                <a
                  href="#"
                  onClick={user ? dangxuat : () => navigate("/Dangnhap")}
                  className="login-btn"
                >
                  <i className="fas fa-user"></i> {user ? "Đăng xuất" : "Đăng nhập"}
                </a>
                <a href="#" onClick={() => setIsCartOpen(true)} className="cart-btn open-cart-btn">
                  <i className="fas fa-shopping-cart" style={{ color: "#74C0FC" }}></i> Giỏ hàng
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </a>
              </div>
            </div>
            <div className="bottom-header">
              <div className="left-bottom-header">
                <a href="/KhuyenMai" className="nav-link">Khuyến mãi</a>
                <a href="/TinTuc" className="nav-link">Tin tức</a>
                <a href="/LienHe" className="nav-link">Liên hệ</a>
                <a href="/MyCoupons" className="nav-link">Mã giảm giá</a>
                <a href="/KiemTraDonHang" className="nav-link">Kiểm tra đơn hàng</a>

              </div>
              <div className="right-bottom-header">
                <a href='/DanhmucSanpham' className="nav-link">
                  <i className="fas fa-bars"></i>
                  <span>  Danh sách sản phẩm</span>
                </a>
                <a href="#hotline" className="nav-link">
                  <i className="fas fa-phone-alt"></i>
                  <span> Hotline: 0123404953</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        {isCartOpen && (
          <CartSidebar
            user={user}
            cartItems={cartItems}
            cartTotal={cartTotal}
            closeCart={() => setIsCartOpen(false)}
          />
        )}
      </header>
    </div>
  );
};
export default Myheader;