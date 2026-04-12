import { useEffect, useRef, useState } from "react";
import type {
  ChangeEvent,
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/Register.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

const readResponseMessage = async (response: Response): Promise<string> => {
  const raw = (await response.text()).trim();
  if (!raw) return "";

  // Nếu backend trả JSON lỗi mặc định, ưu tiên bóc trường message/error.
  try {
    const parsed = JSON.parse(raw) as { message?: string; error?: string };
    return parsed.message || parsed.error || raw;
  } catch {
    return raw;
  }
};

export default function ForgotPassword() {
  const navigate = useNavigate();

  // Bước 1: nhập email, bước 2: nhập OTP, bước 3: nhập mật khẩu mới.
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array<string>(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    // Khi sang bước OTP thì focus ngay ô đầu tiên để thao tác nhanh hơn.
    if (step === 2) {
      inputRefs.current[0]?.focus();
    }
  }, [step]);

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailError("");

    if (!EMAIL_REGEX.test(email.trim())) {
      // Hiển thị lỗi đỏ dưới input email thay vì alert.
      setEmailError("Email không đúng định dạng");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/password/otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        },
      );

      const message = await readResponseMessage(response);

      if (!response.ok) {
        throw new Error(message || "Không thể gửi OTP");
      }

      window.alert(message);
      setStep(2);
    } catch (error: any) {
      const message = error.message || "Không thể gửi OTP";
      setEmailError(message);
    }
  };

  const handleOtpChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 1);
    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);
    if (otpError) {
      setOtpError("");
    }

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (event: ClipboardEvent<HTMLDivElement>) => {
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
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleOtpSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOtpError("");

    const otpValue = otp.join("");

    if (!otpValue || otpValue.length !== 6) {
      setOtpError("Vui lòng nhập đủ mã OTP");
      return;
    }

    // Chuyển đến step 3 để nhập mật khẩu mới
    setStep(3);
  };

  const handleResetSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError("");

    const otpValue = otp.join("");

    if (!otpValue || otpValue.length !== 6) {
      setPasswordError("Vui lòng xác nhận mã OTP");
      return;
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      setPasswordError(
        "Mật khẩu phải có ít nhất 6 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&)",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Mật khẩu nhập lại không khớp");
      return;
    }

    try {
      // Xác thực OTP trước
      const verifyResponse = await fetch(
        "http://localhost:8080/api/auth/password/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            otp: otpValue,
          }),
        },
      );

      if (!verifyResponse.ok) {
        const verifyMessage = await readResponseMessage(verifyResponse);
        throw new Error(verifyMessage || "OTP không hợp lệ");
      }

      // Sau khi xác thực OTP thành công, tiến hành đổi mật khẩu
      const resetResponse = await fetch(
        "http://localhost:8080/api/auth/password/reset",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            otp: otpValue,
            newPassword,
            confirmPassword,
          }),
        },
      );

      const message = await readResponseMessage(resetResponse);

      if (!resetResponse.ok) {
        throw new Error(message || "Không thể đổi mật khẩu");
      }

      window.alert(message);
      navigate("/login");
    } catch (error: any) {
      setPasswordError(error.message || "Không thể đổi mật khẩu");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="image-side">
        <img src="/images/bg_login.jpg" alt="forgot password background" />
      </div>

      <div className="form-side">
        <div className="form-container">
          <h3>Quên mật khẩu</h3>

          {step === 1 ? (
            <form onSubmit={handleEmailSubmit} className="form" noValidate>
              <div className="input-group">
                <label htmlFor="forgot-email" className="label">
                  Nhập email đã đăng ký
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  className={`input ${emailError ? "input-error" : ""}`}
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (emailError) {
                      setEmailError("");
                    }
                  }}
                />
                {emailError && <span className="error-msg">{emailError}</span>}
              </div>

              <button type="submit" className="btn-auth">
                Xác nhận
              </button>

              <div className="text-login">
                Bạn đã nhớ mật khẩu?{" "}
                <Link to="/login" className="link-login">
                  Tiếp tục đăng nhập
                </Link>
              </div>
            </form>
          ) : step === 2 ? (
            <form onSubmit={handleOtpSubmit} className="form" noValidate>
              <div className="input-group">
                <label className="label">
                  Nhập mã OTP đã được gửi đến email của bạn
                </label>
                <div className="otp-inputs" onPaste={handleOtpPaste}>
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="otp-input"
                      value={value}
                      onChange={(event) => handleOtpChange(index, event)}
                      onKeyDown={(event) => handleOtpKeyDown(index, event)}
                      ref={(element) => (inputRefs.current[index] = element)}
                      required={index === 0}
                    />
                  ))}
                </div>
                {otpError && <span className="error-msg">{otpError}</span>}
              </div>

              <button type="submit" className="btn-auth">
                Xác nhận OTP
              </button>

              <div className="text-login">
                Chưa nhận được mã?{" "}
                <button
                  type="button"
                  className="link-login"
                  onClick={() => setStep(1)}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                  }}
                >
                  Nhập lại email
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetSubmit} className="form" noValidate>
              <div className="input-group">
                <div className="label-row">
                  <label htmlFor="new-password" className="label">
                    Mật khẩu mới
                  </label>
                </div>
                <div className="input-password">
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                  />
                  <i
                    className={`fa-solid ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="confirm-password" className="label">
                  Nhập lại mật khẩu mới
                </label>
                <div className="input-password">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                  <i
                    className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </div>
              </div>

              {passwordError && (
                <span className="error-msg">{passwordError}</span>
              )}

              <button type="submit" className="btn-auth">
                Xác nhận
              </button>

              <div className="text-login">
                Bạn đã nhớ mật khẩu?{" "}
                <Link to="/login" className="link-login">
                  Tiếp tục đăng nhập
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
