import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/user/Home";
import FAQ from "./pages/user/FAQ";
import About from "./pages/user/About";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import RegisterOTP from "./pages/user/RegisterOTP";
import ForgotPassword from "./pages/user/ForgotPassword";
import Profile from "./pages/user/Profile";
import ProductDetail from "./pages/product/ProductDetail";
import PurchaseHistory from "./pages/user/PurchaseHistory";
import SalesHistory from "./pages/user/SalesHistory";
import MyPackages from "./pages/package-management/MyPackages";
import UpgradePackage from "./pages/package-management/UpgradePackage";
import SellerDashboard from "./pages/package-management/SellerDashboard";
import Payment from "./pages/user/Payment";
import UserAreaLayout from "./components/sidebar/user/UserAreaLayout";
import CreateListing from "./pages/user/CreateListing";
import MyListings from "./pages/user/MyListings";
import EditListing from "./pages/user/EditListing";
import AdminPostList from "./pages/admin/PostManagement/AdminPostList";
import AdminLayout from "./components/admin/AdminLayout";
import AdminPostApproval from "./pages/admin/PostManagement/AdminPostApproval";
import AdminViolationList from "./pages/admin/PostManagement/AdminViolationList";
import AdminPackage from "./pages/admin/AdminPackage";
import AdminCategory from "./pages/admin/CategoryManagement/AdminCategoryList";
import AdminUserList from "./pages/admin/UserManagement/AdminUserList";
import AdminUserStatus from "./pages/admin/UserManagement/AdminUserStatus";
import ChangePassword from "./pages/user/ChangePassword";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SellerProfile from "./pages/user/SellerProfile";
import SavedListings from "./pages/listing/SavedListings";
import SellerReviews from "./pages/user/SellerReviews";
import BuyerReviews from "./pages/user/BuyerReviews";
import MyReview from "./pages/user/MyReview";
import AdminTransactionList from "./pages/admin/TransactionManagement/AdminTransactionList";
import AdminStudentVerification from "./pages/admin/TrustManagement/AdminStudentVerification";
import AdminBannedKeywords from "./pages/admin/TrustManagement/AdminBannedKeywords";
import Messages from "./pages/user/Messages";
import AdminLogs from "./pages/admin/AdminLogs";
import Policy from "./pages/user/Policy"

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!pathname.startsWith('/admin')) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
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
        <Route path="/policy" element={<Policy />} />
        <Route path="/seller-profile/:id" element={<SellerProfile />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/messages" element={<Messages />} />
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
          <Route path="/dashboard" element={<SellerDashboard />} />
          <Route path="/upgrade-package" element={<UpgradePackage />} />
        </Route>

        <Route path="/payment/:orderId" element={<Payment />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminLayout breadcrumb="Trang chủ > Dashboard"><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/posts" element={<AdminLayout breadcrumb="Trang chủ > Bài đăng > Danh sách bài đăng"><AdminPostList /></AdminLayout>} />
        <Route path="/admin/duyet-bai" element={<AdminLayout breadcrumb="Trang chủ > Bài đăng > Kiểm duyệt bài đăng"><AdminPostApproval /></AdminLayout>} />
        <Route path="/admin/vi-pham" element={<AdminLayout breadcrumb="Trang chủ > Bài đăng > Danh sách vi phạm"><AdminViolationList /></AdminLayout>} />
        <Route path="/admin/khu-vuc" element={<AdminLayout breadcrumb="Trang chủ > Địa chỉ > Danh sách khu vực"><div>Khu vực</div></AdminLayout>} />
        <Route path="/admin/dia-chi" element={<AdminLayout breadcrumb="Trang chủ > Địa chỉ > Danh sách địa chỉ"><div>Địa chỉ</div></AdminLayout>} />
        <Route path="/admin/categories" element={<AdminLayout breadcrumb="Trang chủ > Danh mục > Danh sách danh mục"><AdminCategory /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout breadcrumb="Trang chủ > Người dùng > Danh sách người dùng"><AdminUserList /></AdminLayout>} />
        <Route path="/admin/status/:id" element={<AdminLayout breadcrumb="Trang chủ > Người dùng > Cập nhật trạng thái"><AdminUserStatus /></AdminLayout>} />
        <Route path="/admin/giao-dich" element={<AdminLayout breadcrumb="Trang chủ > Giao dịch > Danh sách giao dịch"><AdminTransactionList /></AdminLayout>} />
        <Route path="/admin/xac-thuc" element={<AdminLayout breadcrumb="Trang chủ > Tin cậy > Duyệt định danh"><AdminStudentVerification /></AdminLayout>} />
        <Route path="/admin/tu-khoa" element={<AdminLayout breadcrumb="Trang chủ > Tin cậy > Từ khóa cấm"><AdminBannedKeywords /></AdminLayout>} />
        <Route path="/admin/packages" element={<AdminLayout breadcrumb="Trang chủ > Gói tin > Danh sách gói tin"><AdminPackage /></AdminLayout>} />
        <Route path="/admin/logs" element={<AdminLayout breadcrumb="Trang chủ > Nhật ký hoạt động"><AdminLogs /></AdminLayout>} />

        <Route path="*" element={<div>Trang đang được phát triển.</div>} />
      </Routes>
    </>
  );
}

export default App;
