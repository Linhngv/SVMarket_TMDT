import { ChangeEvent, useState } from "react";
import { ChevronDown, Plus, Tag, Zap, Check, X, AlertCircle,} from "lucide-react";
import { CategoryOption } from "../../services/listingService";

export type SellerPackageOption = {
  id: number;
  packageName: string;
  remainingPosts: number;
  remainingPushes: number;
};

export type ListingFormValues = {
  title: string;
  categoryId: string;
  price: string;
  deliveryAddress: string;
  conditionLevel: string;
  description: string;
  status: string;
  sellerPackageId: string;
  wantPush?: boolean;
};

type ListingFormProps = {
  title: string;
  submitLabel: string;
  categories: CategoryOption[];
  packages: SellerPackageOption[];
  values: ListingFormValues;
  imagePreviews: string[];
  submitDisabled?: boolean;
  showStatusField?: boolean;
  showBack?: boolean;
  isEditMode?: boolean;
  titleWarning?: React.ReactNode;
  descriptionWarning?: React.ReactNode;
  onBack?: () => void;
  onChange: (nextValues: ListingFormValues) => void;
  onImageChange: (files: File[]) => void;
  onSubmit: () => void;
};

const CONDITION_OPTIONS = [
  { value: "Mới", label: "Mới" },
  { value: "Mới 95%", label: "Mới 95%" },
  { value: "Đã qua sử dụng", label: "Đã qua sử dụng" },
];

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Chờ duyệt" },
  { value: "ACTIVE", label: "Đang bán" },
  { value: "SOLD", label: "Đã bán" },
  { value: "INACTIVE", label: "Tạm ẩn" },
  { value: "REJECTED", label: "Bị từ chối" },
];

export default function ListingForm({
  title,
  submitLabel,
  categories,
  packages = [],
  values,
  imagePreviews,
  submitDisabled = false,
  showStatusField = false,
  showBack = false,
  titleWarning,
  descriptionWarning,
  isEditMode = false,
  onBack,
  onChange,
  onImageChange,
  onSubmit,
}: ListingFormProps) {
  const [showPackageModal, setShowPackageModal] = useState(false);
  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    onChange({
      ...values,
      [name]: value,
    });
  };

  // Giới hạn số ảnh tối đa 5 file để phù hợp giao diện và backend.
  const handleImageInput = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []).slice(0, 5);

    onImageChange(selectedFiles);
  };

  const isUsingPackage = !!values.sellerPackageId;
  const hasPackages = packages.length > 0;

  return (
    <section className="listing-panel">
      <div className="listing-panel-header">
        {showBack && (
          <button type="button" className="listing-back-btn" onClick={onBack}>
            <span>‹</span> Quay lại
          </button>
        )}

        <h2>{title}</h2>
      </div>

      <div className="listing-form-grid">
        <div className="field-group full-width">
          <label>Ảnh sản phẩm</label>

          <label className="image-upload-box" htmlFor="listing-image-input">
            <input
              id="listing-image-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageInput}
            />

            <div className="image-preview-row">
              {imagePreviews.length > 0 ? (
                imagePreviews.map((preview, index) => (
                  <div className="image-thumb" key={`${preview}-${index}`}>
                    <img src={preview} alt={`preview-${index}`} />
                  </div>
                ))
              ) : (
                <span className="image-placeholder">
                  Nhấn để thêm ảnh (Tối đa 5 ảnh)
                </span>
              )}

              {imagePreviews.length > 0 && imagePreviews.length < 5 && (
                <div className="image-thumb add-more">
                  <Plus size={16} />
                </div>
              )}
            </div>
          </label>
        </div>

        <div className="field-group full-width">
          <label>Tiêu đề bài đăng</label>

          <div
            style={{
              position: "relative",
              display: "flex",
            }}
          >
            {titleWarning && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: "11px 14px",
                  fontSize: "16px",
                  lineHeight: "1.35",
                  pointerEvents: "none",
                  whiteSpace: "pre",
                  overflow: "hidden",
                  color: "#111827",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  border: "1px solid #c0392b",
                  zIndex: 0,
                }}
              >
                {titleWarning}
              </div>
            )}

            <input
              name="title"
              value={values.title}
              onChange={handleInputChange}
              placeholder="VD: Sào phơi đồ 2 tầng cũ"
              style={
                titleWarning
                  ? {
                      color: "transparent",
                      caretColor: "#111827",
                      backgroundColor: "transparent",
                      position: "relative",
                      zIndex: 1,
                    }
                  : {}
              }
            />
          </div>
        </div>

        <div className="field-group">
          <label>Danh mục</label>

          <div className="select-wrap">
            <select
              name="categoryId"
              value={values.categoryId}
              onChange={handleInputChange}
            >
              <option value="">Chọn danh mục</option>

              {categories.map((category) => (
                <option key={category.id} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
            </select>

            <ChevronDown size={16} />
          </div>
        </div>

        <div className="field-group">
          <label>Giá bán (VND)</label>

          <input
            name="price"
            type="number"
            min={0}
            value={values.price}
            onChange={handleInputChange}
          />
        </div>

        <div className="field-group full-width">
          <label>Địa điểm giao</label>

          <input
            name="deliveryAddress"
            value={values.deliveryAddress}
            onChange={handleInputChange}
            placeholder="VD: Cổng UEH Nguyễn Đình Chiểu"
          />
        </div>

        <div className="field-group full-width">
          <label>Tình trạng</label>

          <div className="select-wrap">
            <select
              name="conditionLevel"
              value={values.conditionLevel}
              onChange={handleInputChange}
            >
              {CONDITION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <ChevronDown size={16} />
          </div>
        </div>

        {showStatusField && (
          <div className="field-group full-width">
            <label>Trạng thái</label>

            <div className="select-wrap">
              <select
                name="status"
                value={values.status}
                onChange={handleInputChange}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown size={16} />
            </div>
          </div>
        )}

        <div className="field-group full-width">
          <label>Mô tả chi tiết</label>

          <div
            style={{
              position: "relative",
              display: "flex",
            }}
          >
            {descriptionWarning && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: "11px 14px",
                  fontSize: "16px",
                  lineHeight: "1.35",
                  pointerEvents: "none",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflow: "hidden",
                  color: "#111827",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  border: "1px solid #c0392b",
                  zIndex: 0,
                }}
              >
                {descriptionWarning}
              </div>
            )}

            <textarea
              name="description"
              value={values.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Mô tả tình trạng, lý do bán, phụ kiện kèm theo..."
              style={
                descriptionWarning
                  ? {
                      color: "transparent",
                      caretColor: "#111827",
                      backgroundColor: "transparent",
                      position: "relative",
                      zIndex: 1,
                    }
                  : {}
              }
            />
          </div>
        </div>

        {/* ===== LOẠI ĐĂNG ===== */}
        <div className="field-group full-width">
          <label>Loại đăng</label>

          <div className="post-source-grid">
            {/* FREE */}
            <div
              className={`post-option-card ${!isUsingPackage ? "active" : ""}`}
              onClick={() => {
                onChange({
                  ...values,
                  sellerPackageId: "",
                });
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onChange({
                    ...values,
                    sellerPackageId: "",
                  });
                }
              }}
            >
              <div className="post-option-radio">
                {!isUsingPackage && <Check size={12} />}
              </div>

              <div className="post-option-icon">
                <Tag size={24} />
              </div>

              <div className="post-option-content">
                <strong>Đăng miễn phí</strong>
                <p>Hiển thị bình thường</p>
              </div>
            </div>

            {/* PACKAGE */}
            <div
              className={`post-option-card ${
                isUsingPackage ? "active" : ""
              } ${!hasPackages ? "disabled" : ""}`}
              onClick={() => {
                if (!hasPackages) return;

                if (!isUsingPackage) {
                  onChange({
                    ...values,
                    sellerPackageId: String(packages[0].id),
                  });
                }
                setShowPackageModal(true);
              }}
              role="button"
              tabIndex={!hasPackages ? -1 : 0}
              onKeyDown={(e) => {
                if (!hasPackages) return;
                if (e.key === "Enter" || e.key === " ") {
                  if (!isUsingPackage) {
                    onChange({
                      ...values,
                      sellerPackageId: String(packages[0].id),
                    });
                  }
                  setShowPackageModal(true);
                }
              }}
            >
              <div className="post-option-radio">
                {isUsingPackage && <Check size={12} />}
              </div>

              <div className="post-option-icon premium">
                <Zap size={24} />
              </div>

              <div className="post-option-content">
                <strong>Đăng bằng gói</strong>
                <p>
                  {hasPackages
                    ? "Ưu tiên hiển thị + đẩy tin"
                    : "Bạn chưa có gói nào"}
                </p>
              </div>
            </div>
          </div>

          {/* Package Modal — Hiện khi chọn "Đăng bằng gói" */}
          {isUsingPackage && (
            <>
              <button
                type="button"
                className="package-modal-trigger"
                onClick={() => setShowPackageModal(true)}
              >
                <div className="package-info">
                  <span className="package-label">Gói của bạn</span>
                  <span className="package-selected">
                    {packages.find(
                      (p) => String(p.id) === values.sellerPackageId,
                    )?.packageName || "Chọn gói"}
                  </span>
                </div>
                <ChevronDown size={18} />
              </button>

              {/* Modal Backdrop */}
              {showPackageModal && (
                <div
                  className="package-modal-backdrop"
                  onClick={() => setShowPackageModal(false)}
                />
              )}

              {/* Modal */}
              {showPackageModal && (
                <div className="package-modal">
                  <div className="package-modal-header">
                    <h3>Chọn gói đăng tin</h3>
                    <button
                      type="button"
                      className="modal-close-btn"
                      onClick={() => setShowPackageModal(false)}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {isEditMode && (
                    <div className="package-modal-notice">
                      <AlertCircle size={18} />
                      <span>
                        Hỗ trợ nâng cấp gói hiển thị cho bài đăng hiện tại
                      </span>
                    </div>
                  )}

                  <div className="package-modal-list">
                    {packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`package-modal-item ${
                          String(pkg.id) === values.sellerPackageId
                            ? "active"
                            : ""
                        }`}
                        onClick={() => {
                          const confirmPush = window.confirm(
                            "Bạn có chắc muốn đẩy tin ngay để tăng ưu tiên hiển thị không?",
                          );

                          onChange({
                            ...values,
                            sellerPackageId: String(pkg.id),
                            wantPush: confirmPush,
                          });

                          setShowPackageModal(false);
                        }}
                      >
                        <div className="package-item-header">
                          <span className="package-name">
                            {pkg.packageName}
                          </span>
                          {String(pkg.id) === values.sellerPackageId && (
                            <div className="package-item-badge">Đang dùng</div>
                          )}
                        </div>
                        <div className="package-item-stats">
                          <div className="stat">
                            <span className="stat-label">Lượt đăng</span>
                            <span className="stat-value">
                              {pkg.remainingPosts}
                            </span>
                          </div>
                          <div className="stat">
                            <span className="stat-label">Lượt đẩy</span>
                            <span className="stat-value">
                              {pkg.remainingPushes}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="package-modal-footer">
                    <button
                      type="button"
                      className="modal-btn-close"
                      onClick={() => setShowPackageModal(false)}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <button
        className="listing-submit-btn"
        type="button"
        onClick={onSubmit}
        disabled={submitDisabled}
      >
        {submitLabel}
      </button>
    </section>
  );
}
