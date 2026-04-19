import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingForm, {
  ListingFormValues,
} from "../components/listing/ListingForm";
import {
  CategoryOption,
  createListing,
  fetchCategoryOptions,
} from "../services/listingService";
import "../styles/ListingManagement.css";

const DEFAULT_VALUES: ListingFormValues = {
  title: "",
  categoryId: "",
  price: "0",
  deliveryAddress: "",
  conditionLevel: "Da qua su dung",
  description: "",
  status: "ACTIVE",
};

export default function CreateListing() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [values, setValues] = useState<ListingFormValues>(DEFAULT_VALUES);
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategoryOptions();
        setCategories(data);
      } catch (error) {
        console.error("Không thể tải danh mục", error);
      }
    };

    loadCategories();
  }, []);

  const imagePreviews = useMemo(
    () => images.map((image) => URL.createObjectURL(image)),
    [images],
  );

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  // Validate dữ liệu trước khi gửi API tạo bài đăng.
  const handleCreateListing = async () => {
    if (!values.title.trim()) {
      alert("Vui lòng nhập tiêu đề bài đăng");
      return;
    }

    if (!values.categoryId) {
      alert("Vui lòng chọn danh mục");
      return;
    }

    const price = Number(values.price);
    if (Number.isNaN(price) || price <= 0) {
      alert("Giá bán phải lớn hơn 0");
      return;
    }

    setIsSubmitting(true);

    try {
      await createListing({
        title: values.title.trim(),
        categoryId: Number(values.categoryId),
        price,
        deliveryAddress: values.deliveryAddress.trim(),
        conditionLevel: values.conditionLevel,
        description: values.description.trim(),
        status: values.status,
        images,
      });

      alert("Thêm bài đăng thành công");
      navigate("/my-listings");
    } catch (error: any) {
      alert(error?.response?.data || "Không thể tạo bài đăng");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ListingForm
      title="Thêm bài đăng"
      submitLabel="Thêm bài đăng"
      categories={categories}
      values={values}
      imagePreviews={imagePreviews}
      submitDisabled={isSubmitting}
      onChange={setValues}
      onImageChange={setImages}
      onSubmit={handleCreateListing}
    />
  );
}
