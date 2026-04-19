import React, { useState, useEffect } from "react";
import "../../../styles/admin/AdminPostList.css";
import "../../../styles/admin/AdminPostApproval.css";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminTopBar from "../../../components/admin/AdminTopBar";

interface PendingPost {
    id: number;
    title: string;
    sellerName: string;
    description: string;
    imageUrls: string[];
}

export default function AdminPostApproval() {
    const [pendingPosts, setPendingPosts] = useState<PendingPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        const fetchPendingPosts = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:8080/api/admin/listings/pending", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    console.log("Dữ liệu PENDING trả về từ API:", data);
                    setPendingPosts(data);
                } else {
                    console.error("Lỗi gọi API Kiểm duyệt, HTTP Status:", res.status);
                    alert("Lỗi khi tải dữ liệu chờ duyệt! (Mã lỗi: " + res.status + ")");
                }
            } catch (error) {
                console.error("Lỗi lấy danh sách chờ duyệt:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPendingPosts();
    }, []);

    const handleApprove = async (id: number) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:8080/api/admin/listings/${id}/approve`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                // alert("Đã duyệt bài đăng!");
                setPendingPosts((prev) => prev.filter((post) => post.id !== id));
            }
        } catch (error) {
            console.error("Lỗi duyệt bài:", error);
        }
    };

    const handleReject = async (id: number) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:8080/api/admin/listings/${id}/reject`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ reason: rejectReason })
            });
            if (res.ok) {
                setPendingPosts((prev) => prev.filter((post) => post.id !== id));
                setRejectReason("");
            }
        } catch (error) {
            console.error("Lỗi từ chối bài:", error);
        }
    };

    const currentPost = pendingPosts[0];

    return (
        <div className="admin-container d-flex">

            {/* SIDEBAR */}
            <AdminSidebar />

            {/* MAIN */}
            <div className="admin-main flex-grow-1">

                {/* TOPBAR */}
                <AdminTopBar breadcrumb="Trang chủ > Bài đăng > Kiểm duyệt bài đăng" />

                {/* CONTENT */}
                <div className="admin-content approval-content container-fluid mt-4">

                    {loading ? (
                        <div className="card p-4 shadow-sm text-center">Đang tải dữ liệu...</div>
                    ) : !currentPost ? (
                        <div className="card p-4 shadow-sm text-center py-5">
                            <h4 className="text-muted">Không có bài đăng nào đang chờ duyệt</h4>
                        </div>
                    ) : (
                        <div className="card p-4 shadow-sm">
                            <h3 className="page-title mb-4">Kiểm duyệt bài đăng</h3>

                            {/* APPROVAL DETAILS */}
                            <div className="approval-container p-4 mb-4">
                                <div className="approval-title mb-2">{currentPost.title}</div>
                                <div className="approval-author mb-3">Người đăng: {currentPost.sellerName || "Khuyết danh"}</div>

                                {/* POST IMAGES */}
                                <div className="post-images d-flex gap-3 mb-4 overflow-auto">
                                    {currentPost.imageUrls && currentPost.imageUrls.length > 0 ? (
                                        currentPost.imageUrls.map((url, idx) => (
                                            <img key={idx} src={url.startsWith("http") ? url : `http://localhost:8080${url}`} alt={`Sản phẩm ${idx + 1}`} className="post-img" />
                                        ))
                                    ) : (
                                        <p className="text-muted">Không có hình ảnh</p>
                                    )}
                                </div>

                                <div className="approval-desc mb-0">
                                    {currentPost.description}
                                </div>
                            </div>

                            {/* REJECT REASON INPUT */}
                            <div className="mb-4">
                                <textarea
                                    rows={4}
                                    className="form-control reject-input px-4 py-3"
                                    placeholder="Nhập lý do từ chối (nếu có)"
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                ></textarea>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="d-flex gap-3">
                                <button className="btn btn-approve-post" onClick={() => handleApprove(currentPost.id)}>Duyệt bài</button>
                                <button className="btn btn-reject-post" onClick={() => handleReject(currentPost.id)}>Từ chối</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}