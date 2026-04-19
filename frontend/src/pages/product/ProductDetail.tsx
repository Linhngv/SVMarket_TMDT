import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaFlag, FaStar } from "react-icons/fa";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/product/ProductDetail.css";
import { useAuth } from "../../context/AuthContext";
import {
  fetchListingById,
  PublicListingDetail,
} from "../../services/listingService";

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isLoggedIn } = useAuth();

  const [isBuyFormOpen, setIsBuyFormOpen] = useState(false);
  const [buyerNote, setBuyerNote] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState(
    "Gặp trực tiếp tại trường",
  );
  const [product, setProduct] = useState<PublicListingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [id]);

  useEffect(() => {
    document.body.style.overflow = isBuyFormOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isBuyFormOpen]);

  useEffect(() => {
    if (!id) {
      setLoadError("Khong tim thay bai dang nay");
      setIsLoading(false);
      return;
    }

    const loadListing = async () => {
      try {
        setIsLoading(true);
        setLoadError("");
        const listing = await fetchListingById(Number(id));
        setProduct(listing);
      } catch (error) {
        console.error("Khong the tai chi tiet bai dang", error);
        setLoadError("Khong the tai chi tiet bai dang nay");
      } finally {
        setIsLoading(false);
      }
    };

    loadListing();
  }, [id]);

  const openBuyForm = () => setIsBuyFormOpen(true);
  const closeBuyForm = () => setIsBuyFormOpen(false);

  const handleBuySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoggedIn) {
      window.alert("Vui lòng đăng nhập để thực hiện đặt mua!");
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/orders/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          listingId: product?.id,
          note: buyerNote,
          deliveryMethod: deliveryMethod
        })
      });

      if (!response.ok) throw new Error("Lỗi khi gửi yêu cầu");

      setIsBuyFormOpen(false);
      window.alert("Đã gửi yêu cầu đặt mua. Người bán sẽ nhận được thông báo!");
    } catch (error) {
      console.error(error);
      window.alert("Có lỗi xảy ra khi gửi yêu cầu mua hàng.");
    }
  };

  const title = product?.title || "Đang tải...";
  const price = product
    ? `${new Intl.NumberFormat("vi-VN").format(product.price)}đ`
    : "";
  const sellerName = product?.sellerName || "Người bán";
  const sellerUniversity = product?.sellerUniversity || "SV Market";
  const description = product?.description || "Chưa có mô tả cho bài đăng này.";
  const condition = product?.conditionLevel || "Chưa cập nhật";
  const location = product?.deliveryAddress || "Chưa cập nhật địa điểm";

  const galleryImages =
    product?.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls
      : product?.thumbnailUrl
        ? [product.thumbnailUrl]
        : ["/images/detail.png"];

  const normalizedGalleryImages = galleryImages.map((url) =>
    url.startsWith("http") ? url : `http://localhost:8080${url}`,
  );

  const imageSrc =
    normalizedGalleryImages[
    Math.min(currentImageIndex, normalizedGalleryImages.length - 1)
    ] || "/images/detail.png";

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product?.id]);

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? normalizedGalleryImages.length - 1 : prev - 1,
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === normalizedGalleryImages.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <>
      <Header />

      <div className="product-detail-page">
        <div className="detail-backbar" onClick={() => navigate(-1)}>
          <div className="container-fluid px-4 d-flex align-items-center gap-2">
            <FaChevronLeft size={25} />
            <span>Quay lại</span>
          </div>
        </div>

        <div className="container-fluid px-4 mt-2">
          {isLoading && (
            <div className="detail-loading">Đang tải chi tiết sản phẩm...</div>
          )}

          {!isLoading && loadError && (
            <div className="detail-error">{loadError}</div>
          )}

          {!isLoading && !loadError && product && (
            <>
              <div className="detail-top-card">
                <div className="detail-gallery">
                  <button
                    type="button"
                    className="gallery-arrow left"
                    onClick={goToPreviousImage}
                    disabled={normalizedGalleryImages.length <= 1}
                  >
                    <FaChevronLeft />
                  </button>

                  <div className="gallery-image-wrap">
                    <img
                      src={imageSrc}
                      className="gallery-img"
                      alt={title}
                      onError={(event) => {
                        event.currentTarget.src = "/images/detail.png";
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    className="gallery-arrow right"
                    onClick={goToNextImage}
                    disabled={normalizedGalleryImages.length <= 1}
                  >
                    <FaChevronRight />
                  </button>

                  <div className="gallery-count">
                    {currentImageIndex + 1}/{normalizedGalleryImages.length}
                  </div>
                </div>

                <div className="detail-main-info">
                  <div className="detail-title-row">
                    <h1 className="detail-title">{title}</h1>
                    <button className="report-btn">
                      <FaFlag />
                    </button>
                  </div>

                  <p className="detail-price">{price}</p>

                  <div className="seller-row">
                    <div className="seller-avatar">
                      {sellerName.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="seller-meta">
                      <div className="seller-name-wrap">
                        <p className="seller-name">{sellerName}</p>
                        <span className="seller-badge">Người bán</span>
                      </div>

                      <div className="seller-rating-wrap">
                        <div className="seller-stars">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <FaStar key={index} />
                          ))}
                        </div>
                        <span>5.0</span>
                        <span>Đánh giá từ cộng đồng</span>
                      </div>

                      <p className="seller-school">{sellerUniversity}</p>
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

              <div className="detail-bottom-grid">
                <div className="detail-block">
                  <h2>Mô tả</h2>
                  <p>{description}</p>
                </div>

                <div className="detail-block">
                  <h2>Thông tin chi tiết</h2>

                  <div className="detail-row-item">
                    <span>Tình trạng:</span>
                    <span>{condition}</span>
                  </div>

                  <div className="detail-row-item">
                    <span>Trường:</span>
                    <span>{sellerUniversity}</span>
                  </div>

                  <div className="detail-row-item no-border">
                    <span>Địa điểm:</span>
                    <span>{location}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {isBuyFormOpen && product && (
          <div className="buy-modal-overlay" onClick={closeBuyForm}>
            <div
              className="buy-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="buy-modal-header">
                <h2>Xác nhận đặt mua</h2>
                <button className="buy-modal-close" onClick={closeBuyForm}>
                  ×
                </button>
              </div>

              <div className="buy-modal-product">
                <img
                  src={imageSrc}
                  alt={title}
                  className="buy-modal-product-image"
                  onError={(event) => {
                    event.currentTarget.src = "/images/detail.png";
                  }}
                />
                <div className="buy-modal-product-info">
                  <h3>{title}</h3>
                  <p>{price}</p>
                </div>
              </div>

              <p className="buy-modal-note">
                Yêu cầu của bạn sẽ được gửi đến <strong>{sellerName}</strong> <br /> Người bán sẽ xác nhận hoặc từ chối trong vòng 24h.
              </p>

              <form className="buy-modal-form" onSubmit={handleBuySubmit}>
                <label>Ghi chú</label>
                <textarea
                  value={buyerNote}
                  onChange={(event) => setBuyerNote(event.target.value)}
                />

                <label>Giao nhận</label>
                <select
                  value={deliveryMethod}
                  onChange={(event) => setDeliveryMethod(event.target.value)}
                >
                  <option>Gặp trực tiếp tại trường</option>
                  <option>Nhờ ship nội thành</option>
                  <option>Hẹn địa điểm khác</option>
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
