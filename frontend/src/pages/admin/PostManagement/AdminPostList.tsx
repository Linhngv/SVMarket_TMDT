import React, { useState, useEffect } from "react";
import "../../../styles/admin/AdminPostList.css";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminTopBar from "../../../components/admin/AdminTopBar";
import { BadgeCheck, Eye } from "lucide-react";

interface Post {
    id: number;
    title: string;
    author: string;
    status: string;
    packageName?: string;
    price?: number;
    sellerUniversity?: string;
    createdAt?: any;
    isVerified?: boolean;
}

export default function AdminPostList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal state
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [postDetail, setPostDetail] = useState<any | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

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

    // Hàm giúp định dạng ngày đăng
    const formatDate = (dateValue: any) => {
        if (!dateValue) return "Không rõ";
        let date: Date;
        if (Array.isArray(dateValue)) {
            date = new Date(
                dateValue[0],
                dateValue[1] - 1,
                dateValue[2],
                dateValue[3] || 0,
                dateValue[4] || 0,
            );
        } else {
            date = new Date(dateValue);
        }
        return date.toLocaleDateString("vi-VN");
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
                        status: item.status || "UNKNOWN",
                        packageName: item.packageName || "Miễn phí",
                        price: item.price,
                        sellerUniversity: item.sellerUniversity,
                        createdAt: item.createdAt,
                        isVerified: item.isVerified
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

    const openDetailModal = async (id: number) => {
        setSelectedPostId(id);
        setLoadingDetail(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:8080/api/admin/listings/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPostDetail(data);
            } else {
                alert("Không thể lấy chi tiết bài đăng");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingDetail(false);
        }
    };

    const closeDetailModal = () => {
        setSelectedPostId(null);
        setPostDetail(null);
    };

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
                        <div className="d-flex gap-3 mb-4 flex-nowrap">
                            <input
                                type="text"
                                className="form-control search-input w-100"
                                placeholder="Tìm theo tiêu đề hoặc người đăng ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="btn admin-btn-search px-4 text-nowrap">Tìm kiếm</button>
                        </div>

                        {/* TABLE */}
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tiêu đề</th>
                                        <th>Người đăng</th>
                                        <th>Gói tin</th>
                                        <th className="text-center">Trạng thái</th>
                                        <th className="text-center">Hành động</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={6} className="text-center py-4">Đang tải dữ liệu...</td></tr>
                                    ) : (!currentPosts || currentPosts.length === 0) ? (
                                        <tr><td colSpan={6} className="text-center py-4">Chưa có bài đăng nào</td></tr>
                                    ) : (
                                        currentPosts.map((post) => (
                                            <tr key={post.id}>
                                                <td className="admin-post-list-td">{post.id}</td>
                                                <td className="admin-post-list-td" style={{ maxWidth: "250px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={post.title}>{post.title}</td>
                                                <td className="admin-post-list-td">
                                                    {post.author}
                                                </td>
                                                <td className="admin-post-list-td text-primary fw-medium">{post.packageName}</td>
                                                <td className="align-middle text-center admin-post-list-td">
                                                    <div className="d-flex align-items-center justify-content-center m-0">
                                                        <span className={`${getStatusClass(post.status)} status-badge rounded-pill py-2 px-3 m-0`}>
                                                            {getStatusLabel(post.status)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="align-middle text-center admin-post-list-td">
                                                    <button className="btn btn-sm btn-light border rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{ width: "32px", height: "32px" }} onClick={() => openDetailModal(post.id)} title="Xem chi tiết">
                                                        <Eye size={16} className="text-secondary" />
                                                    </button>
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

            {/* MODAL CHI TIẾT BÀI ĐĂNG */}
            {selectedPostId && (
                <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex={-1} onClick={closeDetailModal}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" onClick={e => e.stopPropagation()}>
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header border-bottom-0">
                                <h4 className="modal-title fw-bold text-start pe-3" style={{ color: "#1A1A2E", lineHeight: "1.5" }}>
                                    Chi tiết bài đăng #{selectedPostId} {postDetail?.title ? `- ${postDetail.title}` : ""}
                                </h4>
                                <button type="button" className="btn-close" onClick={closeDetailModal}></button>
                            </div>
                            <div className="modal-body px-4">
                                {loadingDetail ? (
                                    <div className="text-center py-4 text-muted">Đang tải thông tin...</div>
                                ) : postDetail ? (
                                    <div>
                                        {/* USER INFO */}
                                        <div className="d-flex align-items-center mb-4">
                                            {postDetail.sellerAvatar ? (
                                                <img src={postDetail.sellerAvatar.startsWith('http') ? postDetail.sellerAvatar : `http://localhost:8080${postDetail.sellerAvatar}`} alt="avatar" className="rounded-circle me-3" style={{ width: "48px", height: "48px", objectFit: "cover" }} />
                                            ) : (
                                                <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-3" style={{ width: "48px", height: "48px", fontSize: "18px", fontWeight: "bold" }}>
                                                    {postDetail.sellerName?.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <div className="fw-bold d-flex align-items-center" style={{ fontSize: "16px", color: "#1A1A2E" }}>
                                                    {postDetail.sellerName || "Khuyết danh"}
                                                    {postDetail.isVerified && <span title="Đã xác thực" className="d-flex align-items-center ms-1"><BadgeCheck size={16} className="text-success" /></span>}
                                                </div>
                                                <div className="text-muted small">{postDetail.sellerUniversity || "Không rõ trường ĐH"}</div>
                                            </div>
                                        </div>

                                        {/* POST INFO */}
                                        <p className="text-danger fw-bold fs-5 mb-3">Giá: {new Intl.NumberFormat('vi-VN').format(postDetail.price)}đ</p>
                                        
                                        <div className="row mb-4 text-muted" style={{ fontSize: "15px" }}>
                                            <div className="col-sm-6 mb-2"><strong>Danh mục:</strong> {postDetail.categoryName}</div>
                                            <div className="col-sm-6 mb-2"><strong>Tình trạng:</strong> {postDetail.conditionLevel}</div>
                                            <div className="col-sm-6 mb-2"><strong>Khu vực:</strong> {postDetail.deliveryAddress}</div>
                                            <div className="col-sm-6 mb-2"><strong>Ngày đăng:</strong> {formatDate(postDetail.createdAt)}</div>
                                            <div className="col-sm-6 mb-2"><strong>Gói tin:</strong> <span className="text-primary fw-medium">{postDetail.packageName || 'Miễn phí'}</span></div>
                                            <div className="col-sm-6 mb-2 d-flex align-items-center">
                                                <strong>Trạng thái:</strong> <span className={`${getStatusClass(postDetail.status)} ms-2 py-1 px-3 rounded-pill text-white fw-medium`} style={{ fontSize: "13px" }}>{getStatusLabel(postDetail.status)}</span>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <strong style={{ color: "#1A1A2E" }}>Mô tả chi tiết:</strong>
                                            <div className="p-3 rounded mt-2" style={{ whiteSpace: "pre-wrap", backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", color: "#3D3D5C", fontSize: "15px", lineHeight: "1.6" }}>
                                                {postDetail.description}
                                            </div>
                                        </div>

                                        {/* REJECT REASON */}
                                        {postDetail.rejectReason && (
                                            <div className="mb-4 p-3 bg-danger bg-opacity-10 text-danger rounded border border-danger border-opacity-25">
                                                <strong>Lý do từ chối:</strong> {postDetail.rejectReason}
                                            </div>
                                        )}

                                        {/* IMAGES */}
                                        {postDetail.imageUrls && postDetail.imageUrls.length > 0 && (
                                            <div>
                                                <strong style={{ color: "#1A1A2E" }}>Hình ảnh sản phẩm:</strong>
                                                <div className="d-flex gap-2 mt-2 overflow-auto pb-2 post-images">
                                                    {postDetail.imageUrls.map((url: string, idx: number) => (
                                                        <img key={idx} src={url.startsWith('http') ? url : `http://localhost:8080${url}`} alt="product" className="rounded" style={{ width: "120px", height: "120px", objectFit: "cover", border: "1px solid #E5E7EB" }} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-5 text-danger">Không tìm thấy thông tin bài đăng</div>
                                )}
                            </div>
                            <div className="modal-footer border-top-0 pt-0">
                                <button type="button" className="btn btn-secondary px-4 rounded-pill" onClick={closeDetailModal}>Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}