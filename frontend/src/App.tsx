import { Routes, Route, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Home from "./pages/Home";

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
  // token state
  const [token, setToken] = useState(localStorage.getItem("token"));

  // user state
  const [user, setUser] = useState<any>(null);

  // listen localStorage change (login/logout)
  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // fetch user when token changes
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
          <Home
            isLoggedIn={isLoggedIn}
            avatarUrl={user?.avatar || "/images/avatar_default.jpg"}
            userName={user?.fullName || "Khách"}
          />
        }
      />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<RegisterOTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* OTHER PAGES */}
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