import React, { useState, useEffect } from 'react';
import { brandAPI } from '../../APIs/APIs';
import {showAlert, showConfirm } from '../../alertUtils';
const AdminBrand = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ id: '', name: '', description: '' });

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const res = await brandAPI.get('');
            setBrands(Array.isArray(res.data.data) ? res.data.data : []);
        } catch (err) {
            console.error('Lỗi tải danh sách hãng:', err);
            showAlert('Không thể tải danh sách hãng.', 'error');
        }
        setLoading(false);
    };

    const handleOpenModal = (brand = null) => {
        if (brand) {
            setEditingId(brand.id);
            setFormData({ id: brand.id, name: brand.name, description: brand.description || '' });
        } else {
            setEditingId(null);
            setFormData({ id: '', name: '', description: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({ id: '', name: '', description: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            showAlert('Vui lòng nhập tên hãng!', 'warning');
            return;
        }

        try {
            if (editingId) {
                // Cập nhật hãng
                const res = await brandAPI.patch(`/${editingId}`, {
                    name: formData.name,
                    description: formData.description
                });
                setBrands(prev =>
                    prev.map(b => b.id === editingId ? res.data.data : b)
                );
                showAlert('Cập nhật hãng thành công!', 'success');
            } else {
                // Tạo hãng mới
                const res = await brandAPI.post('', {
                    name: formData.name,
                    description: formData.description
                });
                setBrands(prev => [...prev, res.data.data]);
                showAlert('Tạo hãng thành công!', 'success');
            }
            handleCloseModal();
        } catch (err) {
            console.error('Lỗi lưu hãng:', err);
            showAlert('Không thể lưu hãng.', 'error');
        }
    };

    const handleDelete = async (id, name) => {

        const result = await showConfirm(`Bạn có chắc muốn xóa hãng "${name}"?`);

        if (!result) return; //

        try {
            await brandAPI.delete(`/${id}`);
            setBrands(prev => prev.filter(b => b.id !== id));
            showAlert('Đã xóa hãng!', 'success');
        } catch (err) {
            console.error('Lỗi xóa:', err);
            showAlert(err.response?.data?.message, 'error');
        }
    };

    const filtered = searchTerm
        ? brands.filter(b =>
            b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : brands;

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                <p>Đang tải danh sách hãng...</p>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#333', marginBottom: '24px' }}>
                <i className="fas fa-building" style={{ color: '#667eea', marginRight: '10px' }}></i>
                Quản lý hãng
            </h1>

            <div className="admin-table-card">
                <div className="admin-table-header">
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="🔍 Tìm tên hãng, mô tả..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '8px 14px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '14px', width: '280px', outline: 'none' }}
                        />
                        <span style={{ fontSize: '13px', color: '#888' }}>{filtered.length} hãng</span>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        style={{
                            padding: '8px 16px',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <i className="fas fa-plus"></i> Thêm hãng
                    </button>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên hãng</th>
                            <th>Mô tả</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? (
                            filtered.map(brand => (
                                <tr key={brand.id}>
                                    <td><strong>#{brand.id}</strong></td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 700, fontSize: '13px', flexShrink: 0
                                            }}>
                                                {brand.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ fontWeight: 500 }}>{brand.name}</span>
                                        </div>
                                    </td>
                                    <td>{brand.description || 'N/A'}</td>
                                    <td>
                                        <button
                                            className="admin-action-btn edit"
                                            onClick={() => handleOpenModal(brand)}
                                            style={{ marginRight: '8px' }}
                                        >
                                            <i className="fas fa-edit"></i> Sửa
                                        </button>
                                        <button
                                            className="admin-action-btn delete"
                                            onClick={() => handleDelete(brand.id, brand.name)}
                                        >
                                            <i className="fas fa-trash"></i> Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                                    Không có hãng nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Thêm/Sửa Hãng */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        width: '90%',
                        maxWidth: '500px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                        animation: 'slideUp 0.3s ease'
                    }}>
                        <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 700 }}>
                            {editingId ? 'Sửa hãng' : 'Thêm hãng'}
                        </h2>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>
                                Tên hãng <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Nhập tên hãng"
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1.5px solid #ddd',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.3s'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>
                                Mô tả
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Nhập mô tả hãng"
                                rows="3"
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1.5px solid #ddd',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    fontFamily: 'inherit',
                                    transition: 'border-color 0.3s'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={handleCloseModal}
                                style={{
                                    padding: '10px 20px',
                                    background: '#f0f0f0',
                                    color: '#333',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '14px'
                                }}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                style={{
                                    padding: '10px 20px',
                                    background: '#667eea',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '14px'
                                }}
                            >
                                {editingId ? 'Cập nhật' : 'Thêm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBrand;
