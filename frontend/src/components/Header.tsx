import {
  Heart,
  Bell,
  MessageCircle,
  ChevronDown,
  FileText,
  Star,
  History,
  Package,
  LogOut,
  User,
} from "lucide-react";

import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  favoritesUpdatedEvent,
  fetchMyFavoriteListings,
} from "../services/favoriteService";
import { ListingSummary } from "../services/listingService";

type HeaderProps = {
  isLoggedIn?: boolean;
  avatarUrl?: string;
  userName?: string;
};

export default function Header({
  isLoggedIn: isLoggedInProp,
  avatarUrl,
  userName,
}: HeaderProps) {
  const { isLoggedIn, user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [openFavorites, setOpenFavorites] = useState(false);
  const [favoriteListings, setFavoriteListings] = useState<ListingSummary[]>(
    [],
  );
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const favoriteRef = useRef<HTMLDivElement>(null);
  const favoriteCloseTimerRef = useRef<number | null>(null);
  const navigate = useNavigate();

  // click outside close popup
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // avatar fallback
  const resolvedIsLoggedIn = isLoggedInProp ?? isLoggedIn;

  const avatar =
    avatarUrl ||
    (user?.avatar && user.avatar.trim() !== ""
      ? `http://localhost:8080/${user.avatar.replace(/^\/+/, "")}`
      : "/images/avatar_default.jpg");

  const resolvedUserName = userName || user?.fullName;

  // Tai danh sach bai dang da luu de hien thi trong popup icon tim.
  const loadFavoriteListings = useCallback(async () => {
    if (!resolvedIsLoggedIn) {
      setFavoriteListings([]);
      return;
    }

    try {
      setLoadingFavorites(true);
      const data = await fetchMyFavoriteListings();
      setFavoriteListings(data);
    } catch (error) {
      console.error("Khong the tai danh sach bai dang da luu", error);
      setFavoriteListings([]);
    } finally {
      setLoadingFavorites(false);
    }
  }, [resolvedIsLoggedIn]);

  useEffect(() => {
    const handleFavoritesUpdated = () => {
      if (resolvedIsLoggedIn) {
        loadFavoriteListings();
      }
    };

    window.addEventListener(favoritesUpdatedEvent, handleFavoritesUpdated);
    return () => {
      window.removeEventListener(favoritesUpdatedEvent, handleFavoritesUpdated);
    };
  }, [loadFavoriteListings, resolvedIsLoggedIn]);

  const handleFavoritesMouseEnter = () => {
    if (favoriteCloseTimerRef.current) {
      window.clearTimeout(favoriteCloseTimerRef.current);
    }

    setOpenFavorites(true);
    if (resolvedIsLoggedIn) {
      loadFavoriteListings();
    }
  };

  const handleFavoritesMouseLeave = () => {
    favoriteCloseTimerRef.current = window.setTimeout(() => {
      setOpenFavorites(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (favoriteCloseTimerRef.current) {
        window.clearTimeout(favoriteCloseTimerRef.current);
      }
    };
  }, []);

  // Click avatar nho de vao trang quan ly bai dang.
  const handleAvatarClick = () => {
    if (!resolvedIsLoggedIn) {
      navigate("/login");
      return;
    }

    setOpen(false);
    navigate("/my-listings");
  };

  // Click nut Dang tin de vao trang tao bai dang.
  const handleCreateListingClick = () => {
    if (!resolvedIsLoggedIn) {
      navigate("/login");
      return;
    }

    navigate("/create-listing");
  };

  return (
    <div className="header shadow-sm">
      <div className="container-fluid px-4 d-flex justify-content-between align-items-center py-2">
        {/* LOGO */}
        <div
          className="fw-bold fs-5"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <span style={{ color: "#1B7A4A" }}>SV</span>
          <span style={{ color: "#D4A017" }}>Marketplace</span>
        </div>

        {/* RIGHT */}
        <div className="d-flex align-items-center gap-2">
          <div
            className="saved-listings-wrapper"
            ref={favoriteRef}
            onMouseEnter={handleFavoritesMouseEnter}
            onMouseLeave={handleFavoritesMouseLeave}
          >
            <div className="icon-btn">
              <Heart size={18} />
            </div>

            {openFavorites && (
              <SavedListingsPopup
                isLoggedIn={resolvedIsLoggedIn}
                isLoading={loadingFavorites}
                listings={favoriteListings}
                onNavigate={(path) => navigate(path)}
                onLogin={() => navigate("/login")}
              />
            )}
          </div>
          <div className="icon-btn">
            <Bell size={18} />
          </div>

          <button className="contact-btn rounded-pill px-3 d-flex align-items-center gap-2">
            <MessageCircle size={18} />
            Liên hệ
          </button>

          <button
            type="button"
            className="btn btn-success rounded-pill px-3"
            onClick={handleCreateListingClick}
          >
            Đăng tin
          </button>

          {/* AVATAR */}
          <div className="avatar-wrapper position-relative" ref={ref}>
            <div className="avatar d-flex align-items-center gap-1">
              {resolvedIsLoggedIn ? (
                <img
                  src={avatar}
                  alt="avatar"
                  onClick={handleAvatarClick}
                  style={{ cursor: "pointer" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/avatar_default.jpg";
                  }}
                />
              ) : (
                <User size={18} />
              )}

              <ChevronDown
                size={16}
                className={`arrow-icon ${open ? "rotate" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => setOpen((prev) => !prev)}
              />
            </div>

            {open && (
              <ProfilePopup
                isLoggedIn={resolvedIsLoggedIn}
                avatarUrl={avatar}
                userName={resolvedUserName}
                navigate={navigate}
                logout={logout}
                onClose={() => setOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type SavedListingsPopupProps = {
  isLoggedIn: boolean;
  isLoading: boolean;
  listings: ListingSummary[];
  onNavigate: (path: string) => void;
  onLogin: () => void;
};

function SavedListingsPopup({
  isLoggedIn,
  isLoading,
  listings,
  onNavigate,
  onLogin,
}: SavedListingsPopupProps) {
  if (!isLoggedIn) {
    return (
      <div className="saved-listings-popup">
        <div className="saved-listings-arrow"></div>
        <div className="saved-listings-body empty">
          Vui lòng đăng nhập để lưu bài đăng.
        </div>
        <button
          type="button"
          className="saved-listings-login-btn"
          onClick={onLogin}
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="saved-listings-popup">
      <div className="saved-listings-arrow"></div>

      <div className="saved-listings-header">
        <h6>Tin đăng đã lưu</h6>
        <button type="button" onClick={() => onNavigate("/my-listings")}>
          Xem tất cả
        </button>
      </div>

      <div className="saved-listings-body">
        {isLoading && <p className="saved-listings-empty">Đang tải...</p>}

        {!isLoading && listings.length === 0 && (
          <p className="saved-listings-empty">Bạn chưa lưu bài đăng nào.</p>
        )}

        {!isLoading &&
          listings.slice(0, 5).map((listing) => {
            const imageUrl = listing.thumbnailUrl
              ? listing.thumbnailUrl.startsWith("http")
                ? listing.thumbnailUrl
                : `http://localhost:8080${listing.thumbnailUrl}`
              : "/images/detail.png";

            return (
              <button
                key={listing.id}
                type="button"
                className="saved-listing-item"
                onClick={() => onNavigate(`/product/${listing.id}`)}
              >
                <img src={imageUrl} alt={listing.title} />
                <span>{listing.title}</span>
              </button>
            );
          })}
      </div>
    </div>
  );
}

type PopupProps = {
  isLoggedIn: boolean;
  avatarUrl: string;
  userName?: string;
  navigate: (path: string) => void;
  logout: () => void;
  onClose: () => void;
};

function ProfilePopup({
  isLoggedIn,
  avatarUrl,
  userName,
  navigate,
  logout,
  onClose,
}: PopupProps) {
  const handleLogout = () => {
    logout();
    onClose();
    navigate("/");
  };

  return (
    <div className="profile-popup">
      <div className="popup-arrow"></div>

      {/* USER INFO */}
      <div className="text-center">
        <div className="popup-avatar">
          <img
            src={avatarUrl}
            alt="avatar"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/avatar_default.jpg";
            }}
          />

          {isLoggedIn && (
            <div
              className="edit-icon"
              onClick={() => {
                navigate("/profile");
                onClose();
              }}
            >
              ✎
            </div>
          )}
        </div>

        <h6 className="mt-2 mb-1 fw-bold">{isLoggedIn ? userName : "Khách"}</h6>

        <small className="text-muted">
          {isLoggedIn ? "Đã đăng nhập" : "Chưa đăng nhập"}
        </small>
      </div>

      {/* MENU */}
      {isLoggedIn ? (
        <>
          <PopupSection
            title="Tiện ích"
            items={[
              { label: "Đơn hàng đã mua", icon: <FileText size={16} /> },
              { label: "Đánh giá từ tôi", icon: <Star size={16} /> },
            ]}
          />

          <PopupSection
            title="Dịch vụ trả phí"
            items={[
              { label: "Lịch sử giao dịch", icon: <History size={16} /> },
              { label: "Gói đăng tin", icon: <Package size={16} /> },
            ]}
          />

          <PopupSection
            title="Khác"
            items={[
              {
                label: "Đăng xuất",
                icon: <LogOut size={16} />,
                onClick: handleLogout,
              },
            ]}
            isLogout
          />
        </>
      ) : (
        <PopupSection
          title="Tài khoản"
          items={[
            {
              label: "Đăng nhập",
              icon: <User size={16} />,
              onClick: () => {
                navigate("/login");
                onClose();
              },
            },
          ]}
        />
      )}
    </div>
  );
}

type Item = {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
};

type SectionProps = {
  title: string;
  items: Item[];
  isLogout?: boolean;
};

function PopupSection({ title, items, isLogout = false }: SectionProps) {
  return (
    <div className="popup-section">
      <p className="section-title">{title}</p>

      <div className="popup-box">
        {items.map((item, index) => (
          <div
            key={index}
            className={`popup-row ${isLogout ? "logout" : ""}`}
            onClick={item.onClick}
            style={{ cursor: item.onClick ? "pointer" : "default" }}
          >
            <div className="d-flex align-items-center gap-2">
              {item.icon}
              <span>{item.label}</span>
            </div>

            <span>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
