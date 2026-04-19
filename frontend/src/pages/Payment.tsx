import { useParams, useNavigate } from "react-router-dom";
import "../styles/History.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Payment() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <div className="history-container" style={{ minHeight: "calc(100vh - 300px)" }}>
                <h2 className="history-title text-center">Thanh toán trực tuyến</h2>

                <div className="card p-4 shadow-sm" style={{ maxWidth: "600px", margin: "0 auto", borderRadius: "12px", border: "1px solid #E5E7EB" }}>
                    <h5 className="mb-4 fw-bold" style={{ color: "#1A1A2E" }}>Chi tiết thanh toán đơn hàng #{orderId}</h5>

                    <p className="text-muted mb-4">Vui lòng chọn phương thức thanh toán bên dưới để hoàn tất giao dịch an toàn thông qua SVMarketplace.</p>

                    <div className="d-grid gap-3 mb-4">
                        <button className="btn btn-outline-success p-3 text-start rounded-3" style={{ fontWeight: 500 }}>
                            <i className="fa-solid fa-wallet me-3"></i> Thanh toán qua VNPay
                        </button>
                        <button className="btn btn-outline-danger p-3 text-start rounded-3" style={{ fontWeight: 500 }}>
                            <i className="fa-solid fa-mobile-screen me-3"></i> Thanh toán qua ví MoMo
                        </button>
                        <button className="btn btn-outline-primary p-3 text-start rounded-3" style={{ fontWeight: 500 }}>
                            <i className="fa-solid fa-building-columns me-3"></i> Chuyển khoản ngân hàng
                        </button>
                    </div>

                    <div className="d-flex justify-content-end gap-3 mt-2">
                        <button className="btn" style={{ backgroundColor: "#F3F4F6", color: "#374151", fontWeight: 500, borderRadius: "8px", padding: "10px 24px" }} onClick={() => navigate("/purchase-history")}>
                            Hủy
                        </button>
                        <button className="btn" style={{ backgroundColor: "#1B7A4A", color: "white", fontWeight: 500, borderRadius: "8px", padding: "10px 24px" }} onClick={() => alert("Chức năng thanh toán đang được phát triển!")}>
                            Tiếp tục
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}