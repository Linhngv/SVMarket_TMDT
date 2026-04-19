import { ChangeEvent } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { CategoryOption } from "../../services/listingService";

export type ListingFormValues = {
  title: string;
  categoryId: string;
  price: string;
  deliveryAddress: string;
  conditionLevel: string;
  description: string;
  status: string;
};

type ListingFormProps = {
  title: string;
  submitLabel: string;
  categories: CategoryOption[];
  values: ListingFormValues;
  imagePreviews: string[];
  submitDisabled?: boolean;
  showStatusField?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  onChange: (nextValues: ListingFormValues) => void;
  onImageChange: (files: File[]) => void;
  onSubmit: () => void;
};

const CONDITION_OPTIONS = [
  { value: "Da qua su dung", label: "Đã qua sử dụng" },
  { value: "Moi 95%", label: "Mới 95%" },
  { value: "Moi", label: "Mới" },
];
const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Đang bán" },
  { value: "SOLD", label: "Đã bán" },
  { value: "INACTIVE", label: "Tạm ẩn" },
];

export default function ListingForm({
  title,
  submitLabel,
  categories,
  values,
  imagePreviews,
  submitDisabled = false,
  showStatusField = false,
  showBack = false,
  onBack,
  onChange,
  onImageChange,
  onSubmit,
}: ListingFormProps) {
  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    onChange({ ...values, [name]: value });
  };

  // Giới hạn số ảnh tối đa 5 file để phù hợp giao diện và backend.
  const handleImageInput = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []).slice(0, 5);
    onImageChange(selectedFiles);
  };

  return (
    <section className="listing-panel">
      <div className="listing-panel-header">
        {showBack && (
          <button type="button" className="listing-back-btn" onClick={onBack}>
            <span>‹</span>
            Quay lai
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
          <input
            name="title"
            value={values.title}
            onChange={handleInputChange}
            placeholder="VD: Sào phơi đồ 2 tầng cũ"
          />
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
          <textarea
            name="description"
            value={values.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Mô tả tình trạng, lý do bán, phụ kiện kèm theo..."
          />
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
