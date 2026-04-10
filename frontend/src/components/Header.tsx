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

type HeaderProps = {
    isLoggedIn: boolean;
    avatarUrl: string;
    userName: string;
};

export default function Header({
    isLoggedIn,
    avatarUrl,
    userName
}: HeaderProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // đóng popup khi click ngoài
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div className="header shadow-sm">
            <div className="container-fluid px-4 d-flex justify-content-between align-items-center py-2">

                {/* LOGO */}
                <div className="fw-bold fs-5">
                    <span style={{ color: "#1B7A4A" }}>SV</span>
                    <span style={{ color: "#D4A017" }}>Marketplace</span>
                </div>

                {/* RIGHT */}
                <div className="d-flex align-items-center gap-2">

                    {/* ICON */}
                    <div className="icon-btn">
                        <Heart size={18} />
                    </div>

                    <div className="icon-btn">
                        <Bell size={18} />
                    </div>

                    {/* LIÊN HỆ */}
                    <button className="contact-btn rounded-pill px-3 d-flex align-items-center gap-2">
                        <MessageCircle size={18} />
                        Liên hệ
                    </button>

                    {/* ĐĂNG TIN */}
                    <button className="btn btn-success rounded-pill px-3">
                        Đăng tin
                    </button>

                    {/* AVATAR */}
                    <div className="avatar-wrapper position-relative" ref={ref}>
                        <div
                            className="avatar d-flex align-items-center gap-1"
                            onClick={() => setOpen(!open)}
                        >
                            {isLoggedIn ? (
                                <img src={avatarUrl} alt="avatar" />
                            ) : (
                                <User size={18} />
                            )}

                            <ChevronDown
                                size={16}
                                className={`arrow-icon ${open ? "rotate" : ""}`}
                            />
                        </div>

                        {/* POPUP */}
                        {open && (
                            <ProfilePopup
                                isLoggedIn={isLoggedIn}
                                avatarUrl={avatarUrl}
                                userName={userName}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Popup

type PopupProps = {
    isLoggedIn: boolean;
    avatarUrl: string;
    userName: string;
};

function ProfilePopup({
    isLoggedIn,
    avatarUrl,
    userName
}: PopupProps) {
    return (
        <div className="profile-popup">
            <div className="popup-arrow"></div>

            {/* USER */}
            <div className="text-center">
                <div className="popup-avatar">
                    <img src={avatarUrl} alt="avatar" />
                    <div className="edit-icon">✎</div>
                </div>

                <h6 className="mt-2 mb-1 fw-bold popup-name">
                    {isLoggedIn ? userName : "Khách"}
                </h6>

                <small className="text-muted">
                    {isLoggedIn ? "user@gmail.com" : "Chưa đăng nhập"}
                </small>
            </div>

            {/* Nếu đã login */}
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
                            { label: "Đăng xuất", icon: <LogOut size={16} /> }
                        ]}
                        isLogout
                    />
                </>
            ) : (
                <PopupSection
                    title="Tài khoản"
                    items={[
                        { label: "Đăng nhập", icon: <User size={16} /> }
                    ]}
                />
            )}
        </div>
    );
}

// Section trong popup

type Item = {
    label: string;
    icon: React.ReactNode;
};

type SectionProps = {
    title: string;
    items: Item[];
    isLogout?: boolean;
};

function PopupSection({ title, items, isLogout = false }: SectionProps) {
    return (
        <div className="popup-section">
            <p className="section-title popup-title">{title}</p>

            <div className="popup-box">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`popup-row ${isLogout ? "logout" : ""}`}
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