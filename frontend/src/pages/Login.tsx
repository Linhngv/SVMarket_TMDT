// import type { CSSProperties } from "react";
// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// import axios from "axios";

// export default function Login() {
//   // State để lưu trữ dữ liệu người dùng nhập vào
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault(); // Ngăn trình duyệt tải lại trang
//     try {
//       const res = await axios.post("http://localhost:8080/api/auth/login", {
//         emailOrPhone: email.trim(),
//         password: password.trim(),
//       });

//       // Kiểm tra nếu có token thì mới cho qua
//       if (res.data.token) {
//         // lưu token
//         localStorage.setItem("token", res.data.token);
//         console.log("LOGIN RESPONSE:", res.data);
//         // chuyển trang
//         window.location.href = "/";
//       } else {
//         // Đăng nhập thất bại (trả về 200 OK nhưng token null)
//         alert(res.data.message || "Sai tài khoản hoặc mật khẩu");
//         setEmail("");
//         setPassword("");
//       }
//     } catch (error) {
//       console.error("Lỗi đăng nhập:", error); // Log lỗi chi tiết hơn
//       alert("Sai tài khoản hoặc mật khẩu");
//       setEmail("");
//       setPassword("");
//     }
//   };
//   return (
//     <>
//       <style>
//         {`
//           @media (max-width: 768px) {
//             .login-wrapper { flex-direction: column !important; height: auto !important; min-height: 100vh; }
//             .image-side { display: none !important; } /* Ẩn ảnh trên mobile để tập trung vào form */
//             .form-side { padding: 20px !important; }
//           }
//         `}
//       </style>
//       <div className="login-wrapper" style={styles.wrapper}>
//         {/* CỘT TRÁI: HÌNH ẢNH */}
//         <div className="image-side" style={styles.imageSide}>
//           <img
//             src="/images/bg_login.jpg"
//             alt="login background"
//             style={styles.image}
//           />
//         </div>

//         {/* CỘT PHẢI: FORM ĐĂNG NHẬP */}
//         <div className="form-side" style={styles.formSide}>
//           <div style={styles.formContainer}>
//             <h2
//               style={{
//                 marginBottom: "15px",
//                 fontSize: "36px",
//                 color: "#1A1A2E",
//                 textAlign: "center",
//               }}
//             >
//               Đăng nhập
//             </h2>
//             <form onSubmit={handleLogin} style={styles.form}>
//               <div style={styles.inputGroup}>
//                 <label htmlFor="email" style={styles.label}>
//                   Email hoặc số điện thoại
//                 </label>
//                 <input
//                   type="text"
//                   id="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   style={styles.input}
//                   required
//                 />
//               </div>

//               <div style={styles.inputGroup}>
//                 <label htmlFor="password" style={styles.label}>
//                   Mật khẩu
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   style={styles.input}
//                   required
//                 />
//               </div>
//               <Link
//                 to="/forgot-password"
//                 style={{
//                   color: "#1B7A4A",
//                   fontSize: "14px",
//                   alignSelf: "flex-end",
//                   textDecoration: "none",
//                 }}
//               >
//                 Quên mật khẩu?
//               </Link>
//               <button
//                 type="submit"
//                 style={{
//                   ...styles.button,
//                   opacity: password.length < 6 ? 0.5 : 1,
//                   cursor: password.length < 6 ? "not-allowed" : "pointer",
//                 }}
//                 disabled={password.length < 6}
//               >
//                 Đăng nhập
//               </button>
//               <div
//                 style={{
//                   color: "#3D3D5C",
//                   fontSize: "14px",
//                   textAlign: "center",
//                 }}
//               >
//                 Bạn chưa có tài khoản?{" "}
//                 <a
//                   href="/register"
//                   style={{
//                     color: "#1B7A4A",
//                     fontSize: "14px",
//                     textDecoration: "none",
//                   }}
//                 >
//                   Đăng ký
//                 </a>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// // css
// const styles: Record<string, CSSProperties> = {
//   wrapper: {
//     display: "flex",
//     height: "100vh",
//     width: "100%",
//     fontFamily: "sans-serif",
//   },
//   imageSide: {
//     flex: 1,
//     backgroundColor: "#f3f4f6",
//     display: "flex",
//     padding: "40px",
//     boxSizing: "border-box",
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//     borderRadius: "24px",
//   },
//   formSide: {
//     flex: 1,
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#ffffff",
//     padding: "40px",
//     boxSizing: "border-box",
//   },
//   formContainer: { width: "100%", maxWidth: "420px" },
//   form: { display: "flex", flexDirection: "column", gap: "20px" },
//   inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
//   label: { fontWeight: "100", fontSize: "14px", color: "#333" },
//   input: {
//     padding: "12px",
//     borderRadius: "10px",
//     border: "1px solid #BFBFBF",
//     fontSize: "16px",
//   },
//   button: {
//     padding: "14px",
//     backgroundColor: "#1B7A4A",
//     color: "white",
//     border: "none",
//     borderRadius: "10px",
//     fontSize: "16px",
//     fontWeight: "bold",
//     cursor: "pointer",
//   },
// };

import type { CSSProperties } from "react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

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
        // lưu token
        localStorage.setItem("token", res.data.token);

        // lưu user
        localStorage.setItem(
          "user",
          JSON.stringify({
            fullName: res.data.fullName,
            avatar: res.data.avatar,
          })
        );

        // chuyển trang
        navigate("/");
        window.location.reload(); // để Header cập nhật ngay
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
};
