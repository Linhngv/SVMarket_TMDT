import { useLocation, useNavigate } from "react-router-dom";
import "../../../styles/Sidebar.css";

const menuGroups = [
  {
    label: "Quản lí hồ sơ",
    items: [
      { id: "thong-tin", label: "Thông tin cá nhân" },
      { id: "mat-khau", label: "Thay đổi mật khẩu" },
    ],
  },
  {
    label: "Quản lí bài đăng",
    items: [
      { id: "them-bai", label: "Thêm bài đăng" },
      { id: "danh-sach-bai", label: "Danh sách bài đăng" },
    ],
  },
  {
    label: "Quản lí giao dịch",
    items: [
      { id: "purchase-history", label: "Mua hàng" },
      { id: "sales-history", label: "Bán hàng" },
    ],
  },
  {
    label: "Quản lí đánh giá",
    items: [
      { id: "nguoi-ban", label: "Người bán" },
      { id: "nguoi-mua", label: "Người mua" },
    ],
  },
  {
    label: "Quản lí gói tin",
    items: [
      { id: "my-packages", label: "Gói tin sử dụng" },
      { id: "thong-ke", label: "Thống kê hoạt động" },
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
                    location.pathname === `/${item.id}` ? "active" : ""
                  }`}
                  onClick={() => navigate(`/${item.id}`)}
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
