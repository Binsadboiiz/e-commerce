import { Routes, Route } from "react-router-dom";
import ErrorPage from "../pages/error/ErrorPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import MainLayout from "../components/layout/MainLayout";
import HomePage from "../pages/home/Home";
import ProductList from "../features/product/pages/ProductList";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Layout chung */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/products" element={<ProductList />} />
      </Route>

      {/* Route không dùng layout */}
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

    </Routes>
  );
};

export default AppRoutes;