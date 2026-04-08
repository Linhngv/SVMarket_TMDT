export type Product = {
  id: number;
  emoji: string;
  tag: string;
  name: string;
  price: string;
  description: string;
  accent: string;
};

export const products: Product[] = [
  {
    id: 1,
    emoji: "📚",
    tag: "Bán chạy",
    name: "Sách lập trình React",
    price: "45.000đ",
    description: "Bộ sách cơ bản cho sinh viên học frontend và React JS.",
    accent: "#4f46e5",
  },
  {
    id: 2,
    emoji: "💻",
    tag: "Mới đăng",
    name: "Laptop sinh viên",
    price: "6.200.000đ",
    description: "Máy phù hợp học tập, làm đồ án và chạy web app.",
    accent: "#0ea5e9",
  },
  {
    id: 3,
    emoji: "🎧",
    tag: "Giá tốt",
    name: "Tai nghe Bluetooth",
    price: "320.000đ",
    description: "Phục vụ học online, nghe nhạc và làm việc nhóm.",
    accent: "#22c55e",
  },
  {
    id: 4,
    emoji: "🖊️",
    tag: "Ưu đãi",
    name: "Combo dụng cụ học tập",
    price: "120.000đ",
    description: "Bút, sổ, thước và các vật dụng cần thiết cho sinh viên.",
    accent: "#f97316",
  },
];
