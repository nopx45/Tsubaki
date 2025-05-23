import { useEffect } from "react";
import { CreateUser } from "../../../../services/https";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiKey, FiPlus, FiArrowLeft } from "react-icons/fi";
import { RiAdminFill } from "react-icons/ri";

function CustomerCreate() {
  const navigate = useNavigate();

  const onFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const values = {
      first_name: (form.elements.namedItem("first_name") as HTMLInputElement).value,
      last_name: (form.elements.namedItem("last_name") as HTMLInputElement).value,
      username: (form.elements.namedItem("username") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      role: (form.elements.namedItem("role") as HTMLSelectElement).value,
      force_password_change: true,
    };    

    const res = await CreateUser(values);
    if (res.status == 201) {
      showNotification("success", res.data.message);
      setTimeout(() => navigate("/admin/customer"), 2000);
    } else {
      showNotification("error", res.data.error);
    }
  };

  const showNotification = (type: string, message: string) => {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add("show");
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  useEffect(() => {}, []);

  return (
    <div className="customer-create-container">
      <div className="form-card">
        <div className="form-header">
          <FiUser className="header-icon" />
          <h2>เพิ่มข้อมูลผู้ใช้</h2>
          <p>กรอกข้อมูลผู้ใช้ใหม่ในระบบ</p>
        </div>
        
        <form onSubmit={onFinish} className="user-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="first_name">
                <FiUser className="input-icon" />
                ชื่อจริง
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  placeholder="กรอกชื่อจริง"
                  required
                />
                <span className="input-focus"></span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="last_name">
                <FiUser className="input-icon" />
                นามสกุล
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  placeholder="กรอกนามสกุล"
                  required
                />
                <span className="input-focus"></span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="username">
                <FiUser className="input-icon" />
                ชื่อผู้ใช้
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="กรอกชื่อผู้ใช้"
                  required
                />
                <span className="input-focus"></span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <FiMail className="input-icon" />
                อีเมล
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="กรอกอีเมล"
                  required
                />
                <span className="input-focus"></span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                <FiPhone className="input-icon" />
                เบอร์ที่ทำงาน
              </label>
              <div className="input-wrapper">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="กรอกเบอร์ที่ทำงาน"
                  required
                />
                <span className="input-focus"></span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <FiKey className="input-icon" />
                รหัสผ่าน
              </label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="กรอกรหัสผ่าน"
                  required
                />
                <span className="input-focus"></span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="role">
                <RiAdminFill className="input-icon" />
                สิทธิ์การเข้าถึง
              </label>
              <div className="select-wrapper">
                <select id="role" name="role" required>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="adminit">Admin IT</option>
                  <option value="adminhr">Admin HR</option>
                </select>
                <span className="select-focus"></span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/admin/customer" className="cancel-button">
              <FiArrowLeft className="button-icon" />
              ยกเลิก
            </Link>
            <button type="submit" className="submit-button">
              <FiPlus className="button-icon" />
              ยืนยันการเพิ่ม
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .customer-create-container {
          font-family: 'Mali', Tahoma, Geneva, Verdana, sans-serif;
          min-height: 80vh;
          border-radius: 20px;
          padding: 30px;
          background: linear-gradient(135deg, #f0f4f8 0%, #d9e4f2 100%);
          display: flex;
          justify-content: center;
          align-items: top;
        }
        
        .form-card {
          width: 100%;
          max-width: 800px;
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 15px 35px rgba(106, 17, 203, 0.15);
          transition: transform 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .form-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(106, 17, 203, 0.2);
        }
        
        .form-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
        }
        
        .form-header {
          margin-bottom: 50px;
          text-align: center;
        }
        
        .form-header h2 {
          background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: inherit;
        }
        
        .form-header p {
          margin: 0;
          color: #7b8a8b;
          font-size: 16px;
        }
        
        .header-icon {
          font-size: 40px;
          color: #6a11cb;
          background: rgba(106, 17, 203, 0.1);
          padding: 15px;
          border-radius: 50%;
        }
        
        .user-form {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          color: #2c3e50;
          font-size: 14px;
        }
        
        .input-icon {
          color: #6a11cb;
          font-size: 18px;
        }
        
        .input-wrapper, .select-wrapper {
          position: relative;
        }
        
        input, select {
          width: 100%;
          padding: 12px 15px 12px 40px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
          background-color: #f9f9f9;
        }
        
        select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 10px center;
          background-size: 15px;
        }
        
        input:focus, select:focus {
          outline: none;
          border-color: #6a11cb;
          background-color: white;
          box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.1);
        }
        
        .input-focus, .select-focus {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
          transition: width 0.3s ease;
        }
        
        input:focus ~ .input-focus, 
        select:focus ~ .select-focus {
          width: 100%;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 20px;
        }
        
        .cancel-button, .submit-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .cancel-button {
          background: #f5f5f5;
          color: #666;
        }
        
        .cancel-button:hover {
          background: #e0e0e0;
          transform: translateY(-2px);
        }
        
        .submit-button {
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);
        }
        
        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(106, 17, 203, 0.4);
          background: linear-gradient(135deg, #5a0db5 0%, #1565d8 100%);
        }
        
        .button-icon {
          font-size: 18px;
        }
        
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 25px;
          border-radius: 8px;
          color: white;
          font-weight: 500;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transform: translateX(100%);
          opacity: 0;
          transition: all 0.3s ease;
          z-index: 1000;
        }
        
        .notification.show {
          transform: translateX(0);
          opacity: 1;
        }
        
        .notification.success {
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
        }
        
        .notification.error {
          background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
        }
        
        @media (max-width: 768px) {
          .form-card {
            padding: 25px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .cancel-button, .submit-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

export default CustomerCreate;