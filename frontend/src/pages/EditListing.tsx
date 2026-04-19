import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ListingForm, {
  ListingFormValues,
} from "../components/listing/ListingForm";
import {
  CategoryOption,
  fetchCategoryOptions,
  fetchMyListingById,
  updateListing,
} from "../services/listingService";
import "../styles/ListingManagement.css";

export default function EditListing() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [values, setValues] = useState<ListingFormValues>({
    title: "",
    categoryId: "",
    price: "0",
    deliveryAddress: "",
    conditionLevel: "Da qua su dung",
    description: "",
    status: "ACTIVE",
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
          conditionLevel: listingData.conditionLevel || "Da qua su dung",
          description: listingData.description || "",
          status: listingData.status || "ACTIVE",
        });
      } catch (error) {
        console.error("Khong the tai du lieu bai dang", error);
        alert("Khong the tai du lieu bai dang");
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
      alert("ID bai dang khong hop le");
      return;
    }

    if (!values.title.trim() || !values.categoryId) {
      alert("Vui long dien day du thong tin bat buoc");
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
      });

      alert("Cap nhat bai dang thanh cong");
      navigate("/my-listings");
    } catch (error: any) {
      alert(error?.response?.data || "Khong the cap nhat bai dang");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ListingForm
      title="Cap nhat bai dang"
      submitLabel="Cap nhat bai dang"
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
    />
  );
}
