const API = "http://localhost:8080/api/payment";

function getAuthHeader() {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Vui long dang nhap de su dung tinh nang luu bai dang");
    }

    return { Authorization: `Bearer ${token}` };
}

// Tạo yêu cầu thanh toán cho đơn hàng 
export async function createOrderPayment(
    orderId: number,
    returnUrl: string,
) {
    const res = await fetch(
        `${API}/create-order?orderId=${orderId}&returnUrl=${returnUrl}`,
        {
            method: "GET",
            headers: getAuthHeader(),
        },
    );

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
    }

    return res.text();
}