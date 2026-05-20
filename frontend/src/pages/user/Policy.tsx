import type { CSSProperties } from "react";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import { useAuth } from "../../context/AuthContext";
import "../../styles/user/Policy.css";

export default function Policy() {
  const { isLoggedIn, user } = useAuth();

  return (
    <div className="policy-page">
      <Header
        isLoggedIn={isLoggedIn}
        avatarUrl={user?.avatar || ""}
        userName={user?.fullName || ""}
      />

      {/* Section intro */}
      <section className="policy-hero-section">
        <h1 className="responsive-title policy-title">Chính sách của chúng tôi</h1>
        <p className="responsive-text policy-description">
          Để hỗ trợ người dùng đăng bán sản phẩm hiệu quả hơn, hệ thống cung cấp nhiều gói đăng tin với quyền lợi khác nhau. Người dùng có thể sử dụng miễn phí hoặc nâng cấp gói để tăng số lượng bài đăng, lượt đẩy tin và ưu tiên hiển thị nhằm tiếp cận nhiều người mua hơn.
        </p>
      </section>

      <main className="responsive-card policy-main-content">
        <div className="policy-section">
          <h3 className="policy-section-title">1. Chính sách đăng tin miễn phí</h3>
          <p className="policy-paragraph">Người dùng chưa đăng ký gói. Người dùng sử dụng tài khoản miễn phí sẽ được:</p>
          <ul className="policy-list">
            <li>Đăng tối đa 3 bài viết.</li>
            <li>Bài đăng hiển thị theo thứ tự thông thường.</li>
            <li>Không có tính năng đẩy tin.</li>
            <li>Không có nhãn ưu tiên hoặc nổi bật.</li>
            <li>Không được ưu tiên hiển thị trên hệ thống.</li>
          </ul>
        </div>

        <div className="policy-section">
          <h3 className="policy-section-title">2. Các gói đăng tin</h3>
          <div className="policy-table-container">
            <table className="policy-table">
              <thead>
                <tr>
                  <th>Thuộc tính</th>
                  <th>Gói cơ bản</th>
                  <th>Gói sinh viên</th>
                  <th>Gói VIP</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Giá</td>
                  <td>19.000đ / 30 ngày</td>
                  <td>39.000đ / 30 ngày</td>
                  <td>69.000đ / 30 ngày</td>
                </tr>
                <tr>
                  <td>Số bài đăng</td>
                  <td>5 bài</td>
                  <td>8 bài</td>
                  <td>12 bài</td>
                </tr>
                <tr>
                  <td>Lượt đẩy tin</td>
                  <td>8 lượt</td>
                  <td>15 lượt</td>
                  <td>25 lượt</td>
                </tr>
                <tr>
                  <td>Thời gian ưu tiên mỗi lượt đẩy</td>
                  <td>12 giờ</td>
                  <td>24 giờ</td>
                  <td>24 giờ</td>
                </tr>
                <tr>
                  <td>Nhãn hiển thị</td>
                  <td>Không có</td>
                  <td>Tin ưu tiên</td>
                  <td>TOP</td>
                </tr>
                <tr>
                  <td>Ưu tiên hiển thị</td>
                  <td>Bài đăng được ưu tiên hiển thị trên danh sách “Tất cả bài đăng”, xếp dưới gói Sinh viên và VIP</td>
                  <td>Bài đăng được hiển thị nổi bật với nhãn “Tin ưu tiên” và được ưu tiên hiển thị cao hơn gói cơ bản</td>
                  <td>Bài đăng xuất hiện tại mục “Đề xuất”, gắn nhãn “TOP” và được ưu tiên hiển thị cao nhất trên hệ thống</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="policy-section">
          <h3 className="policy-section-title">3. Chi tiết quyền lợi</h3>
          <h4 className="policy-subsection-title">3.1. Gói cơ bản</h4>
          <p className="policy-paragraph">Phù hợp với người dùng đăng bán ít sản phẩm hoặc nhu cầu sử dụng cơ bản.</p>
          <p className="policy-paragraph"><strong>Quyền lợi:</strong></p>
          <ul className="policy-list">
            <li>Đăng tối đa 5 bài viết.</li>
            <li>Có 8 lượt đẩy tin.</li>
            <li>Mỗi lượt đẩy giúp bài viết ưu tiên trong 12 giờ.</li>
            <li>Bài đăng được ưu tiên hiển thị hơn tài khoản miễn phí.</li>
            <li>Giá tiết kiệm, phù hợp cho nhu cầu đăng bán ngắn hạn.</li>
          </ul>

          <h4 className="policy-subsection-title">3.2. Gói sinh viên</h4>
          <p className="policy-paragraph">Phù hợp với sinh viên thường xuyên trao đổi, mua bán đồ dùng học tập và sinh hoạt.</p>
          <p className="policy-paragraph"><strong>Quyền lợi:</strong></p>
          <ul className="policy-list">
            <li>Đăng tối đa 8 bài viết.</li>
            <li>Có 15 lượt đẩy tin.</li>
            <li>Ưu tiên hiển thị trong 24 giờ cho mỗi lượt đẩy.</li>
            <li>Có nhãn nổi bật “Tin ưu tiên” trên bài đăng.</li>
            <li>Được ưu tiên hiển thị cao hơn gói cơ bản.</li>
            <li>Tăng khả năng tiếp cận người mua nhanh hơn.</li>
          </ul>

          <h4 className="policy-subsection-title">3.3. Gói VIP</h4>
          <p className="policy-paragraph">Phù hợp với người bán hoạt động thường xuyên hoặc kinh doanh nhỏ.</p>
          <p className="policy-paragraph"><strong>Quyền lợi:</strong></p>
          <ul className="policy-list">
            <li>Đăng tối đa 12 bài viết.</li>
            <li>Có 25 lượt đẩy tin.</li>
            <li>Hiển thị ưu tiên trong 24 giờ cho mỗi lượt đẩy.</li>
            <li>Xuất hiện trong mục “Đề xuất” của hệ thống.</li>
            <li>Luôn được ưu tiên ở đầu danh sách bài đăng.</li>
            <li>Có nhãn nổi bật “TOP” giúp tăng độ nhận diện.</li>
            <li>Giao diện bài đăng nổi bật hơn so với các gói khác.</li>
            <li>Tăng tối đa khả năng tiếp cận và tỷ lệ bán hàng.</li>
          </ul>
        </div>

        <div className="policy-section">
          <h3 className="policy-section-title">4. Chính sách đẩy tin</h3>
          <h4 className="policy-subsection-title">4.1. Đẩy tin là gì?</h4>
          <p className="policy-paragraph">Đẩy tin là tính năng giúp bài đăng được tăng mức độ ưu tiên hiển thị theo quyền lợi của gói đăng ký, từ đó tăng khả năng tiếp cận người mua và lượt xem bài viết.</p>
          <p className="policy-paragraph"><strong>Quy định sử dụng:</strong></p>
          <ul className="policy-list">
            <li>Mỗi lần sử dụng sẽ trừ 1 lượt đẩy tin.</li>
            <li>Sau khi đẩy tin, bài đăng sẽ được ưu tiên hiển thị trong thời gian tương ứng với gói hiện tại.</li>
            <li>Mức độ ưu tiên hiển thị phụ thuộc vào từng gói thành viên.</li>
            <li>Người dùng có thể theo dõi số lượt đẩy còn lại trong mục quản lý bài đăng.</li>
            <li>Khi hết lượt đẩy, người dùng cần gia hạn hoặc nâng cấp gói để tiếp tục sử dụng.</li>
          </ul>
        </div>

        <div className="policy-section">
          <h3 className="policy-section-title">5. Chính sách gia hạn</h3>
          <p className="policy-paragraph">Gói có hiệu lực trong 30 ngày kể từ thời điểm thanh toán thành công.</p>
          <p className="policy-paragraph"><strong>Sau khi hết hạn:</strong></p>
          <ul className="policy-list">
            <li>Quyền lợi ưu tiên sẽ bị hủy.</li>
            <li>Nhãn “Tin ưu tiên” hoặc “TOP” sẽ không còn hiển thị.</li>
            <li>Người dùng có thể gia hạn hoặc nâng cấp gói bất kỳ lúc nào.</li>
          </ul>
        </div>

        <section className="policy-features-section">
          <div className="policy-features-header">
            <h2 className="responsive-title policy-features-title">Nâng cấp ngay để tăng hiệu quả bán hàng</h2>
          </div>
          <div className="policy-features-grid">
            <div className="feature-card delay-1">
              <div className="policy-feature-icon"><i className="fas fa-layer-group"></i></div>
              <h4 className="policy-feature-card-title">Đăng nhiều bài hơn</h4>
              <p className="policy-feature-card-text">Tăng giới hạn số lượng bài đăng để bạn có thể giới thiệu nhiều sản phẩm hơn cùng lúc.</p>
            </div>
            <div className="feature-card delay-2">
              <div className="policy-feature-icon"><i className="fas fa-users"></i></div>
              <h4 className="policy-feature-card-title">Tiếp cận nhiều người mua</h4>
              <p className="policy-feature-card-text">Bài đăng của bạn sẽ được ưu tiên hiển thị, thu hút nhiều lượt xem và tương tác hơn.</p>
            </div>
            <div className="feature-card delay-3">
              <div className="policy-feature-icon"><i className="fas fa-rocket"></i></div>
              <h4 className="policy-feature-card-title">Nổi bật và ưu tiên</h4>
              <p className="policy-feature-card-text">Sử dụng các nhãn "TOP" hoặc "Tin ưu tiên" để bài đăng của bạn nổi bật giữa hàng ngàn tin khác.</p>
            </div>
            <div className="feature-card delay-4">
              <div className="policy-feature-icon"><i className="fas fa-bolt-lightning"></i></div>
              <h4 className="policy-feature-card-title">Bán hàng nhanh chóng</h4>
              <p className="policy-feature-card-text">Tăng tốc độ bán hàng nhờ các công cụ đẩy tin và hiển thị nổi bật, giúp chốt đơn nhanh hơn.</p>
            </div>
            <div className="feature-card delay-5">
              <div className="policy-feature-icon"><i className="fas fa-shield-halved"></i></div>
              <h4 className="policy-feature-card-title">Gia tăng độ uy tín</h4>
              <p className="policy-feature-card-text">Các gói trả phí giúp xây dựng hình ảnh người bán chuyên nghiệp và đáng tin cậy trong mắt người mua.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}