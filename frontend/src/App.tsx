import type { CSSProperties } from "react";

import { products } from "./data/products";

const stats = [
  { value: "1.2K+", label: "Sinh viên tham gia" },
  { value: "350+", label: "Tin đăng" },
  { value: "98%", label: "Hài lòng" },
];

const features = [
  "Đăng bán nhanh",
  "Tìm kiếm theo danh mục",
  "Giao diện thân thiện",
  "Tối ưu cho đồ án React JS",
];

function App() {
  return (
    <div className="page">
      <header className="header">
        <div className="container header__inner">
          <a className="logo" href="#top">
            <span>sv</span>Market
          </a>
          <nav className="nav">
            <a href="#san-pham">Sản phẩm</a>
            <a href="#tinh-nang">Tính năng</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero container" id="top">
          <div className="hero__content">
            <p className="eyebrow">Đồ án React JS</p>
            <h1>svMarket - Nền tảng mua bán dành cho sinh viên</h1>
            <p className="hero__text">
              Mẫu giao diện khởi đầu cho đồ án svMarket với bố cục rõ ràng, hiện
              đại và dễ mở rộng thêm đăng nhập, giỏ hàng hoặc quản trị.
            </p>

            <div className="hero__actions">
              <a className="btn btn--primary" href="#san-pham">
                Xem sản phẩm
              </a>
              <a className="btn btn--ghost" href="#tinh-nang">
                Tính năng
              </a>
            </div>
          </div>

          <div className="hero__card">
            <h2>Khởi tạo nhanh</h2>
            <p>
              Template React + Vite dành cho svMarket, phù hợp để phát triển
              tiếp thành website bán hàng cho sinh viên.
            </p>
            <div className="hero__mini-grid">
              {stats.map((item) => (
                <div className="mini-stat" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container section" id="san-pham">
          <div className="section__head">
            <div>
              <p className="eyebrow">Sản phẩm nổi bật</p>
              <h2>Danh sách tin đăng mẫu</h2>
            </div>
          </div>

          <div className="grid">
            {products.map((product) => {
              const cardStyle = { "--accent": product.accent } as CSSProperties;

              return (
                <article className="card" key={product.id} style={cardStyle}>
                  <div className="card__media">{product.emoji}</div>
                  <div className="card__body">
                    <span className="badge">{product.tag}</span>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="card__footer">
                      <strong>{product.price}</strong>
                      <button type="button">Liên hệ</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="container section" id="tinh-nang">
          <div className="section__head">
            <div>
              <p className="eyebrow">Tính năng</p>
              <h2>Khung chức năng cơ bản</h2>
            </div>
          </div>

          <div className="feature-list">
            {features.map((feature) => (
              <div className="feature" key={feature}>
                {feature}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>svMarket • Project React JS cho đồ án sinh viên</p>
        </div>
      </footer>
    </div>
  );
}

export default App;