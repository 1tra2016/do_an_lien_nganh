import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../APIs/APIs";
import '../css/dangnhap.css'
import Myheader from "./Myheader";
import Footer from "./Footer";

function Dangky({ onLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [numberPhone, setNumberPhone] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = "Tên không được để trống";
    }

    // Validate numberPhone
    const phoneRegex = /^0[3-9]\d{8}$/;
    if (!numberPhone.trim()) {
      newErrors.numberPhone = "Số điện thoại không được để trống";
    } else if (!phoneRegex.test(numberPhone)) {
      newErrors.numberPhone = "Số điện thoại phải đúng định dạng (10 số, bắt đầu bằng 03-09)";
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email phải đúng định dạng (ví dụ: example@email.com)";
    }

    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*\d)[a-z\d]{6,}$/;
    if (!password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (!passwordRegex.test(password)) {
      newErrors.password1 = "Mật khẩu phải ít nhất 6 ký tự";
      newErrors.password2 = "Chứa ít nhất 1 chữ cái và 1 số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = async (e) => {
    e.preventDefault(); // Ngăn reload trang

    if (!validateForm()) {
      return;
    }

    try {
      // Kiểm tra email đã tồn tại chưa (lấy tất cả user rồi tìm client-side)
      const response = await userAPI.get('');
      const existingUsers = response.data.data;
      const emailExists = existingUsers.find(u => u.email === email);

      if (emailExists) {
        setErrors({ email: "Email đã tồn tại, vui lòng chọn email khác" });
        return;
      }

      const createResponse = await userAPI.post("/register", { name, numberPhone, email, password });
      //console.log("Create user response:", name, numberPhone, email, password, createResponse);
      const createdUser = createResponse.data.data; // Server trả về user với ID thật
      localStorage.setItem("user", JSON.stringify({
        email: createdUser.email,
        name: createdUser.name,
        id: createdUser.id,
        cart: createdUser.cart || []
      }));
      alert("Đăng ký thành công!");
      onLogin(createdUser);
      navigate("/");

    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  return (
    <div>
      <Myheader />
      <div className="s1">
        <p>
          <a href="/">Trang chủ</a> / Đăng Ký
        </p>
      </div>
      <div className="dangnhap1">
        <form className="dangnhap" onSubmit={handleAddUser}>
          <h1>Đăng Ký Tài Khoản</h1>
          <p>
            Bạn đã có tài khoản ? <a href="/Dangnhap">Đăng nhập tại đây</a>
          </p>
          <input
            type="text"
            placeholder="Tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <p style={{ color: "red", fontSize: "14px", padding: "5px 20px" }}>{errors.name}</p>}
          <input
            type="text"
            placeholder="Số điện thoại"
            value={numberPhone}
            onChange={(e) => setNumberPhone(e.target.value)}
            required
          />
          {errors.numberPhone && <p style={{ color: "red", fontSize: "14px", padding: "5px 20px" }}>{errors.numberPhone}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p style={{ color: "red", fontSize: "14px", padding: "5px 20px" }}>{errors.email}</p>}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password1 && <p style={{ color: "red", fontSize: "14px", padding: "0px 60px" }}>{errors.password1}</p>}
          {errors.password2 && <p style={{ color: "red", fontSize: "14px", padding: "0px 60px" }}>{errors.password2}</p>}
          <button className="button">Đăng Ký</button>
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
export default Dangky;