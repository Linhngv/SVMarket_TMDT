import React, { useState, useEffect, useRef } from "react";
import { Bell, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin/AdminTopBar.css";
import { useAuth } from "../../context/AuthContext";

interface AdminTopBarProps {
    breadcrumb: React.ReactNode;
}

export default function AdminTopBar({ breadcrumb }: AdminTopBarProps) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const navigate = useNavigate();
    const notificationRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                const res = await fetch("http://localhost:8080/api/notifications/my", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setNotifications(data);
                }
            } catch (error) {
                console.error("Lỗi lấy thông báo:", error);
            }
        };
        fetchNotifications();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target as Node)
            ) {
                setShowNotifications(false);
            }
            if (
                userRef.current &&
                !userRef.current.contains(event.target as Node)
            ) {
                setShowUserDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications.filter((n) => !n.isRead).length;
    const unreadPostNotes = notifications.filter(
        (n) => n.type === "SYSTEM" && !n.isRead && n.content.includes("bài đăng mới"),
    );
    const unreadVerifyNotes = notifications.filter(
        (n) => n.type === "SYSTEM" && !n.isRead && n.content.includes("duyệt định danh mới"),
    );
    const pendingPostCount = unreadPostNotes.length;
    const pendingVerifyCount = unreadVerifyNotes.length;

    const displayNotifications = notifications.filter(
        (n) => !(n.type === "SYSTEM" && !n.isRead),
    );

    const handlePendingPostClick = async () => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                await Promise.all(
                    unreadPostNotes.map((n) =>
                        fetch(`http://localhost:8080/api/notifications/${n.id}/read`, {
                            method: "PUT",
                            headers: { Authorization: `Bearer ${token}` },
                        }),
                    ),
                );
                setNotifications((prev) =>
                    prev.map((n) => (n.type === "SYSTEM" && n.content.includes("bài đăng mới") ? { ...n, isRead: true } : n)),
                );
            }
        } catch (error) {
            console.error("Lỗi đánh dấu đã đọc:", error);
        }
        navigate("/admin/duyet-bai");
        setShowNotifications(false);
    };

    const handlePendingVerifyClick = async () => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                await Promise.all(
                    unreadVerifyNotes.map((n) =>
                        fetch(`http://localhost:8080/api/notifications/${n.id}/read`, {
                            method: "PUT",
                            headers: { Authorization: `Bearer ${token}` },
                        }),
                    ),
                );
                setNotifications((prev) =>
                    prev.map((n) => (n.type === "SYSTEM" && n.content.includes("duyệt định danh mới") ? { ...n, isRead: true } : n)),
                );
            }
        } catch (error) {
            console.error("Lỗi đánh dấu đã đọc:", error);
        }
        navigate("/admin/xac-thuc");
        setShowNotifications(false);
    };

    const handleMarkAllAsRead = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch(
                "http://localhost:8080/api/notifications/mark-read",
                {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );

            if (res.ok) {
                setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            }
        } catch (error) {
            console.error("Lỗi đánh dấu đã đọc:", error);
        }
    };

    const handleNotificationClick = async (note: any) => {
        if (!note.isRead) {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    await fetch(
                        `http://localhost:8080/api/notifications/${note.id}/read`,
                        {
                            method: "PUT",
                            headers: { Authorization: `Bearer ${token}` },
                        },
                    );
                    setNotifications((prev) =>
                        prev.map((n) => (n.id === note.id ? { ...n, isRead: true } : n)),
                    );
                }
            } catch (error) {
                console.error("Lỗi đánh dấu đã đọc:", error);
            }
        }

        if (note.type === "SYSTEM") {
            if (note.content.includes("bài đăng mới")) {
                navigate("/admin/duyet-bai");
            } else if (note.content.includes("duyệt định danh mới")) {
                navigate("/admin/xac-thuc");
            }
            setShowNotifications(false);
        }
    };

    const formatTimeAgo = (dateValue: any) => {
        if (!dateValue) return "";
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
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diffInSeconds < 60) return "Vừa xong";
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} giờ trước`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) return `${diffInDays} ngày trước`;
        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) return `${diffInMonths} tháng trước`;
        return `${Math.floor(diffInDays / 365)} năm trước`;
    };

    return (
        <div
            className="admin-topbar d-flex justify-content-between align-items-center"
        >
            <div className="breadcrumb mb-0">{breadcrumb}</div>

            <div className="topbar-right d-flex align-items-center gap-3">
                <div className="container-bell" ref={notificationRef}>
                    <div
                        className="icon-bell avatar-box bg-light rounded-circle d-flex justify-content-center align-items-center position-relative"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell size={25} />
                        {unreadCount > 0 && (
                            <span
                                className="position-absolute p-1 bg-danger border border-light rounded-circle"
                            ></span>
                        )}
                    </div>
                    {showNotifications && (
                        <div
                            className="notification-dropdown"
                            style={{
                                minWidth: "270px"
                            }}
                        >
                            <div className="notification-arrow"></div>
                            <div className="notification-item">
                                <h6>Thông báo</h6>
                                {unreadCount > 0 && (
                                    <span
                                        onClick={handleMarkAllAsRead}
                                    >
                                        Đánh dấu là đã đọc
                                    </span>
                                )}
                            </div>
                            {notifications.length === 0 ? (
                                <p
                                    className="text-muted text-center m-0 py-3"
                                    style={{ fontSize: "14px" }}
                                >
                                    Không có thông báo nào
                                </p>
                            ) : (
                                <>
                                    {pendingPostCount > 0 && (
                                        <div
                                            className="notification-note"
                                            onClick={handlePendingPostClick}
                                        >
                                            <div
                                                className="dot-green"
                                            ></div>
                                            <div className="notification-content">
                                                Có <strong>{pendingPostCount}</strong> bài đăng mới
                                                <div className="notification-time mt-1">
                                                    Đang chờ bạn kiểm duyệt
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {pendingVerifyCount > 0 && (
                                        <div
                                            className="notification-note"
                                            onClick={handlePendingVerifyClick}
                                        >
                                            <div
                                                className="dot-green"
                                            ></div>
                                            <div className="notification-content">
                                                Có <strong>{pendingVerifyCount}</strong> yêu cầu xác thực mới
                                                <div className="notification-time mt-1">
                                                    Đang chờ bạn kiểm duyệt định danh
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {displayNotifications.map((note) => (
                                        <div
                                            key={note.id}
                                            className="notification-note"
                                            style={{
                                                backgroundColor: note.isRead
                                                    ? "transparent"
                                                    : "var(--light-green)"
                                            }}
                                            onClick={() => handleNotificationClick(note)}
                                        >
                                            <div
                                                className="dot-green"
                                                style={{
                                                    backgroundColor: note.isRead
                                                        ? "transparent"
                                                        : "var(--primary)",
                                                }}
                                            ></div>
                                            <div className="notification-content">
                                                {note.content.startsWith(
                                                    "Có bài đăng mới cần kiểm duyệt: ",
                                                ) ? (
                                                    <>
                                                        Có bài đăng mới cần kiểm duyệt:{" "}
                                                        <strong>
                                                            {note.content.replace(
                                                                "Có bài đăng mới cần kiểm duyệt: ",
                                                                "",
                                                            )}
                                                        </strong>
                                                    </>
                                                ) : note.content.startsWith("Có yêu cầu duyệt định danh mới từ: ") ? (
                                                    <>
                                                        Có yêu cầu duyệt định danh mới từ:{" "}
                                                        <strong>
                                                            {note.content.replace(
                                                                "Có yêu cầu duyệt định danh mới từ: ",
                                                                "",
                                                            )}
                                                        </strong>
                                                    </>
                                                ) : (
                                                    note.content
                                                )}
                                                <div className="notification-time mt-1">
                                                    {formatTimeAgo(note.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div className="container-user position-relative" ref={userRef}>
                    <div
                        className="icon-user avatar-box bg-light rounded-pill d-flex justify-content-center align-items-center gap-2 px-3 py-1"
                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                    >
                        <img
                            src={
                                user?.avatar
                                    ? (user.avatar.startsWith("/images/") || user.avatar.startsWith("http")
                                        ? user.avatar
                                        : `http://localhost:8080${user.avatar}`)
                                    : "/images/avatar_default.jpg"
                            }
                            alt="Admin Avatar"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/images/avatar_default.jpg";
                            }}
                        />
                        <span className="fw-medium d-none d-md-block">
                            {user?.fullName || "Admin"}
                        </span>
                        {showUserDropdown ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                    {showUserDropdown && (
                        <div
                            className="user-dropdown position-absolute bg-white shadow-sm rounded p-3"
                        >
                            <div className="notification-arrow"></div>
                            <div className="avatar-admin d-flex flex-column align-items-center text-center gap-2">
                                <img
                                    src={
                                        user?.avatar
                                            ? (user.avatar.startsWith("/images/") || user.avatar.startsWith("http")
                                                ? user.avatar
                                                : `http://localhost:8080${user.avatar}`)
                                            : "/images/avatar_default.jpg"
                                    }
                                    alt="Admin Avatar"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/images/avatar_default.jpg";
                                    }}
                                />
                                <div className="mt-1">
                                    <h6 className="fullname-admin m-0 fw-bold">{user?.fullName || "Admin"}</h6>
                                    <small className="text-muted" style={{ fontSize: "13px" }}>Quản trị viên</small>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
