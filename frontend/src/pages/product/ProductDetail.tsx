import { FaChevronLeft, FaChevronRight, FaFlag, FaStar } from "react-icons/fa";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/product/ProductDetail.css";

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
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams();
  const [isBuyFormOpen, setIsBuyFormOpen] = useState(false);
  const [buyerNote, setBuyerNote] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState(
    "Gặp trực tiếp tại trường",
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [id]);

  useEffect(() => {
    // Khóa cuộn nền khi form đặt mua đang mở để tránh người dùng cuộn ra phía sau modal.
    document.body.style.overflow = isBuyFormOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isBuyFormOpen]);

  const openBuyForm = () => {
    setIsBuyFormOpen(true);
  };

  const closeBuyForm = () => {
    setIsBuyFormOpen(false);
  };

  const handleBuySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Frontend-only: hiện tại chưa gọi backend, nên chỉ đóng form sau khi người dùng xác nhận.
    setIsBuyFormOpen(false);
    window.alert("Đã gửi yêu cầu đặt mua.");
  };

  // demo frontend: chưa có backend nên dùng dữ liệu giả cố định
  const product = { ...mockProduct, id: id ?? mockProduct.id };

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        avatarUrl="/images/avatar.jpg"
        userName="Nguyễn Lan Anh"
      />

      <div className="product-detail-page">
        <div className="detail-backbar" onClick={() => navigate(-1)}>
          <div className="container-fluid px-4 d-flex align-items-center gap-2">
            <FaChevronLeft size={25} />
            <span>Quay lại</span>
          </div>
        </div>

        <div className="container-fluid px-4 mt-2">
          <div className="detail-top-card">
            <div className="detail-gallery">
              <button
                className="gallery-arrow left"
                type="button"
                aria-label="Ảnh trước"
              >
                <FaChevronLeft />
              </button>

              <div className="gallery-image-wrap">
                <img
                  src="/images/detail.png"
                  className="gallery-img"
                  alt={product.name}
                />
              </div>

              <button
                className="gallery-arrow right"
                type="button"
                aria-label="Ảnh sau"
              >
                <FaChevronRight />
              </button>

              <div className="gallery-count">1/1</div>
            </div>

            <div className="detail-main-info">
              <div className="detail-title-row">
                <h1 className="detail-title">{product.name}</h1>
                <button
                  className="report-btn"
                  type="button"
                  aria-label="Báo cáo sản phẩm"
                >
                  <FaFlag />
                </button>
              </div>

              <p className="detail-price">{product.price}</p>

              <div className="seller-row">
                <div className="seller-avatar">NL</div>

                <div className="seller-meta">
                  <div className="seller-name-wrap">
                    <p className="seller-name">{product.seller}</p>
                    <span className="seller-badge">{product.badge}</span>
                  </div>

                  <div className="seller-rating-wrap">
                    <div className="seller-stars">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <FaStar key={index} />
                      ))}
                    </div>
                    <span className="seller-rating">{product.rating}</span>
                    <span className="seller-reviews">{product.reviews}</span>
                  </div>

                  <p className="seller-school">{product.schoolYear}</p>
                </div>

                <button className="seller-page-btn" type="button">
                  Xem trang
                </button>
              </div>

              <div className="detail-action-row">
                <button className="buy-btn" type="button" onClick={openBuyForm}>
                  Đặt mua
                </button>
                <button className="chat-btn" type="button">
                  Nhắn tin
                </button>
              </div>
            </div>
          </div>

          <div className="detail-bottom-grid">
            <div className="detail-block">
              <h2 className="detail-block-title">Mô tả</h2>
              <p className="detail-desc">{product.description}</p>
            </div>

            <div className="detail-block">
              <h2 className="detail-block-title">Thông tin chi tiết</h2>

              <div className="detail-row-item">
                <span>Tình trạng:</span>
                <span>{product.condition}</span>
              </div>

              <div className="detail-row-item">
                <span>Trường:</span>
                <span>{product.school}</span>
              </div>

              <div className="detail-row-item no-border">
                <span>Địa điểm giao:</span>
                <span>{product.location}</span>
              </div>
            </div>
          </div>
        </div>

        {isBuyFormOpen && (
          <div className="buy-modal-overlay" onClick={closeBuyForm}>
            <div
              className="buy-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="buy-modal-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="buy-modal-header">
                <h2 id="buy-modal-title">Xác nhận đặt mua</h2>
                <button
                  type="button"
                  className="buy-modal-close"
                  onClick={closeBuyForm}
                  aria-label="Đóng form đặt mua"
                >
                  ×
                </button>
              </div>

              <div className="buy-modal-product">
                <img
                  src="/images/detail.png"
                  alt={product.name}
                  className="buy-modal-product-image"
                />

                <div className="buy-modal-product-info">
                  <h3>{product.name}</h3>
                  <p>{product.price}</p>
                </div>
              </div>

              <p className="buy-modal-note">
                Yêu cầu của bạn sẽ được gửi đến{" "}
                <strong>{product.seller}</strong>. Người bán sẽ xác nhận hoặc từ
                chối trong vòng 24h.
              </p>

              <form className="buy-modal-form" onSubmit={handleBuySubmit}>
                <label htmlFor="buyer-note">Ghi chú cho người bán</label>
                <textarea
                  id="buyer-note"
                  value={buyerNote}
                  onChange={(event) => setBuyerNote(event.target.value)}
                  placeholder="VD: Mình ở KTX A, có thể gặp ở cổng trường chiều T5..."
                  rows={4}
                />

                <label htmlFor="delivery-method">Hình thức giao nhận</label>
                <select
                  id="delivery-method"
                  value={deliveryMethod}
                  onChange={(event) => setDeliveryMethod(event.target.value)}
                >
                  <option>Gặp trực tiếp tại trường</option>
                  <option>Nhờ ship nội thành</option>
                  <option>Hẹn giao tại địa điểm khác</option>
                </select>

                <div className="buy-modal-actions">
                  <button type="submit" className="buy-modal-submit">
                    Gửi yêu cầu đặt mua
                  </button>
                  <button
                    type="button"
                    className="buy-modal-cancel"
                    onClick={closeBuyForm}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
