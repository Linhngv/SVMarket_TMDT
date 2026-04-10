export default function Banner() {
  return (
    <div className="banner">
      <h4>
        Lướt ngay - Đồ ngon - <span style={{ color: "#D4A017" }}>Giá hời</span>
      </h4>
      <p className="text-center">
        Mua bán sách giáo trình, đồ KTX, đồng phục & dụng cụ học tập cũ giữa
        sinh viên các trường
      </p>

      <div className="search-box mt-3">
        <div className="search-wrapper">
          <input
            className="form-control search-input"
            placeholder="Tìm giáo trình, đồ KTX, đồng phục..."
          />

          <div className="select-wrapper">

            {/* ICON LEFT (location-dot) */}
            <span className="icon-left">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 384 512"
                fill="#6B7280"
              >
                <path d="M168 0C75.2 0 0 75.2 0 168c0 87.4 140.5 292.4 158.3 317.1 3.6 5 10.2 7.9 16.7 7.9s13.1-2.9 16.7-7.9C243.5 460.4 384 255.4 384 168 384 75.2 308.8 0 216 0H168zm24 256c-48.6 0-88-39.4-88-88s39.4-88 88-88 88 39.4 88 88-39.4 88-88 88z" />
              </svg>
            </span>

            {/* SELECT */}
            <select className="form-select search-select">
              <option>Chọn khu vực</option>
              <option>Hồ Chí Minh</option>
              <option>Hà Nội</option>
            </select>

            {/* ICON RIGHT (caret-down) */}
            <span className="icon-right">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 320 512"
                fill="#6B7280"
              >
                <path d="M31.3 192h257.4c28.4 0 42.7 34.5 22.6 54.6L182.6 375.3c-12.5 12.5-32.8 12.5-45.3 0L8.7 246.6C-11.4 226.5 2.9 192 31.3 192z" />
              </svg>
            </span>

          </div>

          <button className="btn search-btn">Tìm kiếm</button>
        </div>
      </div>
    </div>
  );
}
