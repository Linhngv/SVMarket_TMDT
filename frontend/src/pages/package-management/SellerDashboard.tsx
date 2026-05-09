import "../../styles/user/SellerDashboard.css";
import { Eye, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchSellerDashboard } from "../../services/dashboardService";
import PackageChart from "../../components/dashboard/PackageChart";
import TopListingsChart from "../../components/dashboard/TopListingsChart";
import { PackageBar } from "../../types/PackageBar";
import { SellerDashboardResponse } from "../../types/SellerDashboardResponse";

export default function SellerDashboard() {
  const [dashboard, setDashboard] = useState<SellerDashboardResponse | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await fetchSellerDashboard();
        setDashboard(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadDashboard();
  }, []);

  const packageData: PackageBar[] =
    dashboard?.categoryViews?.map((item) => ({
      category: item.categoryName,
      normalViews: item.normalViews,
      packageViews: item.packageViews,
    })) ?? [];

  return (
    <div className="statistics-page">
      <h1>Thống kê hoạt động</h1>

      <div className="stats-cards">
        {/* Card 1 */}
        <div className="stats-card">
          <span className="stats-card-label">Tổng lượt xem</span>
          <div className="stats-card-value-row">
            <span className="stats-card-value">
              {(dashboard?.totalViews ?? 0).toLocaleString("vi-VN")}
            </span>
            <div className="stats-card-icon green">
              <Eye size={22} />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="stats-card">
          <span className="stats-card-label">Tin đăng đang hoạt động</span>
          <div className="stats-card-listing">
            <div className="listing-line">
              <span className="listing-number">{dashboard?.activeListingCount ?? 0}</span>
              <span className="listing-text">tin đang bán</span>
            </div>
            <div className="listing-line">
              <span className="listing-number">{dashboard?.soldListingCount ?? 0}</span>
              <span className="listing-text">tin đã bán</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="stats-card">
          <span className="stats-card-label">Đánh giá trung bình</span>
          <div className="stats-card-value-row">
            <span className="stats-card-value">
              {dashboard ? dashboard.averageRating.toFixed(1) : "0.0"}
              <span style={{ fontSize: 18, fontWeight: 500, color: "var(--text-muted)", marginLeft: 2 }}>/5</span>
            </span>
            <div className="stats-card-icon gold">
              <Star size={22} />
            </div>
          </div>
          <div className="review-count">{dashboard?.reviewCount ?? 0} đánh giá</div>
        </div>
      </div>

      {/* Biểu đồ 1 */}
      <div className="chart-panel">
        <div className="chart-panel-header">
          <h2 className="chart-panel-title">Hiệu quả gói tin</h2>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-dot" style={{ background: "#e7f0ea", border: "1px solid #a3c4ae" }} />
              Tin thường
            </span>
            <span className="legend-item">
              <span className="legend-dot" style={{ background: "#006b2d" }} />
              Gói tin
            </span>
          </div>
        </div>
        <PackageChart data={packageData} />
      </div>

      {/* Biểu đồ 2 */}
      <div className="chart-panel">
        <h2 className="chart-panel-title">Top bài đăng nổi bật</h2>
        <TopListingsChart data={dashboard?.topListings ?? []} />
      </div>
    </div>
  );
}