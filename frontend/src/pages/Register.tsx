import type { CSSProperties } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

      alert("Đã gửi mã OTP về email của bạn. Vui lòng kiểm tra và xác nhận.");
      navigate("/verify-otp", {
        state: {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        },
      });
    } catch (error: any) {
      alert(error.message || "Lỗi đăng ký");
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

            {/* Họ và tên */}
            <div className="input-group">
              <label htmlFor="fullName" className="label">Họ và tên</label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                className={`input ${errors.fullName ? "input-error" : ""}`}
                placeholder="Nhập họ và tên"
                onChange={handleChange}
              />
              {errors.fullName && <span className="error-msg"><i className="fa-solid fa-circle-exclamation" /> {errors.fullName}</span>}
            </div>

            {/* Email */}
            <div className="input-group">
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                type="text"
                name="email"
                className={`input ${errors.email ? "input-error" : ""}`}
                placeholder="Nhập email của bạn"
                onChange={handleChange}
              />
              {errors.email && <span className="error-msg"><i className="fa-solid fa-circle-exclamation" /> {errors.email}</span>}
            </div>

            {/* Mật khẩu */}
            <div className="input-group">
              <div className="label-row">
                <label htmlFor="password" className="label">Mật khẩu</label>
              </div>
              <div className={`input-password ${errors.password ? "input-error" : ""}`}>
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
              {errors.password && <span className="error-msg"><i className="fa-solid fa-circle-exclamation" /> {errors.password}</span>}
            </div>

            {/* Nhập lại mật khẩu */}
            <div className="input-group">
              <label htmlFor="confirmPassword" className="label">Nhập lại mật khẩu</label>
              <div className={`input-password ${errors.confirmPassword ? "input-error" : ""}`}>
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
              {errors.confirmPassword && <span className="error-msg"><i className="fa-solid fa-circle-exclamation" /> {errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="btn-auth">Đăng ký</button>
            <div className="text-login">
              Bạn đã có tài khoản?{" "}
              <a href="/login" className="link-login">Đăng nhập</a>
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
    fontFamily: "sans-serif",
    backgroundImage: "url('/images/bg_tmdt.png')",
    backgroundSize: "100% 100%",
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  formContainer: {
    width: "100%",
    maxWidth: "480px",
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
};