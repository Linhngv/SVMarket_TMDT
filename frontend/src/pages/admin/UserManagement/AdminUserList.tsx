import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminTopBar from "../../../components/admin/AdminTopBar";
import { Search, User as UserIcon, Eye, ChevronDown } from "lucide-react";
import AdminUserDetailsPopup from "./AdminUserDetailsPopup";
import "../../../styles/admin/AdminPackage.css";

export interface UserAdmin {
    id: number;
    fullName: string;
    email: string;
    university: string;
    avatar: string;
    role: string;
    status: string;
    createdAt: string;
    postCount: number;
    reportCount: number;
}

export default function AdminUserList() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserAdmin[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    // Modal state
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserAdmin | null>(null);
    const [status, setStatus] = useState("");
    const [role, setRole] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8080/api/admin/users", {
                headers: token ? { "Authorization": `Bearer ${token}` } : {}
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách người dùng", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u =>
        u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const handleOpenStatusModal = (user: UserAdmin) => {
        setSelectedUser(user);
        setStatus(user.status || "Đang hoạt động");
        setRole(user.role || "USER");
        setShowStatusModal(true);
    };

    const handleOpenDetails = (user: UserAdmin) => {
        setSelectedUser(user);
        setShowDetailsModal(true);
    };

    const handleSaveStatus = async () => {
        if (!selectedUser) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:8080/api/admin/users/${selectedUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ status, role })
            });

            if (res.ok) {
                alert("Cập nhật trạng thái thành công!");
                setShowStatusModal(false);
                fetchUsers();
            } else {
                alert("Lỗi khi cập nhật");
            }
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
        }
    };

    return (
        <div className="admin-container d-flex">
            <AdminSidebar />
            <div className="admin-main flex-grow-1">
                <AdminTopBar breadcrumb="Trang chủ > Quản lý người dùng" />
                <div className="admin-content container-fluid mt-4">
                    <div className="card p-4 shadow-sm border-0" style={{ borderRadius: '12px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                            <h3 className="page-title m-0 fw-bold" style={{ color: "#1A1A2E" }}>Danh sách người dùng</h3>
                        </div>

                        <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                            <div className="d-flex align-items-center border rounded bg-white package-search-box flex-grow-1" style={{ maxWidth: "400px" }}>
                                <div className="px-3 d-flex align-items-center justify-content-center">
                                    <Search size={18} className="text-muted" />
                                </div>
                                <input
                                    type="text"
                                    className="form-control border-0 shadow-none bg-transparent ps-0 py-2"
                                    placeholder="Tìm kiếm theo tên hoặc email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th className="fw-medium text-muted" style={{ width: "60px" }}>ID</th>
                                        <th className="fw-medium text-muted">Người dùng</th>
                                        <th className="fw-medium text-muted">Email</th>
                                        <th className="fw-medium text-muted" style={{ width: "120px" }}>Vai trò</th>
                                        <th className="fw-medium text-muted">Xác minh</th>
                                        <th className="fw-medium text-muted" style={{ width: "150px" }}>Trạng thái</th>
                                        <th className="fw-medium text-center text-muted" style={{ width: "100px" }}>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={6} className="text-center py-4 text-muted">Đang tải...</td></tr>
                                    ) : currentUsers.length === 0 ? (
                                        <tr><td colSpan={6} className="text-center py-4 text-muted">Không tìm thấy người dùng nào</td></tr>
                                    ) : (
                                        currentUsers.map((user) => (
                                            <tr key={user.id}>
                                                <td>#{user.id}</td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-3">
                                                        {user.avatar ? (
                                                            <img src={user.avatar.startsWith("http") ? user.avatar : `http://localhost:8080${user.avatar}`} alt={user.fullName} className="rounded-circle object-fit-cover" style={{ width: "40px", height: "40px" }} />
                                                        ) : (
                                                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center text-muted" style={{ width: "40px", height: "40px" }}>
                                                                <UserIcon size={20} />
                                                            </div>
                                                        )}
                                                        <div className="fw-semibold text-dark">{user.fullName || "Chưa cập nhật"}</div>
                                                    </div>
                                                </td>
                                                <td className="text-muted">{user.email}</td>
                                                <td>
                                                    <span 
                                                        className={`badge rounded-pill ${user.role === 'ADMIN' ? 'bg-danger-subtle text-danger border border-danger-subtle' : ''}`}
                                                        style={user.role !== 'ADMIN' ? {
                                                            backgroundColor: '#E8F5EE',
                                                            color: '#2D9E63',
                                                            padding: '5.5px 12px'
                                                        } : { padding: '5.5px 12px' }}
                                                    >
                                                        {user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
                                                    </span>
                                                </td>
                                                <td>{user.university ? "Đã duyệt" : "Chờ duyệt"}</td>
                                                <td>
                                                    <span className="badge rounded-pill text-white px-3 py-2" style={{ backgroundColor: user.status === 'Đã khóa' ? '#C0392B' : '#22C55E' }}>
                                                        {user.status === 'Đã khóa' ? 'Bị khóa' : 'Hoạt động'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <button className="btn btn-sm bg-transparent border-0 text-primary" title="Xem chi tiết" onClick={() => handleOpenDetails(user)}>
                                                            <Eye size={20}  style={{color: "#1B7A4A"}} />
                                                        </button>
                                                        <button className="btn btn-sm bg-transparent border-0 text-primary" title="Cập nhật trạng thái" onClick={() => handleOpenStatusModal(user)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="20" height="20">
                                                                <path fill="#C0392B" d="M256 312C322.3 312 376 258.3 376 192C376 125.7 322.3 72 256 72C189.7 72 136 125.7 136 192C136 258.3 189.7 312 256 312zM226.3 368C127.8 368 48 447.8 48 546.3C48 562.7 61.3 576 77.7 576L329.2 576C293 533.4 272 478.5 272 420.4L272 389.3C272 382 273 374.8 274.9 368L226.3 368zM477.3 552.5L464 558.8L464 370.7L560 402.7L560 422.3C560 478.1 527.8 528.8 477.3 552.6zM453.9 323.5L341.9 360.8C328.8 365.2 320 377.4 320 391.2L320 422.3C320 496.7 363 564.4 430.2 596L448.7 604.7C453.5 606.9 458.7 608.1 463.9 608.1C469.1 608.1 474.4 606.9 479.1 604.7L497.6 596C565 564.3 608 496.6 608 422.2L608 391.1C608 377.3 599.2 365.1 586.1 360.7L474.1 323.4C467.5 321.2 460.4 321.2 453.9 323.4z"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        {totalPages > 1 && (
                            <div className="d-flex justify-content-center align-items-center mt-4 text-muted small">
                                <div className="d-flex flex-wrap justify-content-center gap-2">
                                    <button 
                                        className="btn btn-sm rounded-circle border bg-white d-flex align-items-center justify-content-center"
                                        style={{ width: "32px", height: "32px" }}
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    >‹</button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button 
                                            key={page}
                                            className={`btn btn-sm rounded-circle border d-flex align-items-center justify-content-center ${currentPage === page ? 'text-white' : 'bg-white text-dark'}`}
                                            style={currentPage === page ? { backgroundColor: '#1B7A4A', borderColor: '#1B7A4A', width: "32px", height: "32px" } : { width: "32px", height: "32px" }}
                                            onClick={() => setCurrentPage(page)}
                                        >{page}</button>
                                    ))}
                                    <button 
                                        className="btn btn-sm rounded-circle border bg-white d-flex align-items-center justify-content-center"
                                        style={{ width: "32px", height: "32px" }}
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    >›</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* MODAL CẬP NHẬT TRẠNG THÁI */}
                {showStatusModal && selectedUser && (
                    <div className="modal d-block modal-overlay" tabIndex={-1}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content custom-modal-content p-4" style={{ borderRadius: '12px', border: '0' }}>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h3 className="page-title m-0 fw-bold" style={{ color: '#1A1A2E' }}>Cập nhật trạng thái - {selectedUser.fullName || "Chưa cập nhật"}</h3>
                                    <button type="button" className="btn-close" onClick={() => setShowStatusModal(false)}></button>
                                </div>
                                
                                <div className="modal-body p-0 text-start">
                                    <div className="mb-4">
                                        <p className="fw-medium mb-2" style={{ color: '#374151' }}>Trạng thái hiện tại</p>
                                        <span className="badge rounded-pill px-4 py-2 text-white" style={{ backgroundColor: selectedUser.status === "Đã khóa" ? "#C0392B" : "#22C55E", fontSize: '14px', fontWeight: '500' }}>
                                            {selectedUser.status === "Đã khóa" ? "Bị khóa" : "Hoạt động"}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <p className="fw-medium mb-2" style={{ color: '#374151' }}>Cập nhật trạng thái</p>
                                        <div className="position-relative">
                                            <select className="form-select bg-white" value={status} onChange={(e) => setStatus(e.target.value)} style={{ borderColor: '#E5E7EB', padding: '10px 16px', appearance: 'none', WebkitAppearance: 'none', backgroundImage: 'none' }}>
                                                <option value="Đang hoạt động">Hoạt động</option>
                                                <option value="Đã khóa">Khóa tài khoản</option>
                                            </select>
                                            <ChevronDown size={20} className="position-absolute text-muted" style={{ right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="fw-medium mb-2 d-flex align-items-center gap-2" style={{ color: '#374151' }}>
                                            Cập nhật vai trò
                                        </p>
                                        <div className="position-relative">
                                            <select className="form-select bg-white" value={role} onChange={(e) => setRole(e.target.value)} style={{ borderColor: '#E5E7EB', padding: '10px 16px', appearance: 'none', WebkitAppearance: 'none', backgroundImage: 'none' }}>
                                                <option value="USER">Người dùng</option>
                                                <option value="ADMIN">Quản trị viên</option>
                                            </select>
                                            <ChevronDown size={20} className="position-absolute text-muted" style={{ right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                        </div>
                                    </div>

                                    <div className="text-start mt-4">
                                        <button className="btn px-4 py-2 text-white border-0" style={{ backgroundColor: '#1B7A4A', fontWeight: '500', borderRadius: '8px' }} onClick={handleSaveStatus}>
                                            Cập nhật trạng thái
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL CHI TIẾT */}
                {showDetailsModal && selectedUser && (
                    <AdminUserDetailsPopup user={selectedUser} onClose={() => setShowDetailsModal(false)} />
                )}
            </div>
        </div>
    );
}