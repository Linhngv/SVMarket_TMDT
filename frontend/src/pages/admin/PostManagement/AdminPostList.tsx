import React, { useState, useEffect } from "react";
import "../../../styles/admin/AdminPostList.css";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminTopBar from "../../../components/admin/AdminTopBar";

interface Post {
    id: number;
    title: string;
    author: string;
    status: string;
}

export default function AdminPostList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Hàm giúp xác định màu hiển thị badge trạng thái
    const getStatusClass = (status: string) => {
        switch (status.toUpperCase()) {
            case "APPROVED":
            case "ACTIVE":
            case "HOẠT ĐỘNG":
                return "badge-approved";
            case "PENDING":
            case "CHỜ DUYỆT":
                return "badge-pending";
            case "REJECTED":
            case "TỪ CHỐI":
                return "badge-violation";
            case "INACTIVE":
            case "HIDDEN":
            case "DELETED":
                return "bg-secondary";
            case "SOLD":
                return "bg-dark text-white";
            default:
                return "bg-secondary";
        }
    };

    // Hàm giúp ánh xạ trạng thái sang tiếng Việt hiển thị
    const getStatusLabel = (status: string) => {
        switch (status.toUpperCase()) {
            case "PENDING":
                return "Chờ duyệt";
            case "ACTIVE":
            case "APPROVED":
                return "Đã duyệt";
            case "REJECTED":
                return "Vi phạm";
            case "HIDDEN":
                return "Tạm ẩn";
            case "INACTIVE":
                return "Không hoạt động";
            case "SOLD":
                return "Đã bán";
            case "DELETED":
                return "Đã xóa";
            default:
                return status;
        }
    };

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:8080/api/admin/listings", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error("Fetch failed");
                const data = await res.json();

                const formattedData: Post[] = data.map((item: any) => {
                    const authorName = item.seller?.fullName
                        || item.user?.fullName
                        || item.sellerName
                        || item.author
                        || (item.sellerId ? `User ID: ${item.sellerId}` : null)
                        || (item.seller_id ? `User ID: ${item.seller_id}` : null)
                        || "Khuyết danh";
                    return {
                        id: item.id,
                        title: item.title,
                        author: authorName,
                        status: item.status || "UNKNOWN"
                    };
                });
                setPosts(formattedData);
            } catch (err) {
                console.error("Lỗi lấy danh sách bài đăng:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    const filteredPosts = posts.filter(post =>
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        setCurrentPage(1); // Reset trang về 1 khi tìm kiếm
    }, [searchTerm]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

    return (
        <div className="admin-container d-flex">

            {/* SIDEBAR */}
            <AdminSidebar />

            {/* MAIN */}
            <div className="admin-main flex-grow-1">

                {/* TOPBAR */}
                <AdminTopBar breadcrumb="Trang chủ > Bài đăng > Danh sách bài đăng" />

                {/* CONTENT */}
                <div className="admin-content container-fluid mt-4">

                    <div className="card p-4 shadow-sm">
                        <h3 className="page-title mb-4">Danh sách bài đăng</h3>

                        {/* SEARCH */}
                        <div className="d-flex gap-3 mb-4 flex-wrap">
                            <input
                                type="text"
                                className="form-control search-input"
                                placeholder="Tìm theo tiêu đề hoặc người đăng ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="btn admin-btn-search px-4">Tìm kiếm</button>
                        </div>

                        {/* TABLE */}
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tiêu đề</th>
                                        <th>Người đăng</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-4">Đang tải dữ liệu...</td>
                                        </tr>
                                    ) : (!currentPosts || currentPosts.length === 0) ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-4">
                                                Chưa có bài đăng nào
                                            </td>
                                        </tr>
                                    ) : (
                                        currentPosts.map((post) => (
                                            <tr key={post.id}>
                                                <td>{post.id}</td>
                                                <td>{post.title}</td>
                                                <td>{post.author}</td>
                                                <td>
                                                    <span className={`badge ${getStatusClass(post.status)} status-badge rounded-pill py-2 px-3`}>
                                                        {getStatusLabel(post.status)}
                                                    </span>
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
            </div>
        </div>
    );
}