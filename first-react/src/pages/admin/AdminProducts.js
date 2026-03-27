import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { brandAPI } from '../../APIs/APIs';
import '../../css/AdminProduct.css';
const laptopAPI = axios.create({
    baseURL: 'http://localhost:8080/api/laptops',
    headers: { "Content-Type": "application/json" },
});

const emptyProduct = {
    name: '', price: '', remain: '',
    cpu: '', ram: '', drive: '', card: '',
    screen: '', camera: '', port: '', weight: '',
    pin: '', system: '', brandId: '', images: ['']
};

const AdminProducts = () => {
    const LOW_STOCK_THRESHOLD = 10;
    const [items, setItems] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ ...emptyProduct });
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;
    const [selectedBrand, setSelectedBrand] = useState('');
    const [priceRange, setPriceRange] = useState('');
    const [stockStatus, setStockStatus] = useState('');

    const fetchBrands = async () => {
        try {
            const res = await brandAPI.get('');
            setBrands(Array.isArray(res.data.data) ? res.data.data : []);
        } catch (err) {
            console.error('Lỗi tải danh sách hãng:', err);
        }
    };

    const fetchItems = async (currentPage = page) => {
        setLoading(true);
        try {

            let minPrice = null;
            let maxPrice = null;

            if (priceRange === '1') { // dưới 20tr
                maxPrice = 20000000;
            } else if (priceRange === '2') { // 20-30tr
                minPrice = 20000000;
                maxPrice = 30000000;
            } else if (priceRange === '3') { // 30-50tr
                minPrice = 30000000;
                maxPrice = 50000000;
            } else if (priceRange === '4') { // trên 50tr
                minPrice = 50000000;
            }

            const res = await laptopAPI.get('', {
                params: {
                    page: currentPage,
                    size: pageSize,
                    keyword: keyword,
                    brandId: selectedBrand || null,
                    minPrice,
                    maxPrice,
                    stockStatus: stockStatus || null
                }
            });

            const pageData = res.data.data;

            setItems(pageData.content || []);
            setTotalPages(pageData.totalPages || 1);

        } catch (err) {
            console.error('Lỗi tải sản phẩm:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchItems(page);
        fetchBrands();
    }, [page, keyword, selectedBrand, priceRange, stockStatus]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleResetFilter = () => {
        setSearchTerm('');
        setKeyword('');
        setSelectedBrand('');
        setPriceRange('');
        setStockStatus('');
        setPage(0);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        setKeyword(searchTerm);
    };

    const handleBrandChange = (e) => {
        setSelectedBrand(e.target.value);
        setPage(0);
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const addImageField = () => {
        setFormData({ ...formData, images: [...formData.images, ''] });
    };

    const removeImageField = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages.length > 0 ? newImages : [''] });
    };

    const openAddForm = () => {
        setEditingId(null);
        setFormData({ ...emptyProduct, images: [''] });
        setShowForm(true);
    };

    const openEditForm = async (item) => {
    try {
        const res = await laptopAPI.get(`/${item.id}`);
        const data = res.data.data;

        setEditingId(data.id);
        setFormData({
            name: data.name || '',
            price: data.price || '',
            remain: data.remain || '',
            cpu: data.cpu || '',
            ram: data.ram || '',
            drive: data.drive || '',
            card: data.card || '',
            screen: data.screen || '',
            camera: data.camera || '',
            port: data.port || '',
            weight: data.weight || '',
            pin: data.pin || '',
            system: data.system || '',
            brandId: data.brand?.id || '',
            images: data.images?.length ? [...data.images] : ['']
        });

        setShowForm(true);
    } catch (err) {
        console.error("Lỗi tải chi tiết:", err);
    }
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price) {
            await Swal.fire({
                icon: 'warning',
                title: 'Thiếu thông tin',
                text: 'Vui lòng nhập tên và giá sản phẩm!'
            });
            return;
        }

        const payload = {
            name: formData.name,
            price: Number(formData.price),
            remain: Number(formData.remain) || 0,
            monthly: Math.round(Number(formData.price) / 12),
            cpu: formData.cpu,
            ram: formData.ram,
            drive: formData.drive,
            card: formData.card,
            screen: formData.screen,
            camera: formData.camera,
            port: formData.port,
            weight: formData.weight,
            pin: formData.pin,
            system: formData.system,
            brand: formData.brandId ? { id: Number(formData.brandId) } : null,
            images: formData.images.filter(img => img.trim() !== '')
        };

        try {
            if (editingId) {
                await laptopAPI.patch(`/${editingId}`, payload);
                await Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Cập nhật sản phẩm thành công!'
                });
            } else {
                await laptopAPI.post('', payload);
                await Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Thêm sản phẩm thành công!'
                });
            }
            setShowForm(false);
            fetchItems();
        } catch (err) {
            console.error('Lỗi lưu sản phẩm:', err);
            await Swal.fire({
                icon: 'error',
                title: 'Có lỗi xảy ra',
                text: 'Không thể lưu sản phẩm. Vui lòng thử lại.'
            });
        }
    };

    const handleDelete = async (id, name) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Xác nhận xóa',
            text: `Bạn có chắc muốn xóa "${name}"?`,
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#d33'
        });

        if (!result.isConfirmed) return;

        try {
            await laptopAPI.delete(`/${id}`);
            await Swal.fire({
                icon: 'success',
                title: 'Đã xóa',
                text: 'Đã xóa sản phẩm!'
            });
            fetchItems();
        } catch (err) {
            console.error('Lỗi xóa:', err);
            await Swal.fire({
                icon: 'error',
                title: 'Có lỗi xảy ra',
                text: 'Không thể xóa sản phẩm.'
            });
        }
    };  

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                <p>Đang tải sản phẩm...</p>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#333', marginBottom: '24px' }}>
                <i className="fas fa-box" style={{ color: '#667eea', marginRight: '10px' }}></i>
                Quản lý sản phẩm
            </h1>

            <div className="admin-table-card">
                <div className="admin-table-header">
                    <form onSubmit={handleSearch} className="filter-form filter-form-container">
                        <div className="filter-form">
                            <input
                                className="filter-input"
                                type="text"
                                placeholder="🔍 Tìm sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="filter-btn">
                                Tìm kiếm tên
                            </button>
                        </div>
                        <div className="filter-form">
                            <select
                                className="filter-select"
                                value={selectedBrand}
                                onChange={(e) => {
                                    setSelectedBrand(e.target.value);
                                    setPage(0);
                                }}
                            >
                                <option value="">Tất cả hãng</option>
                                {brands.map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                            
                            <select
                                className="filter-select"
                                value={stockStatus}
                                onChange={(e) => {
                                    setStockStatus(e.target.value);
                                    setPage(0);
                                }}
                            >
                                <option value="">Tất cả số lượng</option>
                                <option value="out">Hết hàng</option>
                                <option value="low">Sắp hết (&lt;{LOW_STOCK_THRESHOLD})</option>
                                <option value="instock">Còn hàng</option>
                            </select>
                            
                            <select
                                className="filter-select"
                                value={priceRange}
                                onChange={(e) => {
                                    setPriceRange(e.target.value);
                                    setPage(0);
                                }}
                            >
                                <option value="">Tất cả giá</option>
                                <option value="1">Dưới 20 triệu</option>
                                <option value="2">20 - 30 triệu</option>
                                <option value="3">30 - 50 triệu</option>
                                <option value="4">Trên 50 triệu</option>
                            </select>
                            
                            <button type="button" className="filter-btn" onClick={handleResetFilter}>
                                Xóa lọc
                            </button>

                        </div>

                        
                        
                    </form>
                    <button className="admin-add-btn" onClick={openAddForm}>
                        <i className="fas fa-plus" style={{ marginRight: '6px' }}></i>Thêm sản phẩm
                    </button>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Hình</th>
                            <th>Tên sản phẩm</th>
                            <th>Hãng hàng</th>
                            <th>Giá</th>
                            <th style={{ width: '45px' }}>Số lượng</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => {
                            let rowStyle = {};
                        
                            if (item.remain === 0) {
                                rowStyle = { backgroundColor: '#fff6f6' }; // đỏ nhạt
                            } else if (item.remain < LOW_STOCK_THRESHOLD) {
                                rowStyle = { backgroundColor: '#fff8e1' }; // vàng nhạt
                            } else {
                                rowStyle = { backgroundColor: '#e4f4ff' }; // trắng
                            }
                        
                            return (
                                <tr key={item.id} style={rowStyle}>
                                    <td>
                                        <img src={item.imageMain} alt={item.name} />
                                    </td>
                            
                                    <td style={{ maxWidth: '300px' }}>
                                        <div style={{
                                            fontWeight: 500,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {item.name}
                                        </div>
                                    </td>
                                    
                                    <td>{item.brand?.name}</td>
                                    
                                    <td className="price-text">
                                        {item.price?.toLocaleString('vi-VN')}₫
                                    </td>
                                    
                                    <td style={{
                                        fontWeight: item.remain === 0 ? 'bold' : 500,
                                        color: item.remain === 0 ? '#c62828' :
                                               item.remain < LOW_STOCK_THRESHOLD ? '#f57c00' : '#333'
                                    }}>
                                        {item.remain}
                                    </td>
                                
                                    <td>
                                        <button className="admin-action-btn edit" onClick={() => openEditForm(item)}>
                                            <i className="fas fa-pen"></i> Sửa
                                        </button>
                                        <button className="admin-action-btn delete" onClick={() => handleDelete(item.id, item.name)}>
                                            <i className="fas fa-trash"></i> Xóa
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', gap: '6px' }}>
    {Array.from({ length: totalPages }).map((_, i) => (
        <button
            key={i}
            onClick={() => setPage(i)}
            style={{
                padding: '8px 14px',
                fontSize: '14px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                background: page === i ? '#667eea' : '#fff',
                color: page === i ? '#fff' : '#333',
                cursor: 'pointer'
            }}
        >
            {i + 1}
        </button>
    ))}
</div>
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingId ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm mới'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-form-group">
                                <label>Tên sản phẩm *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="VD: Laptop Asus TUF Gaming..." required />
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>Giá (VNĐ) *</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="VD: 15000000" required />
                                </div>
                                <div className="admin-form-group">
                                    <label>Số lượng còn</label>
                                    <input type="number" name="remain" value={formData.remain} onChange={handleChange} placeholder="VD: 50" />
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>CPU</label>
                                    <input type="text" name="cpu" value={formData.cpu} onChange={handleChange} placeholder="VD: Intel Core i7-13700H" />
                                </div>
                                <div className="admin-form-group">
                                    <label>RAM</label>
                                    <input type="text" name="ram" value={formData.ram} onChange={handleChange} placeholder="VD: 16GB DDR5" />
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>Ổ cứng</label>
                                    <input type="text" name="drive" value={formData.drive} onChange={handleChange} placeholder="VD: 512GB SSD" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Card đồ họa</label>
                                    <input type="text" name="card" value={formData.card} onChange={handleChange} placeholder="VD: RTX 4060" />
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>Màn hình</label>
                                    <input type="text" name="screen" value={formData.screen} onChange={handleChange} placeholder="VD: 15.6 FHD 144Hz" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Camera</label>
                                    <input type="text" name="camera" value={formData.camera} onChange={handleChange} placeholder="VD: HD 720p" />
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label>Cổng kết nối</label>
                                <input type="text" name="port" value={formData.port} onChange={handleChange} placeholder="VD: USB-C, HDMI, USB-A..." />
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>Trọng lượng</label>
                                    <input type="text" name="weight" value={formData.weight} onChange={handleChange} placeholder="VD: 2.1kg" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Pin</label>
                                    <input type="text" name="pin" value={formData.pin} onChange={handleChange} placeholder="VD: 76Wh" />
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>Hệ điều hành</label>
                                    <input type="text" name="system" value={formData.system} onChange={handleChange} placeholder="VD: Windows 11" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Hãng sản xuất</label>
                                    <select name="brandId" value={formData.brandId} onChange={handleChange} style={{
                                        padding: '8px 12px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '14px', width: '100%', outline: 'none'
                                    }}>
                                        {/* <option value="">-- Chọn hãng --</option> */}
                                        {brands.map(brand => (
                                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Images setSearchParams */}
                            <div className="admin-form-group">
                                <label>Hình ảnh (URL)</label>
                                {formData.images.map((img, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                                        <input
                                            type="url"
                                            value={img}
                                            onChange={(e) => handleImageChange(idx, e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                            style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '13px' }}
                                        />
                                        {formData.images.length > 1 && (
                                            <button type="button" onClick={() => removeImageField(idx)}
                                                style={{ padding: '8px 12px', background: '#fde8e8', color: '#c62828', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addImageField}
                                    style={{ padding: '6px 14px', background: '#f0f0f0', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', marginTop: '4px' }}>
                                    + Thêm ảnh
                                </button>
                            </div>

                            <div className="admin-form-actions">
                                <button type="submit" className="admin-form-save">
                                    <i className="fas fa-check" style={{ marginRight: '6px' }}></i>
                                    {editingId ? 'Cập nhật' : 'Thêm sản phẩm'}
                                </button>
                                <button type="button" className="admin-form-cancel" onClick={() => setShowForm(false)}>
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                    
                </div>
                
            )}
        </div>
    );
};

export default AdminProducts;
