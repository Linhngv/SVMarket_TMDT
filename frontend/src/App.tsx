import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import AdminCategory from "./pages/admin/CategoryManagement/AdminCategoryList";
import AdminUserList from "./pages/admin/UserManagement/AdminUserList";
import AdminUserStatus from "./pages/admin/UserManagement/AdminUserStatus";
import ChangePassword from "./pages/ChangePassword";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SellerProfile from "./pages/SellerProfile";
import SavedListings from "./pages/listing/SavedListings";
import SellerReviews from "./pages/SellerReviews";
import BuyerReviews from "./pages/BuyerReviews";
import MyReview from "./pages/MyReview";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<RegisterOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/seller-profile/:id" element={<SellerProfile />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/my-review" element={<MyReview />} />

        <Route path="/saved-listings" element={<SavedListings />} />

        <Route element={<UserAreaLayout />}>
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/my-listings/:id/edit" element={<EditListing />} />
          <Route path="/purchase-history" element={<PurchaseHistory />} />
          <Route path="/sales-history" element={<SalesHistory />} />
          <Route path="/reviews/seller" element={<SellerReviews />} />
          <Route path="/reviews/buyer" element={<BuyerReviews />} />
          <Route path="/my-packages" element={<MyPackages />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>

        <Route path="/payment/:orderId" element={<Payment />} />

        <Route path="/admin/posts" element={<AdminPostList />} />
        <Route path="/admin/duyet-bai" element={<AdminPostApproval />} />
        <Route path="/admin/vi-pham" element={<AdminViolationList />} />

        <Route path="/admin/packages" element={<AdminPackage />} />
        <Route path="/admin/categories" element={<AdminCategory />} />
        <Route path="/admin/users" element={<AdminUserList />} />
        <Route path="/admin/status/:id" element={<AdminUserStatus />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="*" element={<div>Trang đang được phát triển.</div>} />
      </Routes>
    </>
  );
}

export default App;
