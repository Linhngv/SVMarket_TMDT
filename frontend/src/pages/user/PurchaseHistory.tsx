import { useState, useEffect } from "react";
import { Search, Eye, X } from "lucide-react";
import type { PurchaseTransaction } from "../../types/PurchaseTransaction";
import type { OrderDetail } from "../../types/OrderDetail";
import { fetchPurchases, fetchOrderDetail } from "../../services/orderService";
import { createOrderPayment } from "../../services/paymentService";
import "../../styles/user/History.css";

export default function PurchaseHistory() {
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [purchases, setPurchases] = useState<PurchaseTransaction[]>([]);

  const [statusMsg, setStatusMsg] = useState("");
  const [selectedDetail, setSelectedDetail] = useState<OrderDetail | null>(
    null,
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("VNPAY");

  useEffect(() => {
    loadPurchases();
  }, []);

  // Xử lý kết quả thanh toán
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");

    if (status === "success") {
      setShowSuccessModal(true);
      window.history.replaceState({}, "", "/purchase-history");
      fetchPurchases();
    } else if (status === "failed") {
      alert("Thanh toán thất bại!");
      window.history.replaceState({}, "", "/purchase-history");
    }
  }, []);

  // Hàm lấy lịch sử mua hàng
  const loadPurchases = async () => {
    try {
      setLoading(true);
      const data = await fetchPurchases();
      setPurchases(data);
    } catch (error) {
      console.error("Lỗi lấy lịch sử mua hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi người dùng nhấn "Xem chi tiết"
  const handleViewDetail = async (orderId: string | number) => {
    setLoadingDetail(true);
    setSelectedDetail(null);

    try {
      const data = await fetchOrderDetail(orderId);
      setSelectedDetail(data);
      setPaymentMethod("");
    } catch (err) {
      console.error("Lỗi lấy chi tiết:", err);
    } finally {
      setLoadingDetail(false); 
    }
  };

  // Hàm xử lý khi người dùng nhấn "Thanh toán" trong modal chi tiết
  const handlePayment = async () => {
    if (!selectedDetail) return;

    try {
      setLoading(true);

      const url = await createOrderPayment(
        selectedDetail.orderId,
        window.location.origin,
      );

      window.location.href = url;
    } catch (err: any) {
      alert(err.message || "Lỗi thanh toán");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedDetail(null);
    setPaymentMethod("");
  };

  const formatStatus = (status: string) => {
    const map: Record<string, string> = {
      PENDING: "Chờ xác nhận",
      ACCEPTED: "Chờ thanh toán",
      PAID: "Đã thanh toán",
      SHIPPED: "Đang giao hàng",
      COMPLETED: "Hoàn thành",
      CANCELLED: "Đã hủy",
    };
    return map[status] || status;
  };

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "—";
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

  const filtered = purchases.filter(
    (t) =>
      String(t.id).toLowerCase().includes(search.toLowerCase()) ||
      t.product.toLowerCase().includes(search.toLowerCase()),
  );

  const formattedPurchases = filtered.map((row) => ({
    ...row,
    id: String(row.id),
    price: new Intl.NumberFormat("vi-VN").format(row.price) + "đ",
    status: formatStatus(row.status),
    date: formatDate(row.requestDate),
  }));

  const totalPages = Math.max(1, Math.ceil(formattedPurchases.length / 10));

  return (
    <div className="history-container">
      <h2 className="history-title">Lịch sử mua hàng</h2>

      {statusMsg && <div className="status-message">{statusMsg}</div>}

      <div className="search-bar">
        <Search size={15} className="search-icon" />
        <input
          type="text"
          placeholder="Tìm kiếm theo ID giao dịch"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <table className="history-table">
        <thead>
          <tr>
            <th>ID giao dịch</th>
            <th>Sản phẩm</th>
            <th>Giá cả</th>
            <th>Ngày</th>
            <th>Trạng thái</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="empty-row">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : formattedPurchases.length === 0 ? (
            <tr>
              <td colSpan={6} className="empty-row">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            formattedPurchases.map((row) => (
              <tr key={row.id}>
                <td className="id-cell" data-label="ID giao dịch">
                  #{row.id}
                </td>
                <td data-label="Sản phẩm">{row.product}</td>
                <td data-label="Giá cả">{row.price}</td>
                <td data-label="Ngày">{row.date}</td>
                <td data-label="Trạng thái">
                  <span
                    className={`status-pill ${
                      row.status === "Hoàn thành"
                        ? "done"
                        : row.status === "Chờ xác nhận"
                          ? "pending"
                          : row.status === "Đã thanh toán"
                            ? "paid"
                            : "shipping"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td data-label="Chi tiết">
                  <button
                    className="icon-btn"
                    onClick={() => handleViewDetail(row.id)}
                    title="Xem chi tiết"
                  >
                    <Eye size={16} />
                  </button>
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

      {/* Modal chi tiết */}
      {(loadingDetail || selectedDetail) && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {loading ? (
              <div className="modal-loading">
                <div className="spinner"></div>
              </div>
            ) : (
              selectedDetail && (
                <>
                  <div className="modal-header mb-0">
                    <h3>Chi tiết đơn hàng #{selectedDetail.orderId}</h3>
                    <button className="modal-close" onClick={closeModal}>
                      <X size={18} />
                    </button>
                  </div>

                  {/* Thông tin đơn hàng */}
                  <div className="modal-section">
                    <h4 className="modal-section-title">Thông tin đơn hàng</h4>
                    <div className="modal-row">
                      <span className="modal-label">Người mua</span>
                      <span className="modal-value">
                        {selectedDetail.buyerName}
                      </span>
                    </div>
                    <div className="modal-row">
                      <span className="modal-label">Người bán</span>
                      <span className="modal-value">
                        {selectedDetail.sellerName}
                      </span>
                    </div>
                    <div className="modal-row">
                      <span className="modal-label">Ngày đặt</span>
                      <span className="modal-value">
                        {formatDate(selectedDetail.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Sản phẩm */}
                  <div className="modal-section">
                    <h4 className="modal-section-title">Sản phẩm</h4>
                    {selectedDetail.items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <div className="order-item-title">
                          {item.listingTitle}
                        </div>
                        <div className="order-item-meta d-flex justify-content-between">
                          <span>SL: {item.quantity}</span>
                          <span className="order-item-price">
                            {new Intl.NumberFormat("vi-VN").format(item.price)}đ
                          </span>
                        </div>
                        {item.note && (
                          <div className="order-item-note">
                            Ghi chú: {item.note}
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="modal-row total-row">
                      <span className="modal-label">Tổng tiền</span>
                      <span className="price-highlight">
                        {new Intl.NumberFormat("vi-VN").format(
                          selectedDetail.totalAmount,
                        )}
                        đ
                      </span>
                    </div>
                  </div>

                  {/* Thanh toán */}
                  <div className="modal-section payment-section">
                    <p className="modal-section-title">Thanh toán</p>

                    {selectedDetail.paymentStatus === "SUCCESS" ? (
                      <div className="modal-row">
                        <span className="modal-label">Trạng thái</span>
                        <span
                          className="modal-value"
                          style={{ color: "green", fontWeight: 600 }}
                        >
                          Đã thanh toán
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="payment-method-title">Chọn phương thức</div>

                        <div className="payment-methods">
                          <label
                            className={`payment-option ${
                              paymentMethod === "VNPAY" ? "selected" : ""
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment"
                              value="VNPAY"
                              checked={paymentMethod === "VNPAY"}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            Thanh toán VNPay
                          </label>
                        </div>

                        <button
                          className="btn-pay-online"
                          disabled={loading}
                          onClick={handlePayment}
                        >
                          {loading ? "Đang xử lý..." : "Thanh toán"}
                        </button>
                      </>
                    )}
                  </div>
                </>
              )
            )}
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div className="success-icon">✓</div>
            <h3>Thanh toán thành công!</h3>
            <div>Cảm ơn bạn đã mua hàng.</div>

            <button
              className="btn-ok"
              onClick={() => setShowSuccessModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
