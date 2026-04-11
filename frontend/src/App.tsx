import Header from "./components/Header";
import Banner from "./components/Banner";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Footer from "./components/Footer";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Login from "./pages/Login";

function App() {
  // Kiểm tra xem có token trong localStorage không
  const isLoggedIn = !!localStorage.getItem("token"); 
  const path = window.location.pathname;
  if (path === "/faq") {
    return <FAQ />;
  }
  if (path === "/login") {
    return <Login />;
  }
  if (path === "/about") {
    return <About />;
  }


  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        avatarUrl="/images/avatar.jpg"
        userName="Nguyễn Lan Anh"
      />

      <div>
        <Banner />
      </div>

      <div className="container-fluid px-4 mt-3">
        <Categories />
        <Products title="Tất cả bài đăng" />
        <Products title="Đề xuất sản phẩm" />
      </div>

      <Footer />
    </>
  );
}

export default App;