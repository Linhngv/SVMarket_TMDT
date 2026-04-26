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
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
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

  useEffect(() => {
    if (resolvedIsLoggedIn) {
      const fetchNotifications = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;
          const res = await fetch(
            "http://localhost:8080/api/notifications/my",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (res.ok) {
            const data = await res.json();
            setNotifications(data);
          }
        } catch (error) {
          console.error("Lỗi lấy thông báo:", error);
        }
      };
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [resolvedIsLoggedIn]);

  const rawAvatar = avatarUrl || user?.avatar;
  const avatar =
    rawAvatar && rawAvatar.trim() !== ""
      ? rawAvatar.startsWith("/images/") || rawAvatar.startsWith("http")
        ? rawAvatar
        : `http://localhost:8080/${rawAvatar.replace(/^\/+/, "")}`
      : "/images/avatar_default.jpg";

  const resolvedUserName = userName || user?.fullName;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Hàm gọi API đánh dấu tất cả là đã đọc
  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        "http://localhost:8080/api/notifications/mark-read",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.ok) {
        // Cập nhật lại UI ngay lập tức
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.error("Lỗi đánh dấu đã đọc:", error);
    }
  };

  // Hàm gọi API đánh dấu 1 thông báo cụ thể là đã đọc và điều hướng
  const handleNotificationClick = async (note: any) => {
    if (!note.isRead) {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await fetch(
            `http://localhost:8080/api/notifications/${note.id}/read`,
            {
              method: "PUT",
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          setNotifications((prev) =>
            prev.map((n) => (n.id === note.id ? { ...n, isRead: true } : n)),
          );
        }
      } catch (error) {
        console.error("Lỗi đánh dấu đã đọc:", error);
      }
    }

    if (note.type === "PAYMENT" || note.content.includes("đã chấp nhận")) {
      navigate(`/purchase-history`);
      setShowNotifications(false);
    } else if (note.type === "ORDER") {
      navigate("/sales-history");
      setShowNotifications(false);
    } else if (note.type === "REVIEW") {
      navigate("/reviews/buyer");
      setShowNotifications(false);
    } else if (note.type === "REVIEW_REPLY") {
      navigate("/reviews/seller");
      setShowNotifications(false);
    }
  };

  // Hàm tính toán và hiển thị thời gian trôi qua
  const formatTimeAgo = (dateValue: any) => {
    if (!dateValue) return "";
    let date: Date;
    if (Array.isArray(dateValue)) {
      date = new Date(
        dateValue[0],
        dateValue[1] - 1,
        dateValue[2],
        dateValue[3] || 0,
        dateValue[4] || 0,
        dateValue[5] || 0,
      );
    } else {
      date = new Date(dateValue);
    }
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return "Vừa xong";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} ngày trước`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} tháng trước`;
    return `${Math.floor(diffInDays / 365)} năm trước`;
  };

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
    navigate("/profile");
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
          <span style={{ color: "var(--primary)" }}>SV</span>
          <span style={{ color: "var(--gold)" }}>Marketplace</span>
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

          {/* KHU VỰC CHUÔNG THÔNG BÁO */}
          <div style={{ position: "relative" }}>
            <div
              className="icon-btn"
              style={{ position: "relative" }}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={18} />

              {/* CHẤM ĐỎ */}
              {unreadCount > 0 && <span className="notification-dot"></span>}
            </div>

            {/* DROPDOWN HIỂN THỊ THÔNG BÁO */}
            {showNotifications && (
              <div className="notification-dropdown">
                {/* Dấu nhọn chỉa lên */}
                <div className="notification-arrow"></div>

                <div className="notification-item">
                  <h6>Thông báo</h6>
                  {unreadCount > 0 && (
                    <span onClick={handleMarkAllAsRead}>
                      Đánh dấu là đã đọc
                    </span>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <p className="text-muted text-center m-0">
                    Không có thông báo nào
                  </p>
                ) : (
                  notifications.map((note) => (
                    <div
                      key={note.id}
                      className="notification-note"
                      style={{
                        backgroundColor: note.isRead
                          ? "transparent"
                          : "var(--light-green)",
                      }}
                      onClick={() => handleNotificationClick(note)}
                    >
                      {/* Nút tròn màu xanh lá */}
                      <div
                        className="dot-green"
                        style={{
                          backgroundColor: note.isRead
                            ? "transparent"
                            : "var(--primary)",
                        }}
                      ></div>

                      {/* Nội dung thông báo */}
                      <div className="notification-content">
                        {note.content.includes(" muốn mua ") ? (
                          <>
                            <strong>
                              {note.content.substring(
                                0,
                                note.content.indexOf(" muốn mua "),
                              )}
                            </strong>{" "}
                            muốn mua{" "}
                            <strong>
                              {note.content.substring(
                                note.content.indexOf(" muốn mua ") + 10,
                              )}
                            </strong>
                          </>
                        ) : (
                          note.content
                        )}
                        <div className="notification-time">
                          {formatTimeAgo(note.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
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
        <button type="button" onClick={() => onNavigate("/saved-listings")}>
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
              {
                label: "Đơn hàng đã mua",
                icon: <FileText size={16} />,
                onClick: () => { navigate("/purchase-history"); onClose(); }
              },
              { 
                label: "Đánh giá từ tôi", 
                icon: <Star size={16} />,
                onClick: () => { navigate("/my-review"); onClose(); }
              },
            ]}
          />

          <PopupSection
            title="Dịch vụ trả phí"
            items={[
              { label: "Lịch sử giao dịch", icon: <History size={16} /> },
              {
                label: "Gói đăng tin", icon: <Package size={16} />,
                onClick: () => { navigate("/my-packages"); onClose(); }
              },
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
            style={{ cursor: item.onClick ? "pointer" : "default" }}
            onClick={item.onClick}
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
