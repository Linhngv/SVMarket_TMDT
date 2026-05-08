import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopBar from "../../components/admin/AdminTopBar";
import { Users, FileText, CreditCard, AlertTriangle, Check, ArrowUpRight, ChevronDown } from "lucide-react";
import { FaSackDollar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const [period, setPeriod] = useState("30 ngày qua");
    const [openPeriodDropdown, setOpenPeriodDropdown] = useState(false);
    const periodRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // State lưu trữ dữ liệu thống kê từ API (có giá trị mặc định)
    const [dashboardData, setDashboardData] = useState({
        totalUsers: 0,
        totalPosts: 0,
        totalTransactions: 0,
        totalRevenue: 0,
        userGrowth: [0, 0, 0, 0, 0, 0, 0],
        postsByCategory: [] as { label: string, val: number }[],
        transactionRate: {
            success: 70,
            refund: 20,
            failed: 10
        },
        recentActivities: [
            { text: "0 người dùng mới đăng ký", type: "user" },
            { text: "0 bài đăng được duyệt", type: "post" },
            { text: "2 khiếu nại mới", type: "report" },
            { text: "0 giao dịch thành công", type: "transaction" },
        ]
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`http://localhost:8080/api/admin/dashboard?period=${encodeURIComponent(period)}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                if (res.ok) {
                    const data = await res.json();
                    setDashboardData(prev => ({ ...prev, ...data }));
                }
            } catch (error) {
                console.error("Lỗi lấy dữ liệu dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [period]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (periodRef.current && !periodRef.current.contains(event.target as Node)) {
                setOpenPeriodDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Hàm định dạng tiền tệ
    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('vi-VN') + ' đ';
    };

    // Hàm tính toán vị trí hiển thị phần trăm trên biểu đồ tròn
    const getPieLabelStyle = (startPct: number, slicePct: number) => {
        const midPct = startPct + slicePct / 2;
        const deg = midPct * 3.6;
        return {
            top: "50%", left: "50%",
            transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-75px) rotate(-${deg}deg)`,
            fontSize: "14px"
        };
    };

    // Tìm giá trị lớn nhất trong mảng postsByCategory để tự động scale chiều cao cột
    const maxPostVal = dashboardData.postsByCategory.length > 0 
        ? Math.max(400, ...dashboardData.postsByCategory.map(item => item.val))
        : 400;
    
    const postStep = Math.ceil(maxPostVal / 4); // Chia 4 mốc

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
                        <div 
                            className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded shadow-sm border position-relative" 
                            style={{ minWidth: "230px", cursor: "pointer" }}
                            ref={periodRef}
                            onClick={() => setOpenPeriodDropdown(!openPeriodDropdown)}
                        >
                            <span className="text-muted fw-medium text-nowrap" style={{ fontSize: "14px" }}>Khoảng thời gian:</span>
                            <div className="w-100 d-flex justify-content-between align-items-center" style={{ color: "#6B7280", fontSize: "14px", fontWeight: "500" }}>
                                <span>{period}</span>
                                <ChevronDown size={16} />
                            </div>
                            
                            {openPeriodDropdown && (
                                <div 
                                    className="position-absolute bg-white border rounded shadow-sm w-100 overflow-hidden" 
                                    style={{ top: "calc(100% + 5px)", left: 0, zIndex: 100 }}
                                >
                                    {["7 ngày", "30 ngày", "1 năm"].map((opt) => (
                                        <div 
                                            key={opt}
                                            className="px-3 py-2"
                                            style={{ 
                                                fontSize: "14px", 
                                                color: period === opt ? "#1B7A4A" : "#6B7280",
                                                backgroundColor: period === opt ? "#e8f5ee" : "transparent",
                                                transition: "all 0.2s"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = "#e8f5ee";
                                                e.currentTarget.style.color = "#1B7A4A";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = period === opt ? "#e8f5ee" : "transparent";
                                                e.currentTarget.style.color = period === opt ? "#1B7A4A" : "#6B7280";
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPeriod(opt);
                                                setOpenPeriodDropdown(false);
                                            }}
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* DÒNG 2: 4 Thẻ Card Thống kê */}
                    <div className="row g-4 mb-4">
                        {/* Người dùng */}
                        <div className="col-md-6 col-xl-3">
                            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                                <div className="d-flex justify-content-between align-items-center h-100">
                                    <div>
                                        <p className="text-muted mb-1 fw-medium" style={{ fontSize: "14px" }}>Người Dùng</p>
                                        <h4 className="fw-bold mb-0" style={{ color: "#111827" }}>
                                            {loading ? <span className="spinner-border spinner-border-sm text-success" role="status" aria-hidden="true"></span> : dashboardData.totalUsers.toLocaleString()}
                                        </h4>
                                    </div>
                                    <div className="p-3 bg-success bg-opacity-10 rounded-circle">
                                        <Users size={26} className="text-success" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bài đăng */}
                        <div className="col-md-6 col-xl-3">
                            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                                <div className="d-flex justify-content-between align-items-center h-100">
                                    <div>
                                        <p className="text-muted mb-1 fw-medium" style={{ fontSize: "14px" }}>Bài Đăng</p>
                                        <h4 className="fw-bold mb-0" style={{ color: "#111827" }}>
                                            {loading ? <span className="spinner-border spinner-border-sm text-success" role="status" aria-hidden="true"></span> : dashboardData.totalPosts.toLocaleString()}
                                        </h4>
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
                                        <p className="text-muted mb-1 fw-medium" style={{ fontSize: "14px" }}>Giao Dịch</p>
                                        <h4 className="fw-bold mb-0" style={{ color: "#111827" }}>
                                            {loading ? <span className="spinner-border spinner-border-sm text-warning" role="status" aria-hidden="true"></span> : dashboardData.totalTransactions.toLocaleString()}
                                        </h4>
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
                                        <p className="text-muted mb-1 fw-medium" style={{ fontSize: "14px" }}>Doanh Thu</p>
                                        <h4 className="fw-bold mb-0" style={{ color: "#111827" }}>
                                            {loading ? <span className="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true"></span> : formatCurrency(dashboardData.totalRevenue)}
                                        </h4>
                                    </div>
                                    <div className="p-3 rounded-circle" style={{ backgroundColor: "rgba(13, 110, 253, 0.1)" }}>
                                        <FaSackDollar size={26} style={{ color: "#0d6efd" }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DÒNG 3: Biểu đồ tăng trưởng người dùng & Biểu đồ tròn tỷ lệ giao dịch */}
                    <div className="row g-4 mb-4"> 
                        {/* Biểu đồ tăng trưởng người dùng (Area/Line chart vẽ bằng SVG thuần) */}
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                                <h6 className="fw-bold mb-4" style={{ color: "#3D3D5C" }}>Tăng trưởng người dùng</h6>
                                <div className="position-relative w-100" style={{ height: "250px", paddingLeft: "30px", paddingBottom: "20px" }}>
                                    {/* Grid lines container */}
                                    <div className="position-absolute h-100" style={{ top: 0, left: '30px', right: 0, pointerEvents: "none" }}>
                                        {/* Horizontal grid lines */}
                                        <div className="w-100 position-absolute" style={{ top: 0, left: 0, borderTop: "1px dashed #000000" }}></div>
                                        <div className="w-100 position-absolute" style={{ top: '25%', left: 0, borderTop: "1px dashed #000000" }}></div>
                                        <div className="w-100 position-absolute" style={{ top: '50%', left: 0, borderTop: "1px dashed #000000" }}></div>
                                        <div className="w-100 position-absolute" style={{ top: '75%', left: 0, borderTop: "1px dashed #000000" }}></div>
                                        
                                        {/* Vertical grid lines */}
                                        {[0, 16.66, 33.33, 50, 66.66, 83.33, 100].map((pos, idx) => (
                                            <div key={idx} className="position-absolute" style={{ top: 0, bottom: '20px', left: `${pos}%`, borderLeft: "1px dashed #000000" }}></div>
                                        ))}
                                    </div>

                                    {/* Y Axis labels */}
                                    <div className="position-absolute w-100 h-100" style={{ top: 0, left: 0, pointerEvents: "none" }}>
                                        <span className="position-absolute text-muted" style={{ top: '-6px', left: 0, fontSize: '10px' }}>400</span>
                                        <span className="position-absolute text-muted" style={{ top: 'calc(25% - 6px)', left: 0, fontSize: '10px' }}>300</span>
                                        <span className="position-absolute text-muted" style={{ top: 'calc(50% - 6px)', left: 0, fontSize: '10px' }}>200</span>
                                        <span className="position-absolute text-muted" style={{ top: 'calc(75% - 6px)', left: 0, fontSize: '10px' }}>100</span>
                                        <span className="position-absolute text-muted" style={{ bottom: '14px', left: 0, fontSize: '10px' }}>0</span>
                                    </div>

                                    {/* SVG for line chart */}
                                    <div className="w-100 h-100 position-relative" style={{ borderBottom: "1px solid #000000" }}>
                                        <svg viewBox="0 0 600 230" className="w-100 h-100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                                            <polyline
                                                fill="none" stroke="#000000" strokeWidth="1"
                                                points={dashboardData.userGrowth.map((count, idx) => {
                                                    const y = 230 - (Math.min(count as number, 400) / 400) * 230;
                                                    return `${idx * 100},${y}`;
                                                }).join(" ")} 
                                            />
                                            {/* Nối các điểm */}
                                            {dashboardData.userGrowth.map((count, idx) => {
                                                const y = 230 - (Math.min(count as number, 400) / 400) * 230;
                                                return (
                                                    <circle key={idx} cx={idx * 100} cy={y} r="4" fill="#fff" stroke="#000000" strokeWidth="1" />
                                                );
                                            })}
                                        </svg>
                                        {[0, 16.66, 33.33, 50, 66.66, 83.33, 100].map((pos, idx) => (
                                            <span key={idx} className="text-muted position-absolute" style={{ fontSize: "11px", left: `${pos}%`, bottom: "-20px", transform: "translateX(-50%)" }}>
                                                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][idx]}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Biểu đồ cột bài đăng theo danh mục */}
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                                <h6 className="fw-bold mb-4" style={{ color: "#374151" }}>Bài đăng theo danh mục</h6>
                                <div className="position-relative w-100" style={{ height: "250px", paddingLeft: "30px", paddingBottom: "35px" }}>
                                    {/* Grid lines container */}
                                    <div className="position-absolute h-100" style={{ top: 0, left: '30px', right: 0, pointerEvents: "none" }}>
                                        {/* Horizontal grid lines */}
                                        <div className="w-100 position-absolute" style={{ top: '0%', borderTop: "1px dashed #e0e0e0" }}></div>
                                        <div className="w-100 position-absolute" style={{ top: '25%', borderTop: "1px dashed #e0e0e0" }}></div>
                                        <div className="w-100 position-absolute" style={{ top: '50%', borderTop: "1px dashed #e0e0e0" }}></div>
                                        <div className="w-100 position-absolute" style={{ top: '75%', borderTop: "1px dashed #e0e0e0" }}></div>
                                    </div>
                                        
                                    {/* Y Axis labels */}
                                    <div className="position-absolute w-100 h-100" style={{ top: 0, left: 0, pointerEvents: "none" }}>
                                        <span className="position-absolute text-muted" style={{ top: '-6px', left: 0, fontSize: '10px' }}>400</span>
                                        <span className="position-absolute text-muted" style={{ top: 'calc(25% - 6px)', left: 0, fontSize: '10px' }}>300</span>
                                        <span className="position-absolute text-muted" style={{ top: 'calc(50% - 6px)', left: 0, fontSize: '10px' }}>200</span>
                                        <span className="position-absolute text-muted" style={{ top: 'calc(75% - 6px)', left: 0, fontSize: '10px' }}>100</span>
                                        <span className="position-absolute text-muted" style={{ bottom: '29px', left: 0, fontSize: '10px' }}>0</span>
                                    </div>

                                    {/* Bars */}
                                    <div className="d-flex justify-content-around align-items-end h-100 w-100 position-relative" style={{ borderBottom: "1px solid #e0e0e0" }}>
                                        {dashboardData.postsByCategory.map((item, idx) => (
                                            <div key={idx} className="d-flex flex-column align-items-center justify-content-end h-100 position-relative" style={{ width: "14%" }}>
                                                <div 
                                                    style={{ 
                                                    height: `${(item.val / maxPostVal) * 100}%`, 
                                                        width: "32px", 
                                                        backgroundColor: "#0d6efd", 
                                                        borderRadius: "4px 4px 0 0",
                                                        transition: "height 0.3s ease-in-out"
                                                    }} 
                                                ></div>
                                                <div className="text-muted text-center fw-medium position-absolute" style={{ fontSize: "10px", bottom: "-30px", width: "100%", whiteSpace: "normal", lineHeight: "1.1" }}>{item.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DÒNG 4: Biểu đồ tỷ lệ giao dịch & Hoạt động gần đây */}
                    <div className="row g-4">
                        {/* Biểu đồ tròn tỷ lệ giao dịch */}
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    {/* Bên trái: Title */}
                                    <h6 className="fw-bold m-0" style={{ color: "#374151" }}>Tỷ lệ giao dịch</h6>
                                    
                                    {/* Bên phải: Chú thích */}
                                    <div className="d-flex flex-column gap-2 align-items-start">
                                        <div className="d-flex align-items-center">
                                            <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#22C55E', marginRight: '6px', borderRadius: '2px' }}></span>
                                            <span className="text-muted" style={{ fontSize: "12px" }}>Thành công</span> 
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#F59E0B', marginRight: '6px', borderRadius: '2px' }}></span>
                                            <span className="text-muted" style={{ fontSize: "12px" }}>Hoàn tiền</span> 
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#C0392C', marginRight: '6px', borderRadius: '2px' }}></span>
                                            <span className="text-muted" style={{ fontSize: "12px" }}>Thất bại</span> 
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Bên dưới: Biểu đồ */}
                                <div className="d-flex justify-content-center align-items-center flex-grow-1" style={{ marginTop: "-20px" }}>
                                    <div className="position-relative flex-shrink-0" style={{
                                        width: "280px", height: "280px", borderRadius: "50%",
                                        background: `conic-gradient(#22C55E 0% ${dashboardData.transactionRate.success}%, #F59E0B ${dashboardData.transactionRate.success}% ${dashboardData.transactionRate.success + dashboardData.transactionRate.refund}%, #C0392C ${dashboardData.transactionRate.success + dashboardData.transactionRate.refund}% 100%)`,
                                    }}>
                                        {/* Success */}
                                        {dashboardData.transactionRate.success > 0 && <span className="position-absolute text-white fw-bold" style={getPieLabelStyle(0, dashboardData.transactionRate.success)}>{dashboardData.transactionRate.success}%</span>}
                                        {/* Refund */}
                                        {dashboardData.transactionRate.refund > 0 && <span className="position-absolute text-white fw-bold" style={getPieLabelStyle(dashboardData.transactionRate.success, dashboardData.transactionRate.refund)}>{dashboardData.transactionRate.refund}%</span>}
                                        {/* Failed */}
                                        {dashboardData.transactionRate.failed > 0 && <span className="position-absolute text-white fw-bold" style={getPieLabelStyle(dashboardData.transactionRate.success + dashboardData.transactionRate.refund, dashboardData.transactionRate.failed)}>{dashboardData.transactionRate.failed}%</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hoạt động gần đây */}
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h6 className="fw-bold m-0" style={{ color: "#374151" }}>Hoạt động gần đây</h6>
                                    <div 
                                        className="d-flex align-items-center gap-1 px-3 py-1 rounded" 
                                        style={{ backgroundColor: "#e8f5ee", color: "#1B7A4A", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}
                                        onClick={() => navigate("/admin/logs")}
                                    >
                                        Xem tất cả <ArrowUpRight size={16}/>
                                    </div>
                                </div>
                                <div className="recent-activities d-flex flex-column gap-1">
                                    {dashboardData.recentActivities.map((act, idx) => {
                                        let icon, bg, customBg;
                                        if (act.type === "user" || act.type === "post") {
                                            icon = <Check size={18} className="text-success"/>;
                                            bg = "bg-success bg-opacity-10";
                                        } else if (act.type === "report") {
                                            icon = <AlertTriangle size={18} className="text-danger"/>;
                                            bg = "bg-danger bg-opacity-10";
                                        } else {
                                            icon = <FaSackDollar size={18} style={{ color: "#22C55E" }}/>;
                                            bg = "";
                                            customBg = "rgba(13, 110, 253, 0.1)";
                                        }
                                        
                                        return (
                                        <div key={idx} className="d-flex align-items-center gap-3 pb-2 border-bottom border-light">
                                            <div className={`p-2 rounded-circle ${bg}`} style={customBg ? { backgroundColor: customBg } : {}}>
                                                {icon}
                                            </div>
                                            <div>
                                                <p className="m-0 fw-medium" style={{ fontSize: "14px", color: "#1f2937" }}>{act.text}</p>
                                            </div>
                                        </div>
                                    )})}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}