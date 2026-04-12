import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

export default function Profile() {

    const token = localStorage.getItem("token");

    const isLoggedIn = true;

    const [avatarUrl, setAvatarUrl] = useState("/images/avatar_default.jpg");
    const [userName, setUserName] = useState("");

    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [school, setSchool] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("female");

    const [active, setActive] = useState("profile");

    // GỌI API LẤY PROFILE
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/user/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = res.data;

                // Mapping đúng theo yêu cầu
                setName(data.fullName);                // users.full_name
                setUserName(data.fullName);
                setAvatarUrl(data.avatar || "/images/avatar_default.jpg"); // users.avatar
                setCity(data.province);               // address.province
                setSchool(data.university);           // users.university
                setAddress(data.addressDetail);       // address.address_detail

            } catch (err) {
                console.error("Lỗi lấy profile:", err);
            }
        };

        if (token) fetchProfile();
    }, [token]);

    return (
        <>
            {/* HEADER */}
            <Header
                isLoggedIn={isLoggedIn}
                avatarUrl={avatarUrl}
                userName={userName}
            />

            {/* CONTENT */}
            <div className="container-fluid px-4 mt-3">
                <div className="row align-items-stretch">

                    {/* SIDEBAR */}
                    <div className="col-md-3 d-flex">
                        <div className="card p-3 w-100">
                            <h6 className="profile-section">Quản lý hồ sơ</h6>
                            <p className={`sidebar-item ${active === "profile" ? "active" : ""}`}
                                onClick={() => setActive("profile")}
                            >Thông tin cá nhân</p>
                            <p className="sidebar-item">Thay đổi mật khẩu</p>

                            <h6 className="profile-section">Quản lý bài đăng</h6>
                            <p className="sidebar-item">Thêm bài đăng</p>
                            <p className="sidebar-item">Danh sách bài đăng</p>

                            <h6 className="profile-section" >Quản lý giao dịch</h6>
                            <p className="sidebar-item">Mua hàng</p>
                            <p className="sidebar-item">Bán hàng</p>

                            <h6 className="profile-section" >Quản lý đánh giá</h6>
                            <p className="sidebar-item">Người bán</p>
                            <p className="sidebar-item">người mua</p>

                            <h6 className="profile-section" >Quản lý gói tin</h6>
                            <p className="sidebar-item">Gói tin sử dụng</p>
                            <p className="sidebar-item">Thống kê hoạt động</p>
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div className="col-md-9 d-flex">
                        <div className="card p-4 w-100">

                            <h5 className="profile-title mb-4">Hồ sơ cá nhân</h5>

                            {/* AVATAR */}
                            <div className="avatar-container">

                                <img
                                    src={avatarUrl}
                                    alt=""
                                    className="avatar-img"
                                />

                                <input
                                    type="file"
                                    id="avatarUpload"
                                    className="avatar-input"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            console.log("Selected file:", file);
                                        }
                                    }}
                                />

                                <label htmlFor="avatarUpload" className="avatar-overlay">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 640 640"
                                        width="18"
                                        height="18"
                                    >
                                        <path
                                            fill="#1E1E1E"
                                            d="M213.1 128.8L202.7 160L128 160C92.7 160 64 188.7 64 224L64 480C64 515.3 92.7 544 128 544L512 544C547.3 544 576 515.3 576 480L576 224C576 188.7 547.3 160 512 160L437.3 160L426.9 128.8C420.4 109.2 402.1 96 381.4 96L258.6 96C237.9 96 219.6 109.2 213.1 128.8zM320 256C373 256 416 299 416 352C416 405 373 448 320 448C267 448 224 405 224 352C224 299 267 256 320 256z"
                                        />
                                    </svg>
                                </label>

                            </div>

                            {/* FORM */}
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="profile-section">Tên của bạn</label>
                                    <input
                                        className="form-control input-short"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="profile-section">Giới tính</label>
                                    <div className="d-flex align-items-center">
                                        <label style={{ marginRight: "10px" }}>
                                            <input
                                                type="radio"
                                                name="gender"
                                                checked={gender === "male"}
                                                onChange={() => setGender("male")}
                                                style={{ marginRight: "5px" }}
                                            />
                                            Nam
                                        </label>

                                        <label style={{ marginRight: "10px" }}>
                                            <input
                                                type="radio"
                                                name="gender"
                                                checked={gender === "female"}
                                                onChange={() => setGender("female")}
                                                style={{ marginRight: "5px" }}
                                            />
                                            Nữ
                                        </label>

                                        <label>
                                            <input
                                                type="radio"
                                                name="gender"
                                                checked={gender === "other"}
                                                onChange={() => setGender("other")}
                                                style={{ marginRight: "5px" }}
                                            />
                                            Khác
                                        </label>
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="profile-section">Thành phố hiện tại</label>
                                    <input
                                        className="form-control input-short"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>

                                <div className="col-md-6 mb-3 profile-section">
                                    <label className="profile-section">Trường học</label>
                                    <input
                                        className="form-control input-short"
                                        value={school}
                                        onChange={(e) => setSchool(e.target.value)}
                                    />
                                </div>

                                <div className="col-md-12 mb-3">
                                    <label className="profile-section">Địa chỉ cụ thể</label>
                                    <input
                                        className="form-control"
                                        style={{ background: "#F9FAFB", borderColor: "#E5E7EB" }}
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="d-flex justify-content-end mt-3">
                                <button className="btn btn-success save-btn">
                                    Lưu thay đổi
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </>
    );
}