/**
 * <summary>
 * Root layout shell for dashboard pages
 * Composes Sidebar + Topbar + routed content
 * </summary>
 */

import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import styles from "./DashboardLayout.module.css";

function DashboardLayout() {
    return (
        <div className={styles.layout}>

            <Sidebar />

            <div className={styles.content}>
                <Topbar />

                <main className={styles.main}>
                    <Outlet />
                </main>
            </div>

        </div>
    );
}

export default DashboardLayout;