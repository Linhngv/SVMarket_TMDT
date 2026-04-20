import React, { useState, useEffect, useCallback } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopBar from "../../components/admin/AdminTopBar";
import { Search, Plus, Upload, Download, Edit, Filter } from "lucide-react";
import "../../styles/admin/AdminPackage.css"; 

interface PackagePlan {
    id: number;
    name: string;
    price: number;
    postLimit: number;
    pushLimit: number;
    pushHours: number;
    priorityLevel: number;
    isHighlight: boolean;
    isFeatured: boolean;
    durationDays: number;
    status: "ACTIVE" | "INACTIVE" | "EXPIRED";
}

export default function AdminPackage() {
    const [packages, setPackages] = useState<PackagePlan[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    
    // popup add/edit
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<PackagePlan>({
        id: 0,
        name: "",
        price: 0,
        postLimit: 0,
        pushLimit: 0,
        pushHours: 0,
        priorityLevel: 1,
        isHighlight: false,
        isFeatured: false,
        durationDays: 30,
        status: "ACTIVE"
    });

    // phan trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    //goi api lay danh sach goi tin
    const fetchPackages = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            let url = `http://localhost:8080/api/package-plans/admin/packages?page=${currentPage - 1}&size=${itemsPerPage}`;
            if (searchTerm) {
                url += `&name=${encodeURIComponent(searchTerm)}`;
            }
            if (filterStatus !== "ALL") {
                url += `&status=${filterStatus}`;
            }

            const res = await fetch(url, {
                headers: token ? { "Authorization": `Bearer ${token}` } : {}
            });
            if (res.ok) {
                const data = await res.json();
                const mappedPackages = data.content.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    postLimit: item.postLimit || 0,
                    pushLimit: item.pushLimit || 0,
                    pushHours: item.pushHours || 0,
                    priorityLevel: item.priorityLevel || 1,
                    isHighlight: item.isHighlight || false,
                    isFeatured: item.isFeatured || false,
                    durationDays: item.durationDays,
                    status: item.status || "ACTIVE"
                }));
                setPackages(mappedPackages);
                setTotalPages(data.totalPages);
                setTotalElements(data.totalElements);
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách gói tin", error);
        }
    }, [currentPage, itemsPerPage, searchTerm, filterStatus]);

    // trigger fetch khi thay doi search/filter/page
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPackages();
        }, 500);
        return () => clearTimeout(timer);
    }, [fetchPackages]);

    // chuyen trang
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // format tien te
    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('vi-VN') + ' đ';
    };

    // popup them moi
    const handleOpenAdd = () => {
        setEditMode(false);
        setFormData({ 
            id: 0, 
            name: "", 
            price: 0, 
            postLimit: 0, 
            pushLimit: 0, 
            pushHours: 0, 
            priorityLevel: 1, 
            isHighlight: false, 
            isFeatured: false, 
            durationDays: 30, 
            status: "ACTIVE" 
        });
        setShowModal(true);
    };

    // popup cap nhat
    const handleOpenEdit = (pkg: PackagePlan) => {
        setEditMode(true);
        setFormData({ ...pkg });
        setShowModal(true);
    };

    // xu ly du lieu tu form va goi API luu
    const handleSave = async () => {
        const token = localStorage.getItem("token");
        const payload = {
            name: formData.name,
            price: formData.price,
            durationDays: formData.durationDays,
            status: formData.status,
            postLimit: formData.postLimit,
            pushLimit: formData.pushLimit,
            pushHours: formData.pushHours,
            priorityLevel: formData.priorityLevel,
            isHighlight: formData.isHighlight,
            isFeatured: formData.isFeatured
        };

        try {
            const url = editMode 
                ? `http://localhost:8080/api/package-plans/admin/packages/${formData.id}`
                : `http://localhost:8080/api/package-plans/admin/packages`;
            const method = editMode ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setShowModal(false);
                fetchPackages();
                alert(editMode ? "Cập nhật thành công!" : "Thêm mới thành công!");
            } else {
                alert("Có lỗi xảy ra khi lưu gói tin!");
            }
        } catch (error) {
            console.error("Lỗi lưu gói tin:", error);
            alert("Lỗi kết nối máy chủ!");
        }
    };

    return (
        <div className="admin-container d-flex">
            {/* SIDEBAR */}
            <AdminSidebar />

            {/* MAIN */}
            <div className="admin-main flex-grow-1">
                {/* TOPBAR */}
                <AdminTopBar breadcrumb="Trang chủ > Quản lý gói tin > Danh sách gói tin" />

                {/* CONTENT */}
                <div className="admin-content container-fluid mt-4">
                    <div className="card p-4 shadow-sm">
                        {/* HEADER & ACTION BUTTONS */}
                        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                            <h3 className="page-title m-0">Danh sách gói tin</h3>
                            
                            <div className="d-flex gap-2">
                                <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
                                    <Upload size={18} />
                                    Import
                                </button>
                                <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
                                    <Download size={18} />
                                    Export
                                </button>
                                <button className="btn d-flex align-items-center gap-2 btn-add-package" onClick={handleOpenAdd}>
                                    <Plus size={18} />
                                    Thêm gói tin
                                </button>
                            </div>
                        </div>

                        {/* SEARCH & FILTER */}
                        <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                            {/* Khối Tìm kiếm */}
                            <div className="d-flex align-items-center border rounded bg-white package-search-box">
                                <div className="px-3 d-flex align-items-center justify-content-center">
                                    <Search size={18} className="text-muted" />
                                </div>
                                <input 
                                    type="text" 
                                    className="form-control border-0 shadow-none bg-transparent ps-0 py-2" 
                                    placeholder="Tìm kiếm theo ID, Tên gói..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                            
                            {/* Khối Lọc */}
                            <div className="d-flex align-items-center border rounded bg-white package-filter-box">
                                <div className="px-3 d-flex align-items-center justify-content-center">
                                    <Filter size={18} className="text-muted" />
                                </div>
                                <select 
                                    className="form-select border-0 shadow-none bg-transparent ps-0 py-2 package-filter-select"
                                    value={filterStatus}
                                    onChange={(e) => {
                                        setFilterStatus(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="ALL">Tất cả trạng thái</option>
                                    <option value="ACTIVE">Đang hoạt động</option>
                                    <option value="INACTIVE">Ngừng hoạt động</option>
                                    <option value="EXPIRED">Hết hạn</option>
                                </select>
                            </div>
                        </div>

                        {/* TABLE */}
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th className="fw-normal">ID</th>
                                        <th className="fw-normal">Tên gói tin</th>
                                        <th className="fw-normal">Giá</th>
                                        <th className="fw-normal">Số lượng</th>
                                        <th className="fw-normal">Trạng thái</th>
                                        <th className="fw-normal text-center">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {packages.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-4 text-muted">
                                                Không tìm thấy gói tin nào
                                            </td>
                                        </tr>
                                    ) : (
                                        packages.map((pkg) => (
                                            <tr key={pkg.id}>
                                            <td>#{pkg.id}</td>
                                                <td>{pkg.name}</td>
                                                <td>{formatCurrency(pkg.price)}</td>
                                            <td>{pkg.postLimit || 0}</td>
                                            <td className={pkg.status === 'ACTIVE' ? 'text-success' : pkg.status === 'INACTIVE' ? 'text-danger' : 'text-secondary'}>
                                                {pkg.status === 'ACTIVE' ? 'Đang hoạt động' : pkg.status === 'INACTIVE' ? 'Ngừng hoạt động' : 'Hết hạn'}
                                                </td>
                                                <td>
                                                    <div className="d-flex justify-content-center gap-2">
                                                    <button className="btn btn-sm btn-outline-success rounded-circle" title="Chỉnh sửa" onClick={() => handleOpenEdit(pkg)}>
                                                            <Edit size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        {totalPages > 1 && (
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <span className="text-muted small">
                                    Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalElements)} trong tổng số {totalElements} gói tin
                                </span>
                                <nav>
                                    <ul className="pagination mb-0">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                                                Trước
                                            </button>
                                        </li>
                                        
                                        {[...Array(totalPages)].map((_, i) => (
                                            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => paginate(i + 1)}>
                                                    {i + 1}
                                                </button>
                                            </li>
                                        ))}

                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                                                Sau
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        )}

                    </div>
                </div>

                {/* MODAL THÊM / CHỈNH SỬA */}
                {showModal && (
                    <div className="modal d-block modal-overlay" tabIndex={-1}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{editMode ? "Chỉnh sửa gói tin" : "Thêm gói tin mới"}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Tên gói tin</label>
                                        <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Nhập tên gói..." />
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">Giá (VND)</label>
                                            <input type="number" className="form-control" value={formData.price} onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})} placeholder="VD: 50000" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">Thời hạn (Ngày)</label>
                                            <input type="number" className="form-control" value={formData.durationDays} onChange={(e) => setFormData({...formData, durationDays: parseInt(e.target.value) || 0})} placeholder="VD: 30" />
                                        </div>
                                    </div>

                                    {!editMode && (
                                        <>
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label className="form-label fw-medium">Số bài đăng tối đa</label>
                                                    <input type="number" className="form-control" value={formData.postLimit} onChange={(e) => setFormData({...formData, postLimit: parseInt(e.target.value) || 0})} placeholder="VD: 10" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label fw-medium">Số lượt đẩy tin</label>
                                                    <input type="number" className="form-control" value={formData.pushLimit} onChange={(e) => setFormData({...formData, pushLimit: parseInt(e.target.value) || 0})} placeholder="VD: 5" />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label className="form-label fw-medium">Hiệu lực đẩy tin (Giờ)</label>
                                                    <input type="number" className="form-control" value={formData.pushHours} onChange={(e) => setFormData({...formData, pushHours: parseInt(e.target.value) || 0})} placeholder="VD: 24" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label fw-medium">Mức độ ưu tiên (1-3)</label>
                                                    <input type="number" className="form-control" value={formData.priorityLevel} min={1} max={3} onChange={(e) => setFormData({...formData, priorityLevel: parseInt(e.target.value) || 1})} />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="row mb-3">
                                        {!editMode && (
                                            <div className="col-md-6">
                                                <label className="form-label fw-medium d-block">Tùy chọn hiển thị</label>
                                                <div className="form-check form-check-inline mt-2">
                                                    <input className="form-check-input" type="checkbox" checked={formData.isHighlight} onChange={(e) => setFormData({...formData, isHighlight: e.target.checked})} id="isHighlight" />
                                                    <label className="form-check-label" htmlFor="isHighlight">Nổi bật</label>
                                                </div>
                                                <div className="form-check form-check-inline mt-2">
                                                    <input className="form-check-input" type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} id="isFeatured" />
                                                    <label className="form-check-label" htmlFor="isFeatured">Đề xuất</label>
                                                </div>
                                            </div>
                                        )}
                                        <div className={!editMode ? "col-md-6" : "col-12"}>
                                            <label className="form-label fw-medium">Trạng thái</label>
                                            <select className="form-select" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as "ACTIVE" | "INACTIVE" | "EXPIRED"})}>
                                                <option value="ACTIVE">Đang hoạt động</option>
                                                <option value="INACTIVE">Ngừng hoạt động</option>
                                                <option value="EXPIRED">Hết hạn</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-light text-danger border shadow-sm" onClick={() => setShowModal(false)}>Hủy</button>
                                    <button type="button" className="btn btn-add-package" onClick={handleSave}>
                                        {editMode ? "Cập nhật" : "Thêm mới"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}