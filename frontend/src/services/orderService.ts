import { useAuth } from "../context/AuthContext";

const API = "http://localhost:8080/api/orders";

function getAuthHeader() {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Vui long dang nhap de su dung tinh nang luu bai dang");
    }

    return { Authorization: `Bearer ${token}` };
}

// Lấy lịch sử mua hàng
export async function fetchPurchases() {
    const res = await fetch(`${API}/purchases`, {
        headers: getAuthHeader(),
    });

    if (!res.ok) {
        throw new Error("Lỗi lấy lịch sử mua hàng");
    }

    return res.json();
}

// Lấy chi tiết đơn hàng
export async function fetchOrderDetail(orderId: string | number) {
    const res = await fetch(`${API}/${orderId}/detail`, {
        headers: getAuthHeader(),
    });

    if (!res.ok) {
        throw new Error("Lỗi lấy chi tiết đơn hàng");
    }

    return res.json();
}