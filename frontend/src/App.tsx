import { Routes, Route, Outlet } from "react-router-dom";
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
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<RegisterOTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/faq" element={<FAQ />} />
      <Route path="/about" element={<About />} />
      <Route path="/profile" element={<Profile />} />

      <Route path="/product/:id" element={<ProductDetail />} />

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

      <Route path="*" element={<div>Trang đang được phát triển.</div>} />
    </Routes>
  );
}

export default App;