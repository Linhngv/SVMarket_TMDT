import React, { useState, useEffect } from "react";
import "../../../styles/admin/AdminPostList.css";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminTopBar from "../../../components/admin/AdminTopBar";

interface RejectedPost {
    id: number;
    title: string;
    sellerName: string;
    rejectReason?: string;
    packageName?: string;
}

export default function AdminViolationList() {
    const [violations, setViolations] = useState<RejectedPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchViolations = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:8080/api/admin/listings/rejected", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setViolations(data);
                }
            } catch (error) {
                console.error("Lỗi lấy danh sách vi phạm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchViolations();
    }, []);

    return (
        <>


                    <div className="card p-4 shadow-sm">
                        <h3 className="page-title mb-4">Danh sách vi phạm</h3>

                        {/* TABLE */}
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Bài đăng</th>
                                        <th>Người đăng</th>
                                        <th>Gói tin</th>
                                        <th>Lý do</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={6} className="text-center py-4">Đang tải dữ liệu...</td></tr>
                                    ) : violations.length === 0 ? (
                                        <tr><td colSpan={6} className="text-center py-4">Không có bài đăng vi phạm nào</td></tr>
                                    ) : (
                                        violations.map((v) => (
                                            <tr key={v.id}>
                                                <td>{v.id}</td>
                                                <td>{v.title}</td>
                                                <td>{v.sellerName || "Khuyết danh"}</td>
                                                <td className="text-primary fw-medium">{v.packageName || "Miễn phí"}</td>
                                                <td>{v.rejectReason || "Không đạt yêu cầu kiểm duyệt"}</td>
                                                <td>
                                                    <button className="btn rounded-pill px-4" style={{ backgroundColor: "#C0392B", color: "white", border: "none", fontWeight: 500, fontSize: "14px" }}>Ẩn bài</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
        </>
    );
}