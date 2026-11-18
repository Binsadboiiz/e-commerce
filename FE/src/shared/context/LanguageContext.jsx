import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const dictionary = {
  vi: {
    // Header
    sellerCenter: "Kênh Người Bán / Seller Center",
    downloadApp: "Tải ứng dụng PolarisX",
    connectSocial: "Kết nối Facebook & Instagram",
    hotline: "Hotline: 1900 8888",
    langName: "Tiếng Việt",
    register: "Đăng Ký",
    login: "Đăng Nhập",
    logout: "Đăng Xuất",
    myOrders: "Đơn Hàng Của Tôi",
    myProfile: "Hồ Sơ Cá Nhân",
    cart: "Giỏ hàng",
    searchPlaceholder: "Tìm kiếm sản phẩm...",
    searchSuggestions: "Gợi ý:",

    // Footer
    value1Title: "100% Hàng Chính Hãng",
    value1Desc: "Cam kết chất lượng & nguồn gốc sản phẩm",
    value2Title: "Giao Hàng Nhanh Toàn Quốc",
    value2Desc: "Miễn phí vận chuyển đơn từ 150.000đ",
    value3Title: "7 Ngày Đổi Trả Dễ Dàng",
    value3Desc: "Hoàn tiền 100% nếu phát sinh lỗi",
    value4Title: "Hỗ Trợ 24/7 Chuyên Nghiệp",
    value4Desc: "Tư vấn & giải đáp thắc mắc tận tâm",
    brandDesc: "Sàn thương mại điện tử hàng đầu - Nơi mua sắm sản phẩm chính hãng với ưu đãi tốt nhất mỗi ngày.",
    colCustomerSupport: "Hỗ Trợ Khách Hàng",
    colAboutUs: "Về PolarisX Mall",
    colPaymentShip: "Thanh Toán & Vận Chuyển",
    colNewsletter: "Nhận Ưu Đãi Độc Quyền",
    subscribeDesc: "Đăng ký nhận thông tin khuyến mãi và mã giảm giá mới nhất từ PolarisX Mall.",
    subscribeBtn: "Đăng Ký",
    emailPlaceholder: "Nhập email của bạn...",
    rightsReserved: "Tất cả các quyền được bảo lưu.",
    privacyPolicy: "Chính sách bảo mật",
    termsOfService: "Quy chế hoạt động",
    legalTerms: "Điều khoản dịch vụ",

    // Cart
    emptyTitle: "Giỏ hàng của bạn đang trống",
    emptySubtitle: "Hãy khám phá thêm nhiều sản phẩm chất lượng với ưu đãi đặc biệt hôm nay và thêm vào giỏ hàng nhé!",
    shopNow: "Shop Now / Khám Phá Ngay",
    cartHeading: "Giỏ Hàng Của Bạn",
    selectAll: "Chọn Tất Cả",
    delete: "Xóa",
    totalAmount: "Tổng thanh toán",
    checkout: "Thanh Toán",

    // Checkout
    checkoutHeading: "Thanh Toán Đơn Hàng",
    shippingAddress: "Địa Chỉ Nhận Hàng",
    orderedProducts: "Sản Phẩm Đặt Mua",
    vouchers: "Mã Giảm Giá",
    paymentMethod: "Phương Thức Thanh Toán",
    placeOrder: "Đặt Hàng",

    // Product Card
    topSeller: "Bán chạy",
    reviews: "đánh giá",
    addToCart: "Thêm vào giỏ",
    addedSuccess: "Đã thêm vào giỏ hàng!"
  },
  en: {
    // Header
    sellerCenter: "Seller Center",
    downloadApp: "Download PolarisX App",
    connectSocial: "Connect Facebook & Instagram",
    hotline: "Hotline: 1900 8888",
    langName: "English",
    register: "Sign Up",
    login: "Login",
    logout: "Logout",
    myOrders: "My Orders",
    myProfile: "My Profile",
    cart: "Cart",
    searchPlaceholder: "Search products...",
    searchSuggestions: "Popular:",

    // Footer
    value1Title: "100% Authentic Products",
    value1Desc: "Quality & origin guaranteed",
    value2Title: "Fast Nationwide Delivery",
    value2Desc: "Free shipping for orders over 150.000đ",
    value3Title: "7 Days Easy Returns",
    value3Desc: "100% refund for defective products",
    value4Title: "24/7 Professional Support",
    value4Desc: "Dedicated customer service team",
    brandDesc: "Leading enterprise e-commerce platform - Shop authentic products with top daily deals.",
    colCustomerSupport: "Customer Support",
    colAboutUs: "About PolarisX Mall",
    colPaymentShip: "Payment & Shipping",
    colNewsletter: "Exclusive Deals",
    subscribeDesc: "Subscribe to receive latest promotions & voucher codes from PolarisX Mall.",
    subscribeBtn: "Subscribe",
    emailPlaceholder: "Enter your email...",
    rightsReserved: "All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    legalTerms: "Terms & Conditions",

    // Cart
    emptyTitle: "Your cart is empty",
    emptySubtitle: "Discover top quality products with special offers today and add them to your cart!",
    shopNow: "Shop Now",
    cartHeading: "Shopping Cart",
    selectAll: "Select All",
    delete: "Delete",
    totalAmount: "Total Amount",
    checkout: "Checkout",

    // Checkout
    checkoutHeading: "Checkout Order",
    shippingAddress: "Shipping Address",
    orderedProducts: "Ordered Products",
    vouchers: "Vouchers",
    paymentMethod: "Payment Method",
    placeOrder: "Place Order",

    // Product Card
    topSeller: "Top Seller",
    reviews: "reviews",
    addToCart: "Add to cart",
    addedSuccess: "Added to cart!"
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('app_language') || 'vi';
  });

  const setLanguage = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('app_language', newLang);
  };

  const t = (key) => {
    return dictionary[lang]?.[key] || dictionary['vi']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
