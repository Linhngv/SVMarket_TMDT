import React, { useState, useEffect } from "react";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/sidebar/user/Sidebar";

export default function Profile() {

    const token = localStorage.getItem("token");

    const [avatarUrl, setAvatarUrl] = useState("/images/avatar_default.jpg");
    const [userName, setUserName] = useState("");

    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [school, setSchool] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("female");

    const [active, setActive] = useState("profile");

    const { refreshUser } = useAuth();

    const handleSave = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/user/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    fullName: name,
                    university: school,
                    province: city,
                    addressDetail: address,
                    gender: gender.toUpperCase()
                })
            });

            if (!res.ok) throw new Error("Update failed");

            alert("Cập nhật thành công!");
        } catch (err) {
            console.error("Lỗi update:", err);
            alert("Cập nhật thất bại!");
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://localhost:8080/api/user/avatar", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.text();

            setAvatarUrl(data);

            await refreshUser();

        } catch (err) {
            console.error("Upload avatar lỗi:", err);
        }
    };

    // GỌI API LẤY PROFILE
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/user/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error("Fetch failed");

                const data = await res.json();

                setName(data.fullName);
                setUserName(data.fullName);
                setAvatarUrl(data.avatar || "/images/avatar_default.jpg");
                setCity(data.province);
                setSchool(data.university);
                setAddress(data.addressDetail);
                setGender((data.gender || "OTHER").toLowerCase());

            } catch (err) {
                console.error("Lỗi lấy profile:", err);
            }
        };

        if (token) fetchProfile();
    }, [token]);

    return (
        <>
            {/* HEADER */}
            <Header />

            {/* CONTENT */}
            <div className="container-fluid px-4 mt-3">
                <div className="row align-items-stretch">

                    {/* SIDEBAR */}
                    <div className="col-md-3 d-flex">
                        <Sidebar />
                    </div>

                    {/* CONTENT */}
                    <div className="col-12 col-md d-flex flex-column" style={{ marginLeft: "-60px", height: "fit-content", marginBottom: "20px" }}>
                        <div className="card p-4 w-100 flex-grow-1" style={{ border: "none" }}>

                            <h5 className="profile-title mb-4">Hồ sơ cá nhân</h5>

                            {/* AVATAR */}
                            <div className="avatar-container">
                                <img
                                    src={
                                        avatarUrl
                                            ? (avatarUrl.startsWith("/images/") || avatarUrl.startsWith("http")
                                                ? avatarUrl
                                                : `http://localhost:8080${avatarUrl}`)
                                            : "/images/avatar_default.jpg"
                                    }
                                    alt=""
                                    className="avatar-img"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/images/avatar_default.jpg";
                                    }}
                                />

                                <input
                                    type="file"
                                    id="avatarUpload"
                                    className="avatar-input"
                                    onChange={handleAvatarChange}
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

                                <div className="col-md-6 mb-3 profile-section" style={{ marginTop: "-1px" }}>
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

                            <div className="d-flex justify-content-end mt-3" style={{ marginBottom: "40px" }}>
                                <button className="btn btn-success save-btn" onClick={handleSave}>
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