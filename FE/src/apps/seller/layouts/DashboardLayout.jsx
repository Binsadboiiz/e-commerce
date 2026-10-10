import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { sellerStoreApi } from "@/apps/seller/features/store/api/sellerStoreApi";
import { ROUTES } from "@/config/route.config";
import styles from "./DashboardLayout.module.css";

function DashboardLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

    useEffect(() => {
        const checkShopStatus = async () => {
            try {
                const res = await sellerStoreApi.getShopStatus();
                const data = res?.data || res || {};
                
                if (data.hasShop === false && location.pathname !== ROUTES.SELLER_SETUP_SHOP) {
                    navigate(ROUTES.SELLER_SETUP_SHOP, { replace: true });
                }
            } catch (err) {
                console.error("Error checking seller shop status:", err);
            }
        };

        checkShopStatus();
    }, [navigate, location.pathname]);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    return (
        <div className={styles.layout}>
            {!isSidebarCollapsed && (
                <div 
                    className={styles.backdrop} 
                    onClick={toggleSidebar}
                    aria-hidden="true" 
                />
            )}

            <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

            <div className={styles.content}>
                <Topbar onToggleSidebar={toggleSidebar} />

                <main className={styles.main}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;