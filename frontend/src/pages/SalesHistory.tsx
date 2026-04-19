import { useState, useEffect } from 'react';
import { Search, Eye, Pencil } from 'lucide-react';
import TransactionModal from './TransactionModal';
import "../styles/History.css";

interface SaleTransaction {
  id: string | number;
  buyerName: string;
  buyerInitials: string;
  product: string;
  price: number;
  status: string;
  email: string;
  requestDate: any;
  note: string;
  imageUrl: string;
}

export default function SalesHistory() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sales, setSales] = useState<SaleTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/orders/sales", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSales(data);
        }
      } catch (error) {
        console.error("Lỗi lấy lịch sử bán hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const filtered = sales.filter(
    (t) =>
      String(t.id).toLowerCase().includes(search.toLowerCase()) ||
      t.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      t.product.toLowerCase().includes(search.toLowerCase())
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

  // Hàm xử lý chấp nhận bán
  const handleAcceptTransaction = async (id: string | number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/orders/${id}/accept`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Đã chấp nhận đơn hàng!");
        setSales(prev => prev.map(sale => String(sale.id) === String(id) ? { ...sale, status: "SHIPPED" } : sale));
        setSelectedTx(null);
      } else {
        alert("Có lỗi xảy ra khi cập nhật!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  // Định dạng lại các giá trị để phù hợp với hiển thị và Modal chi tiết
  const formattedSales = filtered.map(row => ({
    ...row,
    id: String(row.id),
    price: new Intl.NumberFormat("vi-VN").format(row.price) + "đ",
    status: formatStatus(row.status),
    requestDate: formatDate(row.requestDate),
    imageUrl: row.imageUrl.startsWith("http") ? row.imageUrl : `http://localhost:8080${row.imageUrl}`
  }));

  const totalPages = Math.max(1, Math.ceil(formattedSales.length / 10));

  return (
    <div className="history-container">
      <h2 className="history-title">Lịch sử bán hàng</h2>

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
            <th>Người mua</th>
            <th>Sản phẩm</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center py-4">Đang tải dữ liệu...</td>
            </tr>
          ) : formattedSales.length === 0 ? (
            <tr>
              <td colSpan={5} className="empty-row">Không có dữ liệu</td>
            </tr>
          ) : (
            formattedSales.map((row) => (
              <tr key={row.id}>
                <td className="id-cell" data-label="ID giao dịch">{row.id}</td>
                <td data-label="Người mua">{row.buyerName}</td>
                <td data-label="Sản phẩm">{row.product}</td>
                <td data-label="Trạng thái">
                  <span className={`status-pill ${row.status === 'Hoàn thành' ? 'done' : row.status === 'Chờ xác nhận' ? 'pending' : 'shipping'}`}>
                    {row.status}
                  </span>
                </td>
                <td data-label="Hành động">
                  <div className="action-btns">
                    <button className="icon-btn" onClick={() => setSelectedTx(row)} title="Xem chi tiết">
                      <Eye size={16} />
                    </button>
                    <button className="icon-btn" title="Chỉnh sửa">
                      <Pencil size={16} />
                    </button>
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
        <span className="page-info">Trang {page}/{totalPages}</span>
        <button
          className="page-btn filled"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Kế tiếp
        </button>
      </div>

      {selectedTx && (
        <TransactionModal
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
          onAccept={() => handleAcceptTransaction(selectedTx.id)}
          onReject={() => setSelectedTx(null)}
        />
      )}
    </div>
  );
}
