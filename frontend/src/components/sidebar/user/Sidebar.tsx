import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  ShieldAlert,
  MapPin,
  List,
  Users,
  CreditCard,
  AlertTriangle,
  BadgeCheck,
  Package,
  History,
  LogOut
} from "lucide-react";

import "../../../styles/admin/AdminSidebar.css";

const menuGroups = [
  {
    label: "Thống kê hoạt động website",
    items: [
      { id: "/", label: "Trang chủ", icon: <Home size={18} /> },
    ],
  },
  {
    label: "Quản lý bài đăng",
    items: [
      { id: "admin/posts", label: "Danh sách bài đăng", icon: <FileText size={18} /> },
      { id: "admin/duyet-bai", label: "Kiểm duyệt bài đăng", icon: <ShieldAlert size={18} /> },
      { id: "admin/vi-pham", label: "Danh sách vi phạm", icon: <AlertTriangle size={18} /> },
    ],
  },
  {
    label: "Quản lý địa chỉ",
    items: [
      { id: "admin/khu-vuc", label: "Danh sách khu vực", icon: <MapPin size={18} /> },
      { id: "admin/dia-chi", label: "Danh sách địa chỉ", icon: <List size={18} /> },
    ],
  },
  {
    label: "Quản lý danh mục",
    items: [
      { id: "admin/danh-muc", label: "Danh sách danh mục", icon: <List size={18} /> },
    ],
  },
  {
    label: "Quản lý người dùng",
    items: [
      { id: "admin/users", label: "Danh sách người dùng", icon: <Users size={18} /> },
      { id: "admin/status", label: "Cập nhật trạng thái", icon: <BadgeCheck size={18} /> },
    ],
  },
  {
    label: "Quản lý giao dịch",
    items: [
      { id: "admin/giao-dich", label: "Danh sách giao dịch", icon: <CreditCard size={18} /> },
    ],
  },
  {
    label: "Quản lý khiếu nại",
    items: [
      { id: "admin/khieu-nai", label: "Danh sách khiếu nại", icon: <AlertTriangle size={18} /> },
      { id: "admin/xu-ly", label: "Xử lý khiếu nại", icon: <ShieldAlert size={18} /> },
    ],
  },
  {
    label: "Quản lý tin cậy",
    items: [
      { id: "admin/xac-thuc", label: "Duyệt định danh sinh viên", icon: <BadgeCheck size={18} /> },
      { id: "admin/lua-dao", label: "Cảnh báo lừa đảo", icon: <AlertTriangle size={18} /> },
      { id: "admin/tu-khoa", label: "Danh sách từ khóa cấm", icon: <List size={18} /> },
    ],
  },
  {
    label: "Quản lý gói tin",
    items: [
      { id: "admin/goi-tin", label: "Danh sách gói tin", icon: <Package size={18} /> },
    ],
  },
  {
    label: "Nhật ký hoạt động",
    items: [
      { id: "admin/logs", label: "Lịch sử", icon: <History size={18} /> },
    ],
  },
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="admin-sidebar">

      {/* LOGO */}
      <div className="sidebar-logo">
        <span className="logo-green">SV</span>
        <span className="logo-yellow">Marketplace</span>
      </div>

      {/* MENU */}
      {menuGroups.map((group) => (
        <div key={group.label} className="sidebar-group">
          <p className="sidebar-group-label">{group.label}</p>

          <ul className="sidebar-menu">
            {group.items.map((item) => (
              <li key={item.id}>
                <button
                  className={`sidebar-item ${location.pathname === `/${item.id}` ? "active" : ""
                    }`}
                  onClick={() => navigate(`/${item.id}`)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* LOGOUT */}
      <div className="sidebar-logout">
        <button>
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}