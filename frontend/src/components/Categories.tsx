const data = [
    "Giáo trình",
    "Đồng phục",
    "Balo/Túi",
    "Đồ KTX",
    "Dụng cụ học tập",
    "Đồ bếp",
    "Thiết bị",
];

export default function Categories() {
    return (
        <div className="category-section mt-4">
            <h5 className="mb-3 category-title">Danh mục</h5>

            <div className="row">
                {data.map((item, index) => (
                    <div key={index} className="col-4 col-md-2 category-item">
                        <img src="https://via.placeholder.com/60" alt="" />
                        <div>{item}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}