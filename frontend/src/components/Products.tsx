import { FaImage, FaHeart, FaRegHeart } from "react-icons/fa";
import { useState } from "react";

type Props = {
    title: string;
};

const items = Array(8).fill({
    title: "Giáo trình Kinh tế vi mô",
    price: "35.000đ",
    university: "UEH • 30 phút trước",
    image: "",
});

export default function Products({ title }: Props) {
    const [likedItems, setLikedItems] = useState<number[]>([]);
    return (
        <div className="product-section mt-4">

            {/* SECTION TITLE */}
            <h5 className="product-title mb-3">{title}</h5>

            {/* LIST */}
            <div className="row">
                {items.map((item, index) => (
                    <div className="col-6 col-md-3 mb-3" key={index}>
                        <div className="product-card">

                            {/* HEART ICON */}
                            <div
                                className="product-heart"
                                onClick={() => {
                                    setLikedItems(prev =>
                                        prev.includes(index)
                                            ? prev.filter(i => i !== index)
                                            : [...prev, index]
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
                                        onError={(e) =>
                                            (e.currentTarget.style.display = "none")
                                        }
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
                                    {item.title}
                                </h6>

                                <p className="product-price">
                                    {item.price}
                                </p>

                                <small className="product-meta">
                                    {item.university}
                                </small>

                                <div className="product-action">
                                    <button className="product-status-btn">
                                        Đã qua sử dụng
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}