import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../APIs/APIs';
import Myheader from './Myheader';
import Footer from './Footer';
import '../css/Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({});
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [successMsg, setSuccessMsg] = useState("");
    const [errors, setErrors] = useState({});

    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const userId = storedUser?.id;
    useEffect(() => {
        if (!userId) {
            navigate("/dangnhap");
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await userAPI.get(`/${userId}`);
                const userData = res.data.data;

                setUser(userData);
                setFormData(userData);
            } catch (err) {
                console.error("Lỗi tải user:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field
        setErrors(prev => ({
            ...prev,
            [name]: ""
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate name
        if (!formData.name?.trim()) {
            newErrors.name = "Tên không được để trống";
        }

        // Validate email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!formData.email?.trim()) {
            newErrors.email = "Email không được để trống";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Email phải đúng định dạng (ví dụ: example@email.com)";
        }

        // Validate numberPhone
        const phoneRegex = /^0[3-9]\d{8}$/;
        if (formData.numberPhone && !phoneRegex.test(formData.numberPhone)) {
            newErrors.numberPhone = "Số điện thoại phải đúng định dạng (10 số, bắt đầu bằng 03-09)";
        }

        // Validate address (optional, but if provided, not empty)
        if (formData.address=== '' || formData.address.trim()==='') {
            newErrors.address = "Địa chỉ không được để trống nếu nhập";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        // Check if email changed and if it exists
        if (formData.email !== user.email) {
            try {
                const response = await userAPI.get('');
                const existingUsers = response.data.data;
                const emailExists = existingUsers.find(u => u.email === formData.email && u.id !== userId);
                if (emailExists) {
                    setErrors({ email: "Email đã tồn tại, vui lòng chọn email khác" });
                    return;
                }
            } catch (err) {
                console.error("Error checking email:", err);
                alert("Lỗi kiểm tra email");
                return;
            }
        }

        try {
            const res = await userAPI.put(`/${userId}`, formData);

            const updatedUser = res.data.data;

            setUser(updatedUser);
            setFormData(updatedUser);

            localStorage.setItem("user", JSON.stringify({
                ...storedUser,
                ...updatedUser
            }));

            setEditing(false);
            setSuccessMsg("Cập nhật thành công!");

            setTimeout(() => setSuccessMsg(""), 3000);

        } catch (err) {
            console.error("Update error:", err);
            alert("Không thể cập nhật");
        }
    };

    const handleCancel = () => {
        if (!user) return;

        setFormData(user);
        setEditing(false);
    };

    if (loading) {
        return (
            <div>
                <Myheader />
                <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p>Đang tải...</p>
                </div>
                <Footer />
            </div>
        );
    }
    if (!user) return <div>Không tìm thấy user</div>;

    const avatarLetter = user?.name ? user.name.charAt(0) : '?';

    return (
        <div>
            <Myheader />
            <div className="profile-page">
                <div className="profile-container">
                    {/* Header avatar */}
                    <div className="profile-header">
                        <div className="profile-avatar">{avatarLetter}</div>
                        <h1>{user?.name || 'Người dùng'}</h1>
                        <p>{user?.email}</p>
                    </div>

                    {/* Card thông tin */}
                    <div className="profile-card">
                        <h3 className="profile-card-title">
                            <i className="fas fa-user-edit"></i>
                            Thông tin cá nhân
                        </h3>

                        {successMsg && (
                            <div className="profile-success-msg">✅ {successMsg}</div>
                        )}

                        {!editing ? (
                            /* === Chế độ xem === */
                            <>
                                <div className="profile-field">
                                    <label>Họ và tên</label>
                                    <div className="profile-field-value">
                                        <i className="fas fa-user"></i>
                                        <span>{user?.name || '—'}</span>
                                    </div>
                                </div>
                                <div className="profile-field">
                                    <label>Email</label>
                                    <div className="profile-field-value">
                                        <i className="fas fa-envelope"></i>
                                        <span>{user?.email || '—'}</span>
                                    </div>
                                </div>
                                <div className="profile-field">
                                    <label>Số điện thoại</label>
                                    <div className="profile-field-value">
                                        <i className="fas fa-phone-alt"></i>
                                        <span>{user?.numberPhone || '—'}</span>
                                    </div>
                                </div>
                                <div className="profile-field">
                                    <label>Địa chỉ</label>
                                    <div className="profile-field-value">
                                        <i className="fas fa-map-marker-alt"></i>
                                        <span>{user?.address || '—'}</span>
                                    </div>
                                </div>
                                <div className="profile-actions">
                                    <button className="profile-btn profile-btn-edit" onClick={() => setEditing(true)}>
                                        <i className="fas fa-pen" style={{ marginRight: '6px' }}></i>
                                        Chỉnh sửa
                                    </button>
                                </div>
                            </>
                        ) : (
                            /* === Chế độ chỉnh sửa === */
                            <>
                                <div className="profile-field">
                                    <label>Họ và tên</label>
                                    <div className="profile-field-value">
                                        <i className="fas fa-user"></i>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Nhập họ và tên"
                                            required
                                        />
                                    </div>
                                    {errors.name && <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.name}</p>}
                                </div>
                                <div className="profile-field">
                                    <label>Email</label>
                                    <div className="profile-field-value">
                                        <i className="fas fa-envelope"></i>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Nhập email"
                                            required
                                        />
                                    </div>
                                    {errors.email && <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.email}</p>}
                                </div>
                                <div className="profile-field">
                                    <label>Số điện thoại</label>
                                    <div className="profile-field-value">
                                        <i className="fas fa-phone-alt"></i>
                                        <input
                                            type="tel"
                                            name="numberPhone"
                                            value={formData.numberPhone}
                                            onChange={handleChange}
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>
                                    {errors.numberPhone && <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.numberPhone}</p>}
                                </div>
                                <div className="profile-field">
                                    <label>Địa chỉ</label>
                                    <div className="profile-field-value">
                                        <i className="fas fa-map-marker-alt"></i>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Nhập địa chỉ"
                                        />
                                    </div>
                                    {errors.address && <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.address}</p>}
                                </div>
                                <div className="profile-actions">
                                    <button className="profile-btn profile-btn-save" onClick={handleSave}>
                                        <i className="fas fa-check" style={{ marginRight: '6px' }}></i>
                                        Lưu thay đổi
                                    </button>
                                    <button className="profile-btn profile-btn-cancel" onClick={handleCancel}>
                                        Hủy
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
