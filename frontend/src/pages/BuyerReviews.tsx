import { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import "../styles/History.css";

interface BuyerReviewDTO {
    reviewId: number;
    orderId: number;
    transactionId: string;
    buyerName: string;
    buyerAvatar?: string;
    productName: string;
    rating: number;
    comment: string;
    isReplied: boolean;
    createdAt: string;
}

export default function BuyerReviews() {
    const [page, setPage] = useState(1);
    const [reviews, setReviews] = useState<BuyerReviewDTO[]>([]);
    const [loading, setLoading] = useState(true);

    // State cho Modal Phản hồi
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<BuyerReviewDTO | null>(null);
    const [replyContent, setReplyContent] = useState("");

    // State cho Modal Xem đánh giá chi tiết
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [reviewDetail, setReviewDetail] = useState<{
        content: string;
        createdAt: string;
    } | null>(null);

    const fetchBuyerReviews = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/reviews/buyer-reviews", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            } else {
                console.error("Lỗi khi tải dữ liệu từ server");
            }
        } catch (error) {
            console.error("Lỗi gọi API:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuyerReviews();
    }, []);

    const openReplyModal = (review: BuyerReviewDTO) => {
        setSelectedReview(review);
        setReplyContent("");
        setIsModalOpen(true);
    };

    const closeReplyModal = () => {
        setIsModalOpen(false);
        setSelectedReview(null);
    };

    const openViewModal = async (review: BuyerReviewDTO) => {
        setSelectedReview(review);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:8080/api/reviews/${review.reviewId}/reply`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setReviewDetail(data);
                setIsViewModalOpen(true);
            } else {
                alert("Không thể tải chi tiết phản hồi");
            }
        } catch (error) {
            console.error("Lỗi lấy chi tiết phản hồi:", error);
        }
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setReviewDetail(null);
    };

    // Logic phân trang
    const itemsPerPage = 10;
    const totalPages = Math.max(1, Math.ceil(reviews.length / itemsPerPage));
    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReviews = reviews.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="history-container">
            <h2 className="history-title">Đánh giá người mua</h2>

            <table className="history-table">
                <thead>
                    <tr>
                        <th>ID giao dịch</th>
                        <th>Người mua</th>
                        <th>Sản phẩm</th>
                        <th>Trạng thái</th>
                        <th className="text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={5} className="text-center py-4">
                                Đang tải dữ liệu...
                            </td>
                        </tr>
                    ) : currentReviews.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="empty-row">
                                Không có dữ liệu
                            </td>
                        </tr>
                    ) : (
                        currentReviews.map((row) => (
                            <tr key={row.reviewId}>
                                <td className="id-cell" data-label="ID giao dịch">
                                    #{row.transactionId}
                                </td>
                                <td data-label="Người mua">{row.buyerName}</td>
                                <td data-label="Sản phẩm">{row.productName}</td>
                                <td data-label="Trạng thái">
                                    <span style={{ color: "#1A1A2E" }}>
                                        {row.isReplied ? "Đã phản hồi" : "Chưa phản hồi"}
                                    </span>
                                </td>
                                <td data-label="Hành động">
                                    <div className="action-btns justify-content-md-center">
                                        {row.isReplied ? (
                                            <button
                                                className="icon-btn"
                                                title="Xem phản hồi"
                                                onClick={() => openViewModal(row)}
                                            >
                                                <Eye size={16} />
                                            </button>
                                        ) : (
                                            <button
                                                className="btn"
                                                style={{
                                                    backgroundColor: "#1B7A4A",
                                                    color: "white",
                                                    fontWeight: 500,
                                                    borderRadius: "10px",
                                                    padding: "6px 16px",
                                                    border: "none",
                                                    fontSize: "13px",
                                                }}
                                                onClick={() => openReplyModal(row)}
                                            >
                                                Phản hồi
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="pagination">
                <button
                    className="page-btn outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Trước
                </button>
                <span className="page-info">
                    Trang {page}/{totalPages}
                </span>
                <button
                    className="page-btn filled"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                >
                    Kế tiếp
                </button>
            </div>

            {/* Modal Phản hồi */}
            {isModalOpen && selectedReview && (
                <div className="modal-overlay" onClick={closeReplyModal}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ width: "500px", padding: "24px" }}>
                        {/* Header */}
                        <div style={{ position: "relative", marginBottom: "20px" }}>
                            <h2 style={{ textAlign: "center", color: "#1A1A2E", fontWeight: 700, fontSize: "24px", margin: 0 }}>
                                Phản hồi người mua
                            </h2>
                            <button
                                className="modal-close"
                                onClick={closeReplyModal}
                                style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Người mua & Số sao */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#1B7A4A", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "bold", marginRight: "12px", overflow: "hidden" }}>
                                    {selectedReview.buyerAvatar ? (
                                        <img src={selectedReview.buyerAvatar.startsWith("http") ? selectedReview.buyerAvatar : `http://localhost:8080${selectedReview.buyerAvatar}`} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        selectedReview.buyerName.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div style={{ color: "#1A1A2E", fontSize: "16px", fontWeight: 600 }}>
                                    {selectedReview.buyerName}
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "2px" }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="16" height="16">
                                        <path fill={selectedReview.rating >= star ? "#F59E0B" : "#E5E7EB"} d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z" />
                                    </svg>
                                ))}
                            </div>
                        </div>

                        {/* Nội dung comment & Ngày đánh giá */}
                        <div style={{ color: "#3D3D5C", fontSize: "15px", marginBottom: "8px", lineHeight: "0.5" }}>
                            {selectedReview.comment}
                        </div>
                        <div style={{ color: "#6B7280", fontSize: "13px", marginTop: "-10px", borderBottom: "1px solid #E5E7EB", paddingBottom: "10px" }}>
                            {new Date(selectedReview.createdAt).toLocaleDateString('vi-VN')}
                        </div>

                        {/* Phản hồi Input */}
                        <div style={{ marginBottom: "24px" }}>
                            <div style={{ color: "#1A1A2E", fontWeight: 600, marginBottom: "8px", fontSize: "15px" }}>Phản hồi</div>
                            <textarea
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    color: "#3D3D5C",
                                    backgroundColor: "#F9FAFB",
                                    border: "1px solid #E5E7EB",
                                    minHeight: "100px",
                                    resize: "vertical",
                                    outline: "none",
                                    fontSize: "15px"
                                }}
                                placeholder="Phản hồi lại đánh giá của người mua ..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                            />
                        </div>

                        <button
                            style={{
                                width: "100%",
                                padding: "12px",
                                backgroundColor: "#1B7A4A",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: 600,
                                fontSize: "16px",
                                cursor: "pointer",
                                opacity: replyContent.trim() === "" ? 0.6 : 1,
                            }}
                            disabled={replyContent.trim() === ""}
                            onClick={async () => {
                                try {
                                    const token = localStorage.getItem("token");
                                    const res = await fetch("http://localhost:8080/api/reviews/reply", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${token}`,
                                        },
                                        body: JSON.stringify({
                                            reviewId: selectedReview.reviewId,
                                            content: replyContent,
                                        }),
                                    });
                                    if (res.ok) {
                                        alert("Đã gửi phản hồi thành công!");
                                        closeReplyModal();

                                        setReviews((prev) => prev.map((rv) =>
                                            rv.reviewId === selectedReview.reviewId ? { ...rv, isReplied: true } : rv
                                        ));
                                    } else {
                                        const text = await res.text();
                                        alert("Lỗi: " + text);
                                    }
                                } catch (error) {
                                    console.error("Lỗi gửi phản hồi:", error);
                                    alert("Có lỗi xảy ra khi gửi phản hồi");
                                }
                            }}
                        >
                            Xác nhận phản hồi
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Xem Đánh giá */}
            {isViewModalOpen && reviewDetail && selectedReview && (
                <div className="modal-overlay" onClick={closeViewModal}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ width: "500px", padding: "24px" }}>
                        <div style={{ position: "relative", marginBottom: "20px" }}>
                            <h2 style={{ textAlign: "center", color: "#1A1A2E", fontWeight: 700, fontSize: "24px", margin: 0 }}>
                                Chi tiết đánh giá
                            </h2>
                            <button
                                className="modal-close"
                                onClick={closeViewModal}
                                style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Người mua & Số sao */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#1B7A4A", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "bold", marginRight: "12px", overflow: "hidden" }}>
                                    {selectedReview.buyerAvatar ? (
                                        <img src={selectedReview.buyerAvatar.startsWith("http") ? selectedReview.buyerAvatar : `http://localhost:8080${selectedReview.buyerAvatar}`} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        selectedReview.buyerName.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div style={{ color: "#1A1A2E", fontSize: "16px", fontWeight: 600 }}>
                                    {selectedReview.buyerName}
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "2px" }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="16" height="16">
                                        <path fill={selectedReview.rating >= star ? "#F59E0B" : "#E5E7EB"} d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z" />
                                    </svg>
                                ))}
                            </div>
                        </div>

                        {/* Nội dung comment & Ngày đánh giá */}
                        <div style={{ color: "#3D3D5C", fontSize: "15px", lineHeight: "0.5" }}>
                            {selectedReview.comment}
                        </div>
                        <div style={{ color: "#6B7280", fontSize: "13px", marginBottom: "20px" }}>
                            {new Date(selectedReview.createdAt).toLocaleDateString('vi-VN')}
                        </div>

                        {/* Phần hiển thị phản hồi của người bán */}
                        <div style={{
                            padding: "10px",
                            backgroundColor: "transparent",
                            borderLeft: "7px solid #2D9E63", marginTop: "-20px"
                        }}>
                            <div style={{ color: "#1B7A4A", marginBottom: "8px", fontSize: "15px" }}>
                                Phản hồi của bạn:
                            </div>
                            <div style={{
                                color: "#3D3D5C",
                                fontSize: "15px",
                                lineHeight: "1.5"
                            }}>
                                {reviewDetail.content || <span style={{ fontStyle: "italic", color: "#9CA3AF" }}>Không có nội dung phản hồi</span>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}