import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";
import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Register.css";

export default function RegisterOTP() {
  const [otp, setOtp] = useState(Array<string>(6).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const { fullName, email, password } = location.state || {};

  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 1);
    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
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

    const otpValue = otp.join("");
    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/register/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            email,
            password,
            otp: otpValue,
          }),
        },
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data);
      }

      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (error: any) {
      alert(error.message || "OTP không đúng");
    }
  };

  return (
    <>
      <div className="register-wrapper">
        <div className="image-side">
          <img src="/images/bg_login.jpg" alt="otp background" />
        </div>

        <div className="form-otp">
          <div className="form-container">
            <h3>Xác thực đăng ký</h3>
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

              <button type="submit" className="btn-auth">
                Xác nhận
              </button>
              <div className="text-login">
                Bạn đã có tài khoản?{" "}
                <a href="#" className="link-login">
                  Đăng nhập
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
