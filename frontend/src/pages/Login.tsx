import type { CSSProperties } from "react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, refreshUser } = useAuth();

  // state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        emailOrPhone: email.trim(),
        password: password.trim(),
      });

      console.log("LOGIN RESPONSE:", res.data);

      if (res.data.token) {
        // localStorage.setItem("token", res.data.token);
        // window.dispatchEvent(new Event("storage"));

        login(res.data.token);

        // load user ngay lập tức
        await refreshUser();

        // chuyển trang
        if (res.data.role === "ADMIN") {
          navigate("/admin/posts");
        } else {
          navigate("/");
        }
      } else {
        alert(res.data.message || "Sai tài khoản hoặc mật khẩu");
        setPassword("");
      }
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);

      const message =
        error?.response?.data?.message || "Sai tài khoản hoặc mật khẩu";

      alert(message);
      setPassword("");
    }
  };

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .login-form-container { padding: 30px 20px !important; }
          }
        `}
      </style>

      <div className="login-wrapper" style={styles.wrapper}>

        {/* FORM */}
        <div className="login-form-container" style={styles.formContainer}>
            <h2 style={styles.title}>Đăng nhập</h2>

            <form onSubmit={handleLogin} style={styles.form}>
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

              <div style={styles.registerText}>
                Bạn chưa có tài khoản?{" "}
                <Link to="/register" style={styles.registerLink}>
                  Đăng ký
                </Link>
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
};