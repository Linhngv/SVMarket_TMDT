import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Header";
import Banner from "./components/Banner";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Footer from "./components/Footer";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterOTP from "./pages/RegisterOTP";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";

import ProductDetail from "./pages/product/ProductDetail";

import PurchaseHistory from "./pages/PurchaseHistory";
import SalesHistory from "./pages/SalesHistory";
import Sidebar from "./components/sidebar/user/Sidebar";


function App() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <Routes>
      {/* HOME */}
      <Route
        path="/"
        element={
          <>
            <Header
              isLoggedIn={isLoggedIn}
              avatarUrl="/images/avatar.jpg"
              userName="Nguyễn Lan Anh"
            />
            <Banner />
            <div className="container-fluid px-4 mt-3">
              <Categories />
              <Products title="Tất cả bài đăng" />
              <Products title="Đề xuất sản phẩm" />
            </div>
            <Footer />
          </>
        }
      />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<RegisterOTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* OTHER */}
      <Route path="/faq" element={<FAQ />} />
      <Route path="/about" element={<About />} />
      <Route path="/profile" element={<Profile />} />

      <Route path="/product/:id" element={<ProductDetail />} />


      <Route
        element={
          <>
         
            <div className="layout">
              <Sidebar />
              <main className="main">
                <Outlet />
              </main>
            </div>

           
          </>
        }
      >
        <Route path="/purchase-history" element={<PurchaseHistory />} />
        <Route path="/sales-history" element={<SalesHistory />} />
      </Route>

      <Route path="*" element={<div>Trang đang được phát triển.</div>} />

    </Routes>
  );
}

export default App;
