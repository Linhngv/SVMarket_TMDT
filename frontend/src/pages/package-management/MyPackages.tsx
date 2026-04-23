import "../../styles/MyPackages.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

interface PackagePlan {
  id: number;
  name: string;
  price: number;
  postLimit: number;
  pushLimit: number;
  pushHours: number;
  durationDays: number;
  priorityLevel: number;
}

interface SellerPackage {
  id: number;
  packageName: string;
  remainingPosts: number;
  remainingPushes: number;
  postLimit: number;
  pushLimit: number;
  startDate: string;
  endDate: string;
}

interface History {
  baiDang: string;
  loaiGoi: string;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
}

const lichSuSuDung: History[] = [
  {
    baiDang: "Giáo trình Kinh tế vĩ mô",
    loaiGoi: "Gói Đẩy Tin Nhanh",
    thoiGianBatDau: "15:00 06/04/2026",
    thoiGianKetThuc: "15:05 06/04/2026",
  },
];

export default function PackagePlans() {
  const { token } = useAuth();
  const [packages, setPackages] = useState<PackagePlan[]>([]);
  const [myPackages, setMyPackages] = useState<SellerPackage[]>([]);
  const [statusMsg, setStatusMsg] = useState("");
  const [postLimit, setPostLimit] = useState<any>(null);

  const fetchPostLimit = () => {
    fetch("http://localhost:8080/api/listings/post-limit", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          console.error("SERVER ERROR:", text);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setPostLimit(data);
      })
      .catch(console.error);
  };

  // Lấy danh sách gói tin
  useEffect(() => {
    fetch("http://localhost:8080/api/package-plans")
      .then((res) => res.json())
      .then(setPackages)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (token) {
      fetchMyPackages();
      fetchPostLimit();
    }
  }, [token]);

  // Thông báo kết quả từ thanh toán
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    if (status === "success") {
      setStatusMsg("Thanh toán thành công! Gói đã được kích hoạt.");
      window.history.replaceState({}, "", "/my-packages");
      fetchMyPackages();
    } else if (status === "failed") {
      setStatusMsg("Thanh toán thất bại!");
    }
  }, []);

  // Hàm lấy danh sách gói tin của người dùng sau khi mua hoặc khi vào trang
  const fetchMyPackages = () => {
    fetch("http://localhost:8080/api/my-packages", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setMyPackages)
      .catch(console.error);
  };

  // Hàm xử lý khi người dùng nhấn "Mua ngay"
  const handlePayment = async (id: number) => {
    const returnUrl = window.location.origin;

    const res = await fetch(
      `http://localhost:8080/api/payment/create?packageId=${id}&returnUrl=${returnUrl}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const paymentUrl = await res.text();
    window.location.href = paymentUrl;
  };

  const activatePackage = (sellerPackageId: number) => {
    alert(`Kích hoạt gói #${sellerPackageId}`);
  };

  return (
    <div className="package-container">
      <h1 className="package-title">Gói tin sử dụng</h1>

      {statusMsg && <div className="status-message">{statusMsg}</div>}

      {postLimit && (
        <section className="active-packages-section">
          <h2 className="section-title">Lượt đăng miễn phí</h2>

          <div className="active-packages-grid">
            <div className="active-pkg-card free">
              <div className="active-pkg-expiry">Reset lại sau 30 ngày</div>

              <div className="usage-item">
                <div className="usage-label">
                  <span>📝 Lượt đăng</span>
                  <span className="usage-count">
                    <strong>{postLimit.freeRemaining}</strong> / 3
                  </span>
                </div>

                <div className="usage-bar-bg">
                  <div
                    className="usage-bar-fill"
                    style={{
                      width: `${(postLimit.freeRemaining / 3) * 100}%`,
                      backgroundColor: "#f59e0b",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== GÓI ĐANG SỬ DỤNG ===== */}
      {myPackages.length > 0 && (
        <section className="active-packages-section">
          <h2 className="section-title">Gói đang sử dụng</h2>
          <div className="active-packages-grid">
            {myPackages.map((sp) => {
              const endDate = new Date(sp.endDate);
              const now = new Date();
              const daysLeft = Math.max(
                0,
                Math.ceil(
                  (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
                ),
              );
              const isExpired = endDate < now;
              const postPercent = Math.round(
                (sp.remainingPosts / sp.postLimit) * 100,
              );
              const pushPercent = Math.round(
                (sp.remainingPushes / sp.pushLimit) * 100,
              );

              return (
                <div
                  key={sp.id}
                  className={`active-pkg-card ${isExpired ? "expired" : ""}`}
                >
                  {/* Header */}
                  <div className="active-pkg-header">
                    <span className="active-pkg-name">{sp.packageName}</span>
                    <span
                      className={`active-pkg-status ${isExpired ? "tag-expired" : "tag-active"}`}
                    >
                      {isExpired ? "Hết hạn" : "Đang hoạt động"}
                    </span>
                  </div>

                  {/* Ngày hết hạn */}
                  <div className="active-pkg-expiry">
                    📅 Hết hạn:{" "}
                    <strong>
                      {endDate.toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </strong>
                    {!isExpired && (
                      <span className="days-left"> — còn {daysLeft} ngày</span>
                    )}
                  </div>

                  {/* Lượt đăng tin */}
                  <div className="usage-item">
                    <div className="usage-label">
                      <span>📝 Lượt đăng tin</span>
                      <span className="usage-count">
                        <strong>{sp.remainingPosts}</strong> / {sp.postLimit}
                      </span>
                    </div>
                    <div className="usage-bar-bg">
                      <div
                        className="usage-bar-fill"
                        style={{
                          width: `${postPercent}%`,
                          backgroundColor: "#4f46e5",
                        }}
                      />
                    </div>
                  </div>

                  {/* Lượt đẩy tin */}
                  <div className="usage-item">
                    <div className="usage-label">
                      <span>🚀 Lượt đẩy tin</span>
                      <span className="usage-count">
                        <strong>{sp.remainingPushes}</strong> / {sp.pushLimit}
                      </span>
                    </div>
                    <div className="usage-bar-bg">
                      <div
                        className="usage-bar-fill"
                        style={{
                          width: `${pushPercent}%`,
                          backgroundColor: "#10b981",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="section-title">Kho gói tin của tôi</h2>

        <div className="plans-grid">
          {packages.map((pkg) => {
            const purchased = myPackages.find((sp) => sp.id === pkg.id);
            const hasPurchased = myPackages.length > 0;
            const isPopular = pkg.priorityLevel === 2;

            return (
              <div
                key={pkg.id}
                className={`plan-card ${isPopular ? "popular" : ""}`}
              >
                {isPopular && (
                  <span className="badge-popular">Phổ biến nhất</span>
                )}

                <div className="plan-name">{pkg.name}</div>
                <div className="plan-price">
                  {pkg.price.toLocaleString("vi-VN")}đ
                </div>
                <div className="plan-period">VNĐ / {pkg.durationDays} ngày</div>

                <hr className="plan-divider" />

                <ul className="plan-features">
                  <li>
                    <span className="check-icon">✓</span>
                    <span>
                      <strong>{pkg.postLimit} bài</strong> đăng tin
                    </span>
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    <span>
                      <strong>{pkg.pushLimit} lượt</strong> đẩy tin
                    </span>
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    <span>
                      Hiệu lực <strong>{pkg.pushHours}h</strong> / lượt
                    </span>
                  </li>
                  {pkg.priorityLevel === 3 && (
                    <li>
                      <span className="check-icon">✓</span>
                      <span>
                        Xuất hiện mục <strong>Đề xuất</strong>
                      </span>
                    </li>
                  )}
                </ul>

                {purchased ? (
                  <button
                    className="btn-activate"
                    onClick={() => activatePackage(purchased.id)}
                  >
                    Kích hoạt
                  </button>
                ) : (
                  <button
                    className={`btn-buy ${isPopular ? "primary" : ""}`}
                    disabled={hasPurchased}
                    style={
                      hasPurchased
                        ? { opacity: 0.4, cursor: "not-allowed" }
                        : {}
                    }
                    onClick={() => !hasPurchased && handlePayment(pkg.id)}
                  >
                    Mua ngay — {pkg.price.toLocaleString("vi-VN")}đ
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="history-section">
        <h2 className="section-title">
          Lịch sử &amp; Trạng thái sử dụng (Dữ liệu demo)
        </h2>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bài đăng</th>
                <th>Loại gói</th>
                <th>Thời gian bắt đầu</th>
                <th>Thời gian kết thúc</th>
              </tr>
            </thead>
            <tbody>
              {lichSuSuDung.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.baiDang}</td>
                  <td>
                    <span className="package-tag">{item.loaiGoi}</span>
                  </td>
                  <td className="time-text">{item.thoiGianBatDau}</td>
                  <td className="time-text">{item.thoiGianKetThuc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
