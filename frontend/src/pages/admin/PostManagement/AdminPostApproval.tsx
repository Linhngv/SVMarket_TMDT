import React from "react";
import "../../../styles/admin/AdminPostList.css";
import "../../../styles/admin/AdminPostApproval.css";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminTopBar from "../../../components/admin/AdminTopBar";

export default function AdminPostApproval() {
    return (
        <div className="admin-container d-flex">

            {/* SIDEBAR */}
            <AdminSidebar />

            {/* MAIN */}
            <div className="admin-main flex-grow-1">

                {/* TOPBAR */}
                <AdminTopBar breadcrumb="Trang chủ > Bài đăng > Kiểm duyệt bài đăng" />

                {/* CONTENT */}
                <div className="admin-content approval-content container-fluid mt-4">

                    <div className="card p-4 shadow-sm">
                        <h3 className="page-title mb-4">Kiểm duyệt bài đăng</h3>

                        {/* APPROVAL DETAILS */}
                        <div className="approval-container p-4 mb-4">
                            <div className="approval-title mb-2">Bán laptop cũ</div>
                            <div className="approval-author mb-3">Người đăng: Nguyễn Văn A</div>

                            {/* POST IMAGES */}
                            <div className="post-images d-flex gap-3 mb-4 overflow-auto">
                                <img src="https://placehold.co/150x150?text=Anh+1" alt="Sản phẩm 1" className="post-img" />
                                <img src="https://placehold.co/150x150?text=Anh+2" alt="Sản phẩm 2" className="post-img" />
                                <img src="https://placehold.co/150x150?text=Anh+3" alt="Sản phẩm 3" className="post-img" />
                            </div>

                            <div className="approval-desc mb-0">
                                Laptop Dell Inspiron cũ, core i5, RAM 8GB, SSD 256GB. Ngoại hình còn mới 90%, pin sử dụng được khoảng 3 tiếng. Phù hợp cho sinh viên học tập và làm việc văn phòng. Kèm sạc zin.
                            </div>
                        </div>

                        {/* REJECT REASON INPUT */}
                        <div className="mb-4">
                            <textarea
                                rows={4}
                                className="form-control reject-input px-4 py-3"
                                placeholder="Nhập lý do từ chối (nếu có)"
                            ></textarea>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="d-flex gap-3">
                            <button className="btn btn-approve-post">Duyệt bài</button>
                            <button className="btn btn-reject-post">Từ chối</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}