import { useState, useEffect, useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ADMIN_NAV, UTILITY_NAV } from "../constants/adminSidebar";
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

    const navItems = ADMIN_NAV;

    // Lấy item đang hoạt động dựa trên URL path hiện tại
    const activeItem = useMemo(() => {
        const allItems = navItems.flatMap(item =>
            item.children ? [item, ...item.children] : [item]
        );
        const matched = allItems.find(item => item.path && item.path !== "#" && location.pathname === item.path);
        return matched?.key || navItems[0]?.key || "dashboard";
    }, [location.pathname, navItems]);

    const handleItemClick = async (key) => {
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
                setUser(null);
                notify.success("Logged out successfully");
                navigate(ROUTES.LOGIN);
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
