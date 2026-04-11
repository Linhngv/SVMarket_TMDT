import { FaImage } from "react-icons/fa";

type Category = {
    name: string;
    image?: string;
};

const data: Category[] = [
    { name: "Giáo trình" },
    { name: "Đồng phục" },
    { name: "Balo/Túi" },
    { name: "Đồ KTX" },
    { name: "Dụng cụ học tập" },
    { name: "Đồ bếp" },
    { name: "Thiết bị" },
];

export default function Categories() {
    return (
        <div className="category-section mt-4">
            <h5 className="category-title">Danh mục</h5>

            <div className="category-grid">
                {data.map((item, index) => (
                    <div key={index} className="category-item">

                        {/* IMAGE / PLACEHOLDER */}
                        {item.image ? (
                            <img src={item.image} alt={item.name} />
                        ) : (
                            <div className="category-img-placeholder">
                                <FaImage size={24} />
                                <span>Ảnh sản phẩm</span>
                            </div>
                        )}

                        {/* LABEL */}
                        <div className="category-label">
                            {item.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}