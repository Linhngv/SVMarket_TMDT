import { Routes, Route, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

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
  // state token (reactive)
  const [token, setToken] = useState(localStorage.getItem("token"));

  // state user
  const [user, setUser] = useState<any>(null);

  // lắng nghe thay đổi localStorage (login/logout)
  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // gọi API /me khi token thay đổi
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    axios
      .get("http://localhost:8080/api/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Lỗi lấy user:", err);

        // ❗ token sai / hết hạn → logout luôn
        localStorage.removeItem("token");
        setUser(null);
      });
  }, [token]);

  const isLoggedIn = !!user;

  return (
    <Routes>
      {/* HOME */}
      <Route
        path="/"
        element={
          <>
            <Header
              isLoggedIn={isLoggedIn}
              avatarUrl={user?.avatar || "/images/avatar_default.jpg"}
              userName={user?.fullName || "Khách"}
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

      {/* USER LAYOUT */}
      <Route
        element={
          <div className="layout">
            <Sidebar />
            <main className="main">
              <Outlet />
            </main>
          </div>
        }
      >
        <Route path="/purchase-history" element={<PurchaseHistory />} />
        <Route path="/sales-history" element={<SalesHistory />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<div>Trang đang được phát triển.</div>} />
    </Routes>
  );
}

export default App;