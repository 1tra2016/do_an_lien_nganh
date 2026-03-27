import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/AdminDashboard.css';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
    LineChart, Line, AreaChart, Area
} from 'recharts';

const url = process.env.REACT_APP_API_URL || "http://localhost:8080";
const orderAPI = axios.create({
    baseURL: url + '/api/dashboard',
    headers: { "Content-Type": "application/json" },
});

const STATUS_LABELS = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
};

const PIE_COLORS = ['#ffc107', '#0d6efd', '#20c997', '#198754', '#dc3545'];
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    totalSoldProducts: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [revenueByDate, setRevenueByDate] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [ordersByDate, setOrdersByDate] = useState([]);

  const [loading, setLoading] = useState(true);

  const [month, setMonth] = useState(null); // mặc định toàn bộ
  const [year, setYear] = useState(new Date().getFullYear());
  const buildParams = (month, year) => {
      const params = {};
      // nếu year = null → KHÔNG gửi gì cả
      if (year === null) return params;
      params.year = year;
      // chỉ gửi month khi có year
      if (month !== null) params.month = month;
      return params;
    };
    
  // ===== 1. Dashboard =====
  const fetchDashboard = async (month, year) => {
    const res = await orderAPI.get('', {
      params: buildParams(month, year)
    });

    const data = res.data.data;

    

    setStats({
      revenue: data.revenue,
      totalOrders: data.totalOrders,
      totalProducts: data.totalProducts,
      pendingOrders: data.pendingOrders,
      totalSoldProducts: data.totalSoldProducts
    });

    setRecentOrders(data.recentOrders);

    setStatusData(
      (data.statusStats || []).map(s => ({
        name: STATUS_LABELS[s.status],
        value: s.count,
        status: s.status
      }))
    );

    setOrdersByDate(
      (data.ordersByDate || []).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      )
    );
  };

  // ===== 2. Revenue =====
  const fetchRevenue = async (month, year) => {
    const res = await orderAPI.get('/revenueByDate', {
      params: buildParams(month, year)
    });

    setRevenueByDate(
      (res.data.data || []).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      )
    );
  };

  // ===== 3. Top Products =====
  const fetchTopProducts = async (month, year) => {
    const res = await orderAPI.get('/topProducts', {
      params: buildParams(month, year)
    });

    setTopProducts(res.data.data || []);
  };

  // ===== Load data =====
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        await Promise.all([
          fetchDashboard(month, year),
          fetchRevenue(month, year),
          fetchTopProducts(month, year)
        ]);
      } catch (err) {
        console.error("Dashboard error:", err);
      }

      setLoading(false);
    };

    load();
  }, [month, year]);

  // ===== Utils =====
  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatVND = (value) => {
    if (!value) return '0₫';
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'tr';
    if (value >= 1_000) return (value / 1_000).toFixed(0) + 'k';
    return value.toLocaleString('vi-VN') + '₫';
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
        <div>
            <div className="admin-header">
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#333', marginBottom: '24px' }}>
                
                <i className="fas fa-chart-pie" style={{ color: '#667eea', marginRight: '10px' }}></i>
                Dashboard
            </h1>
            <div className="admin-filters">
                <div className="date-filter">
                    <label style={{fontSize: '16px', fontWeight: 600, color: '#333'}}>Thống kê theo thời điểm: </label>
                    <select
                      value={month ?? ''}
                      onChange={(e) =>
                        setMonth(e.target.value === '' ? null : Number(e.target.value))
                      }
                    >
                      <option value="">Tất cả</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i} value={i + 1}>
                          Tháng {i + 1}
                        </option>
                      ))}
                    </select>
                    <select
                      style={{ width: '140px' }}
                      value={year ?? ''}
                      onChange={(e) => {
                          const value = e.target.value === '' ? null : Number(e.target.value);
                          setYear(value);
                                    
                          // 🔥 QUAN TRỌNG: nếu chọn tất cả năm → reset month
                          if (value === null) {
                            setMonth(null);
                          }
                        }}
                    >
                      <option value="">Tất cả năm</option>
                      {[...Array(10)].map((_, i) => {
                        const y = new Date().getFullYear() - i;
                        return (
                          <option key={y} value={y}>
                            Năm {y}
                          </option>
                        );
                      })}
                    </select>
                </div>
            </div>
        </div>
            

            {/* ===== Stat Cards ===== */}
            <div className="admin-stats" >
                <div className="admin-stat-card">
                    <div className="admin-stat-icon revenue">
                        <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="admin-stat-info">
                        <h3>{formatVND(stats.revenue)}₫</h3>
                        <p>Doanh thu (đã giao)</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon orders">
                        <i className="fas fa-shopping-bag"></i>
                    </div>
                    <div className="admin-stat-info">
                        <h3>{stats.totalOrders}</h3>
                        <p>Tổng đơn hàng</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon products">
                        <i className="fas fa-box"></i>
                    </div>
                    <div className="admin-stat-info">
                        <h3>{stats.totalProducts}</h3>
                        <p>Loại sản phẩm</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon products">
                        <i className="fas fa-cash-register"></i>
                    </div>
                    <div className="admin-stat-info">
                        <h3>{stats.totalSoldProducts}</h3>
                        <p>Sản phẩm đã bán</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon pending">
                        <i className="fas fa-clock"></i>
                    </div>
                    <div className="admin-stat-info">
                        <h3>{stats.pendingOrders}</h3>
                        <p>Chờ xử lý</p>
                    </div>
                </div>
            </div>

            {/* ===== Charts Row 1: Doanh thu + Trạng thái ===== */}
            <div className="admin-charts-row-1">
                {/* Biểu đồ Area: Doanh thu theo ngày */}
                <div className="admin-table-card">
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#333', marginBottom: '16px' }}>
                        <i className="fas fa-chart-area" style={{ color: '#28a745', marginRight: '8px' }}></i>
                        Doanh thu theo ngày
                    </h2>
                    {revenueByDate.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                          <LineChart data={revenueByDate}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

                            <XAxis
                              dataKey="date"
                              tickFormatter={(date) =>
                                new Date(date).toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit'
                                })
                              }
                              interval="preserveStartEnd"
                              fontSize={12}
                              tick={{ fill: '#888' }}
                            />

                            <YAxis
                              allowDecimals={false}
                              fontSize={12}
                              tick={{ fill: '#888' }}
                            />

                            <Tooltip
                              labelFormatter={(date) =>
                                new Date(date).toLocaleDateString('vi-VN')
                              }
                              formatter={(value) => [`${formatVND(value)} triệu đồng`, 'Doanh thu']}
                              contentStyle={{ borderRadius: '8px', border: '1px solid #eee' }}
                            />

                            <Line
                              type="monotone"
                              dataKey="revenue"
                              stroke="#0d6efd"
                              strokeWidth={2}
                              dot={{ r: 3 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>Chưa có dữ liệu doanh thu</p>
                    )}
                </div>

                {/* Biểu đồ tròn: Trạng thái đơn hàng */}
                <div className="admin-table-card">
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#333', marginBottom: '16px' }}>
                        <i className="fas fa-chart-pie" style={{ color: '#764ba2', marginRight: '8px' }}></i>
                        Trạng thái đơn hàng
                    </h2>
                    {statusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={85}
                                    paddingAngle={3}
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>Chưa có đơn hàng</p>
                    )}
                </div>
            </div>

            {/* ===== Charts Row 2: Top SP + Số đơn theo ngày ===== */}
            <div className="admin-charts-row-2" >
                {/* Biểu đồ cột: Top sản phẩm bán chạy */}
                <div className="admin-table-card">
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#333', marginBottom: '16px' }}>
                        <i className="fas fa-fire" style={{ color: '#fd7e14', marginRight: '8px' }}></i>
                        Top sản phẩm bán chạy
                    </h2>
                    {topProducts.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={topProducts} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis type="number" fontSize={12} tick={{ fill: '#888' }} />
                                <YAxis dataKey="name" type="category" width={180}
                                    fontSize={12} tick={{ fill: '#888' }} />
                                <Tooltip
                                  formatter={(value, name, props) => {
                                    const revenue = props.payload.revenue;
                                
                                    return [
                                      `${value} sản phẩm`,
                                      `Doanh thu: ${formatVND(revenue)}`
                                    ];
                                  }}
                                  contentStyle={{ borderRadius: '8px', border: '1px solid #eee' }}
                                />
                                <Bar dataKey="sold" fill="#667eea" radius={[0, 6, 6, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>Chưa có dữ liệu</p>
                    )}
                </div>

                {/* Biểu đồ line: Số đơn hàng theo ngày */}
                <div className="admin-table-card">
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#333', marginBottom: '16px' }}>
                        <i className="fas fa-chart-line" style={{ color: '#0d6efd', marginRight: '8px' }}></i>
                        Số đơn hàng theo ngày
                    </h2>
                    {ordersByDate.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={ordersByDate}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" fontSize={12} tick={{ fill: '#888' }} />
                                <YAxis fontSize={12} tick={{ fill: '#888' }} allowDecimals={false} />
                                <Tooltip
                                    formatter={(value) => [value + ' đơn', 'Số đơn']}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #eee' }}
                                />
                                <Line type="monotone" dataKey="orders" stroke="#0d6efd" strokeWidth={2} dot={{ fill: '#0d6efd', r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>Chưa có dữ liệu</p>
                    )}
                </div>
            </div>

            {/* ===== Đơn hàng gần đây ===== */}
            <div className="admin-recent-orders">
                <h2><i className="fas fa-clock" style={{ marginRight: '8px', color: '#667eea' }}></i>Đơn hàng gần đây</h2>
                {recentOrders.length === 0 ? (
                    <p style={{ color: '#999', padding: '20px 0' }}>Chưa có đơn hàng nào.</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>Ngày đặt</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(order => (
                                <tr key={order.id}>
                                    <td><strong>#{order.id}</strong></td>
                                    <td>{order.customerName}</td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td className="price-text">{order.totalPrice?.toLocaleString('vi-VN')}₫</td>
                                    <td>
                                        <span className={`admin-badge ${order.status || 'pending'}`}>
                                            {STATUS_LABELS[order.status] || order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
