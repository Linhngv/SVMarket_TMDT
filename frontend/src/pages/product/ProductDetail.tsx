import { FaChevronLeft, FaChevronRight, FaFlag, FaStar } from "react-icons/fa";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/product/ProductDetail.css";

import { useAuth } from "../../context/AuthContext";

type ProductInfo = {
  id: string;
  name: string;
  price: string;
  seller: string;
  badge: string;
  rating: string;
  reviews: string;
  schoolYear: string;
  description: string;
  condition: string;
  school: string;
  location: string;
};

const mockProduct: ProductInfo = {
  id: "1",
  name: "Giáo trình Kinh tế vi mô - ĐH Kinh tế",
  price: "35.000đ",
  seller: "Nguyễn Lan Anh",
  badge: "Uy tín",
  rating: "5.0",
  reviews: "18 đánh giá",
  schoolYear: "UEH K2022",
  description:
    "Sách còn đẹp, không rách, có ghi chú tay một số trang. Mua hồi năm 1 giờ học xong không cần nữa. SV UEH ưu tiên.",
  condition: "Đã qua sử dụng",
  school: "ĐH Kinh tế TP.HCM (UEH)",
  location: "Cổng UEH Nguyễn Đình Chiểu",
};

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { user, isLoggedIn } = useAuth();

  const avatarUrl =
    user?.avatar || "/images/avatar_default.jpg";

  const userName = user?.fullName || "Khách";

  // UI state
  const [isBuyFormOpen, setIsBuyFormOpen] = useState(false);
  const [buyerNote, setBuyerNote] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState(
    "Gặp trực tiếp tại trường"
  );

  // scroll top when id changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [id]);

  // lock scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isBuyFormOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isBuyFormOpen]);

  const openBuyForm = () => setIsBuyFormOpen(true);
  const closeBuyForm = () => setIsBuyFormOpen(false);

  const handleBuySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsBuyFormOpen(false);
    window.alert("Đã gửi yêu cầu đặt mua.");
  };

  const product = { ...mockProduct, id: id ?? mockProduct.id };

  return (
    <>
      {/* HEADER*/}
      <Header
        isLoggedIn={isLoggedIn}
        avatarUrl={avatarUrl}
        userName={userName}
      />

      <div className="product-detail-page">
        {/* BACK */}
        <div className="detail-backbar" onClick={() => navigate(-1)}>
          <div className="container-fluid px-4 d-flex align-items-center gap-2">
            <FaChevronLeft size={25} />
            <span>Quay lại</span>
          </div>
        </div>

        {/* TOP */}
        <div className="container-fluid px-4 mt-2">
          <div className="detail-top-card">

            {/* GALLERY */}
            <div className="detail-gallery">
              <button className="gallery-arrow left">
                <FaChevronLeft />
              </button>

              <div className="gallery-image-wrap">
                <img
                  src="/images/detail.png"
                  className="gallery-img"
                  alt={product.name}
                />
              </div>

              <button className="gallery-arrow right">
                <FaChevronRight />
              </button>

              <div className="gallery-count">1/1</div>
            </div>

            {/* INFO */}
            <div className="detail-main-info">
              <div className="detail-title-row">
                <h1 className="detail-title">{product.name}</h1>
                <button className="report-btn">
                  <FaFlag />
                </button>
              </div>

              <p className="detail-price">{product.price}</p>

              <div className="seller-row">
                <div className="seller-avatar">
                  {product.seller.slice(0, 2).toUpperCase()}
                </div>

                <div className="seller-meta">
                  <div className="seller-name-wrap">
                    <p className="seller-name">{product.seller}</p>
                    <span className="seller-badge">{product.badge}</span>
                  </div>

                  <div className="seller-rating-wrap">
                    <div className="seller-stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <span>{product.rating}</span>
                    <span>{product.reviews}</span>
                  </div>

                  <p className="seller-school">{product.schoolYear}</p>
                </div>

                <button className="seller-page-btn">Xem trang</button>
              </div>

              <div className="detail-action-row">
                <button className="buy-btn" onClick={openBuyForm}>
                  Đặt mua
                </button>
                <button className="chat-btn">Nhắn tin</button>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="detail-bottom-grid">
            <div className="detail-block">
              <h2>Mô tả</h2>
              <p>{product.description}</p>
            </div>

            <div className="detail-block">
              <h2>Thông tin chi tiết</h2>

              <div className="detail-row-item">
                <span>Tình trạng:</span>
                <span>{product.condition}</span>
              </div>

              <div className="detail-row-item">
                <span>Trường:</span>
                <span>{product.school}</span>
              </div>

              <div className="detail-row-item no-border">
                <span>Địa điểm:</span>
                <span>{product.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL */}
        {isBuyFormOpen && (
          <div className="buy-modal-overlay" onClick={closeBuyForm}>
            <div
              className="buy-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="buy-modal-header">
                <h2>Xác nhận đặt mua</h2>
                <button onClick={closeBuyForm}>×</button>
              </div>

              <div className="buy-modal-product">
                <img src="/images/detail.png" />
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.price}</p>
                </div>
              </div>

              <p>
                Gửi yêu cầu đến <strong>{product.seller}</strong>
              </p>

              <form onSubmit={handleBuySubmit}>
                <label>Ghi chú</label>
                <textarea
                  value={buyerNote}
                  onChange={(e) => setBuyerNote(e.target.value)}
                />

                <label>Giao nhận</label>
                <select
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                >
                  <option>Gặp trực tiếp tại trường</option>
                  <option>Nhờ ship nội thành</option>
                  <option>Hẹn địa điểm khác</option>
                </select>

                <button type="submit">Gửi yêu cầu</button>
                <button type="button" onClick={closeBuyForm}>
                  Hủy
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}