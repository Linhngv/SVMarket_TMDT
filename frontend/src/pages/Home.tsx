import Header from "../components/Header";
import Banner from "../components/Banner";
import Categories from "../components/Categories";
import Products from "../components/Products";
import RecommendedProducts from "../components/RecommendedProducts";
import Footer from "../components/Footer";
import { useState } from "react";

function Home() {
  // State lưu từ khóa tìm kiếm toàn cục
  const [searchKeyword, setSearchKeyword] = useState("");
  const [university, setUniversity] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();

  return (
    <>
      <Header />

      {/* Truyền props xuống Banner để cập nhật từ khóa */}
      <Banner
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        university={university}
        setUniversity={setUniversity}
      />

      <div className="container-fluid px-4 mt-3">
        <Categories 
          selectedCategoryId={categoryId}
          onSelectCategory={(id) => setCategoryId(prev => prev === id ? undefined : id)}
        />
        <RecommendedProducts />
        {/* Truyền từ khóa xuống Products */}
        <Products 
          title={"Tất cả bài đăng"} 
          searchKeyword={searchKeyword} 
          university={university}
          categoryId={categoryId}
        />
      </div>

      <Footer />
    </>
  );
}

export default Home;
