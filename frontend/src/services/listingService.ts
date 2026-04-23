import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/listings";

export type CategoryOption = {
  id: number;
  name: string;
};

export type ListingSummary = {
  id: number;
  title: string;
  price: number;
  status: string;
  thumbnailUrl: string | null;
  sellerName?: string | null;
  sellerUniversity?: string | null;
  createdAt?: string;

  priorityLevel?: number;
  isFeatured?: boolean;
};

export type ListingDetail = {
  id: number;
  title: string;
  categoryId: number;
  categoryName: string;
  price: number;
  deliveryAddress: string;
  conditionLevel: string;
  description: string;
  status: string;
  imageUrls: string[];
};

export type PublicListingDetail = ListingDetail & {
  sellerName?: string | null;
  sellerUniversity?: string | null;
  thumbnailUrl?: string | null;
  createdAt?: string;
};

export type ListingFormPayload = {
  title: string;
  categoryId: number;
  price: number;
  deliveryAddress: string;
  conditionLevel: string;
  description: string;
  status: string;
  images: File[];
  postSource: "FREE" | "PACKAGE";
};

function getAuthHeader() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Vui long dang nhap de quan ly bai dang");
  }

  return { Authorization: `Bearer ${token}` };
}

function buildListingFormData(payload: ListingFormPayload) {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("categoryId", String(payload.categoryId));
  formData.append("price", String(payload.price));
  formData.append("deliveryAddress", payload.deliveryAddress);
  formData.append("conditionLevel", payload.conditionLevel);
  formData.append("description", payload.description);
  formData.append("status", payload.status);
  formData.append("postSource", payload.postSource);

  payload.images.forEach((image) => {
    formData.append("images", image);
  });

  return formData;
}

// Lay danh muc de hien thi dropdown cho form dang tin.
export async function fetchCategoryOptions() {
  const response = await axios.get<CategoryOption[]>(
    `${API_BASE_URL}/categories`,
  );
  return response.data;
}

// Lay danh sach bai dang cua user hien tai.
export async function fetchMyListings() {
  const response = await axios.get<ListingSummary[]>(`${API_BASE_URL}/my`, {
    headers: getAuthHeader(),
  });

  return response.data;
}

// Lấy danh sách bài đăng đang hoạt động cho trang chủ hoặc tìm kiếm theo từ khóa.
// Nếu keyword truyền vào là rỗng hoặc không có thì trả về tất cả bài đăng active.
export async function fetchActiveListings(keyword?: string) {
  const url =
    keyword && keyword.trim() !== ""
      ? `${API_BASE_URL}?keyword=${encodeURIComponent(keyword)}`
      : API_BASE_URL;
  const response = await axios.get<ListingSummary[]>(url);
  return response.data;
}

// Lấy danh sách đăng tin cho phép xuất hiện ở đề xuất
export const fetchFeaturedListings = async () => {
  const res = await axios.get("http://localhost:8080/api/listings/featured");
  return res.data;
};

// Lay chi tiet bai dang theo id de do du lieu vao form sua.
export async function fetchMyListingById(id: number) {
  const response = await axios.get<ListingDetail>(`${API_BASE_URL}/my/${id}`, {
    headers: getAuthHeader(),
  });

  return response.data;
}

// Lay chi tiet bai dang dang hoat dong cho trang chi tiet san pham.
export async function fetchListingById(id: number) {
  const response = await axios.get<PublicListingDetail>(
    `${API_BASE_URL}/${id}`,
  );
  return response.data;
}

// Tao bai dang moi, gui kem danh sach hinh anh.
export async function createListing(payload: ListingFormPayload) {
  const formData = buildListingFormData(payload);

  const response = await axios.post<ListingDetail>(
    `${API_BASE_URL}/my`,
    formData,
    {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}

// Cap nhat bai dang theo id, neu co image moi thi backend se thay anh.
export async function updateListing(id: number, payload: ListingFormPayload) {
  const formData = buildListingFormData(payload);

  const response = await axios.put<ListingDetail>(
    `${API_BASE_URL}/my/${id}`,
    formData,
    {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}

// Xoa mem bai dang cua user dang nhap.
export async function deleteListing(id: number) {
  await axios.delete(`${API_BASE_URL}/my/${id}`, {
    headers: getAuthHeader(),
  });
}
