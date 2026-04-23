import { FaImage, FaHeart, FaRegHeart, FaAngleDown } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchActiveListings,
  ListingSummary,
} from "../services/listingService";
import {
  fetchMyFavoriteListingIds,
  toggleFavoriteListing,
} from "../services/favoriteService";
import { useAuth } from "../context/AuthContext";
import type { CardItem } from "../types/CardItem";

type Props = {
  title: string;
};

function formatRelativeTime(value?: string) {
  if (!value) {
    return "Mới đăng";
  }

  const createdAt = new Date(value);

  if (Number.isNaN(createdAt.getTime())) {
    return "Mới đăng";
  }

  const diffInMinutes = Math.max(
    0,
    Math.floor((Date.now() - createdAt.getTime()) / 60000),
  );

  if (diffInMinutes < 1) {
    return "Vừa xong";
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }

  return `${Math.floor(diffInHours / 24)} ngày trước`;
}

function formatCurrency(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}


// Nhận props searchKeyword từ Home
export default function Products({
  title,
  searchKeyword,
}: {
  title: string;
  searchKeyword: string;
}) {

  const [openFilter, setOpenFilter] = useState(false);
  const [selected, setSelected] = useState("Mới nhất");
  const [activeListings, setActiveListings] = useState<ListingSummary[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadActiveListings = async () => {
      try {
        const data = await fetchActiveListings();
        setActiveListings(data);
      } catch (error) {
        console.error("Không thể tải danh sách bài đăng hoạt động", error);
      }
    };

  // Tải lại khi đổi title hoặc khi searchKeyword thay đổi
  useEffect(() => {
    loadActiveListings(searchKeyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, searchKeyword]);

  useEffect(() => {
    if (!isLoggedIn) {
      setFavoriteIds([]);
      return;
    }

    const loadMyFavoriteIds = async () => {
      try {
        const ids = await fetchMyFavoriteListingIds();
        setFavoriteIds(ids);
      } catch (error) {
        console.error("Khong the tai danh sach bai dang da luu", error);
      }
    };

    loadMyFavoriteIds();
  }, [isLoggedIn]);

  const items: CardItem[] = activeListings.map((listing) => ({
    key: listing.id,
    id: listing.id,
    title: listing.title,
    price: formatCurrency(listing.price),
    university: `${listing.sellerUniversity || "SV Market"} • ${formatRelativeTime(listing.createdAt)}`,
    image: listing.thumbnailUrl
      ? listing.thumbnailUrl.startsWith("http")
        ? listing.thumbnailUrl
        : `http://localhost:8080${listing.thumbnailUrl}`
      : "",

    priorityLevel: listing.priorityLevel,
  }));

  const handleFavoriteClick = async (
    event: React.MouseEvent<HTMLDivElement>,
    item: CardItem,
  ) => {
    event.stopPropagation();

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!item.id) return;

    try {
      const result = await toggleFavoriteListing(item.id);
      setFavoriteIds((prev) =>
        result.favorited
          ? [...new Set([...prev, item.id as number])]
          : prev.filter((id) => id !== item.id),
      );
    } catch (error) {
      console.error("Khong the luu bai dang", error);
    }
  };

  return (
    <div className="product-section mt-4">
      <div className="product-header">
        <h5 className="product-title">{title}</h5>

        <div
          className="filter-wrapper"
          style={
            selected === "Giá thấp → cao" || selected === "Giá cao → thấp"
              ? { minWidth: "150px" }
              : undefined
          }
        >
          <div
            className="filter-btn"
            onClick={() => setOpenFilter(!openFilter)}
          >
            {selected}
            <FaAngleDown className="filter-icon" />
          </div>

          {openFilter && (
            <div className="filter-dropdown">
              {["Mới nhất", "Giá thấp → cao", "Giá cao → thấp"].map(
                (option) => (
                  <div
                    key={option}
                    className="filter-item"
                    onClick={() => {
                      setSelected(option);
                      setOpenFilter(false);
                    }}
                  >
                    {option}
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      {/* LIST */}
      <div className="row">
        {items.map((item) => (
          <div className="col-6 col-md-4 col-lg-3 mb-3" key={item.key}>
            <div
              className="product-card"
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <div
                className="product-heart"
                onClick={(event) => handleFavoriteClick(event, item)}
              >
                {item.id && favoriteIds.includes(item.id) ? (
                  <FaHeart />
                ) : (
                  <FaRegHeart />
                )}
              </div>

              <div className="product-img-wrapper">
                {/* Hiển thị cho gói VIP */}
                {item.priorityLevel === 3 && (
                  <div className="badge hot">
                    <span className="flame"></span>
                    TOP
                  </div>
                )}

                {/* Hiển thị cho Gói Sinh viên */}
                {item.priorityLevel === 2 && (
                  <>
                    <div className="featured-bottom">
                      <span>Tin ưu tiên</span>
                    </div>
                  </>
                )}

                {item.image && (
                  <img
                    src={item.image}
                    alt=""
                    className="product-img"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}

                {!item.image && (
                  <div className="product-img-placeholder">
                    <FaImage size={24} />
                    <span>Ảnh sản phẩm</span>
                  </div>
                )}
              </div>
    
              <div className="product-info">
                <h6 className="product-item-title" title={item.title}>{item.title}</h6>

                <p className="product-price" title={item.price}>{item.price}</p>

                <small className="product-meta" title={item.university}>{item.university}</small>

                <div className="product-action">
                  <button className="product-status-btn">Đã qua sử dụng</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
