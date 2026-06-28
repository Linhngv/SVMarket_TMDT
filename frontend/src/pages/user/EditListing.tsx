import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ListingForm, { ListingFormValues, } from "../../components/listing/ListingForm";
import {
  CategoryOption,
  fetchCategoryOptions,
  fetchMyListingById,
  updateListing,
} from "../../services/listingService";
import "../../styles/user/ListingManagement.css";
import { fetchMyPackages } from "../../services/packageService";
import type { SellerPackage } from "../../types/SellerPackage";

export default function EditListing() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [values, setValues] = useState<ListingFormValues>({
    title: "",
    categoryId: "",
    price: "0",
    deliveryAddress: "",
    conditionLevel: "Mới",
    description: "",
    status: "PENDING",
    sellerPackageId: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalStatus, setOriginalStatus] = useState<string>("");
  const [rejectReason, setRejectReason] = useState<string>("");
  const [bannedKeywords, setBannedKeywords] = useState<string[]>([]);
  const [packages, setPackages] = useState<SellerPackage[]>([]);
  const [originalSellerPackageId, setOriginalSellerPackageId] = useState<string>("");
  
  const [originalValues, setOriginalValues] = useState<ListingFormValues | null>(null);
  // Load gói đã mua
  useEffect(() => {
  const loadPackages = async () => {
    try {
      const data = await fetchMyPackages();

      setPackages(data);
      } catch (error) {
        console.error("Không thể tải gói", error);
      }
    };

    loadPackages();
  }, []);

  useEffect(() => {
    const listingId = Number(id);

    if (Number.isNaN(listingId)) {
      navigate("/my-listings");
      return;
    }

    const fetchSellerBannedKeywords = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:8080/api/seller/dashboard/banned-keywords",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch banned keywords");
      return res.json();
    };

    const loadData = async () => {
      try {
        const [categoryData, listingData, keywordsList] = await Promise.all([
          fetchCategoryOptions(),
          fetchMyListingById(listingId),
          fetchSellerBannedKeywords().catch(() => []),
        ]);

        setCategories(categoryData);
        setBannedKeywords(keywordsList);
        setExistingImageUrls(
          (listingData.imageUrls || []).map((url) =>
            url.startsWith("http") ? url : `http://localhost:8080${url}`,
          ),
        );
        setOriginalStatus(listingData.status || "");
        setRejectReason((listingData as any).rejectReason || "");
        setValues({
          title: listingData.title || "",
          categoryId: String(listingData.categoryId || ""),
          price: String(listingData.price || 0),
          deliveryAddress: listingData.deliveryAddress || "",
          conditionLevel: listingData.conditionLevel || "Mới",
          description: listingData.description || "",
          status: listingData.status || "PENDING",
          sellerPackageId: listingData.sellerPackageId
            ? String(listingData.sellerPackageId)
            : "",
        });
        setOriginalSellerPackageId(
          listingData.sellerPackageId
            ? String(listingData.sellerPackageId)
            : "",
        );
        const initialValues = {
          title: listingData.title || "",
          categoryId: String(listingData.categoryId || ""),
          price: String(listingData.price || 0),
          deliveryAddress: listingData.deliveryAddress || "",
          conditionLevel: listingData.conditionLevel || "Mới",
          description: listingData.description || "",
          status: listingData.status || "PENDING",
          sellerPackageId: listingData.sellerPackageId ? String(listingData.sellerPackageId) : "",
        };
        setOriginalValues(initialValues);
      } catch (error) {
        console.error("Không thể tải dữ liệu bài đăng", error);
        toast.error("Không thể tải dữ liệu bài đăng");
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
      toast.error("ID bài này không hợp lệ");
      return;
    }

    if (!values.title.trim() || !values.categoryId) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (titleHasBanned || descHasBanned) {
      toast.error("Vui lòng xóa các từ khóa vi phạm trước khi cập nhật");
      return;
    }

    const packageChanged = originalSellerPackageId !== values.sellerPackageId;
    if (packageChanged && values.sellerPackageId) {
      const selectedPackage = packages.find(p => String(p.id) === values.sellerPackageId);
      if (selectedPackage && selectedPackage.remainingPushes <= 0) {
        toast.error("Bạn không còn lượt đẩy tin nào! Vui lòng nâng cấp gói tin để tiếp tục");
        return;
      }
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
        sellerPackageId: values.sellerPackageId
          ? Number(values.sellerPackageId)
          : null,
        wantPush: values.wantPush,
      });

      if (packageChanged && values.sellerPackageId) {
        toast.success(
          "Bài đăng hiện đang chờ quản trị viên phê duyệt nâng cấp hiển thị.",
        );
      } else {
        toast.success("Cập nhật bài đăng thành công! Bài đăng đã được gửi lại cho admin duyệt!");
      }
      navigate("/my-listings");
    } catch (error: any) {
      toast.error(error?.response?.data || "Không thể cập nhật bài đăng");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm highlight từ khóa cấm trong text
  const highlightBannedKeywords = (text: string) => {
    if (!text || bannedKeywords.length === 0) return text;

    let result: (string | JSX.Element)[] = [text];

    bannedKeywords.forEach((keyword) => {
      result = result.flatMap((part) => {
        if (typeof part !== "string") return part;

        // Tạo regex không phân biệt hoa/thường
        const regex = new RegExp(
          `(${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
          "gi",
        );
        const parts = part.split(regex);

        return parts.map((p, idx) => {
          if (regex.test(p)) {
            return (
              <span
                key={idx}
                style={{ backgroundColor: "#ffcccc", color: "#c0392b" }}
              >
                {p}
              </span>
            );
          }
          return p;
        });
      });
    });

    return result;
  };

  const hasBanned = (text: string) => {
    if (!text || bannedKeywords.length === 0) return false;
    return bannedKeywords.some((kw) =>
      text.toLowerCase().includes(kw.toLowerCase()),
    );
  };

  const titleHasBanned = hasBanned(values.title);
  const descHasBanned = hasBanned(values.description);

  const titleWarning = titleHasBanned ? (
    <>{highlightBannedKeywords(values.title)}</>
  ) : null;

  const descWarning = descHasBanned ? (
    <>{highlightBannedKeywords(values.description)}</>
  ) : null;
  
  const hasContentChanged = useMemo(() => {
    if (!originalValues) return false; // Chưa load xong dữ liệu gốc
    if (images.length > 0) return true; // Có thay đổi ảnh

    return (
      originalValues.title !== values.title ||
      originalValues.categoryId !== values.categoryId ||
      originalValues.price !== values.price ||
      originalValues.deliveryAddress !== values.deliveryAddress ||
      originalValues.conditionLevel !== values.conditionLevel ||
      originalValues.description !== values.description ||
      originalValues.sellerPackageId !== values.sellerPackageId
    );
  }, [originalValues, values, images]);

  return (
    <>
      {originalStatus === "REJECTED" && rejectReason && (
        <div className="container mt-3 px-4">
          <div className="alert alert-danger" role="alert">
            <h5 className="alert-heading">Bài đăng đã bị từ chối!</h5>
            <p className="mb-0">
              <strong>Lý do:</strong> {rejectReason}
            </p>
            <hr />
            <p className="mb-0 small">
              Vui lòng chỉnh sửa lại thông tin bài đăng theo yêu cầu và nhấn{" "}
              <strong>Cập nhật</strong>. Bài đăng sẽ được tự động chuyển về
              trạng thái <strong>Chờ duyệt</strong> để quản trị viên kiểm tra
              lại.
            </p>
          </div>
        </div>
      )}
      <ListingForm
        title="Cập nhật bài đăng"
        submitLabel="Cập nhật bài đăng"
        categories={categories}
        packages={packages}
        values={values}
        imagePreviews={mergedImagePreviews}
        titleWarning={titleWarning}
        descriptionWarning={descWarning}
        submitDisabled={isSubmitting || titleHasBanned || descHasBanned || !hasContentChanged}
        showStatusField
        showBack
          isEditMode
        onBack={() => navigate("/my-listings")}
        onChange={setValues}
        onImageChange={setImages}
        onSubmit={handleUpdateListing}
      />
    </>
  );
}
