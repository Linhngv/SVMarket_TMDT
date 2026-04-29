import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ListingForm, {
  ListingFormValues,
} from "../../components/listing/ListingForm";
import {
  CategoryOption,
  fetchCategoryOptions,
  fetchMyListingById,
  updateListing,
} from "../../services/listingService";
import "../../styles/user/ListingManagement.css";

export default function EditListing() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [values, setValues] = useState<ListingFormValues>({
    title: "",
    categoryId: "",
    price: "0",
    deliveryAddress: "",
    conditionLevel: "Đã qua sử dụng",
    description: "",
    status: "ACTIVE",
    postSource: "FREE",
  });
  const [images, setImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const listingId = Number(id);

    if (Number.isNaN(listingId)) {
      navigate("/my-listings");
      return;
    }

    const loadData = async () => {
      try {
        const [categoryData, listingData] = await Promise.all([
          fetchCategoryOptions(),
          fetchMyListingById(listingId),
        ]);

        setCategories(categoryData);
        setExistingImageUrls(
          (listingData.imageUrls || []).map((url) =>
            url.startsWith("http") ? url : `http://localhost:8080${url}`,
          ),
        );
        setValues({
          title: listingData.title || "",
          categoryId: String(listingData.categoryId || ""),
          price: String(listingData.price || 0),
          deliveryAddress: listingData.deliveryAddress || "",
          conditionLevel: listingData.conditionLevel || "Đã qua sử dụng",
          description: listingData.description || "",
          status: listingData.status || "ACTIVE",
          postSource: listingData.postSource,
        });
      } catch (error) {
        console.error("Không thể tải dữ liệu bài đăng", error);
        alert("Không thể tải dữ liệu bài đăng");
        navigate("/my-listings");
      }
    };

    loadData();
  }, [id, navigate]);

  const newImagePreviews = useMemo(
    () => images.map((image) => URL.createObjectURL(image)),
    [images],
  );

  useEffect(() => {
    return () => {
      newImagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [newImagePreviews]);

  const mergedImagePreviews =
    images.length > 0 ? newImagePreviews : existingImageUrls;

  // Cap nhat bai dang theo id dang mo.
  const handleUpdateListing = async () => {
    const listingId = Number(id);

    if (Number.isNaN(listingId)) {
      alert("ID bài này không hợp lệ");
      return;
    }

    if (!values.title.trim() || !values.categoryId) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateListing(listingId, {
        title: values.title.trim(),
        categoryId: Number(values.categoryId),
        price: Number(values.price),
        deliveryAddress: values.deliveryAddress.trim(),
        conditionLevel: values.conditionLevel,
        description: values.description.trim(),
        status: values.status,
        images,
        postSource: values.postSource,
      });

      alert("Cập nhật bài đăng thành công");
      navigate("/my-listings");
    } catch (error: any) {
      alert(error?.response?.data || "Khong the cap nhat bai dang");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ListingForm
      title="Cập nhật bài đăng"
      submitLabel="Cập nhật bài đăng"
      categories={categories}
      values={values}
      imagePreviews={mergedImagePreviews}
      submitDisabled={isSubmitting}
      showStatusField
      showBack
      onBack={() => navigate("/my-listings")}
      onChange={setValues}
      onImageChange={setImages}
      onSubmit={handleUpdateListing}
      disablePostSource
    />
  );
}
