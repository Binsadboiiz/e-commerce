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
    DASHBOARD: "admin/dashboard",
    DASH_PRODUCTS: "admin/dashboard/products",
    DASH_ORDERS: "admin/dashboard/orders",
    DASH_SETTINGS: "admin/dashboard/settings",

    // Seller
    SELLER_DASHBOARD: "/seller/dashboard",
    SELLER_PRODUCTS: "/seller/products",
    SELLER_REGISTRATION: "/seller/registration",
};