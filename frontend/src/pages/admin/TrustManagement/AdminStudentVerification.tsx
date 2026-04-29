import React, { useState, useEffect } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminTopBar from "../../../components/admin/AdminTopBar";
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

interface ConfirmationModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ show, onClose, onConfirm, title, message, confirmText = "Xác nhận", cancelText = "Hủy" }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 10000, display: "flex", justifyContent: "center", alignItems: "center" }} onClick={onClose}>
            <div className="modal-content bg-white p-4 rounded-3 border-0 shadow" style={{ maxWidth: '400px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
                <h5 className="modal-title fw-bold mb-3" style={{ color: "#1A1A2E" }}>{title}</h5>
                <p className="text-muted" style={{ fontSize: '15px' }}>{message}</p>
                <div className="d-flex justify-content-end gap-3 mt-4">
                    <button className="btn btn-light" onClick={onClose} style={{ fontWeight: 500 }}>{cancelText}</button>
                    <button className="btn btn-success" onClick={onConfirm} style={{ fontWeight: 500 }}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
};


export default function AdminStudentVerification() {
    const [users, setUsers] = useState<PendingVerificationUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // State cho modal xác nhận
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: "",
        message: "",
        onConfirm: () => { }
    });

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
                }
            } catch (error) {
                console.error("Lỗi lấy danh sách xác thực:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPendingUsers();
    }, []);

    const confirmApprove = (id: number) => {
        setModalContent({
            title: "Xác nhận duyệt",
            message: "Bạn có chắc chắn muốn duyệt thẻ sinh viên này và cấp huy hiệu 'Uy tín' không?",
            onConfirm: () => handleApprove(id)
        });
        setShowConfirmModal(true);
    };

    const confirmReject = (id: number) => {
        setModalContent({
            title: "Xác nhận từ chối",
            message: "Bạn có chắc chắn muốn từ chối định danh cho sinh viên này không?",
            onConfirm: () => handleReject(id)
        });
        setShowConfirmModal(true);
    };

    const handleApprove = async (userId: number) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:8080/api/admin/users/${userId}/verify`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setUsers((prev) => prev.filter((u) => u.id !== userId));
            } else {
                console.error("Lỗi khi duyệt định danh sinh viên.");
            }
        } catch (error) {
            console.error("Lỗi duyệt:", error);
        } finally {
            setShowConfirmModal(false);
        }
    };

    const handleReject = async (userId: number) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:8080/api/admin/users/${userId}/reject-verification`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setUsers((prev) => prev.filter((u) => u.id !== userId));
            }
        } catch (error) {
            console.error("Lỗi từ chối:", error);
        } finally {
            setShowConfirmModal(false);
        }
    };

    const getImageUrl = (url: string) => {
        if (!url) return "/images/detail.png";
        return url.startsWith("http") ? url : `http://localhost:8080${url}`;
    };

    return (
        <>
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
                                                        <button className="btn btn-sm btn-success me-2 px-3 rounded-pill" onClick={() => confirmApprove(user.id)}>Xác thực</button>
                                                        <button className="btn btn-sm btn-outline-danger px-3 rounded-pill" onClick={() => confirmReject(user.id)}>Từ chối</button>
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

            <ConfirmationModal
                show={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={modalContent.onConfirm}
                title={modalContent.title}
                message={modalContent.message}
            />
            <Footer />
        </>
    );
}