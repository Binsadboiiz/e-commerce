import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosClient from "@/shared/features/auth/api/axiosClient";
import { ROUTES } from "@/config/route.config";
import styles from "./AdminDashboard.module.css";

export const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const [pendingCount, setPendingCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const res = await axiosClient.get("/admin/dashboard/seller-applications");
                const pending = res.filter(app => app.status === "PENDING").length;
                setPendingCount(pending);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu dashboard:", error);
                toast.error("Không thể tải số liệu thống kê.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div className={styles.loading}>Đang tải...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Tổng Quan Quản Trị</h1>
                <p className={styles.subtitle}>Báo cáo nhanh trạng thái hoạt động của hệ thống.</p>
            </div>

            <div className={styles.cardGrid}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>Yêu Cầu Chờ Duyệt</div>
                    <div className={styles.cardValue}>{pendingCount}</div>
                    <div className={styles.cardFooter}>Tài khoản đăng ký bán hàng cần xử lý</div>
                    <button 
                        onClick={() => navigate(ROUTES.ADMIN_SELLER_APPLICATIONS)}
                        className={styles.actionBtn}
                    >
                        Đi đến phê duyệt →
                    </button>
                </div>
            </div>
        </div>
    );
};
