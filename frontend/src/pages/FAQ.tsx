import type { CSSProperties } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";


export default function FAQ() {
    const { isLoggedIn, user } = useAuth();
    return (
        <div style={styles.page}>
            <Header
                isLoggedIn={isLoggedIn}
                avatarUrl={user?.avatar || ""}
                userName={user?.fullName || ""}
            />
            <style>
                {`
                  @media (max-width: 768px) {
                    .responsive-card { padding: 20px !important; margin: 20px auto !important; }
                    .responsive-text { font-size: 16px !important; }
                    .responsive-title { font-size: 24px !important; }
                  }
                `}
            </style>
            {/* Section intro */}
            <section style={styles.heroSection}>
                <h1 className="responsive-title" style={styles.title}>Câu hỏi thường gặp</h1>
                <p className="responsive-text" style={styles.description}>
                    Tìm câu trả lời cho các câu hỏi của bạn về việc mua, bán và sử dụng SVMarketplace.
                </p>
            </section>
            <main className="responsive-card" style={styles.mainContent}>
                <div style={styles.faqCard}>
                    {/* Phần 1 */}
                    <div style={styles.faqItem}>
                        <h3 style={styles.faqTitle}>1. Tôi có thể bán sản phẩm của mình trên SVMarketplace bằng cách nào?</h3>
                        <p style={styles.faqText}>Để bán sản phẩm, chỉ cần đăng nhập vào tài khoản của bạn, vào mục Đăng tin và điền thông tin chi tiết về mặt hàng bạn muốn bán. Hãy chắc chắn tải lên hình ảnh rõ nét, cung cấp mô tả chính xác và đặt giá hợp lý.</p>
                    </div>
                    {/* Phần 2 */}
                    <div style={styles.faqItem}>
                        <h3 style={styles.faqTitle}>2. Làm sao để biết sản phẩm còn trong tình trạng tốt?</h3>
                        <p style={styles.faqText}>Chúng tôi khuyến khích tất cả người bán cung cấp hình ảnh rõ nét và mô tả trung thực về tình trạng của sản phẩm. Chúng tôi cũng khuyên bạn nên xem kỹ chi tiết sản phẩm và liên hệ với người bán để được giải đáp thắc mắc trước khi mua hàng.</p>
                    </div>
                    {/* Phần 3 */}
                    <div style={styles.faqItem}>
                        <h3 style={styles.faqTitle}>3. Tôi có thể hủy đơn hàng của mình không?</h3>
                        <p style={styles.faqText}>Bạn chỉ có thể hủy đơn hàng trong vòng 24 giờ kể từ khi mua hàng, với điều kiện người bán chưa giao sản phẩm. Để yêu cầu hủy đơn hàng, vui lòng liên hệ bộ phận hỗ trợ khách hàng hoặc sử dụng tùy chọn hủy đơn hàng trong chi tiết đơn hàng của bạn.</p>
                    </div>
                    {/* Phần 4 */}
                    <div style={styles.faqItem}>
                        <h3 style={styles.faqTitle}>4. Làm thế nào để tôi theo dõi đơn hàng của mình?</h3>
                        <p style={styles.faqText}>Sau khi đơn hàng của bạn được vận chuyển, bạn sẽ nhận được mã theo dõi qua email hoặc trên nền tảng. Bạn có thể sử dụng mã theo dõi để theo dõi tiến độ giao hàng của mình.</p>
                    </div>
                    {/* Phần 5 */}
                    <div style={styles.faqItem}>
                        <h3 style={styles.faqTitle}>5. Tôi nên làm gì nếu nhận được sản phẩm bị hư hỏng?</h3>
                        <p style={styles.faqText}>Nếu sản phẩm của bạn bị hư hỏng khi giao hàng, vui lòng liên hệ trực tiếp với người bán và cung cấp hình ảnh rõ nét về hư hỏng. Trong trường hợp vấn đề không được giải quyết, hãy liên hệ với đội ngũ hỗ trợ của chúng tôi, và chúng tôi sẽ hỗ trợ bạn trong quá trình trả hàng hoặc hoàn tiền.</p>
                    </div>
                    {/* Phần 6 */}
                    <div style={styles.faqItem}>
                        <h3 style={styles.faqTitle}>6. Tôi có thể cập nhật thông tin hồ sơ của mình bằng cách nào?</h3>
                        <p style={styles.faqText}>Bạn có thể cập nhật thông tin hồ sơ của mình bằng cách truy cập vào cài đặt tài khoản. Tại đây, bạn có thể chỉnh sửa tên, thông tin liên hệ và phương thức thanh toán.</p>
                    </div>
                    {/* Phần 7 */}
                    <div style={styles.faqItem}>
                        <h3 style={styles.faqTitle}>7. Tôi có thể liệt kê nhiều sản phẩm không?</h3>
                        <p style={styles.faqText}>Có, bạn có thể đăng bán nhiều sản phẩm. Chỉ cần vào mục Bán hàng và thêm tin đăng mới cho mỗi mặt hàng bạn muốn bán. Hãy nhớ cung cấp thông tin chi tiết và hình ảnh chính xác cho từng sản phẩm để đảm bảo quá trình giao dịch diễn ra suôn sẻ.</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

const styles: Record<string, CSSProperties> = {
    page: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F5F5F5",
        fontFamily: "sans-serif"
    },
    mainContent: {
        flex: 1,
        padding: "40px",
        margin: "20px auto",
        maxWidth: "1000px",
        width: "90%",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        border: "1px solid #eaeaea",
    },
    heroSection: { backgroundColor: "#1B7A4A", padding: "30px 20px", textAlign: "center" },
    title: { fontSize: "32px", color: "#ffffff", marginBottom: "16px", fontWeight: "bold" },
    description: { fontSize: "18px", color: "#e2e8f0", lineHeight: "1.5", margin: "0 auto", maxWidth: "800px" },
    faqCard: { display: "flex", flexDirection: "column" },
    faqItem: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "40px" },
    faqTitle: { borderLeft: "4px solid #1B7A4A", paddingLeft: "20px", fontSize: "18px", fontWeight: "bold", color: "#1A1A2E", margin: 0 },
    faqText: { fontSize: "16px", color: "#3D3D5C", lineHeight: "1.6", margin: 0 }
};