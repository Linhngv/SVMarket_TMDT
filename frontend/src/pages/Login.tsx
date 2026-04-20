import type { CSSProperties } from "react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, refreshUser } = useAuth();

  // state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // token từ gg trả về
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const error = params.get("error");
    const role = params.get("role");

    if (token) {
      login(token);

      refreshUser().then(() => {
        if (role === "ADMIN") {
          navigate("/admin/posts");
        } else {
          navigate("/");
        }
      });
    }
    else if (error === "edu_email_required") {
      setErrorMessage("Vui lòng sử dụng email sinh viên để tiếp tục!");
      navigate("/login", { replace: true });
    }
  }, [location, login, navigate, refreshUser]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrPhone: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (res.ok && data.token) {
        login(data.token);

        // load user ngay lập tức
        await refreshUser();

        // chuyển trang
        if (data.role === "ADMIN") {
          navigate("/admin/posts");
        } else {
          navigate("/");
        }
      } else {
        setErrorMessage(data.message || "Sai tài khoản hoặc mật khẩu");
        setPassword("");
      }
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);
      setErrorMessage("Không thể kết nối đến máy chủ");
      setPassword("");
    }
  };

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .login-wrapper { flex-direction: column !important; height: auto !important; min-height: 100vh; }
            .image-side { display: none !important; }
            .form-side { padding: 20px !important; }
          }
        `}
      </style>

      <div className="login-wrapper" style={styles.wrapper}>
        {/* LEFT IMAGE */}
        <div className="image-side" style={styles.imageSide}>
          <img
            src="/images/bg_login.jpg"
            alt="login background"
            style={styles.image}
          />
        </div>

        {/* FORM */}
        <div className="form-side" style={styles.formSide}>
          <div style={styles.formContainer}>
            <h2 style={styles.title}>Đăng nhập</h2>

            <form onSubmit={handleLogin} style={styles.form}>
              {errorMessage && (
                <div style={{ color: "red", fontSize: "14px", textAlign: "center" }}>
                  {errorMessage}
                </div>
              )}

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email hoặc số điện thoại</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Mật khẩu</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <Link to="/forgot-password" style={styles.forgot}>
                Quên mật khẩu?
              </Link>

              <button
                type="submit"
                style={{
                  ...styles.button,
                  opacity: password.length < 6 ? 0.5 : 1,
                  cursor: password.length < 6 ? "not-allowed" : "pointer",
                }}
                disabled={password.length < 6}
              >
                Đăng nhập
              </button>

              <div style={styles.divider}>
                <span style={styles.dividerLine}></span>
                <span style={styles.dividerText}>Hoặc</span>
                <span style={styles.dividerLine}></span>
              </div>

              <button
                type="button"
                style={styles.googleButton}
                onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                Tiếp tục với Google
              </button>

              <div style={styles.registerText}>
                Bạn chưa có tài khoản?{" "}
                <Link to="/register" style={styles.registerLink}>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

// styles
const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: "flex",
    height: "100vh",
    width: "100%",
    fontFamily: "sans-serif",
  },
  imageSide: {
    flex: 1,
    padding: "40px",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "24px",
  },
  formSide: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
  },
  formContainer: {
    width: "100%",
    maxWidth: "420px",
  },
  title: {
    marginBottom: "20px",
    fontSize: "36px",
    textAlign: "center",
    color: "#1A1A2E",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #BFBFBF",
  },
  forgot: {
    fontSize: "14px",
    color: "#1B7A4A",
    textDecoration: "none",
    alignSelf: "flex-end",
  },
  button: {
    padding: "14px",
    backgroundColor: "#1B7A4A",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
  },
  registerText: {
    textAlign: "center",
    fontSize: "14px",
  },
  registerLink: {
    color: "#1B7A4A",
    textDecoration: "none",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
  },
  dividerLine: {
    flex: 1,
    borderBottom: "1px solid #BFBFBF",
  },
  dividerText: {
    margin: "0 10px",
    color: "#666",
    fontSize: "14px",
  },
  googleButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "14px",
    backgroundColor: "#fff",
    color: "#333",
    border: "1px solid #BFBFBF",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  errorBox: {
    backgroundColor: "#ffe6e6",
    color: "#d93025",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "14px",
  },
};