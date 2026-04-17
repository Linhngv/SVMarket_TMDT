import {
    Heart,
    Bell,
    MessageCircle,
    ChevronDown,
    FileText,
    Star,
    History,
    Package,
    LogOut,
    User
} from "lucide-react";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
    const { isLoggedIn, user, logout } = useAuth();

    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // click outside close popup
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // avatar fallback
    const avatar =
        user?.avatar && user.avatar.trim() !== ""
            ? `http://localhost:8080/${user.avatar.replace(/^\/+/, "")}`
            : "/images/avatar_default.jpg";

    return (
        <div className="header shadow-sm">
            <div className="container-fluid px-4 d-flex justify-content-between align-items-center py-2">

                {/* LOGO */}
                <div
                    className="fw-bold fs-5"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/")}
                >
                    <span style={{ color: "#1B7A4A" }}>SV</span>
                    <span style={{ color: "#D4A017" }}>Marketplace</span>
                </div>

                {/* RIGHT */}
                <div className="d-flex align-items-center gap-2">

                    <div className="icon-btn"><Heart size={18} /></div>
                    <div className="icon-btn"><Bell size={18} /></div>

                    <button className="contact-btn rounded-pill px-3 d-flex align-items-center gap-2">
                        <MessageCircle size={18} />
                        Liên hệ
                    </button>

                    <button className="btn btn-success rounded-pill px-3">
                        Đăng tin
                    </button>

                    {/* AVATAR */}
                    <div className="avatar-wrapper position-relative" ref={ref}>

                        <div
                            className="avatar d-flex align-items-center gap-1"
                            onClick={() => setOpen(prev => !prev)}
                        >
                            {isLoggedIn ? (
                                <img
                                    src={avatar}
                                    alt="avatar"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            "/images/avatar_default.jpg";
                                    }}
                                />
                            ) : (
                                <User size={18} />
                            )}

                            <ChevronDown
                                size={16}
                                className={`arrow-icon ${open ? "rotate" : ""}`}
                            />
                        </div>

                        {open && (
                            <ProfilePopup
                                isLoggedIn={isLoggedIn}
                                avatarUrl={avatar}
                                userName={user?.fullName}
                                navigate={navigate}
                                logout={logout}
                                onClose={() => setOpen(false)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


type PopupProps = {
    isLoggedIn: boolean;
    avatarUrl: string;
    userName?: string;
    navigate: (path: string) => void;
    logout: () => void;
    onClose: () => void;
};

function ProfilePopup({
    isLoggedIn,
    avatarUrl,
    userName,
    navigate,
    logout,
    onClose
}: PopupProps) {

    const handleLogout = () => {
        logout();
        onClose();
        navigate("/");
    };

    return (
        <div className="profile-popup">
            <div className="popup-arrow"></div>

            {/* USER INFO */}
            <div className="text-center">
                <div className="popup-avatar">
                    <img
                        src={avatarUrl}
                        alt="avatar"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                "/images/avatar_default.jpg";
                        }}
                    />

                    {isLoggedIn && (
                        <div
                            className="edit-icon"
                            onClick={() => {
                                navigate("/profile");
                                onClose();
                            }}
                        >
                            ✎
                        </div>
                    )}
                </div>

                <h6 className="mt-2 mb-1 fw-bold">
                    {isLoggedIn ? userName : "Khách"}
                </h6>

                <small className="text-muted">
                    {isLoggedIn ? "Đã đăng nhập" : "Chưa đăng nhập"}
                </small>
            </div>

            {/* MENU */}
            {isLoggedIn ? (
                <>
                    <PopupSection
                        title="Tiện ích"
                        items={[
                            { label: "Đơn hàng đã mua", icon: <FileText size={16} /> },
                            { label: "Đánh giá từ tôi", icon: <Star size={16} /> }
                        ]}
                    />

                    <PopupSection
                        title="Dịch vụ trả phí"
                        items={[
                            { label: "Lịch sử giao dịch", icon: <History size={16} /> },
                            { label: "Gói đăng tin", icon: <Package size={16} /> }
                        ]}
                    />

                    <PopupSection
                        title="Khác"
                        items={[
                            {
                                label: "Đăng xuất",
                                icon: <LogOut size={16} />,
                                onClick: handleLogout
                            }
                        ]}
                        isLogout
                    />
                </>
            ) : (
                <PopupSection
                    title="Tài khoản"
                    items={[
                        {
                            label: "Đăng nhập",
                            icon: <User size={16} />,
                            onClick: () => {
                                navigate("/login");
                                onClose();
                            }
                        }
                    ]}
                />
            )}
        </div>
    );
}

type Item = {
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
};

type SectionProps = {
    title: string;
    items: Item[];
    isLogout?: boolean;
};

function PopupSection({ title, items, isLogout = false }: SectionProps) {
    return (
        <div className="popup-section">
            <p className="section-title">{title}</p>

            <div className="popup-box">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`popup-row ${isLogout ? "logout" : ""}`}
                        onClick={item.onClick}
                        style={{ cursor: item.onClick ? "pointer" : "default" }}
                    >
                        <div className="d-flex align-items-center gap-2">
                            {item.icon}
                            <span>{item.label}</span>
                        </div>

                        <span>›</span>
                    </div>
                ))}
            </div>
        </div>
    );
}