import { SellerDashboardResponse } from "../types/SellerDashboardResponse";

const API_URL = "http://localhost:8080/api/seller/dashboard";

// Thống kê của người bán
export const fetchSellerDashboard =
    async (): Promise<SellerDashboardResponse> => {

        const token = localStorage.getItem("token");

        const response = await fetch(
            `${API_URL}`,
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