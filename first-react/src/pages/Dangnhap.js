import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import '../css/dangnhap.css'
import Myheader from "./Myheader";
import Footer from "./Footer";



function Dangnhap({ onLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const laptopAPI = axios.create({
    baseURL: 'http://localhost:8080/api/users',
    headers: { "Content-Type": "application/json" },
  });

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
    return regex.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Email không đúng định dạng");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("Mật khẩu phải ít nhất 6 ký tự, chứa ít nhất một chữ cái và một số");
      return;
    }

    try {
      
      const res = await laptopAPI.post("/login", {
        email: email,
        password: password
      });

      const user = res.data.data;

      // lưu user vào localStorage
      localStorage.setItem("user", JSON.stringify(user));

      if (onLogin) onLogin(user);

      if (user.role === "admin") {
        alert("Chào mừng Admin " + user.name);
        navigate("/admin");
      } else {
        alert("Chào mừng trở lại " + user.name);
        navigate("/");
      }

    } catch (err) {

      if (err.response) {
        setError("Sai thông tin đăng nhập");
      } else {
        setError("Lỗi kết nối đến server");
      }

      console.error("Login error:", err);
    }
  };

  return (
    <div>
      <Myheader />
      <div className="s1">
        <p>
          <a href="/">Trang chủ</a> / Đăng Nhập
        </p>
      </div>
      <div className="dangnhap1">
        <form className="dangnhap" onSubmit={handleLogin}>
          <h1>Đăng nhập tài khoản</h1>
          <p>
            Bạn chưa có tài khoản ? <a href='/Dangky'>Đăng ký tại đây</a>
          </p>
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required />
          {emailError && <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{emailError}</p>}

          <input
            placeholder="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required />
          {passwordError && <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{passwordError}</p>}

          <button className="button" type="submit">Đăng nhập</button>{error && <p style={{ color: "red" }}>{error}</p>}
          <p>
            Quên mật khẩu?
            <a href="#"> Nhấn vào đây</a>
          </p>
          <div className="social">
            <a href="">
              <i
                className="fab fa-facebook"
                style={{
                  color: "#3b5998",
                  fontSize: "48px",
                }}
              />
            </a>
            <a href="">
              <i
                className="fab fa-google"
                style={{
                  color: "#de5246",
                  fontSize: "48px",
                }}
              />
            </a>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
export default Dangnhap;