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

type Props = {
  title: string;
};

const featuredItems = Array(8).fill({
  title: "Giáo trình Kinh tế vi mô",
  price: "35.000đ",
  university: "UEH • 30 phút trước",
  image: "",
});

const universityMap: Record<string, string> = {
  UEH: "ĐH Kinh tế",
  HCMUS: "ĐH Khoa học Tự nhiên",
  UIT: "ĐH CNTT",
  NLU: "ĐH Nông Lâm",
  HCMUTE: "ĐH Sư phạm Kỹ thuật",
  HCMUSSH: "ĐH KHXH&NV",
  HUFLIT: "ĐH Ngoại ngữ - Tin học",
  HCMUE: "ĐH Mở",
};

const getUniversityName = (university: string) => {
  const code = university.split(" • ")[0];
  return universityMap[code] || code;
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

type CardItem = {
  key: string | number;
  id?: number;
  title: string;
  price: string;
  university: string;
  image: string;
};

export default function Products({ title }: Props) {
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [selected, setSelected] = useState("Mới nhất");
  const [activeListings, setActiveListings] = useState<ListingSummary[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const showActiveListings = title === "Tất cả bài đăng";

  useEffect(() => {
    if (!showActiveListings) {
      return;
    }

    const loadActiveListings = async () => {
      try {
        const data = await fetchActiveListings();
        setActiveListings(data);
      } catch (error) {
        console.error("Khong the tai danh sach bai dang hoat dong", error);
      }
    };

    loadActiveListings();
  }, [showActiveListings]);

  useEffect(() => {
    if (!showActiveListings || !isLoggedIn) {
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
  }, [showActiveListings, isLoggedIn]);

  const items: CardItem[] = showActiveListings
    ? activeListings.map((listing) => ({
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
      }))
    : featuredItems.map((item, index) => ({
        key: index,
        title: item.title,
        price: item.price,
        university: item.university,
        image: item.image,
      }));

  const handleFavoriteClick = async (
    event: React.MouseEvent<HTMLDivElement>,
    item: CardItem,
    index: number,
  ) => {
    event.stopPropagation();

    if (!showActiveListings || !item.id) {
      setLikedItems((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index],
      );
      return;
    }

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

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

        <div className="filter-wrapper">
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
        {items.map((item, index) => (
          <div className="col-6 col-md-3 mb-3" key={item.key}>
            <div
              className="product-card"
              onClick={() => navigate(`/product/${item.id ?? index + 1}`)}
            >
              {/* HEART ICON */}
              <div
                className="product-heart"
                onClick={(event) => handleFavoriteClick(event, item, index)}
              >
                {(item.id ? favoriteIds.includes(item.id) : likedItems.includes(index)) ? (
                  <FaHeart />
                ) : (
                  <FaRegHeart />
                )}
              </div>

              {/* IMAGE */}
              <div className="product-img-wrapper">
                {item.image && (
                  <img
                    src={item.image}
                    alt=""
                    className="product-img"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}

                {/* PLACEHOLDER */}
                {!item.image && (
                  <div className="product-img-placeholder">
                    <FaImage size={24} />
                    <span>Ảnh sản phẩm</span>
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className="product-info">
                <h6 className="product-item-title">
                  {item.title}
                </h6>

                <p className="product-price">{item.price}</p>

                <small className="product-meta">{item.university}</small>

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
