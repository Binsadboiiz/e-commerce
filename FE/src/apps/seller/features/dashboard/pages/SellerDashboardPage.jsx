import { useState, useEffect, useMemo } from "react";
import { 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    ShoppingBag, 
    ShoppingCart, 
    Percent, 
    Search, 
    Eye, 
    Truck, 
    XCircle, 
    RefreshCw, 
    Download, 
    Calendar,
    ChevronLeft,
    ChevronRight,
    CheckCircle
} from "lucide-react";
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell, 
    BarChart, 
    Bar,
    Legend
} from "recharts";
import toast from "react-hot-toast";
import styles from "./SellerDashboard.module.css";

// Sample mock data generator based on time period
const generateStatsData = (timeRange) => {
    switch (timeRange) {
        case "today":
            return {
                revenue: { value: 4890000, trend: 12.5, isUp: true, label: "so với hôm qua" },
                salesCount: { value: 18, trend: 5.2, isUp: true, label: "so với hôm qua" },
                ordersCount: { value: 12, trend: 8.3, isUp: true, label: "so với hôm qua" },
                conversionRate: { value: 3.4, trend: 0.2, isUp: true, label: "so với hôm qua" }
            };
        case "30d":
            return {
                revenue: { value: 142450000, trend: 18.2, isUp: true, label: "so với 30 ngày trước" },
                salesCount: { value: 580, trend: 14.5, isUp: true, label: "so với 30 ngày trước" },
                ordersCount: { value: 412, trend: 10.8, isUp: true, label: "so với 30 ngày trước" },
                conversionRate: { value: 3.8, trend: 0.5, isUp: true, label: "so với 30 ngày trước" }
            };
        case "ytd":
            return {
                revenue: { value: 1250800000, trend: 28.4, isUp: true, label: "so với năm trước" },
                salesCount: { value: 5120, trend: 22.1, isUp: true, label: "so với năm trước" },
                ordersCount: { value: 3890, trend: 19.3, isUp: true, label: "so với năm trước" },
                conversionRate: { value: 4.1, trend: 0.8, isUp: true, label: "so với năm trước" }
            };
        case "7d":
        default:
            return {
                revenue: { value: 38450000, trend: 14.8, isUp: true, label: "so với 7 ngày trước" },
                salesCount: { value: 145, trend: 8.6, isUp: true, label: "so với 7 ngày trước" },
                ordersCount: { value: 98, trend: 6.4, isUp: true, label: "so với 7 ngày trước" },
                conversionRate: { value: 3.6, trend: 0.3, isUp: true, label: "so với 7 ngày trước" }
            };
    }
};

const getTrendData = (timeRange) => {
    switch (timeRange) {
        case "today":
            return [
                { name: "00:00", doanhThu: 120000, luotBan: 1 },
                { name: "04:00", doanhThu: 80000, luotBan: 0 },
                { name: "08:00", doanhThu: 650000, luotBan: 3 },
                { name: "12:00", doanhThu: 1450000, luotBan: 5 },
                { name: "16:00", doanhThu: 1100000, luotBan: 4 },
                { name: "20:00", doanhThu: 1490000, luotBan: 5 }
            ];
        case "30d":
            return [
                { name: "Tuần 1", doanhThu: 28000000, luotBan: 110 },
                { name: "Tuần 2", doanhThu: 35000000, luotBan: 140 },
                { name: "Tuần 3", doanhThu: 38450000, luotBan: 145 },
                { name: "Tuần 4", doanhThu: 41000000, luotBan: 185 }
            ];
        case "ytd":
            return [
                { name: "T1", doanhThu: 85000000, luotBan: 350 },
                { name: "T2", doanhThu: 92000000, luotBan: 380 },
                { name: "T3", doanhThu: 110000000, luotBan: 420 },
                { name: "T4", doanhThu: 105000000, luotBan: 400 },
                { name: "T5", doanhThu: 128000000, luotBan: 510 },
                { name: "T6", doanhThu: 145000000, luotBan: 580 },
                { name: "T7", doanhThu: 152000000, luotBan: 610 },
                { name: "T8", doanhThu: 140000000, luotBan: 560 },
                { name: "T9", doanhThu: 165000000, luotBan: 650 },
                { name: "T10", doanhThu: 180000000, luotBan: 710 },
                { name: "T11", doanhThu: 198000000, luotBan: 790 },
                { name: "T12", doanhThu: 245000000, luotBan: 980 }
            ];
        case "7d":
        default:
            return [
                { name: "Thứ 2", doanhThu: 4200000, luotBan: 16 },
                { name: "Thứ 3", doanhThu: 5100000, luotBan: 20 },
                { name: "Thứ 4", doanhThu: 3800000, luotBan: 14 },
                { name: "Thứ 5", doanhThu: 6200000, luotBan: 24 },
                { name: "Thứ 6", doanhThu: 4900000, luotBan: 18 },
                { name: "Thứ 7", doanhThu: 7800000, luotBan: 28 },
                { name: "Chủ Nhật", doanhThu: 6450000, luotBan: 25 }
            ];
    }
};

const categoryData = [
    { name: "Điện thoại & Phụ kiện", value: 45, color: "#111827" }, // matching slate-900 / dark style
    { name: "Thời trang nam/nữ", value: 25, color: "#ee4d2d" },    // shopee primary orange
    { name: "Giày dép & Túi xách", value: 15, color: "#6366f1" },
    { name: "Đồ gia dụng", value: 10, color: "#10b981" },
    { name: "Khác", value: 5, color: "#f59e0b" }
];

const initialOrdersList = [
    {
        id: "ORD-9821",
        customer: "Nguyễn Văn A",
        email: "vana@gmail.com",
        productImage: "https://picsum.photos/id/1/100/100",
        productName: "Bàn Phím Cơ Không Dây 3 Chế Độ Kết Nối",
        itemsCount: 1,
        date: "2026-07-07T14:32:00",
        amount: 1450000,
        status: "pending",
        paymentStatus: "unpaid"
    },
    {
        id: "ORD-9820",
        customer: "Trần Thị B",
        email: "thib@gmail.com",
        productImage: "https://picsum.photos/id/2/100/100",
        productName: "Chuột Gaming Không Dây Siêu Nhẹ 59g",
        itemsCount: 1,
        date: "2026-07-07T11:15:00",
        amount: 890000,
        status: "shipping",
        paymentStatus: "paid"
    },
    {
        id: "ORD-9819",
        customer: "Lê Hoàng C",
        email: "hoangc@gmail.com",
        productImage: "https://picsum.photos/id/3/100/100",
        productName: "Tai Nghe Chụp Tai Chống Ồn Chủ Động ANC",
        itemsCount: 1,
        date: "2026-07-06T18:45:00",
        amount: 2200000,
        status: "completed",
        paymentStatus: "paid"
    },
    {
        id: "ORD-9818",
        customer: "Phạm Minh D",
        email: "minhd@gmail.com",
        productImage: "https://picsum.photos/id/4/100/100",
        productName: "Giá Đỡ Laptop Nhôm Công Thái Học xoay 360",
        itemsCount: 2,
        date: "2026-07-06T15:20:00",
        amount: 560000,
        status: "completed",
        paymentStatus: "paid"
    },
    {
        id: "ORD-9817",
        customer: "Vũ Thanh E",
        email: "thanhe@gmail.com",
        productImage: "https://picsum.photos/id/5/100/100",
        productName: "Cáp Sạc Nhanh Type-C 100W Bọc Dù Siêu Bền",
        itemsCount: 3,
        date: "2026-07-05T09:10:00",
        amount: 450000,
        status: "cancelled",
        paymentStatus: "unpaid"
    },
    {
        id: "ORD-9816",
        customer: "Hoàng Đức F",
        email: "ducf@gmail.com",
        productImage: "https://picsum.photos/id/6/100/100",
        productName: "Lót Chuột Cỡ Lớn 80x30cm Chủ Đề Cyberpunk",
        itemsCount: 1,
        date: "2026-07-05T08:30:00",
        amount: 180000,
        status: "completed",
        paymentStatus: "paid"
    },
    {
        id: "ORD-9815",
        customer: "Đỗ Thị G",
        email: "thig@gmail.com",
        productImage: "https://picsum.photos/id/7/100/100",
        productName: "Đèn LED Treo Màn Hình Bảo Vệ Mắt Có Remote",
        itemsCount: 1,
        date: "2026-07-04T22:15:00",
        amount: 720000,
        status: "shipping",
        paymentStatus: "paid"
    },
    {
        id: "ORD-9814",
        customer: "Bùi Anh H",
        email: "anhh@gmail.com",
        productImage: "https://picsum.photos/id/8/100/100",
        productName: "Hub Chuyển Đổi USB-C 8 trong 1 Cho MacBook",
        itemsCount: 1,
        date: "2026-07-04T17:05:00",
        amount: 1250000,
        status: "pending",
        paymentStatus: "paid"
    }
];

export const SellerDashboard = () => {
    const [timeRange, setTimeRange] = useState("7d");
    const [orders, setOrders] = useState(initialOrdersList);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const itemsPerPage = 5;

    // Load statistics based on current time range
    const stats = useMemo(() => generateStatsData(timeRange), [timeRange]);
    const trendData = useMemo(() => getTrendData(timeRange), [timeRange]);

    // Handle statistics refresh simulation
    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            toast.success("Đã cập nhật dữ liệu mới nhất!");
        }, 800);
    };

    // Handle simulation of exporting CSV
    const handleExport = () => {
        const loadingToast = toast.loading("Đang chuẩn bị tệp báo cáo...");
        setTimeout(() => {
            toast.dismiss(loadingToast);
            toast.success("Tải xuống báo cáo doanh thu thành công!");
        }, 1200);
    };

    // Format currency to VND helper
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(value);
    };

    // Format Date helper
    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // Simulating changing order status (e.g. ship order)
    const handleShipOrder = (orderId) => {
        setOrders(prev => prev.map(ord => {
            if (ord.id === orderId) {
                return { ...ord, status: "shipping", paymentStatus: "paid" };
            }
            return ord;
        }));
        toast.success(`Đã xác nhận vận chuyển đơn hàng ${orderId}!`);
    };

    // Simulating cancelling order
    const handleCancelOrder = (orderId) => {
        setOrders(prev => prev.map(ord => {
            if (ord.id === orderId) {
                return { ...ord, status: "cancelled" };
            }
            return ord;
        }));
        toast.error(`Đã huỷ đơn hàng ${orderId}.`);
    };

    // Filtered orders list based on search and status
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = 
                order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.productName.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesStatus = statusFilter === "all" || order.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchQuery, statusFilter]);

    // Reset current page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredOrders.slice(start, start + itemsPerPage);
    }, [filteredOrders, currentPage]);

    // Recharts custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: "#111827",
                    color: "#ffffff",
                    padding: "12px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                    border: "none",
                    fontSize: "13px"
                }}>
                    <p style={{ margin: "0 0 6px 0", fontWeight: "600" }}>{label}</p>
                    {payload.map((item, idx) => (
                        <p key={idx} style={{ margin: "2px 0", color: item.name === "Doanh Thu" ? "#ee4d2d" : "#9ca3af" }}>
                            {item.name}: {item.name === "Doanh Thu" ? formatCurrency(item.value) : `${item.value} lượt`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className={styles.container}>
            {/* Header section with Dynamic Title & Time filters */}
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>Kênh Người Bán</h1>
                    <p>Chào mừng trở lại! Dưới đây là thống kê tình hình kinh doanh của shop bạn.</p>
                </div>
                <div className={styles.filterActions}>
                    <div className="d-flex align-items-center gap-2">
                        <Calendar size={18} className="text-secondary" />
                        <select 
                            className={styles.select} 
                            value={timeRange} 
                            onChange={(e) => setTimeRange(e.target.value)}
                        >
                            <option value="today">Hôm nay</option>
                            <option value="7d">7 ngày qua</option>
                            <option value="30d">30 ngày qua</option>
                            <option value="ytd">Năm nay</option>
                        </select>
                    </div>
                    
                    <button 
                        onClick={handleRefresh} 
                        className={styles.btnSecondary}
                        title="Tải lại dữ liệu"
                        disabled={isRefreshing}
                    >
                        <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                        Tải lại
                    </button>
                    
                    <button 
                        onClick={handleExport} 
                        className={styles.btnPrimary}
                        title="Xuất báo cáo"
                    >
                        <Download size={16} />
                        Xuất báo cáo
                    </button>
                </div>
            </header>

            {/* Statistics summary cards */}
            <section className={styles.statsGrid}>
                {/* Revenue Card */}
                <div className={styles.statCard}>
                    <div className={styles.statCardHeader}>
                        <span className={styles.statLabel}>Doanh Thu (Thu Nhập)</span>
                        <div className={styles.iconWrapper} style={{ backgroundColor: "#fff5f2", color: "#ee4d2d" }}>
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div className={styles.statBody}>
                        <span className={styles.statValue}>{formatCurrency(stats.revenue.value)}</span>
                        <div className={styles.statFooter}>
                            <span className={stats.revenue.isUp ? styles.trendUp : styles.trendDown}>
                                {stats.revenue.isUp ? <TrendingUp size={14} className="me-1" /> : <TrendingDown size={14} className="me-1" />}
                                {stats.revenue.trend}%
                            </span>
                            <span className={styles.trendPeriod}>{stats.revenue.label}</span>
                        </div>
                    </div>
                </div>

                {/* Sales Count Card */}
                <div className={styles.statCard}>
                    <div className={styles.statCardHeader}>
                        <span className={styles.statLabel}>Số Lượt Bán (Sản phẩm)</span>
                        <div className={styles.iconWrapper} style={{ backgroundColor: "#f3f4f6", color: "#111827" }}>
                            <ShoppingBag size={20} />
                        </div>
                    </div>
                    <div className={styles.statBody}>
                        <span className={styles.statValue}>{stats.salesCount.value} lượt</span>
                        <div className={styles.statFooter}>
                            <span className={stats.salesCount.isUp ? styles.trendUp : styles.trendDown}>
                                {stats.salesCount.isUp ? <TrendingUp size={14} className="me-1" /> : <TrendingDown size={14} className="me-1" />}
                                {stats.salesCount.trend}%
                            </span>
                            <span className={styles.trendPeriod}>{stats.salesCount.label}</span>
                        </div>
                    </div>
                </div>

                {/* Total Orders Card */}
                <div className={styles.statCard}>
                    <div className={styles.statCardHeader}>
                        <span className={styles.statLabel}>Tổng Đơn Hàng</span>
                        <div className={styles.iconWrapper} style={{ backgroundColor: "#eef2ff", color: "#6366f1" }}>
                            <ShoppingCart size={20} />
                        </div>
                    </div>
                    <div className={styles.statBody}>
                        <span className={styles.statValue}>{stats.ordersCount.value} đơn</span>
                        <div className={styles.statFooter}>
                            <span className={stats.ordersCount.isUp ? styles.trendUp : styles.trendDown}>
                                {stats.ordersCount.isUp ? <TrendingUp size={14} className="me-1" /> : <TrendingDown size={14} className="me-1" />}
                                {stats.ordersCount.trend}%
                            </span>
                            <span className={styles.trendPeriod}>{stats.ordersCount.label}</span>
                        </div>
                    </div>
                </div>

                {/* Conversion Rate Card */}
                <div className={styles.statCard}>
                    <div className={styles.statCardHeader}>
                        <span className={styles.statLabel}>Tỉ Lệ Chuyển Đổi</span>
                        <div className={styles.iconWrapper} style={{ backgroundColor: "#ecfdf5", color: "#10b981" }}>
                            <Percent size={20} />
                        </div>
                    </div>
                    <div className={styles.statBody}>
                        <span className={styles.statValue}>{stats.conversionRate.value}%</span>
                        <div className={styles.statFooter}>
                            <span className={stats.conversionRate.isUp ? styles.trendUp : styles.trendDown}>
                                {stats.conversionRate.isUp ? <TrendingUp size={14} className="me-1" /> : <TrendingDown size={14} className="me-1" />}
                                {stats.conversionRate.trend}%
                            </span>
                            <span className={styles.trendPeriod}>{stats.conversionRate.label}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Graphs Grid */}
            <section className={styles.chartsGrid}>
                {/* Revenue and Sales Trend Area Graph */}
                <div className={styles.chartCard}>
                    <div className={styles.chartCardHeader}>
                        <h3>Xu Hướng Doanh Thu & Lượt Bán</h3>
                        <span className="text-secondary text-xs">Phân tích chi tiết dựa trên mốc lọc thời gian</span>
                    </div>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorDoanhThu" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ee4d2d" stopOpacity={0.25}/>
                                        <stop offset="95%" stopColor="#ee4d2d" stopOpacity={0.01}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#9ca3af" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <YAxis 
                                    yAxisId="left"
                                    stroke="#9ca3af" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(val) => `${val / 1000000}M`}
                                />
                                <YAxis 
                                    yAxisId="right"
                                    orientation="right"
                                    stroke="#9ca3af" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area 
                                    yAxisId="left"
                                    type="monotone" 
                                    dataKey="doanhThu" 
                                    name="Doanh Thu"
                                    stroke="#ee4d2d" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorDoanhThu)" 
                                />
                                <Area 
                                    yAxisId="right"
                                    type="monotone" 
                                    dataKey="luotBan" 
                                    name="Lượt Bán"
                                    stroke="#111827" 
                                    strokeWidth={2}
                                    fill="none" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart of category share */}
                <div className={styles.chartCard}>
                    <div className={styles.chartCardHeader}>
                        <h3>Cơ Cấu Doanh Mục</h3>
                    </div>
                    <div className={styles.chartContainer} style={{ height: "200px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={75}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value) => `${value}%`}
                                    contentStyle={{ backgroundColor: "#111827", color: "#ffffff", borderRadius: "8px", border: "none" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Pie Chart Legend details list */}
                    <div className={styles.legendList}>
                        {categoryData.map((item, index) => (
                            <div className={styles.legendItem} key={index}>
                                <div className={styles.legendLabel}>
                                    <span className={styles.legendDot} style={{ backgroundColor: item.color }} />
                                    <span>{item.name}</span>
                                </div>
                                <span className={styles.legendValue}>{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Orders Section */}
            <section className={styles.ordersSection}>
                <div className={styles.sectionHeader}>
                    <h3>Đơn Hàng Nổi Bật</h3>
                    
                    <div className={styles.searchFilterGroup}>
                        {/* Search Input */}
                        <div className={styles.searchInputWrapper}>
                            <Search size={16} className={styles.searchIcon} />
                            <input 
                                type="text"
                                className={styles.searchInput}
                                placeholder="Tìm mã đơn, tên khách..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Status Filter Tab/Select */}
                        <select 
                            className={styles.select}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Tất cả đơn hàng</option>
                            <option value="pending">Chờ xác nhận</option>
                            <option value="shipping">Đang giao</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="cancelled">Đã huỷ</option>
                        </select>
                    </div>
                </div>

                {/* Orders list table */}
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Sản phẩm</th>
                                <th>Khách hàng</th>
                                <th>Ngày đặt</th>
                                <th>Tổng tiền</th>
                                <th>Thanh toán</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedOrders.length > 0 ? (
                                paginatedOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="font-semibold text-xs">{order.id}</td>
                                        <td>
                                            <div className={styles.productCell}>
                                                <img 
                                                    src={order.productImage} 
                                                    alt={order.productName} 
                                                    className={styles.productImage} 
                                                />
                                                <div className={styles.productInfo}>
                                                    <span className={styles.productName} title={order.productName}>
                                                        {order.productName}
                                                    </span>
                                                    <span className={styles.productCount}>
                                                        Số lượng: {order.itemsCount}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column">
                                                <span className="font-semibold">{order.customer}</span>
                                                <span className="text-secondary text-xs">{order.email}</span>
                                            </div>
                                        </td>
                                        <td className="text-xs">{formatDate(order.date)}</td>
                                        <td className="font-bold">{formatCurrency(order.amount)}</td>
                                        <td>
                                            <span className={`${styles.badge} ${
                                                order.paymentStatus === "paid" ? styles.badgePaid : styles.badgeUnpaid
                                            }`}>
                                                {order.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`${styles.badge} ${
                                                order.status === "pending" ? styles.badgePending :
                                                order.status === "shipping" ? styles.badgeShipping :
                                                order.status === "completed" ? styles.badgeCompleted :
                                                styles.badgeCancelled
                                            }`}>
                                                {order.status === "pending" ? "Chờ xác nhận" :
                                                 order.status === "shipping" ? "Đang giao" :
                                                 order.status === "completed" ? "Hoàn thành" :
                                                 "Đã huỷ"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.actionGroup}>
                                                <button 
                                                    className={styles.actionBtn} 
                                                    title="Xem chi tiết"
                                                    onClick={() => toast.success(`Đang mở chi tiết đơn ${order.id}...`)}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                
                                                {order.status === "pending" && (
                                                    <>
                                                        <button 
                                                            className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                                                            title="Xác nhận & Giao hàng"
                                                            onClick={() => handleShipOrder(order.id)}
                                                        >
                                                            <Truck size={16} />
                                                        </button>
                                                        <button 
                                                            className={styles.actionBtn} 
                                                            title="Huỷ đơn hàng"
                                                            style={{ color: "#ef4444" }}
                                                            onClick={() => handleCancelOrder(order.id)}
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                {order.status === "shipping" && (
                                                    <button 
                                                        className={styles.actionBtn} 
                                                        title="Đánh dấu hoàn thành"
                                                        style={{ color: "#10b981" }}
                                                        onClick={() => {
                                                            setOrders(prev => prev.map(ord => {
                                                                if (ord.id === order.id) {
                                                                    return { ...ord, status: "completed" };
                                                                }
                                                                return ord;
                                                            }));
                                                            toast.success(`Đơn hàng ${order.id} đã hoàn thành giao hàng!`);
                                                        }}
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-5 text-secondary">
                                        Không tìm thấy đơn hàng nào khớp với điều kiện lọc.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className={styles.tableFooter}>
                        <span className={styles.tableInfo}>
                            Hiển thị {paginatedOrders.length} trên tổng số {filteredOrders.length} đơn hàng
                        </span>
                        <div className={styles.pagination}>
                            <button 
                                className={styles.pageBtn}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            
                            {[...Array(totalPages)].map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`${styles.pageBtn} ${currentPage === idx + 1 ? styles.pageBtnActive : ""}`}
                                    onClick={() => setCurrentPage(idx + 1)}
                                >
                                    {idx + 1}
                                </button>
                            ))}

                            <button 
                                className={styles.pageBtn}
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};
