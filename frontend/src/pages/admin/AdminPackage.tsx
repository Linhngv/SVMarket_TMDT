import React, { useState, useEffect, useCallback, useRef } from "react";
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

interface PackagePlanFormData {
    id: number;
    name: string;
    price: number | "";
    postLimit: number | "";
    pushLimit: number | "";
    pushHours: number | "";
    priorityLevel: number | "";
    isHighlight: boolean;
    isFeatured: boolean;
    durationDays: number | "";
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
    const [formData, setFormData] = useState<PackagePlanFormData>({
        id: 0,
        name: "",
        price: "",
        postLimit: "",
        pushLimit: "",
        pushHours: "",
        priorityLevel: 1,
        isHighlight: false,
        isFeatured: false,
        durationDays: 30,
        status: "ACTIVE"
    });
    const [originalData, setOriginalData] = useState<PackagePlanFormData | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const fileImportRef = useRef<HTMLInputElement>(null);

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
            price: "", 
            postLimit: "", 
            pushLimit: "", 
            pushHours: "", 
            priorityLevel: 1, 
            isHighlight: false, 
            isFeatured: false, 
            durationDays: 30, 
            status: "ACTIVE" 
        });
        setOriginalData(null);
        setIsSubmitted(false);
        setShowModal(true);
    };

    // popup cap nhat
    const handleOpenEdit = (pkg: PackagePlan) => {
        setEditMode(true);
        setFormData({ ...pkg });
        setOriginalData({ ...pkg });
        setIsSubmitted(false);
        setShowModal(true);
    };

    // xu ly du lieu tu form va goi API luu
    const handleSave = async () => {
        setIsSubmitted(true);
        // Kiểm tra dữ liệu không được để trống
        if (
            !formData.name.trim() ||
            formData.price === "" ||
            formData.durationDays === "" ||
            formData.postLimit === "" ||
            formData.pushLimit === "" ||
            formData.pushHours === "" ||
            formData.priorityLevel === ""
        ) {
            return;
        }

        if (editMode && originalData) {
            const isChanged = Object.keys(originalData).some(key => {
                const k = key as keyof PackagePlanFormData;
                return formData[k] !== originalData[k];
            });

            if (!isChanged) {
                setShowModal(false);
                return;
            }
        }

        const token = localStorage.getItem("token");
        const payload = {
            name: formData.name,
            price: Number(formData.price) || 0,
            durationDays: Number(formData.durationDays) || 0,
            status: formData.status,
            postLimit: Number(formData.postLimit) || 0,
            pushLimit: Number(formData.pushLimit) || 0,
            pushHours: Number(formData.pushHours) || 0,
            priorityLevel: Number(formData.priorityLevel) || 1,
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

    const handleExport = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8080/api/package-plans/admin/packages/export", {
                headers: token ? { "Authorization": `Bearer ${token}` } : {}
            });
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "packages.xlsx";
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } else {
                alert("Lỗi khi xuất file");
            }
        } catch (error) {
            console.error("Lỗi xuất file", error);
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:8080/api/package-plans/admin/packages/import", {
                method: "POST",
                headers: token ? { "Authorization": `Bearer ${token}` } : {},
                body: formData
            });
            if (res.ok) {
                alert("Nhập dữ liệu thành công!");
                fetchPackages();
            } else {
                const err = await res.text();
                alert("Lỗi nhập dữ liệu: " + err);
            }
        } catch (error) {
            console.error("Lỗi nhập file:", error);
            alert("Lỗi kết nối máy chủ khi nhập file");
        } finally {
            if (fileImportRef.current) fileImportRef.current.value = "";
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
                                <input 
                                    type="file" 
                                    accept=".xlsx, .xls" 
                                    className="d-none" 
                                    ref={fileImportRef} 
                                    onChange={handleImport} 
                                />
                                <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={() => fileImportRef.current?.click()}>
                                    <Upload size={18} />
                                    Import
                                </button>
                                <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={handleExport}>
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
                            <div className="d-flex justify-content-center align-items-center mt-4 flex-wrap gap-3">
                                <div className="d-flex align-items-center gap-3">
                                    <button 
                                        className="btn btn-pagination-prev" 
                                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Trước
                                    </button>
                                    <span className="fw-medium pagination-text">
                                        Trang {currentPage}/{totalPages}
                                    </span>
                                    <button 
                                        className="btn btn-pagination-next" 
                                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Kế tiếp
                                    </button>
                                </div>
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
                                        <label className="form-label fw-medium">Tên gói tin <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Nhập tên gói..." />
                                        {isSubmitted && formData.name.trim() === "" && <div className="text-danger small mt-1">Vui lòng nhập tên gói tin</div>}
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">Giá (VND) <span className="text-danger">*</span></label>
                                            <input type="number" className="form-control" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value === "" ? "" : Number(e.target.value)})} placeholder="VD: 50000" />
                                            {isSubmitted && formData.price === "" && <div className="text-danger small mt-1">Vui lòng nhập giá</div>}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">Thời hạn (Ngày) <span className="text-danger">*</span></label>
                                            <input type="number" className="form-control" value={formData.durationDays} onChange={(e) => setFormData({...formData, durationDays: e.target.value === "" ? "" : Number(e.target.value)})} placeholder="VD: 30" />
                                            {isSubmitted && formData.durationDays === "" && <div className="text-danger small mt-1">Vui lòng nhập thời hạn</div>}
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">Số bài đăng tối đa <span className="text-danger">*</span></label>
                                            <input type="number" className="form-control" value={formData.postLimit} onChange={(e) => setFormData({...formData, postLimit: e.target.value === "" ? "" : Number(e.target.value)})} placeholder="VD: 10" />
                                            {isSubmitted && formData.postLimit === "" && <div className="text-danger small mt-1">Vui lòng nhập số bài đăng</div>}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">Số lượt đẩy tin <span className="text-danger">*</span></label>
                                            <input type="number" className="form-control" value={formData.pushLimit} onChange={(e) => setFormData({...formData, pushLimit: e.target.value === "" ? "" : Number(e.target.value)})} placeholder="VD: 5" />
                                            {isSubmitted && formData.pushLimit === "" && <div className="text-danger small mt-1">Vui lòng nhập số lượt đẩy</div>}
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">Hiệu lực đẩy tin (Giờ) <span className="text-danger">*</span></label>
                                            <input type="number" className="form-control" value={formData.pushHours} onChange={(e) => setFormData({...formData, pushHours: e.target.value === "" ? "" : Number(e.target.value)})} placeholder="VD: 24" />
                                            {isSubmitted && formData.pushHours === "" && <div className="text-danger small mt-1">Vui lòng nhập hiệu lực đẩy</div>}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">Mức độ ưu tiên (1-3) <span className="text-danger">*</span></label>
                                            <input type="number" className="form-control" value={formData.priorityLevel} min={1} max={3} onChange={(e) => setFormData({...formData, priorityLevel: e.target.value === "" ? "" : Number(e.target.value)})} />
                                            {isSubmitted && formData.priorityLevel === "" && <div className="text-danger small mt-1">Vui lòng nhập mức độ ưu tiên</div>}
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-medium d-block">Tùy chọn hiển thị</label>
                                            <div className="form-check form-check-inline mt-2">
                                                <input className="form-check-input" type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} id="isFeatured" />
                                                <label className="form-check-label" htmlFor="isFeatured">Đề xuất</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
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