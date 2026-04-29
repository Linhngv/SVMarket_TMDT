import { X } from "lucide-react";
import "../../styles/user/TransactionModal.css";

interface SaleTransaction {
  id: string;
  buyerName: string;
  buyerInitials: string;
  product: string;
  price: string;
  status: string;
  email: string;
  requestDate: string;
  note: string;
  imageUrl: string;
}

interface TransactionModalProps {
  transaction: SaleTransaction;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
}

export default function TransactionModal({
  transaction,
  onClose,
  onAccept,
  onReject,
}: TransactionModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Chi tiết giao dịch</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p className="modal-transaction-id">
          Mã giao dịch: <strong>#{transaction.id}</strong>
        </p>

        <div className="modal-buyer-row">
          <div className="buyer-avatar">{transaction.buyerInitials}</div>
          <span className="buyer-name">{transaction.buyerName}</span>
          <span
            className={`status-badge ${transaction.status === "Chờ xác nhận" ? "pending" : "done"}`}
            style={{ width: "fit-content", whiteSpace: "nowrap" }}
          >
            {transaction.status}
          </span>
        </div>

        <div className="modal-product-row">
          <img
            src={transaction.imageUrl}
            alt={transaction.product}
            className="product-thumb"
          />
          <div className="product-info">
            <p className="product-name">{transaction.product}</p>
            <p className="product-price">{transaction.price}</p>
          </div>
        </div>

        <div className="modal-meta-row">
          <div>
            <p className="meta-label">Email người mua</p>
            <p className="meta-value">{transaction.email}</p>
          </div>
          <div>
            <p className="meta-label">Ngày gửi yêu cầu</p>
            <p className="meta-value">{transaction.requestDate}</p>
          </div>
        </div>

        <div className="modal-note">
          <p className="meta-label">Ghi chú</p>
          <div className="note-box">{transaction.note}</div>
        </div>

        <div className="modal-actions">
          <button
            className="btn-accept"
            onClick={onAccept}
            disabled={transaction.status !== "Chờ xác nhận"}
          >
            Chấp nhận bán
          </button>

          <button
            className="btn-reject"
            onClick={onReject}
            disabled={transaction.status !== "Chờ xác nhận"}
          >
            Từ chối
          </button>
        </div>
      </div>
    </div>
  );
}
