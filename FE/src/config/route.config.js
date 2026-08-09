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

    // Admin
    ADMIN_DASHBOARD: "/admin/dashboard",
    ADMIN_SELLER_APPLICATIONS: "/admin/seller-applications",
    ADMIN_SETTINGS: "/admin/settings",

    // Seller
    SELLER_DASHBOARD: "/seller/dashboard",
    SELLER_PRODUCTS: "/seller/products",
    SELLER_VOUCHERS: "/seller/vouchers",
    SELLER_REGISTRATION: "/seller/registration",
};