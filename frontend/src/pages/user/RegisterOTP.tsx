import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";
import type { CSSProperties } from "react";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../styles/user/Register.css";

export default function RegisterOTP() {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(Array<string>(6).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const { fullName, email, password, studentCard } = location.state || {};

  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 1);
    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (event.key === "Enter") {
      event.preventDefault();
      handleVerify(event as any);
    }
  };
  const handlePaste = (event: ClipboardEvent) => {
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    event.preventDefault();

    const nextOtp = Array<string>(6).fill("");
    pasted.split("").forEach((digit, idx) => {
      if (idx < 6) nextOtp[idx] = digit;
    });
    setOtp(nextOtp);
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (e: any) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    const otpValue = otp.join("");

    try {
      const formData = new FormData();
      formData.append(
        "data",
        new Blob(
          [JSON.stringify({ fullName, email, password, otp: otpValue })],
          { type: "application/json" },
        ),
      );
      formData.append("studentCard", studentCard);

      const response = await fetch(
        "http://localhost:8080/api/auth/register/verify",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.text();
      if (!response.ok) throw new Error(data);

      toast.success("Đăng ký thành công!");
      navigate("/login");
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message || "OTP không đúng");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.formContainer}>
        <h3 style={styles.title}>Xác thực đăng ký</h3>
        <form onSubmit={handleVerify} className="form">
          <div className="input-group">
            <label className="label">
              Nhập mã OTP đã được gửi đến email của bạn
            </label>
            <div className="otp-inputs" onPaste={handlePaste}>
              {otp.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="otp-input"
                  value={value}
                  onChange={(event) => handleChange(index, event)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  ref={(element) => (inputRefs.current[index] = element)}
                  required={index === 0}
                />
              ))}
            </div>
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
              "Xác nhận"
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
