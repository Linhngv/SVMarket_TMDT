import React, { useState, useEffect } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminTopBar from "../../../components/admin/AdminTopBar";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import { X } from "lucide-react";
import "../../../styles/admin/AdminPostList.css";

interface PendingVerificationUser {
    id: number;
    fullName: string;
    email: string;
    studentCard: string;
    createdAt: string;
}

export default function AdminStudentVerification() {
    const [users, setUsers] = useState<PendingVerificationUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchPendingUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                // Gọi API lấy danh sách user chờ duyệt định danh (Giả định endpoint)
                const res = await fetch("http://localhost:8080/api/admin/users/pending-verification", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data);
                } else {
                    // Mock data tạm thời nếu API chưa sẵn sàng
                    setUsers([
                        {
                            id: 1,
                            fullName: "Nguyễn Văn Sinh Viên",
                            email: "sinhvien123@st.edu.vn",
                            studentCard: "/images/detail.png", 
                            createdAt: new Date().toISOString()
                        }
                    ]);
                }
            } catch (error) {
                console.error("Lỗi lấy danh sách xác thực:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPendingUsers();
    }, []);

    const handleApprove = async (id: number) => {
        if (!window.confirm("Xác nhận duyệt thẻ sinh viên này để cấp huy hiệu Uy tín?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:8080/api/admin/users/${id}/verify`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                alert("Đã duyệt định danh thành công!");
                setUsers((prev) => prev.filter((u) => u.id !== id));
            } else {
                alert("Lỗi khi duyệt định danh sinh viên.");
            }
        } catch (error) {
            console.error("Lỗi duyệt:", error);
        }
    };

    const handleReject = async (id: number) => {
        if (!window.confirm("Bạn muốn từ chối định danh sinh viên này?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:8080/api/admin/users/${id}/reject-verification`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                alert("Đã từ chối định danh.");
                setUsers((prev) => prev.filter((u) => u.id !== id));
            } else {
                alert("Lỗi khi từ chối.");
            }
        } catch (error) {
            console.error("Lỗi từ chối:", error);
        }
    };

    const getImageUrl = (url: string) => {
        if (!url) return "/images/detail.png";
        return url.startsWith("http") ? url : `http://localhost:8080${url}`;
    };

    return (
        <>
            <Header />
            <div className="admin-container d-flex">
                <AdminSidebar />
                <div className="admin-main flex-grow-1">
                    <AdminTopBar breadcrumb="Trang chủ > Quản lý tin cậy > Duyệt định danh sinh viên" />
                    <div className="admin-content container-fluid mt-4">
                        <div className="card p-4 shadow-sm">
                            <h3 className="page-title mb-4">Duyệt định danh sinh viên</h3>
                            <div className="table-responsive">
                                <table className="table align-middle">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Họ và tên</th>
                                            <th>Email</th>
                                            <th>Thẻ sinh viên</th>
                                            <th className="text-center">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan={5} className="text-center py-4">Đang tải dữ liệu...</td></tr>
                                        ) : users.length === 0 ? (
                                            <tr><td colSpan={5} className="text-center py-4 text-muted">Không có yêu cầu xác thực nào đang chờ</td></tr>
                                        ) : (
                                            users.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="fw-medium">#{user.id}</td>
                                                    <td>{user.fullName}</td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                        <img src={getImageUrl(user.studentCard)} alt="Thẻ sinh viên" style={{ width: "100px", height: "60px", objectFit: "cover", cursor: "pointer", borderRadius: "6px", border: "1px solid #ddd" }} onClick={() => setSelectedImage(getImageUrl(user.studentCard))} title="Nhấn để phóng to" />
                                                    </td>
                                                    <td className="text-center">
                                                        <button className="btn btn-sm btn-success me-2 px-3 rounded-pill" onClick={() => handleApprove(user.id)}>Xác thực</button>
                                                        <button className="btn btn-sm btn-outline-danger px-3 rounded-pill" onClick={() => handleReject(user.id)}>Từ chối</button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal hiển thị ảnh phóng to */}
                {selectedImage && (
                    <div className="modal-overlay" onClick={() => setSelectedImage(null)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.8)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div style={{ position: "relative", maxWidth: "90%", maxHeight: "90%" }} onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setSelectedImage(null)} style={{ position: "absolute", top: "-15px", right: "-15px", background: "white", border: "none", borderRadius: "50%", width: "35px", height: "35px", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>
                                <X size={20} />
                            </button>
                            <img src={selectedImage} alt="Phóng to thẻ sinh viên" style={{ maxWidth: "100%", maxHeight: "85vh", borderRadius: "8px", objectFit: "contain", backgroundColor: "white" }} />
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}