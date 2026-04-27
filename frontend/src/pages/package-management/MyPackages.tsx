import "../../styles/MyPackages.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { FilePenLine, CalendarDays, Rocket } from "lucide-react";
import type { PushHistory } from "../../types/PushHistory";
import type { PackagePlan } from "../../types/PackagePlan";
import type { SellerPackage } from "../../types/SellerPackage";
import {
  fetchPushHistory,
  pushListing,
  fetchPostLimit,
} from "../../services/listingService";
import { createPackagePayment } from "../../services/paymentService";
import {
  fetchPackagePlans,
  fetchMyPackages,
} from "../../services/packageService";

export default function PackagePlans() {
  const { token } = useAuth();
  const [packages, setPackages] = useState<PackagePlan[]>([]);
  const [myPackages, setMyPackages] = useState<SellerPackage[]>([]);
  const [statusMsg, setStatusMsg] = useState("");
  const [postLimit, setPostLimit] = useState<any>(null);
  const [pushHistory, setPushHistory] = useState<PushHistory[]>([]);

  // Hàm đẩy tin
  const handlePush = async (listingId: number) => {
    try {
      const data = await pushListing(listingId);

      toast.success(data.message || "Đẩy tin thành công");

      const history = await fetchPushHistory();
      setPushHistory(history);
    } catch (err: any) {
      toast.error(err.message || "Đẩy tin thất bại");
    }
  };

  // Tính xem có gói nào còn hạn không
  const hasActivePackage = myPackages.some(
    (sp) => new Date(sp.endDate) > new Date(),
  );

  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      try {
        const [pkgPlans, myPkgs, history, limit] = await Promise.all([
          fetchPackagePlans(),
          fetchMyPackages(),
          fetchPushHistory(),
          fetchPostLimit(),
        ]);

        setPackages(pkgPlans);
        setMyPackages(myPkgs);
        setPushHistory(history);
        setPostLimit(limit);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
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

  // Hàm xử lý khi người dùng nhấn "Mua ngay"
  const handlePayment = async (id: number) => {
    try {
      const returnUrl = window.location.origin;

      const paymentUrl = await createPackagePayment(id, returnUrl);

      window.location.href = paymentUrl;
    } catch (err: any) {
      toast.error(err.message || "Không thể tạo thanh toán");
    }
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
                  <span>
                    <FilePenLine size={18} /> Lượt đăng tin
                  </span>
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

      {/* Gói đang sử dụng */}
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
                    <CalendarDays size={18} /> Hết hạn:{" "}
                    <strong>
                      {endDate.toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </strong>
                    {/* {!isExpired && (
                      <span className="days-left"> — còn {daysLeft} ngày</span>
                    )} */}
                  </div>

                  {/* Lượt đăng tin */}
                  <div className="usage-item">
                    <div className="usage-label">
                      <span>
                        <FilePenLine size={18} /> Lượt đăng tin
                      </span>
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
                      <span>
                        <Rocket size={18} /> Lượt đẩy tin
                      </span>
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

      {/* Kho gói tin của tôi */}
      {!hasActivePackage && (
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
                  <div className="plan-period">
                    VNĐ / {pkg.durationDays} ngày
                  </div>

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
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Lịch sử & Trạng thái sử dụng */}
      <section className="history-section">
        <h2 className="section-title">Lịch sử &amp; Trạng thái sử dụng</h2>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bài đăng</th>
                <th>Loại gói</th>
                <th>Thời gian bắt đầu đẩy</th>
                <th>Thời gian hết hiệu lực</th>
                <th>Đẩy tin</th>
              </tr>
            </thead>
            <tbody>
              {pushHistory.map((item) => {
                const expiresAt = new Date(item.pushExpiresAt);
                const isPushExpired = new Date() > expiresAt;

                return (
                  <tr key={item.listingId}>
                    <td>{item.listingTitle}</td>
                    <td>
                      <span className="package-tag">{item.packageName}</span>
                    </td>
                    <td className="time-text">
                      {new Date(item.lastPushAt).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td
                      className="time-text"
                      style={{ color: isPushExpired ? "#888" : "#15803d" }}
                    >
                      {expiresAt.toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      {item.canPush ? (
                        <button
                          className="btn-push"
                          onClick={() => handlePush(item.listingId)}
                        >
                          Đẩy lại
                        </button>
                      ) : !isPushExpired ? (
                        <span className="push-msg warn">Còn hiệu lực</span>
                      ) : item.remainingPushes === 0 ? (
                        <span className="push-msg warn">Hết lượt đẩy</span>
                      ) : (
                        <span className="push-msg warn">Gói hết hạn</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {pushHistory.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      color: "#888",
                      padding: "20px",
                    }}
                  >
                    Chưa có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
