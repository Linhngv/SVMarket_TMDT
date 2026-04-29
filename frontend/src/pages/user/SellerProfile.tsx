import React, { useEffect, useState } from "react";
import "../../styles/user/SellerProfile.css";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";

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
    replyContent?: string;
    replyCreatedAt?: any;
}

interface SellerProfileData {
    id: number;
    fullName: string;
    avatar: string;
    university: string;
    activeListingCount: number;
    soldListingCount: number;
    activeListings: ListingSummary[];
    averageRating: number;
    reviewCount: number;
    reviews: ReviewData[];
    isVerified: boolean;
}

const SellerProfilePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [profile, setProfile] = useState<SellerProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:8080/api/user/${id}/seller-profile`);
                if (!res.ok) throw new Error("Không thể tải thông tin người bán");
                const data = await res.json();
                setProfile(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProfile();
    }, [id]);

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
                <div className="container-fluid py-5 text-center">Đang tải thông tin...</div>
                <Footer />
            </>
        );
    }

    if (error || !profile) {
        return (
            <>
                <Header />
                <div className="container-fluid py-5 text-center text-danger">{error || "Không tìm thấy người bán"}</div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="container-fluid py-3 container-seller-profile">
                {/* Back button */}
                <div
                    className="back-btn d-flex align-items-center mb-2 var(--text-primary)"
                    onClick={() => navigate(-1)}
                >
                    <FaChevronLeft className="me-2" />
                    <span>Quay lại</span>
                </div>
                <div className="bg-white p-4 rounded shadow-sm mb-4">
                    {/* Header */}
                    <div className="container-seller-profile-header d-flex align-items-center mb-4">
                        <div
                            className="avatar-seller rounded-circle bg-success text-white d-flex align-items-center justify-content-center overflow-hidden"
                        >
                            {profile.avatar ? (
                                <img src={profile.avatar.startsWith("http") || profile.avatar.startsWith("/images/") ? profile.avatar : `http://localhost:8080${profile.avatar}`} alt={profile.fullName} onError={(e) => { (e.target as HTMLImageElement).src = "/images/avatar_default.jpg"; }} />
                            ) : (
                                profile.fullName.slice(0, 2).toUpperCase()
                            )}
                        </div>

                        <div className="ms-3">
                            <h5 className="mb-1">{profile.fullName}</h5>
                            <div className="d-flex align-items-center">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="18" height="18" style={{ marginRight: "2px" }}>
                                        <path fill={i < Math.round(profile.averageRating || 0) ? "#F59E0B" : "#E5E7EB"} d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z" />
                                    </svg>
                                ))}
                                <span className="star-and-reviews">{profile.averageRating ? profile.averageRating.toFixed(1) : "0.0"} · {profile.reviewCount || 0} đánh giá</span>
                            </div>
                            <div className="d-flex align-items-center gap-2 mt-2">
                                <span className="university">{profile.university || "SVMarket"}</span>
                                {profile.isVerified && (profile.activeListingCount > 0 || profile.soldListingCount > 0) && (
                                    <span className="reputation position-relative d-flex align-items-center justify-content-center gap-1">
                                        Uy tín
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="16" height="16">
                                            <path fill="currentColor" d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="row text-center mb-4">
                        <div className="col">
                            <h6 className="number">{profile.activeListingCount}</h6>
                            <small className="text-small">Đang bán</small>
                        </div>
                        <div className="col">
                            <h6 className="number">{profile.soldListingCount}</h6>
                            <small className="text-small">Đã bán</small>
                        </div>
                        <div className="col text-danger">
                            <h6 className="number number-red">0</h6>
                            <small className="text-small">Khiếu nại</small>
                        </div>
                    </div>

                    {/* Product */}
                    <div className="product">
                        <h6 className="mb-3 title-common">Đang bán</h6>

                        <div className="d-flex flex-wrap gap-3">
                            {profile.activeListings && profile.activeListings.length > 0 ? (
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
                                <p className="text-muted small">Người bán này hiện chưa có bài đăng nào đang bán.</p>
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

                                        {/* Phản hồi của người bán */}
                                        {review.replyContent && (
                                            <div className="mt-3 p-3 reply-content">
                                                <div className="seller-response">
                                                    Phản hồi của người bán:
                                                </div>
                                                <div className="content-response">
                                                    {review.replyContent}
                                                </div>
                                                {review.replyCreatedAt && (
                                                    <div className="date-response">
                                                        {formatDate(review.replyCreatedAt)}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted small">Người bán này chưa có đánh giá nào.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SellerProfilePage;