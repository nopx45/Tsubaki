import { useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { GetLinksById, UpdateLinksById } from "../../../../services/https";
import { LinksInterface } from "../../../../interfaces/ILink";
import { FiGlobe, FiLink, FiPlus, FiArrowLeft } from "react-icons/fi";

function CentralEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();

  const showNotification = (type: string, message: string) => {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add("show"), 10);
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  };

  const getLink = async (id: string) => {
    const res = await GetLinksById(id);
    if (res.status === 200) {
      const form = document.getElementById("centralForm") as HTMLFormElement;
      if (form) {
        (form.elements.namedItem("name") as HTMLInputElement).value = res.data.name;
        (form.elements.namedItem("link_url") as HTMLInputElement).value = res.data.link_url;
      }
    } else {
      showNotification("error", "ไม่พบข้อมูลเว็บไซต์");
      setTimeout(() => navigate("/admin/central-web"), 2000);
    }
  };

  const onFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const values: LinksInterface = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      link_url: (form.elements.namedItem("link_url") as HTMLInputElement).value,
    };

    const res = await UpdateLinksById(id, values);
    if (res.status === 200) {
      showNotification("success", res.data.message);
      setTimeout(() => navigate("/admin/central-web"), 2000);
    } else {
      showNotification("error", res.data.error);
    }
  };

  useEffect(() => {
    getLink(id);
  }, [id]);

  return (
    <div className="section-create-container">
      <div className="form-card">
        <div className="form-header">
          <FiGlobe className="header-icon" />
          <h2>แก้ไขเว็บไซต์ศูนย์กลาง</h2>
          <p>แก้ไขข้อมูลเว็บไซต์ศูนย์กลางในระบบ</p>
        </div>

        <form id="centralForm" onSubmit={onFinish} className="user-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">
                <FiGlobe className="input-icon" /> ชื่อเว็บไซต์
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="กรอกชื่อเว็บไซต์"
                  required
                />
                <span className="input-focus"></span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="link_url">
                <FiLink className="input-icon" /> URL เว็บไซต์
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="link_url"
                  name="link_url"
                  placeholder="กรอก URL เว็บไซต์"
                  required
                />
                <span className="input-focus"></span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/admin/central-web" className="cancel-button">
              <FiArrowLeft className="button-icon" /> ยกเลิก
            </Link>
            <button type="submit" className="submit-button">
              <FiPlus className="button-icon" /> บันทึกการเปลี่ยนแปลง
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .section-create-container {
          font-family: 'Mali', Tahoma, sans-serif;
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
          position: relative;
          overflow: hidden;
        }
        .form-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .form-header h2 {
          background: linear-gradient(to right, #6a11cb, #2575fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
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
        }
        .input-icon {
          color: #6a11cb;
        }
        .input-wrapper, .select-wrapper {
          position: relative;
        }
        input, select {
          width: 100%;
          padding: 12px 15px 12px 40px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          background-color: #f9f9f9;
        }
        select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
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
          height: 2px;
          background: linear-gradient(to right, #6a11cb, #2575fc);
          width: 0;
          transition: width 0.3s ease;
        }
        input:focus ~ .input-focus, select:focus ~ .select-focus {
          width: 100%;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
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
          background: linear-gradient(to right, #6a11cb, #2575fc);
          color: white;
          box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);
        }
        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(106, 17, 203, 0.4);
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
          background: linear-gradient(to right, #6a11cb, #2575fc);
        }
        .notification.error {
          background: linear-gradient(to right, #ff416c, #ff4b2b);
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

export default CentralEdit;
