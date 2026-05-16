import "../../styles/user/MyPackages.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import type { PackagePlan } from "../../types/PackagePlan";
import type { SellerPackage } from "../../types/SellerPackage";
import { createPackagePayment } from "../../services/paymentService";
import {
  fetchPackagePlans,
  fetchMyPackages,
} from "../../services/packageService";

export default function UpgradePackage() {
  const { token } = useAuth();
  const [packages, setPackages] = useState<PackagePlan[]>([]);
  const [myPackages, setMyPackages] = useState<SellerPackage[]>([]);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      try {
        const [pkgPlans, myPkgs] = await Promise.all([
          fetchPackagePlans(),
          fetchMyPackages(),
        ]);

        setPackages(pkgPlans);
        setMyPackages(myPkgs);
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
      window.history.replaceState({}, "", "/upgrade-package");
      fetchMyPackages().then(setMyPackages);
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
      <h1 className="package-title">Nâng cấp gói tin</h1>

      {statusMsg && <div className="status-message">{statusMsg}</div>}

      <section>
        <h2 className="section-title">Kho gói tin của tôi</h2>

        <div className="plans-grid">
          {packages.map((pkg) => {
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
                  onClick={() => handlePayment(pkg.id)}
                >
                  Mua ngay — {pkg.price.toLocaleString("vi-VN")}đ
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}