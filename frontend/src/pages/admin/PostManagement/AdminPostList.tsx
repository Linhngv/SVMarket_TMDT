import React from "react";
import "../../../styles/admin/AdminPostList.css";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminTopBar from "../../../components/admin/AdminTopBar";

export default function AdminPostList() {
    return (
        <div className="admin-container d-flex">

            {/* SIDEBAR */}
            <AdminSidebar />

            {/* MAIN */}
            <div className="admin-main flex-grow-1">

                {/* TOPBAR */}
                <AdminTopBar breadcrumb="Trang chủ > Bài đăng > Danh sách bài đăng" />

                {/* CONTENT */}
                <div className="admin-content container-fluid mt-4">

                    <div className="card p-4 shadow-sm">
                        <h3 className="page-title mb-4">Danh sách bài đăng</h3>

                        {/* SEARCH */}
                        <div className="d-flex gap-3 mb-4 flex-wrap">
                            <input
                                className="form-control search-input"
                                placeholder="Tìm theo tiêu đề hoặc người đăng ..."
                            />
                            <button className="btn admin-btn-search px-4">Tìm kiếm</button>
                        </div>

                        {/* TABLE */}
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tiêu đề</th>
                                        <th>Người đăng</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Bán laptop cũ</td>
                                        <td>Nguyễn Văn A</td>
                                        <td>
                                            <span className="badge badge-pending status-badge rounded-pill py-2 px-3">Chờ duyệt</span>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>2</td>
                                        <td>Giáo trình IT</td>
                                        <td>Trần Thị B</td>
                                        <td>
                                            <span className="badge badge-approved status-badge rounded-pill py-2 px-3">Đã duyệt</span>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>3</td>
                                        <td>Tai nghe gaming</td>
                                        <td>Lê Văn C</td>
                                        <td>
                                            <span className="badge badge-violation status-badge rounded-pill py-2 px-3">Vi phạm</span>
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