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
    label: "Quản lí hồ sơ",
    items: [
      { id: "thong-tin", label: "Thông tin cá nhân", path: "/profile" },
      { id: "mat-khau", label: "Thay đổi mật khẩu", path: "/profile" },
    ],
  },
  {
    label: "Quản lí bài đăng",
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
    label: "Quản lí giao dịch",
    items: [
      { id: "purchase-history", label: "Mua hàng", path: "/purchase-history" },
      { id: "sales-history", label: "Bán hàng", path: "/sales-history" },
    ],
  },
  {
    label: "Quản lí đánh giá",
    items: [
      { id: "nguoi-ban", label: "Người bán", path: "/profile" },
      { id: "nguoi-mua", label: "Người mua", path: "/profile" },
    ],
  },
  {
    label: "Quản lí gói tin",
    items: [
      { id: "goi-tin", label: "Gói tin sử dụng", path: "/profile" },
      { id: "thong-ke", label: "Thống kê hoạt động", path: "/profile" },
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
            {group.items.map((item) => (
              <li key={item.id}>
                <button
                  className={`sidebar-item ${
                    location.pathname === item.path ||
                    (item.path === "/my-listings" &&
                      location.pathname.startsWith("/my-listings/"))
                      ? "active"
                      : ""
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
