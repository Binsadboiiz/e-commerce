# e-commerce
frontend/
├── public/
│   └── favicon.ico
│
├── src/
│   ├── assets/          # ảnh, icon, font
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/      # component dùng lại
│   │   ├── common/      # Button, Modal, Loader...
│   │   ├── layout/      # Header, Footer, Sidebar
│   │   └── product/     # ProductCard, RatingStar
│   │
│   ├── pages/           # page = route
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ProductList.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Profile.jsx
│   │   └── admin/
│   │   |   ├── Dashboard.jsx
│   │   |   ├── Shop.jsx
│   │   |   └── Users.jsx
|   |   |
│   │   |
|   |   |__ retailer/
|   |           |
|   |           |__Dashboard.jsx
|   |           |__Orderlist.jsx
│   │           |__Products.jsx
|   |
|   |
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── AdminRoute.jsx
│   │
│   ├── services/        # gọi API
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   ├── product.service.js
│   │   ├── cart.service.js
│   │   └── order.service.js
│   │
│   ├── context/         # Context API
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── hooks/           # custom hook
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   └── useFetch.js
│   │
│   ├── utils/
│   │   ├── formatPrice.js
│   │   ├── storage.js
│   │   └── constants.js
│   │
│   ├── styles/
│   │   ├── global.css
│   │   └── variables.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── index.html
├── vite.config.js
└── package.json


backend/
├── src/
│   ├── config/
│   │   ├── db.js           # connect DB
│   │   ├── env.js
│   │   └── ImageFile.js   # upload ảnh
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Review.js
│   │   └── Cart.js
│   │
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── user.route.js
│   │   ├── product.route.js
│   │   ├── category.route.js
│   │   ├── order.route.js
│   │   └── review.route.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── product.controller.js
│   │   ├── order.controller.js
│   │   └── review.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── product.service.js
│   │   ├── order.service.js
│   │   └── payment.service.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── admin.middleware.js
│   │   ├── error.middleware.js
│   │   └── upload.middleware.js
│   │
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── hash.js
│   │   ├── response.js
│   │   └── pagination.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
└── README.md
