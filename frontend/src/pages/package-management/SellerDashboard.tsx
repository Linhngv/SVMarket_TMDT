import "../../styles/user/SellerDashboard.css";
import { Eye, Star, Filter, Inbox, RotateCcw, ShoppingBag, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchSellerDashboard } from "../../services/dashboardService";
import PackageChart from "../../components/dashboard/PackageChart";
import TopListingsChart from "../../components/dashboard/TopListingsChart";
import { PackageBar } from "../../types/PackageBar";
import { SellerDashboardResponse } from "../../types/SellerDashboardResponse";

export default function SellerDashboard() {
  const [dashboard, setDashboard] = useState<SellerDashboardResponse | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const loadDashboard = async () => {
    try {
      // Đã truyền startDate và endDate vào hàm gọi API
      const data = await fetchSellerDashboard(startDate, endDate);
      setDashboard(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleFilter = () => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
      return;
    }
    loadDashboard();
  };

  const handleClearFilter = async () => {
    setStartDate("");
    setEndDate("");
    try {
      const data = await fetchSellerDashboard("", "");
      setDashboard(data);
    } catch (error) {
      console.error(error);
    }
  };

  const packageData: PackageBar[] =
    dashboard?.categoryViews?.map((item) => ({
      category: item.categoryName,
      normalViews: item.normalViews,
      packageViews: item.packageViews,
    })) ?? [];

  // Tính toán dữ liệu cho biểu đồ tròn
  const totalListings = (dashboard?.activeListingCount ?? 0) + (dashboard?.soldListingCount ?? 0);
  const activePct = totalListings > 0 ? Math.round(((dashboard?.activeListingCount ?? 0) / totalListings) * 100) : 0;
  const soldPct = totalListings > 0 ? 100 - activePct : 0;

  const totalSrcViews = (dashboard?.normalViews ?? 0) + (dashboard?.packageViews ?? 0);
  const normalPct = totalSrcViews > 0 ? Math.round(((dashboard?.normalViews ?? 0) / totalSrcViews) * 100) : 0;
  const packagePct = totalSrcViews > 0 ? 100 - normalPct : 0;

  // Tính toán vị trí text hiển thị trên biểu đồ
  const getPieLabelStyle = (startPct: number, slicePct: number) => {
    const midPct = startPct + slicePct / 2;
    const deg = midPct * 3.6;
    return {
      top: "50%",
      left: "50%",
      transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-45px) rotate(-${deg}deg)`,
      fontSize: "13px",
      fontWeight: "bold",
      color: "white",
      position: "absolute" as const,
    };
  };

  return (
    <div className="statistics-page">
      <div className="dashboard-header-wrapper">
        <h1 className="dashboard-title">Thống kê hoạt động</h1>

        <div className="dashboard-filter-wrapper">
          <div className="date-input-group">
            <label htmlFor="startDate" className="date-label">Từ ngày:</label>
            <input 
              type="date" 
              id="startDate" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
            />
          </div>
          <div className="date-input-group">
            <label htmlFor="endDate" className="date-label">Đến ngày:</label>
            <input 
              type="date" 
              id="endDate" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
            />
          </div>
          <button 
            onClick={handleFilter}
            className="btn-filter"
          >
            <Filter size={16} /> Lọc
          </button>
          <button 
            onClick={handleClearFilter}
            className="btn-clear"
          >
            <RotateCcw size={16} /> Bỏ lọc
          </button>
        </div>
      </div>

      {dashboard && dashboard.totalViews === 0 && dashboard.activeListingCount === 0 && dashboard.soldListingCount === 0 && dashboard.reviewCount === 0 ? (
        <div className="empty-state-container">
          <Inbox size={100} strokeWidth={1} color="#9CA3AF" className="empty-state-icon" />
          <div className="empty-state-title">Chưa có dữ liệu thống kê</div>
          <div className="empty-state-subtitle">Không có hoạt động nào trong khoảng thời gian này.</div>
        </div>
      ) : (
        <>
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
              <span className="stats-card-label">Tổng số bài đăng</span>
              <div className="stats-card-value-row">
                <span className="stats-card-value">
                  {totalListings.toLocaleString("vi-VN")}
                </span>
                <div className="stats-card-icon blue">
                  <ShoppingBag size={22} />
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="stats-card">
              <span className="stats-card-label">Đánh giá trung bình</span>
              <div className="stats-card-value-row">
                <span className="stats-card-value">
                  {dashboard ? dashboard.averageRating.toFixed(1) : "0.0"}
                  <span className="rating-max">/5</span>
                </span>
                <div className="stats-card-icon gold">
                  <Star size={22} />
                </div>
              </div>
              <div className="review-count">{dashboard?.reviewCount ?? 0} đánh giá</div>
            </div>

            {/* Card 4 */}
            <div className="stats-card">
              <span className="stats-card-label">Đã chi cho gói tin</span>
              <div className="stats-card-value-row">
                <span className="stats-card-value" style={{ color: "#b91c1c" }}>
                  {/* Ép kiểu any tạm thời, chờ Backend cập nhật trường này */}
                  {((dashboard as any)?.totalSpentOnPackages ?? 0).toLocaleString("vi-VN")}đ
                </span>
                <div className="stats-card-icon" style={{ backgroundColor: "#fee2e2", color: "#b91c1c" }}>
                  <Wallet size={22} />
                </div>
              </div>
            </div>
          </div>

          {/* Biểu đồ tròn (Trạng thái tin đăng & Nguồn lượt xem) */}
          <div className="pie-charts-wrapper">
            <div className="chart-panel pie-chart-panel">
              <h2 className="chart-panel-title pie-chart-title">Tỷ lệ trạng thái tin đăng</h2>
              <div className="pie-chart-content">
                <div 
                  className="pie-chart-circle"
                  style={{ background: totalListings > 0 ? `conic-gradient(#1B7A4A 0% ${activePct}%, #9CA3AF ${activePct}% 100%)` : "#E5E7EB" }}
                >
                    {activePct > 0 && <span style={getPieLabelStyle(0, activePct)}>{activePct}%</span>}
                    {soldPct > 0 && <span style={getPieLabelStyle(activePct, soldPct)}>{soldPct}%</span>}
                </div>
                <div className="pie-chart-legend">
                  <div className="pie-legend-item">
                    <div className="pie-legend-color active"></div>
                    <span className="pie-legend-text">Đang bán ({dashboard?.activeListingCount ?? 0})</span>
                  </div>
                  <div className="pie-legend-item">
                    <div className="pie-legend-color sold"></div>
                    <span className="pie-legend-text">Đã bán ({dashboard?.soldListingCount ?? 0})</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-panel pie-chart-panel">
              <h2 className="chart-panel-title pie-chart-title">Tỷ lệ nguồn lượt xem</h2>
              <div className="pie-chart-content">
                <div 
                  className="pie-chart-circle"
                  style={{ background: totalSrcViews > 0 ? `conic-gradient(#a3c4ae 0% ${normalPct}%, #006b2d ${normalPct}% 100%)` : "#E5E7EB" }}
                >
                    {normalPct > 0 && <span style={{...getPieLabelStyle(0, normalPct), color: "#1B7A4A"}}>{normalPct}%</span>}
                    {packagePct > 0 && <span style={getPieLabelStyle(normalPct, packagePct)}>{packagePct}%</span>}
                </div>
                <div className="pie-chart-legend">
                  <div className="pie-legend-item">
                    <div className="pie-legend-color normal"></div>
                    <span className="pie-legend-text">Tin thường ({dashboard?.normalViews ?? 0})</span>
                  </div>
                  <div className="pie-legend-item">
                    <div className="pie-legend-color package"></div>
                    <span className="pie-legend-text">Gói tin ({dashboard?.packageViews ?? 0})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Biểu đồ 1 */}
          <div className="chart-panel">
            <div className="chart-panel-header">
              <h2 className="chart-panel-title">Hiệu quả gói tin</h2>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-dot" style={{ background: "#a3c4ae", border: "1px solid #7a9f87" }} />
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
        </>
      )}
    </div>
  );
}