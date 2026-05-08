import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopBar from "../../components/admin/AdminTopBar";

// Cấu trúc dữ liệu cho một dòng nhật ký (bạn có thể thay đổi sau để khớp với API)
interface LogEntry {
    id: number;
    adminName: string;
    action: string;
    timestamp: string;
}

export default function AdminLogs() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(false);

    // Mock dữ liệu tạm thời. Sau này bạn thay bằng fetch() từ API nhé
    useEffect(() => {
        setLoading(true);
        // Giả lập thời gian tải API
        setTimeout(() => {
            setLogs([
                { id: 1, adminName: "Admin", action: "Duyệt bài đăng #1024 (Giáo trình Toán cao cấp)", timestamp: "2026-05-08 09:30:00" },
                { id: 2, adminName: "Admin", action: "Xóa người dùng #45 (Tài khoản spam)", timestamp: "2026-05-07 14:15:22" },
                { id: 3, adminName: "Super Admin", action: "Thêm gói tin mới (Gói Sinh viên VIP)", timestamp: "2026-05-06 10:00:00" },
                { id: 4, adminName: "Admin", action: "Từ chối xác thực thẻ sinh viên (Người dùng #88)", timestamp: "2026-05-05 16:45:10" },
                { id: 5, adminName: "Super Admin", action: "Xử lý khiếu nại #12 (Cảnh cáo người bán)", timestamp: "2026-05-04 11:20:05" },
            ]);
            setLoading(false);
        }, 600);
    }, []);

    return (
        <div className="admin-container d-flex">
            {/* SIDEBAR */}
            <AdminSidebar />

            {/* MAIN CONTENT */}
            <div className="admin-main flex-grow-1" style={{ backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
                {/* TOPBAR */}
                <AdminTopBar breadcrumb="Trang chủ > Nhật ký hoạt động" />

                <div className="admin-content container-fluid mt-4 px-4 pb-4">
                    <div className="card p-4 shadow-sm border-0 rounded-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="page-title m-0 fw-bold" style={{ color: "#111827" }}>Nhật ký hoạt động</h3>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th className="fw-medium text-muted">ID</th>
                                        <th className="fw-medium text-muted">Admin</th>
                                        <th className="fw-medium text-muted">Hoạt động</th>
                                        <th className="fw-medium text-muted">Thời gian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={4} className="text-center py-4 text-muted">Đang tải dữ liệu...</td></tr>
                                    ) : logs.length === 0 ? (
                                        <tr><td colSpan={4} className="text-center py-4 text-muted">Không có dữ liệu nhật ký</td></tr>
                                    ) : (
                                        logs.map((log) => (
                                            <tr key={log.id}>
                                                <td className="text-muted">#{log.id}</td>
                                                <td className="fw-medium">{log.adminName}</td>
                                                <td>{log.action}</td>
                                                <td className="text-muted" style={{ fontSize: "14px" }}>{log.timestamp}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}