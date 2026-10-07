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
    Cell
} from "recharts";
import toast from "react-hot-toast";
import styles from "./SellerDashboard.module.css";
import { sellerDashboardApi } from "../api/sellerDashboardApi";

/**
 * SellerDashboard Component
 * Renders the business analytics dashboard for the logged-in seller.
 * Fetches computed metrics (Revenue, Items Sold, Orders Count, Conversion Rate),
 * interactive charts, and recent orders from the backend API.
 */
export const SellerDashboard = () => {
    // ----------------------------------------------------
    // State Variables
    // ----------------------------------------------------
    
    // timeRange: Determines the aggregation filter period ('today', '7d', '30d', 'ytd')
    const [timeRange, setTimeRange] = useState("7d");
    
    // stats: Holds overall summary metric card data (revenue, sales, orders, conversion rate)
    const [stats, setStats] = useState(null);
    
    // trendData: Holds historical/chronological chart data points for Area charts
    const [trendData, setTrendData] = useState([]);
    
    // categoryData: Holds the category share breakdown array for the Pie chart
    const [categoryData, setCategoryData] = useState([]);
    
    // orders: Holds the recent orders array containing products belonging to the shop
    const [orders, setOrders] = useState([]);
    
    // searchQuery: User input filter to search order ID, customer name or product name
    const [searchQuery, setSearchQuery] = useState("");
    
    // statusFilter: Select input filter to filter orders by fulfillment status ('all', 'pending', etc.)
    const [statusFilter, setStatusFilter] = useState("all");
    
    // currentPage: Current active pagination page for the orders table
    const [currentPage, setCurrentPage] = useState(1);
    
    // isRefreshing: Heartbeat spinner trigger when manually reloading the dashboard
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // isLoading: Skeleton/loading indicator state during initial fetch
    const [isLoading, setIsLoading] = useState(true);

    const itemsPerPage = 5;

    // ----------------------------------------------------
    // API Data Fetching Logic
    // ----------------------------------------------------

    /**
     * Fetches dashboard statistics and charts based on the currently selected time range.
     */
    const fetchDashboardData = async (showOverlayLoading = true) => {
        if (showOverlayLoading) {
            setIsLoading(true);
        }
        try {
            const response = await sellerDashboardApi.getDashboardData(timeRange);
            if (response && response.success && response.data) {
                const data = response.data;
                setStats(data.stats);
                setTrendData(data.trendData || []);
                setCategoryData(data.categoryData || []);
                setOrders(data.orders || []);
            } else {
                toast.error("Failed to load dashboard statistics.");
            }
        } catch (error) {
            console.error("Error fetching seller dashboard data:", error);
            toast.error(error.response?.data?.message || "An error occurred while loading dashboard metrics.");
        } finally {
            setIsLoading(false);
        }
    };

    // Trigger dashboard data load whenever the time range selection changes
    useEffect(() => {
        fetchDashboardData(true);
    }, [timeRange]);

    // ----------------------------------------------------
    // Operations & Event Handlers
    // ----------------------------------------------------

    /**
     * Manually triggers a reload of the stats dashboard without full screen overlay loading.
     */
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await fetchDashboardData(false);
            toast.success("Dashboard metrics updated successfully!");
        } catch (err) {
            toast.error("Failed to refresh statistics.");
            console.error("Dashboard refresh error:", err);
        } finally {
            setIsRefreshing(false);
        }
    };

    /**
     * Simulates compiling and downloading a CSV transaction log report.
     */
    const handleExport = () => {
        const loadingToast = toast.loading("Generating sales spreadsheet report...");
        setTimeout(() => {
            toast.dismiss(loadingToast);
            toast.success("Dashboard report downloaded successfully!");
        }, 1200);
    };

    /**
     * Calls the backend service to transition an order's status to 'shipping'.
     */
    const handleShipOrder = async (orderId) => {
        const rawId = orderId.replace("ORD-", "");
        const loadingToast = toast.loading(`Confirming fulfillment for order ${orderId}...`);
        try {
            const res = await sellerDashboardApi.updateOrderStatus(rawId, "shipping", "Merchant Warehouse", "Fulfillment confirmed by merchant. Shipped.");
            toast.dismiss(loadingToast);
            if (res && res.success) {
                toast.success(`Order ${orderId} has been successfully shipped!`);
                fetchDashboardData(false);
            } else {
                toast.error(res.message || "Failed to ship order.");
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            console.error("Fulfillment shipping error:", error);
            toast.error(error.response?.data?.message || "Could not update order status.");
        }
    };

    /**
     * Calls the backend service to cancel an order.
     */
    const handleCancelOrder = async (orderId) => {
        const rawId = orderId.replace("ORD-", "");
        const loadingToast = toast.loading(`Cancelling order ${orderId}...`);
        try {
            const res = await sellerDashboardApi.updateOrderStatus(rawId, "cancelled", "Merchant Store", "Order cancelled by shop merchant.");
            toast.dismiss(loadingToast);
            if (res && res.success) {
                toast.error(`Order ${orderId} was successfully cancelled.`);
                fetchDashboardData(false);
            } else {
                toast.error(res.message || "Failed to cancel order.");
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            console.error("Cancellation error:", error);
            toast.error(error.response?.data?.message || "Could not cancel order.");
        }
    };

    /**
     * Calls the backend service to mark a shipping order as completed.
     */
    const handleCompleteOrder = async (orderId) => {
        const rawId = orderId.replace("ORD-", "");
        const loadingToast = toast.loading(`Marking order ${orderId} as completed...`);
        try {
            const res = await sellerDashboardApi.updateOrderStatus(rawId, "completed", "Customer Destination", "Package delivered and order finalized.");
            toast.dismiss(loadingToast);
            if (res && res.success) {
                toast.success(`Order ${orderId} is finalized and marked as completed.`);
                fetchDashboardData(false);
            } else {
                toast.error(res.message || "Failed to complete order.");
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            console.error("Finalization error:", error);
            toast.error(error.response?.data?.message || "Could not update order status.");
        }
    };

    // ----------------------------------------------------
    // Filtering & Pagination
    // ----------------------------------------------------

    // Computes filtered list of orders based on client search input and status tabs
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

    // Resets to page 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter]);

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    
    // Slices orders array to construct the current page payload
    const paginatedOrders = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredOrders.slice(start, start + itemsPerPage);
    }, [filteredOrders, currentPage]);

    // ----------------------------------------------------
    // Render loading skeletons
    // ----------------------------------------------------
    if (isLoading && !stats) {
        return (
            <div className={styles.container} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
                <div className="d-flex flex-column align-items-center gap-3">
                    <RefreshCw size={40} className="animate-spin text-primary" />
                    <p className="text-secondary font-semibold">Loading dashboard stats...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header section with Title & Time Range Filters */}
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>Seller Channel</h1>
                    <p>Welcome back! Here is a summary of your shop's performance.</p>
                </div>
                <div className={styles.filterActions}>
                    <div className="d-flex align-items-center gap-2">
                        <Calendar size={18} className="text-secondary" />
                        <select 
                            className={styles.select} 
                            value={timeRange} 
                            onChange={(e) => setTimeRange(e.target.value)}
                        >
                            <option value="today">Today</option>
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="ytd">This Year (YTD)</option>
                        </select>
                    </div>
                    
                    <button 
                        onClick={handleRefresh} 
                        className={styles.btnSecondary}
                        title="Refresh metrics"
                        disabled={isRefreshing}
                    >
                        <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                        Refresh
                    </button>
                    
                    <button 
                        onClick={handleExport} 
                        className={styles.btnPrimary}
                        title="Export CSV report"
                    >
                        <Download size={16} />
                        Export Report
                    </button>
                </div>
            </header>

            {/* Statistics summary KPI cards */}
            <section className={styles.statsGrid}>
                {/* Revenue Card */}
                <div className={styles.statCard}>
                    <div className={styles.statCardHeader}>
                        <span className={styles.statLabel}>Revenue (Earnings)</span>
                        <div className={styles.iconWrapper} style={{ backgroundColor: "#fff5f2", color: "#ee4d2d" }}>
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div className={styles.statBody}>
                        <span className={styles.statValue}>{stats ? formatCurrency(stats.revenue.value) : "₫ 0"}</span>
                        <div className={styles.statFooter}>
                            <span className={stats?.revenue.isUp ? styles.trendUp : styles.trendDown}>
                                {stats?.revenue.isUp ? <TrendingUp size={14} className="me-1" /> : <TrendingDown size={14} className="me-1" />}
                                {stats ? stats.revenue.trend : 0}%
                            </span>
                            <span className={styles.trendPeriod}>{stats ? stats.revenue.label : "vs past period"}</span>
                        </div>
                    </div>
                </div>

                {/* Sales Volume Card */}
                <div className={styles.statCard}>
                    <div className={styles.statCardHeader}>
                        <span className={styles.statLabel}>Sales Volume (Units)</span>
                        <div className={styles.iconWrapper} style={{ backgroundColor: "#f3f4f6", color: "#111827" }}>
                            <ShoppingBag size={20} />
                        </div>
                    </div>
                    <div className={styles.statBody}>
                        <span className={styles.statValue}>{stats ? stats.salesCount.value : 0} units</span>
                        <div className={styles.statFooter}>
                            <span className={stats?.salesCount.isUp ? styles.trendUp : styles.trendDown}>
                                {stats?.salesCount.isUp ? <TrendingUp size={14} className="me-1" /> : <TrendingDown size={14} className="me-1" />}
                                {stats ? stats.salesCount.trend : 0}%
                            </span>
                            <span className={styles.trendPeriod}>{stats ? stats.salesCount.label : "vs past period"}</span>
                        </div>
                    </div>
                </div>

                {/* Total Orders Card */}
                <div className={styles.statCard}>
                    <div className={styles.statCardHeader}>
                        <span className={styles.statLabel}>Total Orders</span>
                        <div className={styles.iconWrapper} style={{ backgroundColor: "#eef2ff", color: "#6366f1" }}>
                            <ShoppingCart size={20} />
                        </div>
                    </div>
                    <div className={styles.statBody}>
                        <span className={styles.statValue}>{stats ? stats.ordersCount.value : 0} orders</span>
                        <div className={styles.statFooter}>
                            <span className={stats?.ordersCount.isUp ? styles.trendUp : styles.trendDown}>
                                {stats?.ordersCount.isUp ? <TrendingUp size={14} className="me-1" /> : <TrendingDown size={14} className="me-1" />}
                                {stats ? stats.ordersCount.trend : 0}%
                            </span>
                            <span className={styles.trendPeriod}>{stats ? stats.ordersCount.label : "vs past period"}</span>
                        </div>
                    </div>
                </div>

                {/* Conversion Rate Card */}
                <div className={styles.statCard}>
                    <div className={styles.statCardHeader}>
                        <span className={styles.statLabel}>Conversion Rate</span>
                        <div className={styles.iconWrapper} style={{ backgroundColor: "#ecfdf5", color: "#10b981" }}>
                            <Percent size={20} />
                        </div>
                    </div>
                    <div className={styles.statBody}>
                        <span className={styles.statValue}>{stats ? stats.conversionRate.value : 0}%</span>
                        <div className={styles.statFooter}>
                            <span className={stats?.conversionRate.isUp ? styles.trendUp : styles.trendDown}>
                                {stats?.conversionRate.isUp ? <TrendingUp size={14} className="me-1" /> : <TrendingDown size={14} className="me-1" />}
                                {stats ? stats.conversionRate.trend : 0}%
                            </span>
                            <span className={styles.trendPeriod}>{stats ? stats.conversionRate.label : "vs past period"}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Graphs Grid */}
            <section className={styles.chartsGrid}>
                {/* Revenue and Sales Trend Area Graph */}
                <div className={styles.chartCard}>
                    <div className={styles.chartCardHeader}>
                        <h3>Revenue & Sales Volume Trend</h3>
                        <span className="text-secondary text-xs">Detailed historical breakdown based on filters</span>
                    </div>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 15, bottom: 0 }}>
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
                                    tickFormatter={(val) => val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val}
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
                                    name="Revenue"
                                    stroke="#ee4d2d" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorDoanhThu)" 
                                />
                                <Area 
                                    yAxisId="right"
                                    type="monotone" 
                                    dataKey="luotBan" 
                                    name="Sales"
                                    stroke="#111827" 
                                    strokeWidth={2}
                                    fill="none" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart category composition */}
                <div className={styles.chartCard}>
                    <div className={styles.chartCardHeader}>
                        <h3>Category Contribution</h3>
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
                    
                    {/* Legend listing for Category composition */}
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
                        {categoryData.length === 0 && (
                            <div className="text-center w-100 py-3 text-secondary text-xs">No sales recorded yet.</div>
                        )}
                    </div>
                </div>
            </section>

            {/* Recent Orders Section */}
            <section className={styles.ordersSection}>
                <div className={styles.sectionHeader}>
                    <h3>Recent Orders</h3>
                    
                    <div className={styles.searchFilterGroup}>
                        {/* Search Input */}
                        <div className={styles.searchInputWrapper}>
                            <Search size={16} className={styles.searchIcon} />
                            <input 
                                type="text"
                                className={styles.searchInput}
                                placeholder="Search order ID, customer name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Status Filter Tab Dropdown */}
                        <select 
                            className={styles.select}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Orders</option>
                            <option value="pending">Pending</option>
                            <option value="shipping">Shipping</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Orders list table */}
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Product</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Actions</th>
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
                                                        Qty: {order.itemsCount}
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
                                                {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`${styles.badge} ${
                                                order.status === "pending" ? styles.badgePending :
                                                order.status === "shipping" ? styles.badgeShipping :
                                                order.status === "completed" ? styles.badgeCompleted :
                                                styles.badgeCancelled
                                            }`}>
                                                {order.status === "pending" ? "Pending" :
                                                 order.status === "shipping" ? "Shipping" :
                                                 order.status === "completed" ? "Completed" :
                                                 "Cancelled"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.actionGroup}>
                                                <button 
                                                    className={styles.actionBtn} 
                                                    title="View Details"
                                                    onClick={() => toast.success(`Opening order details for ${order.id}...`)}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                
                                                {order.status === "pending" && (
                                                    <>
                                                        <button 
                                                            className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                                                            title="Confirm & Ship"
                                                            onClick={() => handleShipOrder(order.id)}
                                                        >
                                                            <Truck size={16} />
                                                        </button>
                                                        <button 
                                                            className={styles.actionBtn} 
                                                            title="Cancel Order"
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
                                                        title="Mark as Completed"
                                                        style={{ color: "#10b981" }}
                                                        onClick={() => handleCompleteOrder(order.id)}
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
                                    <td colSpan="8" className="text-center py-5 text-secondary text-sm">
                                        No orders found matching the filter criteria.
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
                            Showing {paginatedOrders.length} of {filteredOrders.length} orders
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

    // ----------------------------------------------------
    // Custom Chart Tooltip
    // ----------------------------------------------------
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
                        <p key={idx} style={{ margin: "2px 0", color: item.name === "Revenue" ? "#ee4d2d" : "#9ca3af" }}>
                            {item.name}: {item.name === "Revenue" ? formatCurrency(item.value) : `${item.value} units`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // ----------------------------------------------------
    // Helpers
    // ----------------------------------------------------

    /**
     * Formats raw numeric values into Vietnamese Dong currency structure.
     */
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0
        }).format(value).replace("$", "₫ ");
    };

    /**
     * Formats DateTime strings into consistent readable dates.
     */
    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };