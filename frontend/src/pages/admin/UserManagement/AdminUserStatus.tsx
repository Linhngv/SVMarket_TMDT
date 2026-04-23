import React, { useState, useEffect } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminTopBar from "../../../components/admin/AdminTopBar";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function AdminUserStatus() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
                    headers: token ? { "Authorization": `Bearer ${token}` } : {}
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                    setStatus(data.status || "Đang hoạt động");
                }
            } catch (error) {
                console.error("Lỗi lấy thông tin người dùng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                alert("Cập nhật trạng thái thành công!");
                navigate("/admin/users");
            } else {
                alert("Lỗi khi cập nhật");
            }
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
        }
    };

    if (loading) return (
        <div className="admin-container d-flex">
            <AdminSidebar />
            <div className="admin-main flex-grow-1">
                <AdminTopBar breadcrumb="Trang chủ > Quản lý người dùng > Cập nhật trạng thái" />
                <div className="admin-content container-fluid mt-4 text-center">Đang tải...</div>
            </div>
        </div>
    );
    if (!user) return <div className="text-center mt-5">Không tìm thấy người dùng</div>;

    const isLocked = user.status === "Đã khóa";
    const currentStatusLabel = isLocked ? "Bị khóa" : "Hoạt động";
    const currentStatusColor = isLocked ? "#C0392B" : "#22C55E";

    return (
        <div className="admin-container d-flex">
            <AdminSidebar />
            <div className="admin-main flex-grow-1">
                <AdminTopBar breadcrumb="Trang chủ > Quản lý người dùng > Cập nhật trạng thái" />
                <div className="admin-content container-fluid mt-4">
                    <div className="card p-4 shadow-sm border-0" style={{ borderRadius: '12px', maxWidth: '600px', margin: '0 auto' }}>
                        <h3 className="page-title m-0 fw-bold mb-4" style={{ color: 'var(--dark-green)' }}>Cập nhật trạng thái - {user.fullName || "Chưa cập nhật"}</h3>
                        
                        <div className="mb-4">
                            <p className="fw-medium mb-2" style={{ color: '#374151' }}>Trạng thái hiện tại</p>
                            <span className="badge rounded-pill px-4 py-2 text-white" style={{ backgroundColor: currentStatusColor, fontSize: '14px', fontWeight: '500' }}>
                                {currentStatusLabel}
                            </span>
                        </div>

                        <div className="mb-4">
                            <p className="fw-medium mb-2" style={{ color: '#374151' }}>Cập nhật trạng thái</p>
                            <div className="position-relative">
                                <select className="form-select bg-white" value={status} onChange={(e) => setStatus(e.target.value)} style={{ borderColor: '#E5E7EB', padding: '10px 16px', appearance: 'none', WebkitAppearance: 'none' }}>
                                    <option value="Đang hoạt động">Hoạt động</option>
                                    <option value="Đã khóa">Khóa tài khoản</option>
                                </select>
                                <ChevronDown size={20} className="position-absolute text-muted" style={{ right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            </div>
                        </div>

                        <div className="text-start mt-4">
                            <button className="btn px-4 py-2 text-white border-0" style={{ backgroundColor: '#1B7A4A', fontWeight: '500', borderRadius: '8px' }} onClick={handleSave}>
                                Cập nhật trạng thái
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}