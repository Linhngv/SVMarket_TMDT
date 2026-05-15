import { SellerDashboardResponse } from "../types/SellerDashboardResponse";

const API_URL = "http://localhost:8080/api/seller/dashboard";

// Thống kê của người bán
export const fetchSellerDashboard =
    async (startDate?: string, endDate?: string): Promise<SellerDashboardResponse> => {

        const token = localStorage.getItem("token");

        // Nối tham số ngày vào URL nếu có
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append("startDate", startDate);
        if (endDate) queryParams.append("endDate", endDate);

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

        const response = await fetch(
            `${API_URL}${queryString}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Không thể tải dashboard");
        }

        return response.json();
    };