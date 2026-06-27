import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  getBannedKeywords,
  createBannedKeyword,
  updateBannedKeyword,
  deleteBannedKeyword,
} from "../../../services/bannedKeywordService";
import "../../../styles/admin/AdminBannedKeywords.css";

interface BannedKeyword {
  id: number;
  keyword: string;
  createdAt: string;
}

export default function AdminBannedKeywords() {
  // State quản lý danh sách từ khóa
  const [keywords, setKeywords] = useState<BannedKeyword[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State quản lý modal
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<BannedKeyword | null>(
    null,
  );
  const [keywordValue, setKeywordValue] = useState("");

  // State quản lý delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [keywordToDelete, setKeywordToDelete] = useState<BannedKeyword | null>(
    null,
  );

  // Tải dữ liệu từ khóa cấm
  const loadKeywords = async () => {
    setLoading(true);
    try {
      const data = await getBannedKeywords();
      setKeywords(data);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách từ khóa cấm");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Khởi tạo dữ liệu khi component mount
  useEffect(() => {
    loadKeywords();
  }, []);

  // Lọc từ khóa theo tìm kiếm
  const filteredKeywords = keywords.filter((item) =>
    item.keyword.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredKeywords.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedKeywords = filteredKeywords.slice(startIdx, endIdx);

  // Mở modal thêm từ khóa mới
  const handleOpenAddModal = () => {
    setEditMode(false);
    setSelectedKeyword(null);
    setKeywordValue("");
    setShowModal(true);
  };

  // Mở modal chỉnh sửa từ khóa
  const handleOpenEditModal = (keyword: BannedKeyword) => {
    setEditMode(true);
    setSelectedKeyword(keyword);
    setKeywordValue(keyword.keyword);
    setShowModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedKeyword(null);
    setKeywordValue("");
  };

  // Xử lý lưu từ khóa (thêm hoặc cập nhật)
  const handleSaveKeyword = async () => {
    if (!keywordValue.trim()) {
      toast.error("Vui lòng nhập từ khóa");
      return;
    }

    try {
      if (editMode && selectedKeyword) {
        // Cập nhật từ khóa
        await updateBannedKeyword(selectedKeyword.id, keywordValue.trim());
        toast.success("Cập nhật từ khóa cấm thành công");
      } else {
        // Thêm từ khóa mới
        await createBannedKeyword(keywordValue.trim());
        toast.success("Thêm từ khóa cấm thành công");
      }
      handleCloseModal();
      await loadKeywords();
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi lưu từ khóa");
    }
  };

  // Mở modal xác nhận xóa
  const handleOpenDeleteModal = (keyword: BannedKeyword) => {
    setKeywordToDelete(keyword);
    setShowDeleteModal(true);
  };

  // Xác nhận xóa từ khóa
  const handleConfirmDelete = async () => {
    if (!keywordToDelete) return;

    try {
      await deleteBannedKeyword(keywordToDelete.id);
      toast.success("Xóa từ khóa cấm thành công");
      setShowDeleteModal(false);
      setKeywordToDelete(null);
      await loadKeywords();
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi xóa từ khóa");
    }
  };

  // Đóng modal xác nhận xóa
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setKeywordToDelete(null);
  };

  if (loading) {
    return (
      <div className="card p-4 shadow-sm border-0">
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <>
      <div className="admin-content container-fluid mt-4">
          <div className="card p-4 shadow-sm border-0">
            {/* Header với tìm kiếm và nút thêm */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">Danh sách từ khóa cấm</h4>
              <button
                className="btn btn-custom-primary d-flex align-items-center gap-2"
                onClick={handleOpenAddModal}
              >
                <Plus size={20} />
                Thêm từ khóa cấm
              </button>
            </div>

            {/* Ô tìm kiếm */}
            <div className="d-flex gap-3 mb-4 flex-wrap">
              <input
                type="text"
                className="form-control search-input"
                placeholder="Tìm theo từ khóa ..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <button className="btn admin-btn-search px-4">Tìm kiếm</button>
            </div>

            {/* Bảng danh sách */}
            {paginatedKeywords.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr className="table-header-row">
                      <th className="py-3">ID</th>
                      <th className="py-3">Từ khóa cấm</th>
                      <th className="py-3">Thêm lúc</th>
                      <th className="py-3 text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedKeywords.map((keyword) => (
                      <tr key={keyword.id} className="table-body-row">
                        <td className="py-3">{keyword.id}</td>
                        <td className="py-3 fw-semibold">{keyword.keyword}</td>
                        <td className="py-3">
                          {new Date(keyword.createdAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </td>
                        <td className="py-3 text-center">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleOpenEditModal(keyword)}
                            title="Chỉnh sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleOpenDeleteModal(keyword)}
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <p className="text-muted fs-6">Không có từ khóa cấm nào</p>
              </div>
            )}

            {/* Phân trang */}
            {totalPages > 1 && (
              <nav className="d-flex justify-content-center mt-4">
                <ul className="pagination">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      Đầu tiên
                    </button>
                  </li>
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Trước
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <li
                        key={page}
                        className={`page-item ${currentPage === page ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      </li>
                    ),
                  )}

                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Tiếp
                    </button>
                  </li>
                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      Cuối cùng
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      
      {/* Modal Thêm/Chỉnh sửa từ khóa */}
      {showModal && (
        <div className="modal d-block modal-overlay" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content custom-modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {editMode ? "Chỉnh sửa từ khóa cấm" : "Thêm từ khóa cấm mới"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label
                    htmlFor="keywordInput"
                    className="form-label fw-semibold"
                  >
                    Từ khóa
                  </label>
                  <input
                    id="keywordInput"
                    type="text"
                    className="form-control"
                    placeholder="Nhập từ khóa cấm..."
                    value={keywordValue}
                    onChange={(e) => setKeywordValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSaveKeyword();
                      }
                    }}
                    autoFocus
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleCloseModal}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-custom-primary"
                  onClick={handleSaveKeyword}
                >
                  {editMode ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác nhận xóa */}
      {showDeleteModal && keywordToDelete && (
        <div className="modal d-block modal-overlay" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content custom-modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Xác nhận xóa</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseDeleteModal}
                ></button>
              </div>

              <div className="modal-body">
                <p className="mb-0">
                  Bạn chắc chắn muốn xóa từ khóa "
                  <strong>{keywordToDelete.keyword}</strong>" không?
                </p>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleCloseDeleteModal}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmDelete}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
