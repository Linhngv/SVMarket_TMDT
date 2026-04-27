const API = "http://localhost:8080/api";

function getAuthHeader() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Vui lòng đăng nhập");
  }

  return { Authorization: `Bearer ${token}` };
}

// Lấy danh sách gói có trong db
export async function fetchPackagePlans() {
  const res = await fetch(`${API}/package-plans`);

  if (!res.ok) {
    throw new Error("Không thể tải danh sách gói");
  }

  return res.json();
}

// Hàm lấy danh sách gói tin của người dùng sau khi mua hoặc khi vào trang
export async function fetchMyPackages() {
  const res = await fetch(`${API}/my-packages`, {
    headers: getAuthHeader(),
  });

  if (!res.ok) {
    throw new Error("Không thể tải gói của bạn");
  }

  return res.json();
}