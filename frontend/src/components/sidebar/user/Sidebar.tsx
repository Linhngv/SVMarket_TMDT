import { useLocation, useNavigate } from "react-router-dom";
import "../../../styles/Sidebar.css";

type SidebarItem = {
  id: string;
  label: string;
  path: string;
};

type SidebarGroup = {
  label: string;
  items: SidebarItem[];
};

const menuGroups: SidebarGroup[] = [
  {
    label: "Quản lý hồ sơ",
    items: [
      { id: "thong-tin", label: "Thông tin cá nhân", path: "/profile" },
      { id: "mat-khau", label: "Thay đổi mật khẩu", path: "/change-password" },
    ],
  },
  {
    label: "Quản lý bài đăng",
    items: [
      { id: "create-listing", label: "Thêm bài đăng", path: "/create-listing" },
      {
        id: "my-listings",
        label: "Danh sách bài đăng",
        path: "/my-listings",
      },
    ],
  },
  {
    label: "Quản lý giao dịch",
    items: [
      { id: "purchase-history", label: "Mua hàng", path: "/purchase-history" },
      { id: "sales-history", label: "Bán hàng", path: "/sales-history" },
    ],
  },
  {
    label: "Quản lý đánh giá",
    items: [
      { id: "seller-reviews", label: "Người bán", path: "/reviews/seller" },
      { id: "buyer-reviews", label: "Người mua", path: "/reviews/buyer" },
    ],
  },
  {
    label: "Quản lý gói tin",
    items: [
      { id: "goi-tin", label: "Gói tin sử dụng", path: "/my-packages" },
      { id: "thong-ke", label: "Thống kê hoạt động", path: "/statistics" },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      {menuGroups.map((group) => (
        <div key={group.label} className="sidebar-group">
          <p className="sidebar-group-label">{group.label}</p>
          <ul className="sidebar-menu">
            {group.items.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path === "/my-listings" && location.pathname.startsWith("/my-listings/"));

              return (
                <li key={item.id}>
                  <button
                    className={`sidebar-item ${isActive ? "active" : ""}`}
                    style={{ borderLeft: isActive ? "4px solid var(--dark-green)" : "4px solid #E8F5EE" }}
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}
