import React from "react";
import { UserAdmin } from "./AdminUserList";

interface Props {
  user: UserAdmin;
  onClose: () => void;
}

export default function AdminUserDetailsPopup({ user, onClose }: Props) {
  if (!user) return null;

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "---";
    let date: Date;
    if (Array.isArray(dateValue)) {
      date = new Date(
        dateValue[0],
        dateValue[1] - 1,
        dateValue[2],
        dateValue[3] || 0,
        dateValue[4] || 0,
        dateValue[5] || 0,
      );
    } else {
      date = new Date(dateValue);
    }
    if (isNaN(date.getTime())) return "---";
    return date.toLocaleDateString("vi-VN");
  };

  const roleLabel = user.role === 'ADMIN' ? 'Quản trị viên' : (user.postCount > 0 ? 'Người bán' : 'Người dùng');
  const isNormalUser = roleLabel === 'Người dùng';

  return (
    <div className="modal d-block modal-overlay" tabIndex={-1} style={{ zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "700px" }}>
        <div className="modal-content custom-modal-content p-4">
          {/* Close button */}
          <button
            onClick={onClose}
            className="btn-close position-absolute top-0 end-0 m-4"
            style={{ zIndex: 1 }}
          ></button>

          <div className="row g-4 mt-2">
            {/* Left Card */}
            <div className="col-md-6">
              <div className="border p-4 d-flex flex-column align-items-center text-center h-100" style={{ borderRadius: "16px" }}>
                {user.avatar ? (
                  <img
                    src={user.avatar.startsWith("http") ? user.avatar : `http://localhost:8080${user.avatar}`}
                    alt={user.fullName}
                    className="rounded-circle object-fit-cover"
                    style={{ width: "64px", height: "64px" }}
                  />
                ) : (
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-semibold fs-4"
                    style={{ width: "64px", height: "64px", backgroundColor: "#D1FAE5", color: "#15803D" }}
                  >
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                  </div>
                )}

                <h2 className="mt-3 fs-5 fw-semibold mb-1">{user.fullName || "Chưa cập nhật"}</h2>
                <p className="text-muted small mb-0">{user.email}</p>

                <span
                  className="mt-3 small rounded-pill"
                  style={{
                    backgroundColor: isNormalUser ? "#E8F5EE" : "#FEF3C7",
                    color: isNormalUser ? "#2D9E63" : "#B45309",
                    fontWeight: "500",
                    padding: "5.5px 16px"
                  }}
                >
                  {roleLabel}
                </span>
              </div>
            </div>

            {/* Right Card */}
            <div className="col-md-6">
              <div className="border p-4 h-100" style={{ borderRadius: "16px" }}>
                <h3 className="fs-5 fw-semibold mb-4">Thông tin chi tiết</h3>

                <div className="row gy-4 small">
                  <div className="col-6">
                    <p className="text-muted mb-1 text-nowrap">Trạng thái tài khoản</p>
                    <span className="d-inline-block px-3 py-1 text-white rounded-pill" style={{ backgroundColor: user.status === 'Đã khóa' ? '#C0392B' : '#22C55E', fontSize: "12px" }}>
                      {user.status === 'Đã khóa' ? 'Bị khóa' : 'Hoạt động'}
                    </span>
                  </div>
                  <div className="col-6">
                    <p className="text-muted mb-1 text-nowrap">Vai trò</p>
                    <p className="mt-1 fw-medium mb-0">{roleLabel}</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted mb-1 text-nowrap">Ngày tham gia</p>
                    <p className="mt-1 fw-medium mb-0">{formatDate(user.createdAt)}</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted mb-1 text-nowrap">Số bài đăng</p>
                    <p className="mt-1 fw-medium mb-0">{user.postCount || 0}</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted mb-1 text-nowrap">Số lần bị báo cáo</p>
                    <p className="mt-1 fw-medium mb-0">{user.reportCount || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}