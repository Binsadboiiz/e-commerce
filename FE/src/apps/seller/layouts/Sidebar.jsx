/**
 * <summary>
 * Sidebar container — manages collapsed + active state
 * and delegates rendering to SidebarView.
 * Supports role-based navigation: retailer vs admin.
 * </summary>
 */

import { useState, useEffect, useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PRIMARY_NAV, SELLER_NAV, UTILITY_NAV } from "./sidebar.config.jsx";
import { AuthContext } from "@/shared/features/auth/context/AuthContext.jsx";
import { logoutApi } from "@/shared/features/auth/api/authService";
import { notify } from "@/shared/utils/Notify";
import { ROUTES } from "@/config/route.config";
import SidebarView from "./SidebarView";

export default function Sidebar({ isCollapsed, onToggle }) {
    const { user, setUser } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const [openSections, setOpenSections] = useState({});

    // Role-based navigation: nếu role === "seller" hoặc đang ở route seller thì dùng SELLER_NAV để test
    const navItems = useMemo(() => {
        const role = user?.role?.toLowerCase();
        if (role === "seller" || location.pathname.startsWith('/seller')) return SELLER_NAV;
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

    const handleItemClick = async (key) => {
        // Cần bao gồm cả UTILITY_NAV để các nút như Settings/Logout có thể xử lý (nếu có path)
        const allItems = [
            ...navItems.flatMap(item => item.children ? [item, ...item.children] : [item]),
            ...UTILITY_NAV
        ];

        const item = allItems.find(i => i.key === key);
        if (item?.path && item.path !== "#") {
            navigate(item.path);
        } else if (key === "logout") {
            try {
                await logoutApi();
            } catch (error) {
                console.warn("Logout API error:", error);
            } finally {
                navigate(ROUTES.LOGIN);
                setUser(null);
                notify.success("Logged out successfully");
            }
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
            onToggle={onToggle}
            onToggleSection={handleToggleSection}
        />
    );
}