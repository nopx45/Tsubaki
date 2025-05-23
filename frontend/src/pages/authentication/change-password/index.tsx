import React, { useState } from 'react';
import { Eye, EyeOff, KeyRound, Lock, ShieldCheck } from 'lucide-react';
import { ChangesPassword, startvisit } from '../../../services/https';
import Swal from 'sweetalert2';

export interface ChangePasswordInterface {
  current_password?: string;
  new_password: string;
}

const ChangePassword: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (!password || !confirmPassword) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    if (password !== confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      // เตรียม payload สำหรับ backend
        const payload: ChangePasswordInterface = {
            current_password: "", // หรือให้ user กรอกถ้าไม่ใช่กรณี force change
            new_password: password,
        };
        
    const res = await ChangesPassword(payload);
      if (res.status === 200) {
        await startvisit();

        await Swal.fire({
          icon: "success",
          title: "เปลี่ยนรหัสผ่านสำเร็จ",
          text: "กำลังเปลี่ยนเส้นทาง...",
          timer: 1800,
          showConfirmButton: false,
          timerProgressBar: true,
          willClose: () => {
            localStorage.setItem("isLoggedIn", "true");
            window.location.href = res.data.redirect_url;
          },
        });
      } else {
        throw new Error("Password change failed");
      }
    } catch (error) {
      alert("Error changing password. Please try again.");
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <div className="card-header">
          <ShieldCheck className="shield-icon" />
          <h2>เปลี่ยนรหัสผ่าน</h2>
          <p>กรุณากรอกรหัสผ่านใหม่เพื่อดำเนินการต่อ</p>
        </div>

        <form onSubmit={handleSubmit} className="change-password-form">
          <div className="form-group">
            <label htmlFor="password">รหัสผ่านใหม่</label>
            <div className="input-wrapper">
              <KeyRound className="input-icon left-icon" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="กรอกรหัสผ่านใหม่"
                className="password-input"
              />
              <div
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password">ยืนยันรหัสผ่าน</label>
            <div className="input-wrapper">
              <Lock className="input-icon left-icon" />
              <input
                id="confirm_password"
                name="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                className="password-input"
              />
              <div
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </div>
            </div>
          </div>

          <button type="submit" className="submit-button">
            <ShieldCheck />
            <span>เปลี่ยนรหัสผ่าน</span>
          </button>
        </form>
      </div>
      <style>{`
        :root {
        --primary-color: #2563eb;
        --background-color: #f0f4f8;
        --text-color: #1f2937;
        --input-border-color: #d1d5db;
        --input-focus-color: #3b82f6;
        }

        .change-password-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, var(--background-color) 0%, #e1e9f0 100%);
        font-family: 'Arial', sans-serif;
        padding: 1rem;
        }

        .change-password-card {
        width: 100%;
        max-width: 28rem;
        background-color: white;
        border-radius: 1rem;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: all 0.6s ease;
        }

        .change-password-card:hover {
        transform: perspective(1000px) rotateY(10deg);
        box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }

        .card-header {
        text-align: center;
        padding: 2rem;
        background-color: #f9fafb;
        }

        .shield-icon {
        color: var(--primary-color);
        width: 4rem;
        height: 4rem;
        margin: 0 auto 1rem;
        animation: bounce 1s infinite;
        }

        .card-header h2 {
        font-size: 1.875rem;
        font-weight: 800;
        color: var(--text-color);
        margin-bottom: 0.5rem;
        }

        .card-header p {
        color: #6b7280;
        font-size: 0.875rem;
        }

        .change-password-form {
        padding: 1rem 2rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        }

        .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        }

        .form-group label {
        font-size: 0.875rem;
        font-weight: 500;
        color: #374151;
        }

        .input-wrapper {
        position: relative;
        }

        .input-icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        color: #9ca3af;
        }

        .left-icon {
        left: 0.75rem;
        }

        .password-input {
        width: 90%;
        padding: 0.75rem 0.75rem 0.75rem 2.5rem;
        border: 1px solid var(--input-border-color);
        border-radius: 0.5rem;
        outline: none;
        transition: border-color 0.3s ease;
        }

        .password-input:focus {
        border-color: var(--input-focus-color);
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        .toggle-password {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        color: #9ca3af;
        transition: color 0.3s ease;
        }

        .toggle-password:hover {
        color: var(--primary-color);
        }

        .submit-button {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.75rem;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
        animation: pulse 2s infinite;
        }

        .submit-button:hover {
        background-color: #1d4ed8;
        }

        @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
        }

        @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
        }
        
        `}</style>
    </div>

  );
};

export default ChangePassword;
