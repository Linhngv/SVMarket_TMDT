import React, { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopBar from "../../components/admin/AdminTopBar";
import { Users, FileText, CreditCard, DollarSign, AlertCircle, ChevronRight } from "lucide-react";

export default function AdminDashboard() {
    const [period, setPeriod] = useState("30 ngày qua");

    // Hàm định dạng tiền tệ
    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('vi-VN') + ' đ';
    };

    return (
        <div className="admin-container d-flex">
            {/* SIDEBAR */}
            <AdminSidebar />

            {/* MAIN */}
            <div className="admin-main flex-grow-1" style={{ backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
                {/* TOPBAR */}
                <AdminTopBar breadcrumb="Trang chủ > Dashboard" />

                {/* CONTENT */}
                <div className="admin-content container-fluid mt-4 px-4 pb-4">
                    
                    {/* DÒNG 1: Tiêu đề & Lọc thời gian */}
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                        <h3 className="page-title m-0 fw-bold" style={{ color: "#111827" }}>Thống kê hoạt động</h3>
                        <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded shadow-sm border">
                            <span className="text-muted fw-medium" style={{ fontSize: "14px" }}>Khoảng thời gian:</span>
                            <select 
                                className="form-select border-0 shadow-none p-0 fw-bold" 
                                style={{ width: "auto", cursor: "pointer", color: "#1B7A4A", backgroundColor: "transparent" }}
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                            >
                                <option>7 ngày qua</option>
                                <option>30 ngày qua</option>
                                <option>Tháng này</option>
                                <option>Năm nay</option>
                            </select>
                        </div>
                    </div>

                    {/* DÒNG 2: 4 Thẻ Card Thống kê */}
                    <div className="row g-4 mb-4">
                        {/* Người dùng */}
                        <div className="col-md-6 col-xl-3">
                            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                                <div className="d-flex justify-content-between align-items-center h-100">
                                    <div>
                                        <p className="text-muted mb-1 fw-medium" style={{ fontSize: "14px" }}>Tổng Người Dùng</p>
                                        <h4 className="fw-bold mb-0" style={{ color: "#111827" }}>1,250</h4>
                                    </div>
                                    <div className="p-3 bg-primary bg-opacity-10 rounded-circle">
                                        <Users size={26} className="text-primary" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bài đăng */}
                        <div className="col-md-6 col-xl-3">
                            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                                <div className="d-flex justify-content-between align-items-center h-100">
                                    <div>
                                        <p className="text-muted mb-1 fw-medium" style={{ fontSize: "14px" }}>Tổng Bài Đăng</p>
                                        <h4 className="fw-bold mb-0" style={{ color: "#111827" }}>3,420</h4>
                                    </div>
                                    <div className="p-3 bg-success bg-opacity-10 rounded-circle">
                                        <FileText size={26} className="text-success" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Giao dịch */}
                        <div className="col-md-6 col-xl-3">
                            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                                <div className="d-flex justify-content-between align-items-center h-100">
                                    <div>
                                        <p className="text-muted mb-1 fw-medium" style={{ fontSize: "14px" }}>Tổng Giao Dịch</p>
                                        <h4 className="fw-bold mb-0" style={{ color: "#111827" }}>856</h4>
                                    </div>
                                    <div className="p-3 bg-warning bg-opacity-10 rounded-circle">
                                        <CreditCard size={26} className="text-warning" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Doanh thu */}
                        <div className="col-md-6 col-xl-3">
                            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                                <div className="d-flex justify-content-between align-items-center h-100">
                                    <div>
                                        <p className="text-muted mb-1 fw-medium" style={{ fontSize: "14px" }}>Tổng Doanh Thu</p>
                                        <h4 className="fw-bold mb-0" style={{ color: "#111827" }}>{formatCurrency(15400000)}</h4>
                                    </div>
                                    <div className="p-3 bg-danger bg-opacity-10 rounded-circle">
                                        <DollarSign size={26} className="text-danger" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DÒNG 3: Biểu đồ tăng trưởng người dùng & Biểu đồ tròn tỷ lệ giao dịch */}
                    <div className="row g-4 mb-4">
                        {/* Biểu đồ tăng trưởng người dùng (Area/Line chart vẽ bằng SVG thuần) */}
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                                <h6 className="fw-bold mb-4" style={{ color: "#374151" }}>Biểu đồ tăng trưởng người dùng</h6>
                                <div className="position-relative w-100" style={{ height: "250px" }}>
                                    <svg viewBox="0 0 500 150" className="w-100 h-100" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="gradientArea" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="#1B7A4A" stopOpacity="0.4" />
                                                <stop offset="100%" stopColor="#1B7A4A" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <polyline
                                            fill="url(#gradientArea)"
                                            points="0,150 0,120 50,100 100,110 150,80 200,90 250,50 300,70 350,40 400,60 450,20 500,30 500,150"
                                        />
                                        <polyline
                                            fill="none" stroke="#1B7A4A" strokeWidth="3"
                                            points="0,120 50,100 100,110 150,80 200,90 250,50 300,70 350,40 400,60 450,20 500,30"
                                        />
                                        {/* Các điểm dữ liệu nổi bật */}
                                        <circle cx="250" cy="50" r="4" fill="#fff" stroke="#1B7A4A" strokeWidth="2" />
                                        <circle cx="350" cy="40" r="4" fill="#fff" stroke="#1B7A4A" strokeWidth="2" />
                                        <circle cx="450" cy="20" r="4" fill="#fff" stroke="#1B7A4A" strokeWidth="2" />
                                    </svg>
                                    <div className="d-flex justify-content-between text-muted mt-2" style={{ fontSize: "12px" }}>
                                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Biểu đồ tròn tỷ lệ giao dịch */}
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                                <h6 className="fw-bold mb-4" style={{ color: "#374151" }}>Tỷ lệ giao dịch</h6>
                                <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
                                    <div style={{
                                        width: "180px", height: "180px", borderRadius: "50%",
                                        background: "conic-gradient(#1B7A4A 0% 70%, #F59E0B 70% 90%, #EF4444 90% 100%)",
                                        boxShadow: "inset 0 0 0 30px #fff" // Tạo hiệu ứng vòng Donut (Đục lỗ ở giữa)
                                    }}></div>
                                    <div className="w-100 mt-4">
                                        <div className="d-flex justify-content-between mb-2 small">
                                            <span className="text-muted"><span style={{color: "#1B7A4A", marginRight: "6px"}}>●</span>Thành công</span> 
                                            <strong style={{ color: "#111827" }}>70%</strong>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2 small">
                                            <span className="text-muted"><span style={{color: "#F59E0B", marginRight: "6px"}}>●</span>Đang chờ xử lý</span> 
                                            <strong style={{ color: "#111827" }}>20%</strong>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2 small">
                                            <span className="text-muted"><span style={{color: "#EF4444", marginRight: "6px"}}>●</span>Đã hủy</span> 
                                            <strong style={{ color: "#111827" }}>10%</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DÒNG 4: Biểu đồ cột bài đăng & Hoạt động gần đây */}
                    <div className="row g-4">
                        {/* Biểu đồ cột bài đăng theo danh mục */}
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                                <h6 className="fw-bold mb-4" style={{ color: "#374151" }}>Lượng bài đăng theo danh mục</h6>
                                <div className="d-flex align-items-end justify-content-around h-100 pb-3" style={{ minHeight: "220px" }}>
                                    {[
                                        { label: "Giáo trình", val: 80, color: "#1B7A4A" },
                                        { label: "Điện tử", val: 50, color: "#3b82f6" },
                                        { label: "Xe cộ", val: 30, color: "#f59e0b" },
                                        { label: "Quần áo", val: 65, color: "#8b5cf6" },
                                        { label: "Gia dụng", val: 45, color: "#ec4899" },
                                        { label: "Khác", val: 20, color: "#9ca3af" },
                                    ].map((item, idx) => (
                                        <div key={idx} className="d-flex flex-column align-items-center w-100">
                                            <div 
                                                style={{ 
                                                    height: `${item.val * 2}px`, // Nhân 2 lần để cột cao dễ nhìn
                                                    width: "40px", 
                                                    backgroundColor: item.color, 
                                                    borderRadius: "4px 4px 0 0",
                                                    transition: "height 0.3s ease-in-out"
                                                }} 
                                            ></div>
                                            <span className="mt-3 text-muted text-center fw-medium" style={{ fontSize: "12px", maxWidth: "60px" }}>{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Hoạt động gần đây */}
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                                <h6 className="fw-bold mb-4" style={{ color: "#374151" }}>Hoạt động gần đây</h6>
                                <div className="recent-activities d-flex flex-column gap-3">
                                    {[
                                        { text: "15 Người dùng mới đăng ký", time: "5 phút trước", icon: <Users size={18} className="text-primary"/>, bg: "bg-primary bg-opacity-10" },
                                        { text: "5 Bài đăng mới được duyệt", time: "30 phút trước", icon: <FileText size={18} className="text-success"/>, bg: "bg-success bg-opacity-10" },
                                        { text: "2 Khiếu nại mới cần xử lý", time: "1 giờ trước", icon: <AlertCircle size={18} className="text-danger"/>, bg: "bg-danger bg-opacity-10" },
                                        { text: "4 Giao dịch thanh toán thành công", time: "2 giờ trước", icon: <CreditCard size={18} className="text-info"/>, bg: "bg-info bg-opacity-10" },
                                    ].map((act, idx) => (
                                        <div key={idx} className="d-flex align-items-start gap-3 pb-3 border-bottom border-light">
                                            <div className={`p-2 rounded-circle ${act.bg}`}>
                                                {act.icon}
                                            </div>
                                            <div>
                                                <p className="mb-1 fw-medium" style={{ fontSize: "14px", color: "#1f2937" }}>{act.text}</p>
                                                <span className="text-muted" style={{ fontSize: "12px" }}>{act.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <div className="text-center mt-2">
                                        <button className="btn btn-link text-success text-decoration-none p-0 fw-bold d-flex align-items-center justify-content-center gap-1 mx-auto" style={{ fontSize: "14px" }}>
                                            Xem tất cả <ChevronRight size={16}/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}