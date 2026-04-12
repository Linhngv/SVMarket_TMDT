import { useState } from "react";
import { Search } from "lucide-react";
import "../styles/History.css";

const purchaseData = [
  {
    id: "GD101",
    product: "Giáo trình Kinh tế vi mô – ĐH Kinh tế",
    price: "35.000đ",
    date: "26/03/2026",
    status: "Hoàn thành",
  },
  {
    id: "GD102",
    product: "Giáo trình Kinh tế chính trị Mác Lênin",
    price: "45.000đ",
    date: "06/04/2026",
    status: "Đang giao dịch",
  },
];

export default function PurchaseHistory() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = purchaseData.filter(
    (t) =>
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.product.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / 10));

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
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={5} className="empty-row">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            filtered.map((row) => (
              <tr key={row.id}>
                <td className="id-cell">{row.id}</td>
                <td>{row.product}</td>
                <td>{row.price}</td>
                <td>{row.date}</td>
                <td>
                  <span
                    className={`status-pill ${row.status === "Hoàn thành" ? "done" : "shipping"}`}
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
