import React, { useState, useEffect } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminTopBar from "../../../components/admin/AdminTopBar";
import "../../../styles/admin/AdminPostList.css";

interface Transaction {
    id: number;
    transactionId: string;
    customerName: string;
    amount: number;
    status: string;
    paymentMethod: string;
    createdAt: string;
}

export default function AdminTransactionList() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:8080/api/admin/payments", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setTransactions(data);
                }
            } catch (error) {
                console.error("Lỗi lấy danh sách giao dịch:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN").format(value) + "đ";
    };

    const formatDate = (dateValue: any) => {
        if (!dateValue) return "";
        let date: Date;
        if (Array.isArray(dateValue)) {
            date = new Date(dateValue[0], dateValue[1] - 1, dateValue[2], dateValue[3] || 0, dateValue[4] || 0, dateValue[5] || 0);
        } else {
            date = new Date(dateValue);
        }
        return date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN");
    };

    return (
        <div className="admin-container d-flex">
            <AdminSidebar />
            <div className="admin-main flex-grow-1">
                <AdminTopBar breadcrumb="Trang chủ > Quản lý giao dịch > Danh sách giao dịch" />
                <div className="admin-content container-fluid mt-4">
                    <div className="card p-4 shadow-sm border-0" style={{ borderRadius: '12px' }}>
                        <h3 className="page-title mb-4 fw-bold" style={{ color: "#1A1A2E" }}>Danh sách giao dịch</h3>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th className="fw-medium text-muted">ID</th>
                                        <th className="fw-medium text-muted">Khách hàng</th>
                                        <th className="fw-medium text-muted">Phương thức</th>
                                        <th className="fw-medium text-muted">Số tiền</th>
                                        <th className="fw-medium text-muted text-center">Trạng thái</th>
                                        <th className="fw-medium text-muted">Ngày</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={5} className="text-center py-4 text-muted">Đang tải dữ liệu...</td></tr>
                                    ) : transactions.length === 0 ? (
                                        <tr><td colSpan={5} className="text-center py-4 text-muted">Không có giao dịch nào</td></tr>
                                    ) : (
                                        transactions.map((tx) => (
                                            <tr key={tx.id}>
                                                <td style={{ padding: "15px 10px" }}>#{tx.transactionId || tx.id}</td>
                                                <td className="fw-medium text-dark" style={{ padding: "15px 10px" }}>{tx.customerName}</td>
                                                <td className="text-muted fw-medium" style={{ padding: "15px 10px" }}>{tx.paymentMethod}</td>
                                                <td className="text-success fw-bold" style={{ padding: "15px 10px" }}>{formatCurrency(tx.amount)}</td>
                                                <td className="text-center" style={{ padding: "15px 10px" }}>
                                                    <span className="px-3 py-2 rounded-pill" style={{ backgroundColor: '#E8F5EE', color: '#2D9E63' }}>
                                                        {tx.status}
                                                    </span>
                                                </td>
                                                <td className="text-muted" style={{ padding: "15px 10px" }}>{formatDate(tx.createdAt)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}