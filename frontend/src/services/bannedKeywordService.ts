const API_URL = "http://localhost:8080/api/admin/banned-keywords";

interface BannedKeywordDTO {
  id: number;
  keyword: string;
  createdAt: string;
}

// Hàm lấy token từ localStorage
function getAuthHeader() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Vui lòng đăng nhập");
  return { Authorization: `Bearer ${token}` };
}

// Lấy tất cả từ khóa cấm
export async function getBannedKeywords(): Promise<BannedKeywordDTO[]> {
  const response = await fetch(API_URL, {
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error("Lỗi khi lấy danh sách từ khóa cấm");
  return response.json();
}

// Lấy từ khóa cấm theo ID
export async function getBannedKeywordById(
  id: number,
): Promise<BannedKeywordDTO> {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error("Lỗi khi lấy thông tin từ khóa cấm");
  return response.json();
}

// Thêm từ khóa cấm mới
export async function createBannedKeyword(
  keyword: string,
): Promise<BannedKeywordDTO> {
  const params = new URLSearchParams();
  params.append("keyword", keyword);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeader(),
    body: params,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  return response.json();
}

// Cập nhật từ khóa cấm
export async function updateBannedKeyword(
  id: number,
  keyword: string,
): Promise<BannedKeywordDTO> {
  const params = new URLSearchParams();
  params.append("keyword", keyword);

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: params,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  return response.json();
}

// Xóa từ khóa cấm theo ID
export async function deleteBannedKeyword(id: number): Promise<string> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  return response.json();
}

// Xóa nhiều từ khóa cấm
export async function deleteBannedKeywords(ids: number[]): Promise<string> {
  const response = await fetch(API_URL, {
    method: "DELETE",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ids),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  return response.json();
}

// Kiểm tra text có chứa từ khóa cấm không
export async function checkBannedKeywords(text: string): Promise<{
  hasBannedKeyword: boolean;
  bannedKeywords: string[];
}> {
  const params = new URLSearchParams();
  params.append("text", text);

  const response = await fetch(`${API_URL}/check`, {
    method: "POST",
    headers: getAuthHeader(),
    body: params,
  });

  if (!response.ok) throw new Error("Lỗi khi kiểm tra từ khóa cấm");
  return response.json();
}
