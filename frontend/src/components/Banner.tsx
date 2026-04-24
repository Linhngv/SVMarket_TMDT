import { useEffect, useRef, useState } from "react";
import {
  fetchActiveListings,
  ListingSummary,
} from "../services/listingService";

// Banner nhận props để cập nhật từ khóa tìm kiếm toàn cục
export default function Banner({
  searchKeyword,
  setSearchKeyword,
}: {
  searchKeyword: string;
  setSearchKeyword: (v: string) => void;
}) {
  // State cho input người dùng đang nhập
  const [inputValue, setInputValue] = useState("");
  // Danh sách sản phẩm để gợi ý
  const [allProducts, setAllProducts] = useState<ListingSummary[]>([]);
  // Gợi ý từ khóa
  const [suggestions, setSuggestions] = useState<ListingSummary[]>([]);
  // Hiển thị khung gợi ý
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lấy danh sách sản phẩm 1 lần khi mount
  useEffect(() => {
    fetchActiveListings().then(setAllProducts);
  }, []);

  // Khi input thay đổi, cập nhật gợi ý
  useEffect(() => {
    if (inputValue.trim() === "") {
      setSuggestions([]);
      return;
    }
    const lower = inputValue.toLowerCase();
    setSuggestions(
      allProducts
        .filter(
          (item) =>
            item.title.toLowerCase().includes(lower) ||
            (item.sellerName && item.sellerName.toLowerCase().includes(lower)),
        )
        .slice(0, 8),
    );
  }, [inputValue, allProducts]);

  // Khi searchKeyword thay đổi (bấm tìm kiếm), cập nhật inputValue
  useEffect(() => {
    setInputValue(searchKeyword);
  }, [searchKeyword]);

  // Đóng suggestions khi click ngoài
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!inputRef.current?.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Xử lý chọn gợi ý
  const handleSelectSuggestion = (item: ListingSummary) => {
    setInputValue(item.title);
    setShowSuggestions(false);
    // Không tìm kiếm ngay, chỉ cập nhật input
  };

  // Xử lý tìm kiếm khi bấm nút hoặc Enter
  const handleSearch = () => {
    setShowSuggestions(false);
    setSearchKeyword(inputValue.trim());
  };

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
        <div className="search-wrapper" style={{ position: "relative" }}>
          <input
            ref={inputRef}
            className="form-control search-input-home"
            placeholder="Tìm giáo trình, đồ KTX, đồng phục..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            autoComplete="off"
          />

          {/* Gợi ý từ khóa */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 15px)",
                left: 0,
                right: 0,
                background: "#fff",
                border: "1px solid #eee",
                zIndex: 10,
                maxHeight: 320,
                overflowY: "auto",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  padding: 12,
                  fontWeight: 600,
                  color: "#030000",
                  fontSize: 18,
                }}
              >
                Có phải bạn muốn tìm ?
              </div>
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 10,
                    cursor: "pointer",
                  }}
                  onMouseDown={() => handleSelectSuggestion(item)}
                >
                  {item.thumbnailUrl && (
                    <img
                      src={
                        item.thumbnailUrl.startsWith("http")
                          ? item.thumbnailUrl
                          : `http://localhost:8080${item.thumbnailUrl}`
                      }
                      alt={item.title}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: 6,
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <span
                    style={{ fontSize: 16, fontWeight: 500, color: "black" }}
                  >
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          )}

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
          <button
            className="btn search-btn ms-2"
            type="button"
            onClick={handleSearch}
          >
            Tìm kiếm
          </button>
        </div>
      </div>
    </div>
  );
}
