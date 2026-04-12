import { FaImage, FaHeart, FaRegHeart, FaAngleDown } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  title: string;
};

const items = Array(8).fill({
  title: "Giáo trình Kinh tế vi mô",
  price: "35.000đ",
  university: "UEH • 30 phút trước",
  image: "",
});

const universityMap: Record<string, string> = {
  UEH: "ĐH Kinh tế",
  HCMUS: "ĐH Khoa học Tự nhiên",
  UIT: "ĐH CNTT",
  NLU: "ĐH Nông Lâm",
  HCMUTE: "ĐH Sư phạm Kỹ thuật",
  HCMUSSH: "ĐH KHXH&NV",
  HUFLIT: "ĐH Ngoại ngữ - Tin học",
  HCMUE: "ĐH Mở",
};

const getUniversityName = (university: string) => {
  const code = university.split(" • ")[0];
  return universityMap[code] || code;
};

export default function Products({ title }: Props) {
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [selected, setSelected] = useState("Mới nhất");
  const navigate = useNavigate();
  return (
    <div className="product-section mt-4">
      <div className="product-header">
        <h5 className="product-title">{title}</h5>

        <div className="filter-wrapper">
          <div
            className="filter-btn"
            onClick={() => setOpenFilter(!openFilter)}
          >
            {selected}
            <FaAngleDown className="filter-icon" />
          </div>

          {openFilter && (
            <div className="filter-dropdown">
              {["Mới nhất", "Giá thấp → cao", "Giá cao → thấp"].map(
                (option) => (
                  <div
                    key={option}
                    className="filter-item"
                    onClick={() => {
                      setSelected(option);
                      setOpenFilter(false);
                    }}
                  >
                    {option}
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      {/* LIST */}
      <div className="row">
        {items.map((item, index) => (
          <div className="col-6 col-md-3 mb-3" key={index}>
            <div
              className="product-card"
              onClick={() => navigate(`/product/${index + 1}`)}
            >
              {/* HEART ICON */}
              <div
                className="product-heart"
                onClick={(e) => {
                  // chặn sự kiện nổi bọt để không điều hướng khi bấm tim
                  e.stopPropagation();
                  setLikedItems((prev) =>
                    prev.includes(index)
                      ? prev.filter((i) => i !== index)
                      : [...prev, index],
                  );
                }}
              >
                {likedItems.includes(index) ? <FaHeart /> : <FaRegHeart />}
              </div>

              {/* IMAGE */}
              <div className="product-img-wrapper">
                {item.image && (
                  <img
                    src={item.image}
                    alt=""
                    className="product-img"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}

                {/* PLACEHOLDER */}
                {!item.image && (
                  <div className="product-img-placeholder">
                    <FaImage size={24} />
                    <span>Ảnh sản phẩm</span>
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className="product-info">
                <h6 className="product-item-title">
                  {item.title} - {getUniversityName(item.university)}
                </h6>

                <p className="product-price">{item.price}</p>

                <small className="product-meta">{item.university}</small>

                <div className="product-action">
                  <button className="product-status-btn">Đã qua sử dụng</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
