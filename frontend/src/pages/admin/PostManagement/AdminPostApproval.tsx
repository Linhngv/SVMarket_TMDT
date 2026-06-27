import React, { useState, useEffect } from "react";
import "../../../styles/admin/AdminPostList.css";
import "../../../styles/admin/AdminPostApproval.css";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminTopBar from "../../../components/admin/AdminTopBar";
import { getBannedKeywords } from "../../../services/bannedKeywordService";
import { User, Calendar } from "lucide-react";

interface PendingPost {
  id: number;
  title: string;
  sellerName: string;
  description: string;
  imageUrls: string[];
  price: number;
  categoryName: string;
  conditionLevel: string;
  deliveryAddress: string;
  createdAt: string;
  packageName?: string;
}

export default function AdminPostApproval() {
  const [pendingPosts, setPendingPosts] = useState<PendingPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectReasons, setRejectReasons] = useState<{ [key: number]: string }>(
    {},
  );
  const [bannedKeywords, setBannedKeywords] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Tải danh sách từ khóa cấm
        const keywordsData = await getBannedKeywords();
        const keywordsList = keywordsData.map((item: any) => item.keyword);
        setBannedKeywords(keywordsList);

        // Tải danh sách bài đăng chờ duyệt
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:8080/api/admin/listings/pending",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.ok) {
          const data = await res.json();
          console.log("Dữ liệu PENDING trả về từ API:", data);
          setPendingPosts(data);

          // Tự động điền lý do từ chối nếu có từ khóa cấm
          const initialRejectReasons: { [key: number]: string } = {};
          data.forEach((post: PendingPost) => {
            const hasBanned = keywordsList.some((kw: string) => {
              const regex = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
              return regex.test(post.title || "") || regex.test(post.description || "");
            });
            if (hasBanned) {
              initialRejectReasons[post.id] = "Vi phạm từ khóa cấm";
            }
          });
          setRejectReasons(initialRejectReasons);
        } else {
          console.error("Lỗi gọi API Kiểm duyệt, HTTP Status:", res.status);
          alert("Lỗi khi tải dữ liệu chờ duyệt! (Mã lỗi: " + res.status + ")");
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Tự động điều chỉnh chiều cao của hộp nhập lý do từ chối
  useEffect(() => {
    const textareas = document.querySelectorAll<HTMLTextAreaElement>(".reject-input");
    textareas.forEach((el) => {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    });
  }, [pendingPosts, rejectReasons]);

  const handleApprove = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8080/api/admin/listings/${id}/approve`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
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
      const res = await fetch(
        `http://localhost:8080/api/admin/listings/${id}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason: rejectReasons[id] || "" }),
        },
      );
      if (res.ok) {
        setPendingPosts((prev) => prev.filter((post) => post.id !== id));
        setRejectReasons((prev) => {
          const newReasons = { ...prev };
          delete newReasons[id];
          return newReasons;
        });
      }
    } catch (error) {
      console.error("Lỗi từ chối bài:", error);
    }
  };

  const handleRejectReasonChange = (id: number, reason: string) => {
    setRejectReasons((prev) => ({ ...prev, [id]: reason }));
  };

  // Hàm highlight từ khóa cấm trong text
  const highlightBannedKeywords = (text: string) => {
    if (!text || bannedKeywords.length === 0) return text;

    let result: (string | JSX.Element)[] = [text];

    bannedKeywords.forEach((keyword) => {
      result = result.flatMap((part) => {
        if (typeof part !== "string") return part;

        // Tạo regex không phân biệt hoa/thường
        const regex = new RegExp(
          `(${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
          "gi",
        );
        const parts = part.split(regex);

        return parts.map((p, idx) => {
          if (regex.test(p)) {
            return (
              <span key={idx} className="highlight-banned-keyword">
                {p}
              </span>
            );
          }
          return p;
        });
      });
    });

    return result;
  };

  return (
    <>

          {loading ? (
            <div className="card p-4 shadow-sm text-center">
              Đang tải dữ liệu...
            </div>
          ) : pendingPosts.length === 0 ? (
            <div className="card p-4 shadow-sm text-center py-5">
              <h4 className="text-muted">
                Không có bài đăng nào đang chờ duyệt
              </h4>
            </div>
          ) : (
            <div>
              <h3 className="page-title mb-4">Kiểm duyệt bài đăng</h3>

              {pendingPosts.map((post) => (
                <div key={post.id} className="card p-4 shadow-sm mb-4">
                  {/* APPROVAL DETAILS */}
                  <div className="approval-container p-4 mb-4">
                    <div className="approval-title mb-2">{highlightBannedKeywords(post.title)}</div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="approval-author mb-0 d-flex align-items-center gap-2" style={{ color: "var(--primary)", fontWeight: "600" }}>
                          <User size={18} />
                          <span>Người đăng: {post.sellerName || "Khuyết danh"}</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="approval-author mb-0 text-muted d-flex align-items-center gap-2">
                          <Calendar size={18} />
                          <span>Ngày đăng: {post.createdAt ? new Date(post.createdAt).toLocaleString('vi-VN') : 'Không rõ'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="row approval-details mb-0">
                      <div className="col-md-6">
                        <div className="approval-desc mb-4">
                          <h6 className="fw-medium mb-2">Giá: {new Intl.NumberFormat('vi-VN').format(post.price || 0)}đ</h6>
                        </div>
                        <div className="approval-desc mb-4">
                          <h6 className="fw-medium mb-2">Danh mục: {post.categoryName || 'Chưa phân loại'}</h6>
                        </div>
                        <div className="approval-desc mb-4">
                          <h6 className="fw-medium mb-2">Gói tin: <span className="text-primary">{post.packageName || 'Miễn phí'}</span></h6>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="approval-desc mb-4">
                          <h6 className="fw-medium mb-2">Tình trạng: {post.conditionLevel || 'Không xác định'}</h6>
                        </div>
                        <div className="approval-desc mb-4">
                          <h6 className="fw-medium mb-2">Khu vực: {post.deliveryAddress || 'Toàn quốc'}</h6>
                        </div>
                      </div>
                    </div>

                    <div className="approval-desc mb-4">
                      <h6 className="fw-medium mb-2">Mô tả chi tiết: <span style={{ fontWeight: 'normal' }}>{highlightBannedKeywords(post.description)}</span></h6>
                    </div>

                    {/* POST IMAGES */}
                    <div className="post-images d-flex gap-3 mb-1 overflow-auto">
                      {post.imageUrls && post.imageUrls.length > 0 ? (
                        post.imageUrls.map((url, idx) => (
                          <img
                            key={idx}
                            src={
                              url.startsWith("http")
                                ? url
                                : `http://localhost:8080${url}`
                            }
                            alt={`Sản phẩm ${idx + 1}`}
                            className="post-img"
                          />
                        ))
                      ) : (
                        <p className="text-muted">Không có hình ảnh</p>
                      )}
                    </div>
                  </div>

                  {/* REJECT REASON INPUT */}
                  <div className="mb-4">
                    <textarea
                      rows={1}
                      className="form-control reject-input px-4 py-3"
                      placeholder="Nhập lý do từ chối (nếu có)"
                      value={rejectReasons[post.id] || ""}
                      onChange={(e) =>
                        handleRejectReasonChange(post.id, e.target.value)
                      }
                      style={{ fontSize: "16px", overflow: "hidden", resize: "none" }}
                    ></textarea>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="d-flex gap-3">
                    <button
                      className="btn btn-approve-post"
                      onClick={() => handleApprove(post.id)}
                    >
                      Duyệt bài
                    </button>
                    <button
                      className="btn btn-reject-post"
                      onClick={() => handleReject(post.id)}
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
    </>
  );
}
