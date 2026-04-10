import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP } from "react-icons/fa";

export default function Footer() {
    return (
        <div className="footer">
            <div className="container">
                <div className="row gy-4">

                    {/* LOGO */}
                    <div className="col-md-3">
                        <h4 className="logo">
                            <span style={{ color: "#1B7A4A" }}>SV</span>
                            <span style={{ color: "#D4A017" }}>Marketplace</span>
                        </h4>
                        <p className="footer-desc">
                            Nền tảng lý tưởng để mua và bán các sản phẩm đã qua sử dụng
                        </p>
                    </div>

                    {/* DỊCH VỤ */}
                    <div className="col-md-3">
                        <h5 className="footer-title">Dịch vụ</h5>
                        <p>Đăng tin miễn phí</p>
                        <p>Xác thực người bán</p>
                        <p>Công cụ hỗ trợ người bán toàn tập</p>
                        <p>Đánh giá minh bạch</p>
                        <p>Lọc thông minh - đề xuất theo sở thích</p>
                    </div>

                    {/* HỖ TRỢ */}
                    <div className="col-md-3">
                        <h5 className="footer-title">Hỗ trợ khách hàng</h5>
                        <p>Câu hỏi thường gặp</p>
                        <p>Về chúng tôi</p>
                        <p>Liên hệ với chúng tôi</p>
                    </div>

                    {/* Mạng xã hội */}
                    <div className="col-md-3">
                        <h5 className="footer-title">Theo dõi chúng tôi</h5>
                        <div className="social-icons">
                            <div className="icon fb"><FaFacebookF /></div>
                            <div className="icon ig"><FaInstagram /></div>
                            <div className="icon tw"><FaTwitter /></div>
                            <div className="icon pt"><FaPinterestP /></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}