export const ROUTES = {
    // Public
    HOME: "/",
    PRODUCTS_LIST: "/products",
    PRODUCT_DETAIL: "/products/:slug",
    SHOP: "/shops/:id",
    
    CART: "/cart",
    CHECKOUT: "/checkout",
    MY_ORDERS: "/my-orders",
    ORDER_TRACKING: "/my-orders/:orderId/tracking",

    // Auth 
    LOGIN: "/login",
    REGISTER: "/register",
    ERROR: "/error",
    PROFILE: "/profile",

    // Dashboard
    DASHBOARD: "/dashboard",
    DASH_PRODUCTS: "/dashboard/products",
    DASH_ORDERS: "/dashboard/orders",
    DASH_SETTINGS: "/dashboard/settings",

    // Retailer
    RETAILER_DASHBOARD: "/retailer/dashboard",
    RETAILER_PRODUCTS: "/retailer/products",
};