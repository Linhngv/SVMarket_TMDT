import Header from "../components/Header";
import Banner from "../components/Banner";
import Categories from "../components/Categories";
import Products from "../components/Products";
import Footer from "../components/Footer";


function Home() {

    return (
        <>
            <Header />

            <Banner />

            <div className="container-fluid px-4 mt-3">
                <Categories />
                <Products title="Tất cả bài đăng" />
                <Products title="Đề xuất sản phẩm" />
            </div>

            <Footer />
        </>
    );
}

export default Home;