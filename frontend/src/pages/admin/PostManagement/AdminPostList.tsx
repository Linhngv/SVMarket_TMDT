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
                return "Đã duyệt";
            case "REJECTED":
                return "Vi phạm";
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
                                className="form-control search-input"
                                placeholder="Tìm theo tiêu đề hoặc người đăng ..."
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
                                    ) : (!posts || posts.length === 0) ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-4">
                                                Chưa có bài đăng nào
                                            </td>
                                        </tr>
                                    ) : (
                                        posts.map((post) => (
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

                    </div>
                </div>
            </div>
        </div>
    );
}