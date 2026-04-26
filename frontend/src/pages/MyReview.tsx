import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/SellerProfile.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface ListingSummary {
    id: number;
    title: string;
    price: number;
    status: string;
    thumbnailUrl: string;
}

interface ReviewData {
    id: number;
    reviewerName: string;
    reviewerInitials: string;
    reviewerAvatar?: string;
    rating: number;
    comment: string;
    productName: string;
    createdAt: any;
}

interface SellerProfileData {
    id: number;
    fullName: string;
    email: string;
    avatar: string;
    university: string;
    province?: string;
    addressDetail?: string;
    activeListingCount: number;
    soldListingCount: number;
    activeListings: ListingSummary[];
    soldListings: ListingSummary[];
    averageRating: number;
    reviewCount: number;
    reviews: ReviewData[];
}

const MyReview = () => {
    const { user, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<SellerProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<"ACTIVE" | "SOLD">("ACTIVE");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                let currentUserId = user?.id;

                // Nếu AuthContext bị thiếu ID, tự động lấy lại thông qua token
                if (!currentUserId) {
                    const token = localStorage.getItem("token");
                    if (!token) throw new Error("Vui lòng đăng nhập lại");

                    const meRes = await fetch("http://localhost:8080/api/user/profile", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (!meRes.ok) throw new Error("Không thể xác thực thông tin người dùng");

                    const meData = await meRes.json();
                    currentUserId = meData.id;
                }

                if (!currentUserId) throw new Error("Không tìm thấy dữ liệu ID người dùng");

                const res = await fetch(`http://localhost:8080/api/user/${currentUserId}/seller-profile`);
                if (!res.ok) throw new Error("Không thể tải thông tin");
                const data = await res.json();
                setProfile(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (isLoggedIn && user) {
            fetchProfile();
        } else if (isLoggedIn === false) {
            navigate("/login");
        }
    }, [user, isLoggedIn, navigate]);

    const formatDate = (dateValue: any) => {
        if (!dateValue) return "";
        let date: Date;
        if (Array.isArray(dateValue)) {
            date = new Date(
                dateValue[0],
                dateValue[1] - 1,
                dateValue[2],
                dateValue[3] || 0,
                dateValue[4] || 0
            );
        } else {
            date = new Date(dateValue);
        }
        return date.toLocaleDateString("vi-VN");
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="container-fluid py-5 text-center min-vh-100">Đang tải thông tin...</div>
                <Footer />
            </>
        );
    }

    if (error || !profile) {
        return (
            <>
                <Header />
                <div className="container-fluid py-5 text-center text-danger min-vh-100">{error || "Không tìm thấy dữ liệu"}</div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="container-fluid py-3 container-seller-profile min-vh-100">
                {/* HEADER PROFILE */}
                <div className="card p-4 mb-4 shadow-sm border-0">
                    <div className="container-reviews">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div className="d-flex align-items-center">
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center me-3 overflow-hidden bg-success text-white"
                                    style={{ width: "70px", height: "70px", fontSize: "24px", fontWeight: "bold" }}
                                >
                                    {profile.avatar ? (
                                        <img
                                            src={profile.avatar.startsWith("http") || profile.avatar.startsWith("/images/") ? profile.avatar : `http://localhost:8080${profile.avatar}`}
                                            alt="avatar"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            onError={(e) => { (e.target as HTMLImageElement).src = "/images/avatar_default.jpg"; }}
                                        />
                                    ) : (
                                        profile.fullName.slice(0, 2).toUpperCase()
                                    )}
                                </div>
                                <div className="d-flex flex-column gap-2">
                                    <h5 className="mb-0 fw-bold">{profile.fullName}</h5>
                                    <div className="text-muted small">{profile.email || ""}</div>
                                    <div className="small d-flex flex-column gap-2">
                                        <div><strong>Trường:</strong> {profile.university || "SVMarket"}</div>
                                        {(profile.province || profile.addressDetail) && (
                                            <div><strong>Địa chỉ:</strong> {profile.addressDetail || profile.province}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                className="btn btn-success btn-sm px-3 py-2 fw-medium rounded-3"
                                onClick={() => navigate("/profile")}
                            >
                                Chỉnh sửa trang cá nhân
                            </button>
                        </div>
                    </div>
                </div>

                {/* POSTS */}
                <div className="card p-4 mb-4 shadow-sm border-0">
                    <div className="container-reviews">
                        <div className="d-flex align-items-center mb-3">
                            <strong className="me-3 fs-5">Tất cả tin đăng</strong>
                            <button
                                className={`btn btn-sm me-2 px-3 rounded-pill fw-medium ${activeTab === 'ACTIVE' ? 'btn-success' : 'btn-outline-secondary'}`}
                                onClick={() => setActiveTab('ACTIVE')}
                            >
                                Đang bán ({profile.activeListingCount})
                            </button>
                            <button
                                className={`btn btn-sm px-3 rounded-pill fw-medium ${activeTab === 'SOLD' ? 'btn-success' : 'btn-outline-secondary'}`}
                                onClick={() => setActiveTab('SOLD')}
                            >
                                Đã bán ({profile.soldListingCount})
                            </button>
                        </div>

                        <div className="d-flex flex-wrap gap-3">
                            {activeTab === 'ACTIVE' && (
                                profile.activeListings && profile.activeListings.length > 0 ? (
                                    profile.activeListings.map((listing) => (
                                        <div key={listing.id} className="seller-product-card" onClick={() => navigate(`/product/${listing.id}`)}>
                                            <img
                                                src={listing.thumbnailUrl ? (listing.thumbnailUrl.startsWith("http") ? listing.thumbnailUrl : `http://localhost:8080${listing.thumbnailUrl}`) : "/images/detail.png"}
                                                className="card-img-top"
                                                alt={listing.title}
                                                onError={(e) => { (e.target as HTMLImageElement).src = "/images/detail.png"; }}
                                            />
                                            <div className="card-body p-2">
                                                <p className="card-text small mb-1" style={{ WebkitBoxOrient: "vertical", WebkitLineClamp: 2 }}>
                                                    {listing.title}
                                                </p>
                                                <span className="text-success fw-bold">{new Intl.NumberFormat("vi-VN").format(listing.price)}đ</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted small">Hiện chưa có bài đăng nào đang bán.</p>
                                )
                            )}
                            {activeTab === 'SOLD' && (
                                profile.soldListings && profile.soldListings.length > 0 ? (
                                    profile.soldListings.map((listing) => (
                                        <div key={listing.id} className="seller-product-card" style={{ opacity: 0.8 }} onClick={() => navigate(`/product/${listing.id}`)}>
                                            <img
                                                src={listing.thumbnailUrl ? (listing.thumbnailUrl.startsWith("http") ? listing.thumbnailUrl : `http://localhost:8080${listing.thumbnailUrl}`) : "/images/detail.png"}
                                                className="card-img-top"
                                                alt={listing.title}
                                                style={{ filter: "grayscale(100%)" }}
                                                onError={(e) => { (e.target as HTMLImageElement).src = "/images/detail.png"; }}
                                            />
                                            <div className="card-body p-2">
                                                <p className="card-text small mb-1" style={{ WebkitBoxOrient: "vertical", WebkitLineClamp: 2 }}>
                                                    {listing.title}
                                                </p>
                                                <span className="text-muted fw-bold">Đã bán</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted small">Hiện chưa có bài đăng nào đã bán.</p>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <div className="bg-white p-4 rounded shadow-sm">
                    <div className="container-reviews">
                        <h6 className="mb-3">Đánh giá</h6>

                        {/* Rating Summary */}
                        <div className="rating-summary p-3 rounded mb-3">
                            <h4 className="mb-0 d-flex align-items-center title-common">{profile.averageRating ? profile.averageRating.toFixed(1) : "0.0"}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="22" height="22" style={{ marginLeft: "5px" }}>
                                    <path fill="#F59E0B" d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z" />
                                </svg></h4>
                            <small className="color-txt-common">({profile.reviewCount || 0} đánh giá)</small>
                        </div>

                        {/* Review Item */}
                        {profile.reviews && profile.reviews.length > 0 ? (
                            profile.reviews.map((review) => (
                                <div key={review.id} className="card mb-3 border-review-item">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <div className="avt-buyer rounded-circle d-flex align-items-center justify-content-center me-2 overflow-hidden">
                                                    {review.reviewerAvatar ? (
                                                        <img
                                                            src={review.reviewerAvatar.startsWith("http") || review.reviewerAvatar.startsWith("/images/") ? review.reviewerAvatar : `http://localhost:8080${review.reviewerAvatar}`}
                                                            alt={review.reviewerName}
                                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                            onError={(e) => { (e.target as HTMLImageElement).src = "/images/avatar_default.jpg"; }}
                                                        />
                                                    ) : (
                                                        review.reviewerInitials
                                                    )}
                                                </div>
                                                <p className="mb-0 name-buyer">{review.reviewerName}</p>
                                            </div>
                                            <div className="text-warning">{[...Array(5)].map((_, i) => (
                                                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="18" height="18" style={{ marginRight: "2px" }}>
                                                    <path fill={i < review.rating ? "#F59E0B" : "#E5E7EB"} d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z" />
                                                </svg>
                                            ))}</div>
                                        </div>

                                        <p className="mt-2 mb-1 write-review">
                                            {review.comment}
                                        </p>

                                        <small className="text-muted">{review.productName} · {formatDate(review.createdAt)}</small>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted small">Hiện chưa có đánh giá nào.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyReview;