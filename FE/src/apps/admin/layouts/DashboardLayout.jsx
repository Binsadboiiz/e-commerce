import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import styles from "./DashboardLayout.module.css";

function DashboardLayout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Default collapsed on load/mobile

    const toggleSidebar = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    return (
        <div className={styles.layout}>
            {/* Backdrop overlay for mobile screens when sidebar is active/expanded */}
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
