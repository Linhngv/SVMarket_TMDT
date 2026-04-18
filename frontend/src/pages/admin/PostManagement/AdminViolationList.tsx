import React from "react";
import "../../../styles/admin/AdminPostList.css";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminTopBar from "../../../components/admin/AdminTopBar";

export default function AdminViolationList() {
    return (
        <div className="admin-container d-flex">

            {/* SIDEBAR */}
            <AdminSidebar />

            {/* MAIN */}
            <div className="admin-main flex-grow-1">

                {/* TOPBAR */}
                <AdminTopBar breadcrumb="Trang chủ > Bài đăng > Danh sách vi phạm" />

                {/* CONTENT */}
                <div className="admin-content container-fluid mt-4">

                    <div className="card p-4 shadow-sm">
                        <h3 className="page-title mb-4">Danh sách vi phạm</h3>

                        {/* TABLE */}
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Bài đăng</th>
                                        <th>Lý do</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Tai nghe gaming</td>
                                        <td>Từ khóa cấm</td>
                                        <td>
                                            <button className="btn btn-danger rounded-pill px-4" style={{ backgroundColor: "#C0392B", border: "none", fontWeight: 500, fontSize: "14px" }}>Ẩn bài</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}