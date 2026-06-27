import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ListingForm, {
  ListingFormValues,
} from "../../components/listing/ListingForm";
import {
  CategoryOption,
  createListing,
  fetchCategoryOptions,
} from "../../services/listingService";
import { fetchMyPackages } from "../../services/packageService";
import type { SellerPackage } from "../../types/SellerPackage";
import "../../styles/user/ListingManagement.css";

const DEFAULT_VALUES: ListingFormValues = {
  title: "",
  categoryId: "",
  price: "0",
  deliveryAddress: "",
  conditionLevel: "Mới",
  description: "",
  status: "PENDING",
  sellerPackageId: "",
};

export default function CreateListing() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [values, setValues] = useState<ListingFormValues>(DEFAULT_VALUES);
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [packages, setPackages] = useState<SellerPackage[]>([]);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const data = await fetchMyPackages();

        setPackages(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadPackages();
  }, []);

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
      toast.error("Vui lòng nhập tiêu đề bài đăng");
      return;
    }

    if (!values.categoryId) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    const price = Number(values.price);
    if (Number.isNaN(price) || price <= 0) {
      toast.error("Giá bán phải lớn hơn 0");
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
        sellerPackageId: values.sellerPackageId
          ? Number(values.sellerPackageId)
          : null,
      });

      console.log("POST DATA:", {
        ...values,
      });

      toast.success(
        "Thêm bài đăng thành công! Bài đăng hiện đang chờ quản trị viên phê duyệt.",
      );
      navigate("/my-listings");
    } catch (error: any) {
      toast.error(error?.response?.data || "Không thể tạo bài đăng");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ListingForm
        title="Thêm bài đăng"
        submitLabel="Thêm bài đăng"
        categories={categories}
        packages={packages}
        values={values}
        imagePreviews={imagePreviews}
        submitDisabled={isSubmitting}
        onChange={setValues}
        onImageChange={setImages}
        onSubmit={handleCreateListing}
      />
    </>
  );
}
