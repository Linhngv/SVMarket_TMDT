import type { CSSProperties } from "react";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import { useAuth } from "../../context/AuthContext";

export default function About() {
  const { isLoggedIn, user } = useAuth();

  return (
    <div style={styles.page}>
      <Header
        isLoggedIn={isLoggedIn}
        avatarUrl={user?.avatar || ""}
        userName={user?.fullName || ""}
      />
      {/* Thêm style để làm animation cho các thẻ Card */}
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .feature-card {
            animation: fadeInUp 0.8s ease-out forwards;
            opacity: 0; /* Ẩn đi lúc ban đầu */
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .feature-card:hover {
            transform: translateY(-10px) !important;
            box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important;
          }
          .delay-1 { animation-delay: 0.2s; }
          .delay-2 { animation-delay: 0.4s; }
          .delay-3 { animation-delay: 0.6s; }
          @media (max-width: 768px) {
            .responsive-card { padding: 20px !important; margin: 20px auto !important; }
            .responsive-text { font-size: 16px !important; }
            .responsive-title { font-size: 24px !important; }
          }
        `}
      </style>

      {/* Section intro */}
      <section style={styles.heroSection}>
        <h1 className="responsive-title" style={styles.title}>Về chúng tôi</h1>
        <p className="responsive-text" style={styles.description}>
          Chào mừng đến với SVMarketplace – Nền tảng mua bán sản phẩm đã qua sử dụng dễ dàng và đáng tin cậy.
        </p>
      </section>

      <main className="responsive-card" style={styles.mainContent}>
        <div style={styles.cardsContainer}>
          {/* content1: image right, text left */}
          <div style={styles.card}>
            <div style={styles.textBlock}>
              <h5 style={styles.cardTitle}>Câu chuyện của chúng tôi</h5>
              <p style={styles.cardText}>
                Sàn giao dịch SVMarketplace được xây dựng với sứ mệnh rõ ràng: làm cho việc trao đổi, mua và bán sản phẩm cũ giữa sinh viên toàn quốc trở nên dễ dàng, an toàn và tiếp cận được. Dù bạn cần tìm giáo trình đã qua sử dụng, đồ dùng ký túc xá, quần áo secondhand hay những món đồ hữu ích cho cuộc sống sinh viên, SVMarketplace giúp kết nối người mua và người bán nhanh chóng, minh bạch và tiết kiệm.
                <br /><br />Chúng tôi tin rằng đồ cũ không chỉ rẻ hơn mà còn mang theo những câu chuyện và giá trị bền vững. SVMarketplace hướng tới xây dựng một cộng đồng đáng tin cậy, nơi giao dịch được thực hiện với thông tin rõ ràng, đánh giá minh bạch và các công cụ bảo vệ người dùng, để cả người mua lẫn người bán đều giao dịch với sự tự tin.
              </p>
            </div>
            <div style={styles.imageBlock}>
              <img src="/images/banner_about1.png" alt="img1" style={styles.image} />
            </div>
          </div>

          {/* content 2: image left, text right */}
          <div style={styles.card}>
            <div style={styles.imageBlock}>
              <img src="/images/banner_about2.png" alt="img2" style={styles.image} />
            </div>
            <div style={styles.textBlock}>
              <h5 style={styles.cardTitle}>Giá trị cốt lõi của chúng tôi</h5>
              <p style={styles.cardText}>
                Tại SVMarketplace, chúng tôi tin tưởng vào những giá trị cốt lõi định hướng mọi hoạt động của mình. Những giá trị này không chỉ định hình nền tảng của chúng tôi mà còn phản ánh cam kết xây dựng một cộng đồng bền vững, an toàn và đáng tin cậy.
              </p>
              <h5 style={styles.cardTitle}>Bảo mật</h5>
              <p style={styles.cardText}>
                Chúng tôi đảm bảo môi trường mua bán minh bạch và an toàn thông qua kiểm duyệt bài đăng, xác thực người bán. mang lại sự tin tưởng cho người mua và người bán rằng dữ liệu và khoản thanh toán của họ được bảo vệ.
              </p>
              <h5 style={styles.cardTitle}>Cộng đồng</h5>
              <p style={styles.cardText}>
                Chúng tôi tin tưởng vào sức mạnh của thương mại dựa trên cộng đồng. Nền tảng của chúng tôi kết nối mọi người, cho phép người mua và người bán kết nối, hợp tác và hỗ trợ lẫn nhau.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Section feature */}
      <section className="responsive-card" style={styles.featuresSection}>
        <div style={styles.featuresHeader}>
          <h2 className="responsive-title" style={styles.featuresTitle}>Sứ mệnh của chúng tôi</h2>
          <p className="responsive-text" style={styles.featuresSubtitle}>Tại SVMarketplace, chúng tôi hoạt động dựa trên niềm tin rằng các sản phẩm đã qua sử dụng không chỉ có giá cả phải chăng mà còn bền vững. Sứ mệnh của chúng tôi là cung cấp một nền tảng đáng tin cậy, an toàn và thân thiện với môi trường để người dùng mua và bán hàng hóa đã qua sử dụng.</p>
        </div>
        <div style={styles.featuresGrid}>
          <div className="feature-card delay-1" style={styles.featureCard}>
            <div style={styles.featureIcon}><i className="fas fa-arrows-spin"></i></div>
            <h4 style={styles.featureCardTitle}>Tính bền vững</h4>
            <p style={styles.featureCardText}>Bằng cách mua bán các sản phẩm đã qua sử dụng, chúng ta đang giảm thiểu rác thải và góp phần tạo nên một tương lai bền vững hơn. Nền tảng của chúng tôi khuyến khích tái chế, nâng cấp và tái sử dụng.</p>
          </div>
          <div className="feature-card delay-2" style={styles.featureCard}>
            <div style={styles.featureIcon}><i className="fas fa-lock"></i></div>
            <h4 style={styles.featureCardTitle}>Bảo mật</h4>
            <p style={styles.featureCardText}>Chúng tôi ưu tiên sự an toàn và quyền riêng tư của người dùng. Nền tảng của chúng tôi cung cấp môi trường mua bán minh bạch, đảm bảo cả người mua và người bán đều được bảo vệ.</p>
          </div>
          <div className="feature-card delay-3" style={styles.featureCard}>
            <div style={styles.featureIcon}><i className="fas fa-handshake"></i></div>
            <h4 style={styles.featureCardTitle}>Cộng đồng</h4>
            <p style={styles.featureCardText}>Chúng tôi tin tưởng vào sức mạnh của thương mại dựa trên cộng đồng. Sàn giao dịch của chúng tôi kết nối mọi người từ mọi tầng lớp xã hội, thúc đẩy sự tin tưởng, hợp tác và lợi ích chung cho cả người mua và người bán.</p>
          </div>
        </div>
      </section>
      {/* gắn footer */}
      <Footer />
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { minHeight: "100vh", backgroundColor: "#F5F5F5", fontFamily: "sans-serif" },
  heroSection: { backgroundColor: "#1B7A4A", padding: "30px 20px", textAlign: "center" },
  mainContent: { padding: "40px", margin: "20px auto", maxWidth: "1000px", width: "90%", backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", border: "1px solid #eaeaea" },
  title: { fontSize: "32px", color: "#ffffff", marginBottom: "16px", fontWeight: "bold" },
  description: { fontSize: "18px", color: "#e2e8f0", lineHeight: "1.5", margin: "0 auto", maxWidth: "800px" },
  cardsContainer: { display: "flex", flexDirection: "column", gap: "40px" },
  card: { display: "flex", alignItems: "flex-start", gap: "24px", flexWrap: "wrap" },
  textBlock: { flex: 1, minWidth: "250px" },
  imageBlock: { flex: 1, minWidth: "250px" },
  cardTitle: { fontSize: "20px", fontWeight: "bold", color: "#0F4D2E", marginBottom: "4px" },
  cardText: { fontSize: "15px", color: "#3D3D5C", lineHeight: "1.5", marginTop: "0px", marginBottom: "5px" },
  image: { width: "100%", height: "auto", objectFit: "cover", display: "block" },

  // Style cho phần Features
  featuresSection: { padding: "40px 20px", maxWidth: "1000px", width: "90%", margin: "40px auto", backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", border: "1px solid #eaeaea" },
  featuresHeader: { textAlign: "center", marginBottom: "40px" },
  featuresTitle: { fontSize: "28px", color: "#0F4D2E", marginBottom: "12px", fontWeight: "bold" },
  featuresSubtitle: { fontSize: "16px", color: "#1A1A2E", lineHeight: "1.5" },
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "30px" },
  featureCard: { backgroundColor: "#E8F5EE", padding: "30px 20px", borderRadius: "12px", textAlign: "center", border: "1px solid #eaeaea", display: "flex", flexDirection: "column", alignItems: "center" },
  featureIcon: { fontSize: "35px", color: "#000000", },
  featureCardTitle: { fontSize: "18px", fontWeight: "bold", color: "#0F4D2E", marginBottom: "12px" },
  featureCardText: { fontSize: "14px", color: "#3D3D5C", lineHeight: "1.5", margin: 0 }
};