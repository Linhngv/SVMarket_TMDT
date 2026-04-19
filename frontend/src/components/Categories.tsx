import React, { useState, useEffect } from "react";
import { FaImage } from "react-icons/fa";

type Category = {
    id: number;
    name: string;
    image?: string;
};

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/listings/categories");
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error("Lỗi fetch danh mục:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="category-section mt-4">
            <h5 className="category-title">Danh mục</h5>

            <div className="category-grid">
                {loading ? (
                    <p>Đang tải danh mục...</p>
                ) : (
                    categories.map((item) => (
                        <div key={item.id} className="category-item">
                            {item.image ? (
                                <img 
                                    src={item.image.startsWith("http") ? item.image : `http://localhost:8080${item.image}`} 
                                    alt={item.name} 
                                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                                />
                            ) : (
                                <div className="category-img-placeholder">
                                    <FaImage size={24} />
                                    <span>Ảnh sản phẩm</span>
                                </div>
                            )}
                            <div className="category-label">
                                {item.name}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}