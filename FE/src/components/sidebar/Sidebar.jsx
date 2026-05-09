/**
 * <summary>
 * Sidebar container — manages collapsed + active state
 * and delegates rendering to SidebarView.
 * Supports role-based navigation: retailer vs admin.
 * </summary>
 */

import { useState, useEffect, useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PRIMARY_NAV, RETAILER_NAV, UTILITY_NAV } from "./sidebar.config.jsx";
import { AuthContext } from "../../features/auth/context/AuthContext.jsx";
import SidebarView from "./SidebarView";

export default function Sidebar() {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [openSections, setOpenSections] = useState({});

    // Role-based navigation: nếu role === "retailer" hoặc đang ở route retailer thì dùng RETAILER_NAV để test
    const navItems = useMemo(() => {
        if (user?.role === "retailer" || location.pathname.startsWith('/retailer')) return RETAILER_NAV;
        return PRIMARY_NAV;
    }, [user?.role, location.pathname]);

    // Active item dựa trên URL hiện tại
    const activeItem = useMemo(() => {
        const allItems = navItems.flatMap(item =>
            item.children ? [item, ...item.children] : [item]
        );
        const matched = allItems.find(item => item.path && item.path !== "#" && location.pathname === item.path);
        return matched?.key || navItems[0]?.key || "dashboard";
    }, [location.pathname, navItems]);

    const handleToggleSidebar = () => {
        setIsCollapsed(prev => !prev);
    };

    const handleItemClick = (key) => {
        // Cần bao gồm cả UTILITY_NAV để các nút như Settings/Logout có thể xử lý (nếu có path)
        const allItems = [
            ...navItems.flatMap(item => item.children ? [item, ...item.children] : [item]),
            ...UTILITY_NAV
        ];
        
        const item = allItems.find(i => i.key === key);
        if (item?.path && item.path !== "#") {
            navigate(item.path);
        } else if (key === "logout") {
            // Placeholder cho logout
            console.log("Logout clicked");
        }
    };

    const handleToggleSection = (key) => {
        setOpenSections(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    useEffect(() => {
        navItems.forEach(section => {
            const hasActiveChild = section.children?.some(
                c => c.key === activeItem
            );

            if (hasActiveChild) {
                setOpenSections(prev => ({
                    ...prev,
                    [section.key]: true
                }));
            }
        });
    }, [activeItem, navItems]);

    return (
        <SidebarView
            navItems={navItems}
            isCollapsed={isCollapsed}
            activeItem={activeItem}
            openSections={openSections}
            onItemClick={handleItemClick}
            onToggle={handleToggleSidebar}
            onToggleSection={handleToggleSection}
        />
    );
}