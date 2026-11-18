import React from 'react';
import {
    LayoutDashboard,
    ClipboardList,
    Settings,
    LogOut
} from 'lucide-react';
import { ROUTES } from '@/config/route.config';

// Danh sách điều hướng admin
export const ADMIN_NAV = [
    {
        key: "dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard size={18} />,
        path: ROUTES.ADMIN_DASHBOARD
    },
    {
        key: "seller-applications",
        label: "Seller Applications",
        icon: <ClipboardList size={18} />,
        path: ROUTES.ADMIN_SELLER_APPLICATIONS
    }
];

// Tiện ích
export const UTILITY_NAV = [
    {
        key: "settings",
        label: "Settings",
        icon: <Settings size={18} />,
        path: ROUTES.ADMIN_SETTINGS
    },
    {
        key: "logout",
        label: "Logout",
        icon: <LogOut size={18} />,
        path: "#",
        variant: "danger"
    }
];
