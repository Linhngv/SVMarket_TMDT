import { useState } from 'react';
import { Search, Eye, Pencil } from 'lucide-react';
import TransactionModal from './TransactionModal';
import "../styles/History.css";

const saleData = [
  {
    id: 'GD101',
    buyerName: 'Trần Minh Đức',
    buyerInitials: 'MĐ',
    product: 'Giáo trình Kinh tế vi mô',
    price: '35.000đ',
    status: 'Chờ xác nhận',
    email: 'minhduc@gmail.com',
    requestDate: '06/04/2026',
    note: 'Mình ở KTX A, có thể gặp ở cổng trường chiều T5. Hình thức: Gặp trực tiếp tại trường.',
    imageUrl: 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
];

export default function SalesHistory() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState<typeof saleData[0] | null>(null);

  const filtered = saleData.filter(
    (t) =>
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      t.product.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / 10));

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
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={5} className="empty-row">Không có dữ liệu</td>
            </tr>
          ) : (
            filtered.map((row) => (
              <tr key={row.id}>
                <td className="id-cell">{row.id}</td>
                <td>{row.buyerName}</td>
                <td>{row.product}</td>
                <td>
                  <span className={`status-pill ${row.status === 'Hoàn thành' ? 'done' : row.status === 'Chờ xác nhận' ? 'pending' : 'shipping'}`}>
                    {row.status}
                  </span>
                </td>
                <td>
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
          onAccept={() => setSelectedTx(null)}
          onReject={() => setSelectedTx(null)}
        />
      )}
    </div>
  );
}
