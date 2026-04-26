/**
 * <summary>
 * Config-driven sidebar menu definition.
 * </summary>
 */

import {
    LayoutDashboard,
    Users,
    Store,
    Package,
    ShoppingCart,
    FileText,
    BarChart3,
    Settings,
    LogOut
} from "lucide-react";

/* primary navigation (admin) */
export const PRIMARY_NAV = [
    {
        key: "dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard size={18} />,
        path: "#",
    },
    {
        key: "users",
        label: "Users",
        icon: <Users size={18} />,
        path: "#",
    },
    {
        key: "online-shops",
        label: "Online Shops",
        icon: <Store size={18} />,
        path: "#",
    },
    {
        key: "products",
        label: "Products",
        icon: <Package size={18} />,
        path: "#",
    },
    {
        key: "orders",
        label: "Orders",
        icon: <ShoppingCart size={18} />,
        path: "#",
    },
    {
        key: "system-reports",
        label: "System Reports",
        icon: <FileText size={18} />,
        path: "#",
        children: [
            {
                key: "reports-account",
                label: "Account",
                path: "#",
            },
            {
                key: "reports-shop",
                label: "Shop",
                path: "#",
            },
            {
                key: "reports-orders",
                label: "Orders",
                path: "#",
            },
        ],
    },
    {
        key: "analytics",
        label: "Analytics",
        icon: <BarChart3 size={18} />,
        path: "#",
    },
];

/* retailer navigation */
export const RETAILER_NAV = [
    {
        key: "retailer-dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard size={18} />,
        path: "/retailer/dashboard",
    },
    {
        key: "retailer-products",
        label: "Products",
        icon: <Package size={18} />,
        path: "/retailer/products",
    },
    {
        key: "retailer-orders",
        label: "Orders",
        icon: <ShoppingCart size={18} />,
        path: "#",
    },
    {
        key: "retailer-analytics",
        label: "Analytics",
        icon: <BarChart3 size={18} />,
        path: "#",
    },
];

/* utility navigation */
export const UTILITY_NAV = [
    {
        key: "settings",
        label: "Settings",
        icon: <Settings size={18} />,
        path: "#",
    },
    {
        key: "logout",
        label: "Logout",
        icon: <LogOut size={18} />,
        path: "#",
        variant: "danger",
    },
];