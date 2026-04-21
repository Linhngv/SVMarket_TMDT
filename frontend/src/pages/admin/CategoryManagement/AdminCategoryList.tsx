import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminTopBar from "../../../components/admin/AdminTopBar";
import { Search, Plus, Edit, Trash2, Image as ImageIcon, Download, Upload, AlertTriangle } from "lucide-react";
import "../../../styles/admin/AdminPackage.css";

interface Category {
    id: number;
    name: string;
    image: string;
}

export default function AdminCategory() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

    // Form state
    const [categoryId, setCategoryId] = useState<number>(0);
    const [categoryName, setCategoryName] = useState("");
    const [categoryImage, setCategoryImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string>("");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const fileImportRef = useRef<HTMLInputElement>(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8080/api/admin/categories", {
                headers: token ? { "Authorization": `Bearer ${token}` } : {}
            });
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách danh mục", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenAdd = () => {
        setEditMode(false);
        setCategoryId(0);
        setCategoryName("");
        setCategoryImage(null);
        setPreviewImage("");
        setShowModal(true);
    };

    const handleOpenEdit = (cat: Category) => {
        setEditMode(true);
        setCategoryId(cat.id);
        setCategoryName(cat.name);
        setCategoryImage(null);
        setPreviewImage(cat.image ? (cat.image.startsWith("http") ? cat.image : `http://localhost:8080${cat.image}`) : "");
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        setCategoryToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!categoryToDelete) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:8080/api/admin/categories/${categoryToDelete}`, {
                method: "DELETE",
                headers: token ? { "Authorization": `Bearer ${token}` } : {}
            });
            if (res.ok) {
                alert("Xóa thành công!");
                fetchCategories();
            } else {
                const err = await res.text();
                alert("Không thể xóa: " + err);
            }
        } catch (error) {
            console.error("Lỗi xóa danh mục:", error);
            alert("Lỗi kết nối máy chủ khi xóa");
        } finally {
            setShowDeleteModal(false);
            setCategoryToDelete(null);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCategoryImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!categoryName.trim()) {
            alert("Vui lòng nhập tên danh mục");
            return;
        }

        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("name", categoryName.trim());
        if (categoryImage) {
            formData.append("image", categoryImage);
        }

        try {
            const url = editMode
                ? `http://localhost:8080/api/admin/categories/${categoryId}`
                : `http://localhost:8080/api/admin/categories`;
            const method = editMode ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: token ? { "Authorization": `Bearer ${token}` } : {},
                body: formData
            });

            if (res.ok) {
                setShowModal(false);
                fetchCategories();
                alert(editMode ? "Cập nhật thành công!" : "Thêm mới thành công!");
            } else {
                const err = await res.text();
                alert("Có lỗi xảy ra: " + err);
            }
        } catch (error) {
            console.error("Lỗi lưu danh mục:", error);
            alert("Lỗi kết nối máy chủ!");
        }
    };

    const handleExport = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8080/api/admin/categories/export", {
                headers: token ? { "Authorization": `Bearer ${token}` } : {}
            });
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "categories.xlsx";
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
            const res = await fetch("http://localhost:8080/api/admin/categories/import", {
                method: "POST",
                headers: token ? { "Authorization": `Bearer ${token}` } : {},
                body: formData
            });
            if (res.ok) {
                alert("Nhập dữ liệu thành công!");
                fetchCategories();
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
            <AdminSidebar />
            <div className="admin-main flex-grow-1">
                <AdminTopBar breadcrumb="Trang chủ > Quản lý danh mục" />
                <div className="admin-content container-fluid mt-4">
                    <div className="card p-4 shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                            <h3 className="page-title m-0">Danh sách danh mục</h3>
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
                                    Nhập Excel
                                </button>
                                <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={handleExport}>
                                    <Download size={18} />
                                    Xuất Excel
                                </button>
                                <button className="btn d-flex align-items-center gap-2 btn-add-package" onClick={handleOpenAdd}>
                                    <Plus size={18} />
                                    Thêm danh mục
                                </button>
                            </div>
                        </div>

                        <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                            <div className="d-flex align-items-center border rounded bg-white package-search-box flex-grow-1" style={{ maxWidth: "400px" }}>
                                <div className="px-3 d-flex align-items-center justify-content-center">
                                    <Search size={18} className="text-muted" />
                                </div>
                                <input
                                    type="text"
                                    className="form-control border-0 shadow-none bg-transparent ps-0 py-2"
                                    placeholder="Tìm kiếm theo tên danh mục..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th className="fw-normal" style={{ width: "80px" }}>ID</th>
                                        <th className="fw-normal" style={{ width: "120px" }}>Hình ảnh</th>
                                        <th className="fw-normal">Tên danh mục</th>
                                        <th className="fw-normal text-center" style={{ width: "150px" }}>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={4} className="text-center py-4 text-muted">Đang tải...</td></tr>
                                    ) : filteredCategories.length === 0 ? (
                                        <tr><td colSpan={4} className="text-center py-4 text-muted">Không tìm thấy danh mục nào</td></tr>
                                    ) : (
                                        filteredCategories.map((cat) => (
                                            <tr key={cat.id}>
                                                <td>#{cat.id}</td>
                                                <td>
                                                    {cat.image ? (
                                                        <img src={cat.image.startsWith("http") ? cat.image : `http://localhost:8080${cat.image}`} alt={cat.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} />
                                                    ) : (
                                                        <div className="bg-light d-flex align-items-center justify-content-center rounded" style={{ width: "60px", height: "60px" }}><ImageIcon size={24} className="text-muted" /></div>
                                                    )}
                                                </td>
                                                <td className="fw-medium">{cat.name}</td>
                                                <td>
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <button className="btn btn-sm btn-outline-success rounded-circle" title="Chỉnh sửa" onClick={() => handleOpenEdit(cat)}><Edit size={16} /></button>
                                                        <button className="btn btn-sm btn-outline-danger rounded-circle" title="Xóa" onClick={() => handleDelete(cat.id)}><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* MODAL */}
                {showModal && (
                    <div className="modal d-block modal-overlay" tabIndex={-1}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content custom-modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title w-100 text-center" style={{ fontSize: "20px" }}>{editMode ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Tên danh mục <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Nhập tên danh mục..." />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium d-block">Hình ảnh</label>
                                        <div className="rounded p-3 text-center image-upload-box" onClick={() => fileInputRef.current?.click()}>
                                            {previewImage ? (<img src={previewImage} alt="Preview" style={{ maxWidth: "100%", maxHeight: "150px", objectFit: "contain" }} />) : (<div className="py-3 text-muted"><ImageIcon size={32} className="mb-2" /><p className="m-0">Nhấn để tải ảnh lên</p></div>)}
                                        </div>
                                        <input type="file" ref={fileInputRef} className="d-none" accept="image/*" onChange={handleImageChange} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                                    <button type="button" className="btn btn-custom-primary" onClick={handleSave}>{editMode ? "Cập nhật" : "Thêm mới"}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* DELETE CONFIRMATION MODAL */}
                {showDeleteModal && (
                    <div className="modal d-block modal-overlay" tabIndex={-1}>
                        <div className="modal-dialog modal-dialog-centered modal-sm">
                            <div className="modal-content custom-modal-content">
                                <div className="modal-body text-center p-4">
                                    <AlertTriangle size={50} className="text-danger mb-3" />
                                    <p className="fs-5 my-3">Bạn có chắc chắn muốn xóa danh mục này không?</p>
                                    <div className="d-flex justify-content-center gap-3 mt-4">
                                        <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setShowDeleteModal(false)}>Hủy</button>
                                        <button type="button" className="btn btn-custom-danger px-4" onClick={confirmDelete}>Xác nhận xóa</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}