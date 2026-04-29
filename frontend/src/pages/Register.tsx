import type { CSSProperties } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Register.css";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  studentCard?: string;
};

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [studentCard, setStudentCard] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string>("");

  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Vui lòng không được để trống";
    }

    if (!form.email.trim()) {
      newErrors.email = "Vui lòng không được để trống";
    } else if (!EMAIL_REGEX.test(form.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    if (!form.password) {
      newErrors.password = "Vui lòng không được để trống";
    } else if (!PASSWORD_REGEX.test(form.password)) {
      newErrors.password =
        "Mật khẩu phải có ít nhất 6 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&)";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng không được để trống";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    if (!studentCard) {
      newErrors.studentCard = "Vui lòng upload ảnh thẻ sinh viên";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setCardError("Vui lòng chọn file ảnh (jpg, png, ...)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setCardError("Ảnh không được vượt quá 5MB");
      return;
    }
    setStudentCard(file);
    setCardError("");
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.text();
      if (!response.ok) throw new Error(data);

      toast.success(
        "Đã gửi mã OTP về email của bạn. Vui lòng kiểm tra và xác nhận.",
      );
      navigate("/verify-otp", {
        state: {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          studentCard,
        },
      });
    } catch (error: any) {
      toast.error(error.message || "Lỗi đăng ký");
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .register-form-container { padding: 30px 20px !important; }
          }
        `}
      </style>

      <div className="register-wrapper" style={styles.wrapper}>
        <div className="register-form-container" style={styles.formContainer}>
          <h3 style={styles.title}>Tạo tài khoản</h3>
          <form onSubmit={handleRegister} className="form" noValidate>
            {/* Họ và tên + Email */}
            <div style={styles.row}>
              <div className="input-group" style={styles.halfField}>
                <label htmlFor="fullName" className="label">
                  Họ và tên
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  className={`input ${errors.fullName ? "input-error" : ""}`}
                  placeholder="Nhập họ và tên"
                  onChange={handleChange}
                />
                {errors.fullName && (
                  <span className="error-msg">
                    <i className="fa-solid fa-circle-exclamation" />{" "}
                    {errors.fullName}
                  </span>
                )}
              </div>

              <div className="input-group" style={styles.halfField}>
                <label htmlFor="email" className="label">
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  name="email"
                  className={`input ${errors.email ? "input-error" : ""}`}
                  placeholder="Nhập email của bạn"
                  onChange={handleChange}
                />
                {errors.email && (
                  <span className="error-msg">
                    <i className="fa-solid fa-circle-exclamation" />{" "}
                    {errors.email}
                  </span>
                )}
              </div>
            </div>

            {/*Mật khẩu + Nhập lại mật khẩu */}
            <div style={styles.row}>
              <div className="input-group" style={styles.halfField}>
                <label htmlFor="password" className="label">
                  Mật khẩu
                </label>
                <div
                  className={`input-password ${errors.password ? "input-error" : ""}`}
                >
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Nhập mật khẩu"
                    onChange={handleChange}
                  />
                  <i
                    className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
                {errors.password && (
                  <span className="error-msg">
                    <i className="fa-solid fa-circle-exclamation" />{" "}
                    {errors.password}
                  </span>
                )}
              </div>

              <div className="input-group" style={styles.halfField}>
                <label htmlFor="confirmPassword" className="label">
                  Nhập lại mật khẩu
                </label>
                <div
                  className={`input-password ${errors.confirmPassword ? "input-error" : ""}`}
                >
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    onChange={handleChange}
                  />
                  <i
                    className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </div>
                {errors.confirmPassword && (
                  <span className="error-msg">
                    <i className="fa-solid fa-circle-exclamation" />{" "}
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>

            {/* Thẻ sinh viên */}
            <div className="input-group">
              <label className="label">Ảnh thẻ sinh viên</label>

              {previewUrl ? (
                <div style={styles.previewWrapper}>
                  <img
                    src={previewUrl}
                    alt="Preview thẻ sinh viên"
                    style={styles.previewInside}
                  />
                  <button
                    type="button"
                    style={styles.removeBtn}
                    onClick={() => {
                      setStudentCard(null);
                      setPreviewUrl(null);
                      setCardError("");
                    }}
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>
              ) : (
                <label htmlFor="studentCard" style={styles.uploadLabel}>
                  <i
                    className="fa-solid fa-id-card"
                    style={{ marginRight: 8 }}
                  />
                  Chọn ảnh thẻ sinh viên
                </label>
              )}

              <input
                id="studentCard"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              {(errors.studentCard || cardError) && (
                <span className="error-msg">
                  <i className="fa-solid fa-circle-exclamation" />{" "}
                  {errors.studentCard || cardError}
                </span>
              )}
            </div>

            <button
              type="submit"
              className={`btn-auth ${loading ? "btn-auth-loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Đang xử lý...
                </>
              ) : (
                "Đăng ký"
              )}
            </button>
            <div className="text-login">
              Bạn đã có tài khoản?{" "}
              <a href="/login" className="link-login">
                Đăng nhập
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// styles
const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100%",
    backgroundImage: "url('/images/bg_tmdt.png')",
    backgroundSize: "100% 100%",
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  formContainer: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
    margin: "20px",
  },
  title: {
    marginBottom: "20px",
    fontSize: "32px",
    textAlign: "center",
    color: "#1A1A2E",
  },
  uploadLabel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0",
    border: "2px dashed #ccc",
    borderRadius: "10px",
    cursor: "pointer",
    color: "#555",
    fontSize: "14px",
    backgroundColor: "#fafafa",
    overflow: "hidden",
    minHeight: "48px",
  },
  preview: {
    marginTop: "8px",
    width: "100%",
    maxHeight: "160px",
    objectFit: "cover" as const,
    borderRadius: "10px",
    border: "1px solid var(--border)",
  },
  previewInside: {
    height: "140px",
    width: "auto",
    maxWidth: "100%",
    objectFit: "contain" as const,
    display: "block",
    backgroundColor: "var(--gray-light)",
    borderRadius: "8px",
  },
  row: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap" as const,
  },
  halfField: {
    flex: "1 1 calc(50% - 8px)",
    minWidth: "200px",
  },
  removeBtn: {
    position: "absolute" as const,
    top: "6px",
    right: "6px",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "rgba(0,0,0,0.55)",
    color: "var(--white)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    lineHeight: 1,
  },
  previewWrapper: {
    position: "relative" as const,
    display: "inline-block",
    borderRadius: "10px",
    overflow: "hidden",
    border: "1px solid var(--border)",
  },
};
