import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/AdminOrders.css';
const url = process.env.REACT_APP_API_URL || "http://localhost:8080";

const orderAPI = axios.create({
    baseURL: url + '/api/orders',
    headers: { "Content-Type": "application/json" },
});

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'shipping', label: 'Đang giao' },
    { value: 'delivered', label: 'Đã giao' },
    { value: 'cancelled', label: 'Đã hủy' },
];

const PAYMENT_LABELS = {
    cod: 'COD',
    bank: 'Chuyển khoản',
    momo: 'MoMo',
    zalopay: 'ZaloPay',
    vnpay: 'VNPAY',
    credit_card: 'Thẻ quốc tế',
    atm: 'ATM',
};

const PAYMENT_LABELS_FULL = {
    cod: { label: 'Thanh toán khi nhận hàng', icon: 'fas fa-money-bill-wave', color: '#28a745' },
    bank: { label: 'Chuyển khoản ngân hàng', icon: 'fas fa-university', color: '#1a73e8' },
    momo: { label: 'Ví MoMo', icon: 'fas fa-mobile-alt', color: '#a50064' },
    zalopay: { label: 'Ví ZaloPay', icon: 'fas fa-wallet', color: '#0068ff' },
    vnpay: { label: 'VNPAY-QR', icon: 'fas fa-qrcode', color: '#e21b1b' },
    credit_card: { label: 'Thẻ quốc tế (Visa/MC/JCB)', icon: 'fas fa-credit-card', color: '#1a1f71' },
    atm: { label: 'Thẻ ATM / Internet Banking', icon: 'fas fa-id-card', color: '#2d6a4f' },
};

const STATUS_MAP = {
    pending: { label: 'Chờ xác nhận', color: '#f39c12', icon: 'fas fa-clock' },
    confirmed: { label: 'Đã xác nhận', color: '#3498db', icon: 'fas fa-check-circle' },
    shipping: { label: 'Đang giao hàng', color: '#e67e22', icon: 'fas fa-shipping-fast' },
    delivered: { label: 'Đã giao hàng', color: '#27ae60', icon: 'fas fa-box-open' },
    cancelled: { label: 'Đã hủy', color: '#e74c3c', icon: 'fas fa-times-circle' },
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState({});

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await orderAPI.get('');
            const sorted = res.data.data.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setOrders(sorted);
        } catch (err) {
            console.error('Lỗi tải đơn hàng:', err);
        }
        setLoading(false);
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const res = await orderAPI.patch(`/${orderId}/status?status=${newStatus}`);
            // ⚠️ CHỈ alert nếu backend có message 
            if (res.data?.message) {
                alert(res.data.message);
            }
            setOrders(prev =>
                prev.map(o =>
                    o.id === orderId ? { ...o, status: newStatus } : o
                )
            );    
        } catch (err) {
            console.error('Lỗi cập nhật trạng thái:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Không thể cập nhật trạng thái. Vui lòng thử lại.';
            alert(errorMessage);
        }
    };

    const toggleOrder = async (orderId) => {
        if (expandedOrder === orderId) {
            setExpandedOrder(null);
            return;
        }
        try {
            const res = await orderAPI.get(`/${orderId}/detail`);
            setOrderDetails(prev => ({
                ...prev,
                [orderId]: res.data.data
            }));
            setExpandedOrder(orderId);
        } catch (err) {
            console.error("Lỗi load chi tiết đơn:", err);
        }
    };

    const getStatusInfo = (status) => {
        return STATUS_MAP[status] || { label: status, color: '#666', icon: 'fas fa-question-circle' };
    };

    const getPaymentInfo = (payment) => {
        return PAYMENT_LABELS_FULL[payment] || { label: payment, icon: 'fas fa-wallet', color: '#666' };
    };

    const formatDate = (iso) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const filtered = filterStatus === 'all'
        ? orders
        : orders.filter(o => o.status === filterStatus);

    // Thống kê theo trạng thái
    const statusCounts = orders.reduce((acc, o) => {
        acc[o.status || 'pending'] = (acc[o.status || 'pending'] || 0) + 1;
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                <p>Đang tải đơn hàng...</p>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#333', marginBottom: '24px' }}>
                <i className="fas fa-shopping-bag" style={{ color: '#667eea', marginRight: '10px' }}></i>
                Quản lý đơn hàng
            </h1>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setFilterStatus('all')}
                    style={{
                        padding: '8px 16px', borderRadius: '20px', border: 'none',
                        background: filterStatus === 'all' ? '#667eea' : '#e0e0e0',
                        color: filterStatus === 'all' ? 'white' : '#555',
                        fontWeight: 600, fontSize: '13px', cursor: 'pointer'
                    }}
                >
                    Tất cả ({orders.length})
                </button>
                {STATUS_OPTIONS.map(s => (
                    <button
                        key={s.value}
                        onClick={() => setFilterStatus(s.value)}
                        style={{
                            padding: '8px 16px', borderRadius: '20px', border: 'none',
                            background: filterStatus === s.value ? '#667eea' : '#e0e0e0',
                            color: filterStatus === s.value ? 'white' : '#555',
                            fontWeight: 600, fontSize: '13px', cursor: 'pointer'
                        }}
                    >
                        {s.label} ({statusCounts[s.value] || 0})
                    </button>
                ))}
            </div>

            <div className="admin-table-card">
                <div className="admin-table-header">
                    <h2>{filtered.length} đơn hàng</h2>
                </div>

                {filtered.length === 0 ? (
                    <p style={{ color: '#999', padding: '30px', textAlign: 'center' }}>
                        Không có đơn hàng nào.
                    </p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>SĐT</th>
                                <th>Ngày đặt</th>
                                <th>Thanh toán</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(order => {
                                const isExpanded = expandedOrder === order.id;
                                const detail = orderDetails[order.id];
                                const statusInfo = getStatusInfo(order.status);

                                return (
                                    <React.Fragment key={order.id}>
                                        <tr>
                                            <td>
                                                <strong 
                                                    style={{ cursor: 'pointer', color: '#667eea' }}
                                                    onClick={() => toggleOrder(order.id)}
                                                    title="Click để xem chi tiết"
                                                >
                                                    #{order.id}
                                                </strong>
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                                                <div style={{ fontSize: '12px', color: '#888', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {order.address}
                                                </div>
                                            </td>
                                            <td>{order.phone}</td>
                                            <td style={{ fontSize: '13px' }}>{formatDate(order.createdAt)}</td>
                                            <td>{PAYMENT_LABELS[order.payment] || order.payment}</td>
                                            <td className="price-text">{order.totalPrice?.toLocaleString('vi-VN')}₫</td>
                                            <td>
                                                <select
                                                    className={`admin-status-select status-${order.status || 'pending'}`}   // ⭐ thêm class theo status
                                                    value={order.status || 'pending'}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                >
                                                    {STATUS_OPTIONS.map(s => (
                                                        <option key={s.value} value={s.value}>{s.label}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>

                                        {/* Order Details Row */}
                                        {isExpanded && (
                                            <tr>
                                                <td colSpan="7" >
                                                    <div className="ktdh-order-details" >
                                                        {/* Shipping Info */}
                                                        <div className="ktdh-detail-section">
                                                            <h4><i className="fas fa-map-marker-alt"></i> Thông tin giao hàng</h4>
                                                            <div className="ktdh-shipping-info">
                                                                <p><strong>Người nhận:</strong> {order.customerName}</p>
                                                                <p><strong>Số điện thoại:</strong> {order.phone}</p>
                                                                <p><strong>Địa chỉ:</strong> {order.address}</p>
                                                                {order.note && <p><strong>Ghi chú:</strong> {order.note}</p>}
                                                            </div>
                                                        </div>

                                                        {/* Items */}
                                                        <div className="ktdh-detail-section">
                                                            <h4><i className="fas fa-box"></i> Chi tiết sản phẩm</h4>
                                                            <div className="ktdh-items-list">
                                                                {detail?.items?.map((item, index) => (
                                                                    <div key={index} className="ktdh-item-row">
                                                                        <img src={item.image} alt={item.name} className="ktdh-item-img" />
                                                                        <div className="ktdh-item-info">
                                                                            <p className="ktdh-item-name">{item.name}</p>
                                                                            <p className="ktdh-item-price-qty">
                                                                                {item.price?.toLocaleString("vi-VN")}₫ × {item.quantity}
                                                                            </p>
                                                                        </div>
                                                                        <div className="ktdh-item-subtotal">
                                                                            {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Order Timeline */}
                                                        <div className="ktdh-detail-section">
                                                            <h4><i className="fas fa-history"></i> Trạng thái đơn hàng</h4>
                                                            <div className="ktdh-timeline">
                                                                {['pending', 'confirmed', 'shipping', 'delivered'].map((step, idx) => {
                                                                    const stepInfo = getStatusInfo(step);
                                                                    const statusOrder = ['pending', 'confirmed', 'shipping', 'delivered'];
                                                                    const currentIdx = statusOrder.indexOf(order.status);
                                                                    const isCancelled = order.status === 'cancelled';
                                                                    const isActive = !isCancelled && idx <= currentIdx;
                                                                    const isCurrent = !isCancelled && idx === currentIdx;

                                                                    return (
                                                                        <div key={step} className={`ktdh-timeline-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
                                                                            <div className="ktdh-timeline-dot" style={isActive ? { background: stepInfo.color } : {}}>
                                                                                <i className={stepInfo.icon}></i>
                                                                            </div>
                                                                            <div className="ktdh-timeline-content">
                                                                                <span className="ktdh-timeline-label">{stepInfo.label}</span>
                                                                                {isCurrent && <span className="ktdh-timeline-current-tag">Hiện tại</span>}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                                {order.status === 'cancelled' && (
                                                                    <div className="ktdh-timeline-step active current">
                                                                        <div className="ktdh-timeline-dot" style={{ background: '#e74c3c' }}>
                                                                            <i className="fas fa-times-circle"></i>
                                                                        </div>
                                                                        <div className="ktdh-timeline-content">
                                                                            <span className="ktdh-timeline-label">Đã hủy</span>
                                                                            <span className="ktdh-timeline-current-tag" style={{ background: '#fde8e8', color: '#e74c3c' }}>Hiện tại</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Cancel Reason */}
                                                        {order.status === 'cancelled' && detail?.cancelReason && (
                                                            <div className="ktdh-cancel-reason">
                                                                <i className="fas fa-info-circle"></i> Lí do hủy: {detail.cancelReason}
                                                            </div>
                                                        )}

                                                        {/* Summary */}
                                                        <div className="ktdh-order-summary">
                                                            <span>Tổng thanh toán:</span>
                                                            <span className="ktdh-final-total">{order.totalPrice?.toLocaleString("vi-VN")}₫</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
