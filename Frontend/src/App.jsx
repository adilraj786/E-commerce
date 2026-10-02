import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useFirebase } from "./context/FirebaseContext";

// Auth Pages
import AuthRegister from "./pages/AuthPage/Register";
import AuthLogin from "./pages/AuthPage/Login";

// User Pages
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import Product from "./pages/HomePage/components/Product";
import ProductPage from "./pages/ProductPage/components/ProductPage";
import ProductDetails from "./pages/ProductPage/ProductDetail";
import CartPage from "./pages/ProductPage/cart";
import CheckoutPage from "./pages/ProductPage/CheckoutPage";
import ClothPage from "./pages/ProductPage/components/ClothPage";
import AccessoriesPage from "./pages/ProductPage/components/AccessoriesPage";
import FootwearPage from "./pages/ProductPage/components/FootwearPage";
import OrderConfirmationPage from "./pages/ProductPage/OrderConfirmationPage";
import StripeWrapper from "./pages/ProductPage/StripeWrapper";
import OrderSuccess from "./pages/ProductPage/OrderSuccess";
import OrdersPage from "./pages/ProductPage/OrdersPage";

// Admin Pages
import Sidebar from "./components/admin-panel/Sidebar";
import AdminProduct from "./pages/admin/AdminProduct";
import AdminUser from "./pages/admin/AdminUser";
import Dashboard from "./pages/admin/AdminDashboard";
import AdminProductAdd from "./pages/admin/AdminProductAdd";
import AdminProductEdit from "./pages/admin/AdminProductEdit";
import AdminBannerList from "./pages/admin/AdminBannerList";
import AdminBannerAdd from "./pages/admin/AdminBannerAdd";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminSettings from "./pages/admin/AdminSettings";

// Layouts
import AuthLayout from "./components/auth/Authlayout";

// Route Guards
import AdminRoute from "./components/routes/AdminRoute";
import NotAuthorized from "./components/routes/NotAuthorized";

function App() {
  const { loading } = useFirebase();

  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        {/*User*/}
        <Route path="/" element={<Navbar />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<Product />} />
          <Route path="product/:docId" element={<ProductDetails />} />
          <Route path="product/cart" element={<CartPage />} />
          <Route path="clothes" element={<ClothPage />} />
          <Route path="accessories" element={<AccessoriesPage />} />
          <Route path="footwear" element={<FootwearPage />} />
          <Route path="Allproduct" element={<ProductPage />} />
          <Route path="order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="checkout" element={<StripeWrapper />} />
          <Route path="order-success" element={<OrderSuccess />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<Sidebar />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<AdminUser />} />
            <Route path="hero-section" element={<AdminBannerList />} />
            <Route path="hero-section/upload" element={<AdminBannerAdd />} />
            <Route path="products" element={<AdminProduct />} />
            <Route path="products/add" element={<AdminProductAdd />} />
            <Route path="products/edit/:productId" element={<AdminProductEdit />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="settings" element={<AdminSettings />} />

          </Route>
        </Route>

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<NotAuthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
