import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/admin/AdminSidebar.css";
import { useAuth } from "../../context/AuthContext";

import {
  Ban,
  History,
  LogOut,
  Bookmark
} from "lucide-react";

const IconHome = ({ size = 24 }: { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    width={size}
    height={size}
  >
    <path
      fill="currentColor"
      d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z"
    />
  </svg>
);

const IconPostList = ({ size = 24 }: { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    width={size}
    height={size}
  >
    <path
      fill="currentColor"
      d="M439.4 96L448 96C483.3 96 512 124.7 512 160L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 160C128 124.7 156.7 96 192 96L200.6 96C211.6 76.9 232.3 64 256 64L384 64C407.7 64 428.4 76.9 439.4 96zM376 176C389.3 176 400 165.3 400 152C400 138.7 389.3 128 376 128L264 128C250.7 128 240 138.7 240 152C240 165.3 250.7 176 264 176L376 176zM256 320C256 302.3 241.7 288 224 288C206.3 288 192 302.3 192 320C192 337.7 206.3 352 224 352C241.7 352 256 337.7 256 320zM288 320C288 333.3 298.7 344 312 344L424 344C437.3 344 448 333.3 448 320C448 306.7 437.3 296 424 296L312 296C298.7 296 288 306.7 288 320zM288 448C288 461.3 298.7 472 312 472L424 472C437.3 472 448 461.3 448 448C448 434.7 437.3 424 424 424L312 424C298.7 424 288 434.7 288 448zM224 480C241.7 480 256 465.7 256 448C256 430.3 241.7 416 224 416C206.3 416 192 430.3 192 448C192 465.7 206.3 480 224 480z"
    />
  </svg>
);

const IconPostModeration = ({ size = 24 }: { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    width={size}
    height={size}
  >
    <path
      fill="currentColor"
      d="M320 64C324.6 64 329.2 65 333.4 66.9L521.8 146.8C543.8 156.1 560.2 177.8 560.1 204C559.6 303.2 518.8 484.7 346.5 567.2C329.8 575.2 310.4 575.2 293.7 567.2C121.3 484.7 80.6 303.2 80.1 204C80 177.8 96.4 156.1 118.4 146.8L306.7 66.9C310.9 65 315.4 64 320 64zM320 130.8L320 508.9C458 442.1 495.1 294.1 496 205.5L320 130.9L320 130.9z"
    />
  </svg>
);

const IconViolationList = ({ size = 24 }: { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    width={size}
    height={size}
  >
    <path
      fill="currentColor"
      d="M320 64C334.7 64 348.2 72.1 355.2 85L571.2 485C577.9 497.4 577.6 512.4 570.4 524.5C563.2 536.6 550.1 544 536 544L104 544C89.9 544 76.8 536.6 69.6 524.5C62.4 512.4 62.1 497.4 68.8 485L284.8 85C291.8 72.1 305.3 64 320 64zM320 416C302.3 416 288 430.3 288 448C288 465.7 302.3 480 320 480C337.7 480 352 465.7 352 448C352 430.3 337.7 416 320 416zM320 224C301.8 224 287.3 239.5 288.6 257.7L296 361.7C296.9 374.2 307.4 384 319.9 384C332.5 384 342.9 374.3 343.8 361.7L351.2 257.7C352.5 239.5 338.1 224 319.8 224z"
    />
  </svg>
);

const IconRegionList = ({ size = 24 }: { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    width={size}
    height={size}
  >
    <path
      fill="currentColor"
      d="M352 348.4C416.1 333.9 464 276.5 464 208C464 128.5 399.5 64 320 64C240.5 64 177 128.5 176 208C176 276.5 223.9 333.9 288 348.4L288 544C288 561.7 302.3 576 320 576C337.7 576 352 561.7 352 544L352 348.4zM328 160C297.1 160 272 185.1 272 216C272 229.3 261.3 240 248 240C234.7 240 224 229.3 224 216C224 158.6 270.6 112 328 112C341.3 112 352 122.7 352 136C352 149.3 341.3 160 328 160z"
    />
  </svg>
);

const IconAddressList = ({ size = 24 }: { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    width={size}
    height={size}
  >
    <path
      fill="currentColor"
      d="M576 112C576 100.9 570.3 90.6 560.8 84.8C551.3 79 539.6 78.4 529.7 83.4L413.5 141.5L234.1 81.6C226 78.9 217.3 79.5 209.7 83.3L81.7 147.3C70.8 152.8 64 163.9 64 176L64 528C64 539.1 69.7 549.4 79.2 555.2C88.7 561 100.4 561.6 110.3 556.6L226.4 498.5L399.7 556.3C395.4 549.9 391.2 543.2 387.1 536.4C376.1 518.1 365.2 497.1 357.1 474.6L255.9 440.9L255.9 156.4L383.9 199.1L383.9 298.4C414.9 262.6 460.9 240 511.9 240C534.5 240 556.1 244.4 575.9 252.5L576 112zM512 288C445.7 288 392 340.8 392 405.9C392 474.8 456.1 556.3 490.6 595.2C502.2 608.2 521.9 608.2 533.5 595.2C568 556.3 632.1 474.8 632.1 405.9C632.1 340.8 578.4 288 512.1 288zM472 408C472 385.9 489.9 368 512 368C534.1 368 552 385.9 552 408C552 430.1 534.1 448 512 448C489.9 448 472 430.1 472 408z"
    />
  </svg>
);

const IconCategoryList = ({ size = 24 }: { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    width={size}
    height={size}
  >
    <path
      fill="currentColor"
      d="M433.2 103.1L581.4 253.4C609.1 281.5 609.1 326.5 581.4 354.6L425 512.9C415.7 522.3 400.5 522.4 391.1 513.1C381.7 503.8 381.6 488.6 390.9 479.2L547.3 320.8C556.5 311.5 556.5 296.4 547.3 287.1L399 136.9C389.7 127.5 389.8 112.3 399.2 103C408.6 93.7 423.8 93.8 433.1 103.2zM64.1 293.5L64.1 160C64.1 124.7 92.8 96 128.1 96L261.6 96C278.6 96 294.9 102.7 306.9 114.7L450.9 258.7C475.9 283.7 475.9 324.2 450.9 349.2L317.4 482.7C292.4 507.7 251.9 507.7 226.9 482.7L82.9 338.7C70.9 326.7 64.2 310.4 64.2 293.4zM208.1 208C208.1 190.3 193.8 176 176.1 176C158.4 176 144.1 190.3 144.1 208C144.1 225.7 158.4 240 176.1 240C193.8 240 208.1 225.7 208.1 208z"
    />
  </svg>
);

const IconUserList = ({ size = 24 }: { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    width={size}
    height={size}
  >
    <path
      fill="currentColor"
      d="M320 80C377.4 80 424 126.6 424 184C424 241.4 377.4 288 320 288C262.6 288 216 241.4 216 184C216 126.6 262.6 80 320 80zM96 152C135.8 152 168 184.2 168 224C168 263.8 135.8 296 96 296C56.2 296 24 263.8 24 224C24 184.2 56.2 152 96 152zM0 480C0 409.3 57.3 352 128 352C140.8 352 153.2 353.9 164.9 357.4C132 394.2 112 442.8 112 496L112 512C112 523.4 114.4 534.2 118.7 544L32 544C14.3 544 0 529.7 0 512L0 480zM521.3 544C525.6 534.2 528 523.4 528 512L528 496C528 442.8 508 394.2 475.1 357.4C486.8 353.9 499.2 352 512 352C582.7 352 640 409.3 640 480L640 512C640 529.7 625.7 544 608 544L521.3 544zM472 224C472 184.2 504.2 152 544 152C583.8 152 616 184.2 616 224C616 263.8 583.8 296 544 296C504.2 296 472 263.8 472 224zM160 496C160 407.6 231.6 336 320 336C408.4 336 480 407.6 480 496L480 512C480 529.7 465.7 544 448 544L192 544C174.3 544 160 529.7 160 512L160 496z"
    />
  </svg>
);

const IconStatusUpdate = ({ size = 24 }: { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    width={size}
    height={size}
  >
    <path
      fill="currentColor"
      d="M256.5 72C322.8 72 376.5 125.7 376.5 192C376.5 258.3 322.8 312 256.5 312C190.2 312 136.5 258.3 136.5 192C136.5 125.7 190.2 72 256.5 72zM226.7 368L286.1 368L287.6 368C274.7 394.8 279.8 426.2 299.1 447.5C278.9 469.8 274.3 503.3 289.7 530.9L312.2 571.3C313.1 572.9 314.1 574.5 315.1 576L78.1 576C61.7 576 48.4 562.7 48.4 546.3C48.4 447.8 128.2 368 226.7 368zM432.6 311.6C432.6 298.3 443.3 287.6 456.6 287.6L504.6 287.6C517.9 287.6 528.6 298.3 528.6 311.6L528.6 317.7C528.6 336.6 552.7 350.5 569.1 341.1L574.1 338.2C585.7 331.5 600.6 335.6 607.1 347.3L629.5 387.5C635.7 398.7 632.1 412.7 621.3 419.5L616.6 422.4C600.4 432.5 600.4 462.3 616.6 472.5L621.2 475.4C632 482.2 635.7 496.2 629.5 507.4L607 547.8C600.5 559.5 585.6 563.7 574 556.9L569.1 554C552.7 544.5 528.6 558.5 528.6 577.4L528.6 583.5C528.6 596.8 517.9 607.5 504.6 607.5L456.6 607.5C443.3 607.5 432.6 596.8 432.6 583.5L432.6 577.6C432.6 558.6 408.4 544.6 391.9 554.1L387.1 556.9C375.5 563.6 360.7 559.5 354.1 547.8L331.5 507.4C325.3 496.2 328.9 482.1 339.8 475.3L344.2 472.6C360.5 462.5 360.5 432.5 344.2 422.4L339.7 419.6C328.8 412.8 325.2 398.7 331.4 387.5L353.9 347.2C360.4 335.5 375.3 331.4 386.8 338.1L391.6 340.9C408.1 350.4 432.3 336.4 432.3 317.4L432.3 311.5zM532.5 447.8C532.5 419.1 509.2 395.8 480.5 395.8C451.8 395.8 428.5 419.1 428.5 447.8C428.5 476.5 451.8 499.8 480.5 499.8C509.2 499.8 532.5 476.5 532.5 447.8z"
    />
  </svg>
);

const IconTransactionList = ({ size = 24 }: { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    width={size}
    height={size}
  >
    <path
      fill="currentColor"
      d="M64 192L64 224L576 224L576 192C576 156.7 547.3 128 512 128L128 128C92.7 128 64 156.7 64 192zM64 272L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 272L64 272zM128 424C128 410.7 138.7 400 152 400L200 400C213.3 400 224 410.7 224 424C224 437.3 213.3 448 200 448L152 448C138.7 448 128 437.3 128 424zM272 424C272 410.7 282.7 400 296 400L360 400C373.3 400 384 410.7 384 424C384 437.3 373.3 448 360 448L296 448C282.7 448 272 437.3 272 424z"
    />
  </svg>
);

const IconComplaintHandling = ({ size = 24 }: { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    width={size}
    height={size}
  >
    <path
      fill="currentColor"
      d="M384 64C407.7 64 428.4 76.9 439.4 96L448 96C483.3 96 512 124.7 512 160L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 160C128 124.7 156.7 96 192 96L200.6 96C211.6 76.9 232.3 64 256 64L384 64zM410.9 276.6C400.2 268.8 385.2 271.2 377.4 281.9L291.8 399.6L265.3 372.2C256.1 362.7 240.9 362.4 231.4 371.6C221.9 380.8 221.6 396 230.8 405.5L277.2 453.5C282.1 458.6 289 461.3 296.1 460.8C303.2 460.3 309.7 456.7 313.9 451L416.2 310.1C424 299.4 421.6 284.4 410.9 276.6zM264 128C250.7 128 240 138.7 240 152C240 165.3 250.7 176 264 176L376 176C389.3 176 400 165.3 400 152C400 138.7 389.3 128 376 128L264 128z"
    />
  </svg>
);

const IconStudentVerification = ({ size = 24 }: { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    width={size}
    height={size}
  >
    <path
      fill="currentColor"
      d="M32 160C32 124.7 60.7 96 96 96L544 96C579.3 96 608 124.7 608 160L32 160zM32 208L608 208L608 480C608 515.3 579.3 544 544 544L96 544C60.7 544 32 515.3 32 480L32 208zM279.3 480C299.5 480 314.6 460.6 301.7 445C287 427.3 264.8 416 240 416L176 416C151.2 416 129 427.3 114.3 445C101.4 460.6 116.5 480 136.7 480L279.2 480zM208 376C238.9 376 264 350.9 264 320C264 289.1 238.9 264 208 264C177.1 264 152 289.1 152 320C152 350.9 177.1 376 208 376zM392 272C378.7 272 368 282.7 368 296C368 309.3 378.7 320 392 320L504 320C517.3 320 528 309.3 528 296C528 282.7 517.3 272 504 272L392 272zM392 368C378.7 368 368 378.7 368 392C368 405.3 378.7 416 392 416L504 416C517.3 416 528 405.3 528 392C528 378.7 517.3 368 504 368L392 368z"
    />
  </svg>
);

const IconBannedKeywords = ({ size = 24 }: { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    width={size}
    height={size}
  >
    <path
      fill="currentColor"
      d="M73 39.1C63.6 29.7 48.4 29.7 39.1 39.1C29.8 48.5 29.7 63.7 39 73.1L567 601.1C576.4 610.5 591.6 610.5 600.9 601.1C610.2 591.7 610.3 576.5 600.9 567.2L354.7 320.9L400.2 160L503 160L497 184.2C492.7 201.3 503.1 218.7 520.3 223C537.5 227.3 554.8 216.9 559.1 199.7L570.1 155.6C577.6 125.3 554.7 96 523.5 96L204.5 96C184.7 96 167.2 108.1 160 126.1L73 39.1zM212.4 178.5L217 160L333.7 160L302.9 269L212.4 178.5zM273 374.8L243.3 480L192 480C174.3 480 160 494.3 160 512C160 529.7 174.3 544 192 544L352 544C369.7 544 384 529.7 384 512C384 494.3 369.7 480 352 480L309.8 480L324.9 426.7L273 374.8z"
    />
  </svg>
);

const menuGroups = [
  {
    label: "Thống kê hoạt động website",
    items: [
      { id: "admin", label: "Trang chủ", icon: <IconHome size={24} /> },
    ],
  },
  {
    label: "Quản lý bài đăng",
    items: [
      { id: "admin/posts", label: "Danh sách bài đăng", icon: <IconPostList size={24} /> },
      { id: "admin/duyet-bai", label: "Kiểm duyệt bài đăng", icon: <IconPostModeration size={24} /> },
      { id: "admin/vi-pham", label: "Danh sách vi phạm", icon: <IconViolationList size={24} /> },
    ],
  },
  {
    label: "Quản lý địa chỉ",
    items: [
      { id: "admin/khu-vuc", label: "Danh sách khu vực", icon: <IconRegionList size={24} /> },
      { id: "admin/dia-chi", label: "Danh sách địa chỉ", icon: <IconAddressList size={24} /> },
    ],
  },
  {
    label: "Quản lý danh mục",
    items: [
      { id: "admin/categories", label: "Danh sách danh mục", icon: <IconCategoryList size={24} /> },
    ],
  },
  {
    label: "Quản lý người dùng",
    items: [
      { id: "admin/users", label: "Danh sách người dùng", icon: <IconUserList size={24} /> },
      // { id: "admin/status", label: "Cập nhật trạng thái", icon: <IconStatusUpdate size={24} /> },
    ],
  },
  {
    label: "Quản lý giao dịch",
    items: [
      { id: "admin/giao-dich", label: "Danh sách giao dịch", icon: <IconTransactionList size={24} /> },
    ],
  },
  {
    label: "Quản lý khiếu nại",
    items: [
      { id: "admin/khieu-nai", label: "Danh sách khiếu nại", icon: <IconViolationList size={24} /> },
      { id: "admin/xu-ly", label: "Xử lý khiếu nại", icon: <IconComplaintHandling size={24} /> },
    ],
  },
  {
    label: "Quản lý tin cậy",
    items: [
      { id: "admin/xac-thuc", label: "Duyệt định danh sinh viên", icon: <IconStudentVerification size={24} /> },
      { id: "admin/lua-dao", label: "Cảnh báo lừa đảo", icon: <Ban size={24} /> },
      { id: "admin/tu-khoa", label: "Danh sách từ khóa cấm", icon: <IconBannedKeywords size={24} /> },
    ],
  },
  {
    label: "Quản lý gói tin",
    items: [
      { id: "admin/packages", label: "Danh sách gói tin", icon: <Bookmark size={24} /> },
    ],
  },
  {
    label: "Nhật ký hoạt động",
    items: [
      { id: "admin/logs", label: "Lịch sử", icon: <History size={24} /> },
    ],
  },
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="admin-sidebar" style={{ minWidth: "300px", width: "300px", flexShrink: 0 }}>

      {/* LOGO */}
      <div className="admin-sidebar-logo">
        <span style={{ color: "#1B7A4A" }}>SV</span>
        <span style={{ color: "#D4A017" }}>Marketplace</span>
      </div>

      {menuGroups.map((group) => (
        <div key={group.label} className="admin-sidebar-group">
          <p className="admin-sidebar-group-label">{group.label}</p>

          <ul className="admin-sidebar-menu">
            {group.items.map((item) => {
              const isActive = item.id === "admin"
                ? location.pathname === "/admin" || location.pathname === "/admin/"
                : location.pathname.startsWith(`/${item.id}`);

              return (
                <li key={item.id}>
                  <button
                    className={`admin-sidebar-item ${isActive ? "active" : ""}`}
                    onClick={() => navigate(`/${item.id}`)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {/* LOGOUT */}
      <div className="admin-sidebar-logout">
        <button
          className="admin-sidebar-item d-flex align-items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut size={24} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}