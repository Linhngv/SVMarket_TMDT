import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import "../styles/History.css";

interface PurchaseTransaction {
  id: string | number;
  product: string;
  price: number;
  status: string;
  requestDate: any;
}

export default function PurchaseHistory() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [purchases, setPurchases] = useState<PurchaseTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/orders/purchases", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPurchases(data);
        }
      } catch (error) {
        console.error("Lỗi lấy lịch sử mua hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  const filtered = purchases.filter(
    (t) =>
      String(t.id).toLowerCase().includes(search.toLowerCase()) ||
      t.product.toLowerCase().includes(search.toLowerCase()),
  );

  const formatStatus = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ xác nhận';
      case 'PAID': return 'Đã thanh toán';
      case 'SHIPPED': return 'Đang giao dịch';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "";
    let date: Date;
    if (Array.isArray(dateValue)) {
      date = new Date(dateValue[0], dateValue[1] - 1, dateValue[2], dateValue[3] || 0, dateValue[4] || 0, dateValue[5] || 0);
    } else {
      date = new Date(dateValue);
    }
    return date.toLocaleDateString("vi-VN");
  };

  const formattedPurchases = filtered.map(row => ({
    ...row,
    id: String(row.id),
    price: new Intl.NumberFormat("vi-VN").format(row.price) + "đ",
    status: formatStatus(row.status),
    date: formatDate(row.requestDate)
  }));

  const totalPages = Math.max(1, Math.ceil(formattedPurchases.length / 10));

  return (
    <div className="history-container">
      <h2 className="history-title">Lịch sử mua hàng</h2>

      <div className="search-bar">
        <Search size={15} className="search-icon" />
        <input
          type="text"
          placeholder="Tìm kiếm theo ID giao dịch"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input" />
      </div>

      <table className="history-table">
        <thead>
          <tr>
            <th>ID giao dịch</th>
            <th>Sản phẩm</th>
            <th>Giá cả</th>
            <th>Ngày</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center py-4">Đang tải dữ liệu...</td>
            </tr>
          ) : formattedPurchases.length === 0 ? (
            <tr>
              <td colSpan={5} className="empty-row">Không có dữ liệu</td>
            </tr>
          ) : (
            formattedPurchases.map((row) => (
              <tr key={row.id}>
                <td className="id-cell" data-label="ID giao dịch">{row.id}</td>
                <td data-label="Sản phẩm">{row.product}</td>
                <td data-label="Giá cả">{row.price}</td>
                <td data-label="Ngày">{row.date}</td>
                <td data-label="Trạng thái">
                  <span
                    className={`status-pill ${row.status === 'Hoàn thành' ? 'done' : row.status === 'Chờ xác nhận' ? 'pending' : 'shipping'}`}
                  >
                    {row.status}
                  </span>
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
    </div>
  );
}
