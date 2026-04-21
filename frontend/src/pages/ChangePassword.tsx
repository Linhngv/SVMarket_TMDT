import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
    const [message, setMessage] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);

    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (newPassword !== confirmPassword) {
            setMessage({ type: "danger", text: "Mật khẩu mới không khớp!" });
            return;
        }

        if (!PASSWORD_REGEX.test(newPassword)) {
            setMessage({ type: "danger", text: "Mật khẩu mới chưa đáp ứng đủ quy tắc bảo mật!" });
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8080/api/users/change-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
            });

            const data = await res.text();
            if (res.ok) {
                setMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setMessage({ type: "danger", text: data || "Có lỗi xảy ra khi đổi mật khẩu" });
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: "danger", text: "Lỗi kết nối máy chủ" });
        } finally {
            setLoading(false);
        }
    };

    const renderPasswordInput = (label: string, value: string, setter: (val: string) => void, field: "current" | "new" | "confirm") => (
        <div className="mb-4">
            <label className="form-label fw-medium" style={{ color: "#374151" }}>{label}</label>
            <div className="position-relative">
                <input
                    type={showPassword[field] ? "text" : "password"}
                    className="form-control"
                    style={{ padding: "10px 16px", backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "8px" }}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    required
                />
                <button type="button" className="btn border-0 position-absolute end-0 top-50 translate-middle-y text-muted" onClick={() => setShowPassword(prev => ({ ...prev, [field]: !prev[field] }))}>
                    {showPassword[field] ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
        </div>
    );

    return (
        <div className="card p-4 w-100 flex-grow-1" style={{ border: "none" }}>
            <h5 className="profile-title mb-4" style={{ fontSize: "28px" }}>Thay đổi mật khẩu</h5>
            {message.text && <div className={`alert alert-${message.type} py-2`} style={{ fontSize: "15px" }}>{message.text}</div>}
            <form onSubmit={handleSubmit}>
                {renderPasswordInput("Mật khẩu hiện tại", currentPassword, setCurrentPassword, "current")}
                {renderPasswordInput("Mật khẩu mới", newPassword, setNewPassword, "new")}

                {/* Rules */}
                <div className="row text-muted small mb-4">
                    <div className="col-6">
                        <ul className="ps-3 mb-0" style={{ lineHeight: "1.8" }}>
                            <li>Tối thiểu 6 ký tự.</li>
                            <li>Có ký tự in thường và IN HOA.</li>
                        </ul>
                    </div>
                    <div className="col-6">
                        <ul className="ps-3 mb-0" style={{ lineHeight: "1.8" }}>
                            <li>Tối thiểu 01 chữ số.</li>
                            <li>Có ký tự đặc biệt (@$!%*?&).</li>
                        </ul>
                    </div>
                </div>

                {renderPasswordInput("Xác nhận mật khẩu mới", confirmPassword, setConfirmPassword, "confirm")}

                <div className="d-flex justify-content-end mt-4">
                    <button type="submit" className="btn px-4 py-2 text-white border-0" disabled={loading} style={{ backgroundColor: "#1B7A4A", borderRadius: "8px", fontWeight: "500", fontSize: "15px" }}>
                        {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                    </button>
                </div>
            </form>
        </div>
    );
}