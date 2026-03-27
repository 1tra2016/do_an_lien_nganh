import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {showAlert, showConfirm} from '../../alertUtils';

const url = "http://localhost:8080";
const couponAPI = axios.create({
    baseURL: url + '/api/coupons',
    headers: { "Content-Type": "application/json" },
});

const generateRandomCouponCode = (prefix = 'SALE') => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const randomPart = Array.from(
        { length: 8 },
        () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');

    return `${prefix}${randomPart}`;
};

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        code: '', type: 'percent', discountValue: '', minOrderValue: '', maxDiscount: '',
        usageLimit: '', expiryDate: ''
    });

    useEffect(() => { fetchCoupons(); }, []);

    const fetchCoupons = async () => {
        try {
            const res = await couponAPI.get('');
            console.log('API Response:', res);
            console.log('Data:', res.data);
            const couponsList = res.data.data;
            console.log('Coupons:', couponsList);
            setCoupons(couponsList);
        } catch (err) { 
            console.error('Lỗi lấy danh sách mã giảm giá:', err); 
        }
        setLoading(false);
    };

    const resetForm = () => {
        setForm({ code: '', type: 'percent', discountValue: '', minOrderValue: '', maxDiscount: '', usageLimit: '', expiryDate: '' });
        setEditing(null);
        setShowForm(false);
    };

    const handleCreateCoupon = () => {
        setEditing(null);
        setForm({
            code: generateRandomCouponCode(),
            type: 'percent',
            discountValue: '',
            minOrderValue: '',
            maxDiscount: '',
            usageLimit: '',
            expiryDate: ''
        });
        setShowForm(true);
    };

    const regenerateCouponCode = () => {
        setForm(prev => ({ ...prev, code: generateRandomCouponCode() }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const maxDiscountValue = Number(form.maxDiscount) || 0;

        // ⚠️ cảnh báo nếu quá lớn
        if (form.type === 'percent' && maxDiscountValue > 5000000) {

            const result = await showConfirm(
                `Giảm tối đa ${maxDiscountValue.toLocaleString('vi-VN')}₫ quá lớn, bạn có chắc không?`,
                'warning'
            );

            if (!result) return;
        }

        const data = {
            code: form.code,
            type: form.type,
            discountValue: Number(form.discountValue),
            minOrderValue: Number(form.minOrderValue),
            maxDiscount: maxDiscountValue,
            usageLimit: Number(form.usageLimit),
            expiryDate: form.expiryDate + "T23:59:59"
        };

        try {
            if (editing) {
                await couponAPI.patch(`/${editing.id}`, data);
            } else {
                await couponAPI.post('', data);
            }

            // 🎉 success alert
            showAlert('Đã lưu mã giảm giá','success');

            fetchCoupons();
            resetForm();

        } catch (err) {
            console.error('Lỗi lưu mã giảm giá:', err);
            showAlert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu mã giảm giá.', 'error');
        }
    };
    const handleEdit = (coupon) => {
        console.log('Edit coupon:', coupon);
        setForm({
            code: coupon.code,
            type: coupon.type,
            discountValue: coupon.discountValue,
            minOrderValue: coupon.minOrderValue,
            maxDiscount: coupon.maxDiscount || 0,
            usageLimit: coupon.usageLimit,
            expiryDate: coupon.expiryDate
        });
        setEditing(coupon);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xác nhận xóa mã giảm giá?')) return;
        try {
            await couponAPI.delete(`/${id}`);
            fetchCoupons();
        } catch (err) { 
            console.error('Lỗi xóa mã giảm giá:', err); 
            alert('Lỗi xóa mã giảm giá!');
        }
    };

    if (loading) return <div className="admin-loading"><div className="spinner"></div><p>Đang tải...</p></div>;

    return (
        <div>
            <div className="admin-table-header">
                <h2><i className="fas fa-ticket-alt" style={{ color: '#EE1926', marginRight: '8px' }}></i>Quản lý mã giảm giá</h2>
                <button className="admin-add-btn" onClick={handleCreateCoupon}>
                    <i className="fas fa-plus"></i> Thêm mã
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) resetForm(); }}>
                    <div className="admin-modal">
                        <h2>{editing ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>Mã code *</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            value={form.code}
                                            onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                            required
                                            placeholder="VD: GIAM10PHAN"
                                            style={{ flex: 1 }}
                                        />
                                        <button
                                            type="button"
                                            onClick={regenerateCouponCode}
                                            style={{
                                                whiteSpace: 'nowrap',
                                                border: '1px solid #EE1926',
                                                background: '#fff5f5',
                                                color: '#EE1926',
                                                borderRadius: '8px',
                                                padding: '0 12px',
                                                fontWeight: 600,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Tạo mã
                                        </button>
                                    </div>
                                </div>
                                <div className="admin-form-group">
                                    <label>Loại giảm giá *</label>
                                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ width: '100%', padding: '10px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '14px' }}>
                                        <option value="percent">Giảm theo %</option>
                                        <option value="fixed">Giảm cố định (₫)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>{form.type === 'percent' ? 'Phần trăm giảm (%)' : 'Số tiền giảm (₫)'} *</label>
                                    <input type="number" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })} required min="1" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Đơn hàng tối thiểu (₫) *</label>
                                    <input type="number" value={form.minOrderValue} onChange={e => setForm({ ...form, minOrderValue: e.target.value })} required min="0" />
                                </div>
                            </div>
                            {form.type === 'percent' && (
                                <div className="admin-form-group">
                                    <label>Giảm tối đa (₫)</label>
                                    <input type="number" value={form.maxDiscount} onChange={e => setForm({ ...form, maxDiscount: e.target.value })} min="0" />
                                </div>
                            )}
                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>Tổng lượt sử dụng *</label>
                                    <input type="number" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: e.target.value })} required min="1" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Ngày hết hạn *</label>
                                    <input type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} required />
                                </div>
                            </div>
                            <div className="admin-form-actions">
                                <button type="submit" className="admin-form-save">{editing ? 'Cập nhật' : 'Tạo mã'}</button>
                                <button type="button" className="admin-form-cancel" onClick={resetForm}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="admin-table-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Mã</th>
                            <th>Loại</th>
                            <th>Giá trị</th>
                            <th>Giá trị tối đa</th>
                            <th>Đơn tối thiểu</th>
                            <th>Đã dùng</th>
                            <th>HSD</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.length === 0 ? (
                            <tr><td colSpan="9" style={{ textAlign: 'center', color: '#999', padding: '30px' }}>Chưa có mã giảm giá</td></tr>
                        ) : coupons.map(c => {
                            const expired = new Date(c.expiryDate) < new Date();
                            const soldOut = c.usedCount >= c.usageLimit;
                            return (
                                <tr key={c.id}>
                                    <td><strong style={{ color: '#EE1926' }}>{c.code}</strong></td>
                                    <td>{c.type === 'percent' ? 'Phần trăm' : 'Cố định'}</td>
                                    <td>{c.type === 'percent' ? `${c.discountValue}%` : `${c.discountValue.toLocaleString('vi-VN')}₫`}</td>
                                    <td>{c.type === 'percent' ? (c.maxDiscount ? c.maxDiscount.toLocaleString('vi-VN') + '₫' : 'Không giới hạn') : '-'}</td>
                                    <td>{c.minOrderValue.toLocaleString('vi-VN')}₫</td>
                                    <td>{c.usedCount || 0}/{c.usageLimit}</td>
                                    <td>{new Date(c.expiryDate).toLocaleDateString('vi-VN')}</td>
                                    <td>
                                        <span className={`admin-badge ${expired ? 'cancelled' : soldOut ? 'cancelled' : 'delivered'}`}>
                                            {expired ? 'Đã dừng' : soldOut ? 'Hết lượt' : 'Còn hiệu lực'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="admin-action-btn edit" onClick={() => handleEdit(c)}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="admin-action-btn delete" onClick={() => handleDelete(c.id)}>
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCoupons;
