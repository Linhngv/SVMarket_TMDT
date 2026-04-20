import { Routes, Route } from "react-router-dom";
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
import MyPackages from "./pages/package-management/MyPackages";
import Payment from "./pages/Payment";
import UserAreaLayout from "./components/sidebar/user/UserAreaLayout";
import CreateListing from "./pages/CreateListing";
import MyListings from "./pages/MyListings";
import EditListing from "./pages/EditListing";
import AdminPostList from "./pages/admin/PostManagement/AdminPostList";
import AdminPostApproval from "./pages/admin/PostManagement/AdminPostApproval";
import AdminViolationList from "./pages/admin/PostManagement/AdminViolationList";
import AdminPackage from "./pages/admin/AdminPackage";


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

      <Route element={<UserAreaLayout />}>
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/my-listings/:id/edit" element={<EditListing />} />
        <Route path="/purchase-history" element={<PurchaseHistory />} />
        <Route path="/sales-history" element={<SalesHistory />} />
        <Route path="/my-packages" element={<MyPackages />} />
      </Route>

      <Route path="/payment/:orderId" element={<Payment />} />

      <Route path="/admin/posts" element={<AdminPostList />} />
      <Route path="/admin/duyet-bai" element={<AdminPostApproval />} />
      <Route path="/admin/vi-pham" element={<AdminViolationList />} />

      <Route path="/admin/packages" element={<AdminPackage/>}/>

      <Route path="*" element={<div>Trang đang được phát triển.</div>} />
    </Routes>
  );
}

export default App;
