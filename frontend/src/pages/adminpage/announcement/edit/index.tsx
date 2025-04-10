import { useEffect, useState } from "react";
import { AnnouncementsInterface } from "../../../../interfaces/IAnnouncement";
import { GetAnnouncementsById, GetFiles, UpdateAnnouncementsById } from "../../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";
import { FilesInterface } from "../../../../interfaces/IFile";
import { FaSave, FaTimes, FaBullhorn, FaAlignLeft, FaFileAlt } from "react-icons/fa";

function AnnouncementEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const [, setAnnounce] = useState<AnnouncementsInterface>();
  const [files, setFiles] = useState<FilesInterface[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showNotification = (type: string, message: string) => {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span class="notification-icon">${type === "success" ? "✓" : "✗"}</span>
      <span>${message}</span>
    `;
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

  const fetchFiles = async () => {
    try {
      const data = await GetFiles();
      setFiles(data);
    } catch (error: any) {
      showNotification("error", error.message);
    }
  };

  const getAnnouncementsById = async (id: string) => {
    try {
      const res = await GetAnnouncementsById(id);
      if (res.status === 200) {
        setAnnounce(res.data);
        setFormValues({
          title: res.data.title,
          content: res.data.content,
          file_id: res.data.file?.ID
        });
      } else {
        showNotification("error", "ไม่พบข้อมูลประกาศ");
        setTimeout(() => navigate("/admin/announcement"), 2000);
      }
    } catch (error: any) {
      showNotification("error", error.message);
    }
  };

  const [formValues, setFormValues] = useState({
    title: "",
    content: "",
    file_id: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const onFinish = async (e: React.FormEvent) => {
    const selectedFile = files.find((file) => file.ID === parseInt(formValues.file_id));
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload: AnnouncementsInterface = {
        title: formValues.title,
        content: formValues.content,
        file_id: parseInt(formValues.file_id),
        file_name: selectedFile?.file_name || "",
      };

      const res = await UpdateAnnouncementsById(id, payload);
      if (res.status === 200) {
        showNotification("success", "อัปเดตประกาศสำเร็จ!");
        setTimeout(() => navigate("/admin/announcement"), 2000);
      } else {
        showNotification("error", res.data.error || "อัปเดตประกาศไม่สำเร็จ");
      }
    } catch (error: any) {
      showNotification("error", error.response?.data?.error || "เกิดข้อผิดพลาด!");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    getAnnouncementsById(id);
    fetchFiles();
  }, [id]);

  return (
    <div className="announcement-edit-container">
      <div className="announcement-edit-card">
        <div className="card-header">
          <div className="header-icon">
            <FaBullhorn />
          </div>
          <h1>แก้ไขข้อมูลประกาศ</h1>
          <div className="header-decoration"></div>
        </div>
        <div className="divider"></div>

        <form onSubmit={onFinish} className="announcement-form">
          <div className="form-group">
            <label htmlFor="title">
              <FaBullhorn className="input-icon" />
              ชื่อประกาศ
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="title"
                name="title"
                value={formValues.title}
                onChange={handleInputChange}
                placeholder="กรอกชื่อประกาศ"
                required
              />
              <span className="input-focus"></span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="content">
              <FaAlignLeft className="input-icon" />
              รายละเอียด
            </label>
            <div className="input-wrapper">
              <textarea
                id="content"
                name="content"
                value={formValues.content}
                onChange={handleInputChange}
                placeholder="กรอกรายละเอียดประกาศ"
                rows={4}
                required
              ></textarea>
              <span className="input-focus"></span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="file_id">
              <FaFileAlt className="input-icon" />
              ไฟล์ประกาศ
            </label>
            <div className="input-wrapper">
              <select
                id="file_id"
                name="file_id"
                value={formValues.file_id}
                onChange={handleInputChange}
                required
                className="select-dropdown"
              >
                <option value="" disabled>เลือกไฟล์ประกาศ</option>
                {files.map((file) => (
                  <option key={file.ID} value={file.ID}>
                    {file.file_name}
                  </option>
                ))}
              </select>
              <div className="select-arrow">▼</div>
              <span className="input-focus"></span>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/admin/announcement" className="cancel-button">
              <FaTimes className="button-icon" />
              ยกเลิก
            </Link>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              <FaSave className="button-icon" />
              {isSubmitting ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
              <div className="button-hover-effect"></div>
            </button>
          </div>
        </form>
      </div>

      <div className="floating-bubbles">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="bubble" style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${10 + Math.random() * 20}s`,
            animationDelay: `${Math.random() * 5}s`,
            width: `${10 + Math.random() * 20}px`,
            height: `${10 + Math.random() * 20}px`,
            opacity: 0.2 + Math.random() * 0.5
          }}></div>
        ))}
      </div>

      <style>{`
        .announcement-edit-container {
          font-family: 'Mali', Tahoma, Geneva, Verdana, sans-serif;
          min-height: 80vh;
          border-radius: 20px;
          padding: 30px;
          background: linear-gradient(135deg, #e3f2fd 0%, #d1e3fa 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        
        .announcement-edit-card {
          width: 100%;
          max-width: 800px;
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 15px 35px rgba(106, 17, 203, 0.15);
          transition: transform 0.3s ease;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }
        
        .announcement-edit-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(106, 17, 203, 0.2);
        }
        
        .announcement-edit-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
        }
        
        .card-header {
          margin-bottom: 25px;
          text-align: center;
          position: relative;
        }
        
        .card-header h1 {
          margin: 15px 0 5px;
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .header-icon {
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          color: white;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 4px 12px rgba(106, 17, 203, 0.3);
        }
        
        .header-decoration {
          position: absolute;
          top: -20px;
          right: -20px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: rgba(126, 87, 194, 0.1);
          z-index: -1;
        }
        
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(106, 17, 203, 0.1), transparent);
          margin: 25px 0;
        }
        
        .announcement-form {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .form-group label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 500;
          color: #2c3e50;
          font-size: 16px;
        }
        
        .input-icon {
          color: #6a11cb;
          font-size: 18px;
        }
        
        .input-wrapper {
          position: relative;
        }
        
        input, textarea, select {
          width: 100%;
          padding: 12px 15px 12px 40px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
          background-color: #f9f9f9;
        }
        
        textarea {
          min-height: 120px;
          resize: vertical;
        }
        
        select {
          appearance: none;
          cursor: pointer;
          padding-right: 40px;
        }
        
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #6a11cb;
          background-color: white;
          box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.1);
        }
        
        .input-focus {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
          transition: width 0.3s ease;
        }
        
        input:focus ~ .input-focus, 
        textarea:focus ~ .input-focus,
        select:focus ~ .input-focus {
          width: 100%;
        }
        
        .select-arrow {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #6a11cb;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 30px;
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
          text-decoration: none;
        }
        
        .cancel-button:hover {
          background: #e0e0e0;
          transform: translateY(-2px);
        }
        
        .submit-button {
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(106, 17, 203, 0.4);
        }
        
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .button-icon {
          font-size: 16px;
        }
        
        .button-hover-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: all 0.6s ease;
        }
        
        .submit-button:hover .button-hover-effect {
          left: 100%;
        }
        
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 25px;
          border-radius: 8px;
          color: white;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 1000;
          transform: translateX(120%);
          transition: transform 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .notification.show {
          transform: translateX(0);
        }
        
        .notification.success {
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
        }
        
        .notification.error {
          background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
        }
        
        .notification-icon {
          font-weight: bold;
        }
        
        .floating-bubbles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }
        
        .bubble {
          position: absolute;
          bottom: -100px;
          background: linear-gradient(135deg, rgba(106, 17, 203, 0.2), rgba(37, 117, 252, 0.2));
          border-radius: 50%;
          animation: float-up linear infinite;
        }
        
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @media (max-width: 768px) {
          .announcement-edit-container {
            padding: 15px;
          }
          
          .announcement-edit-card {
            padding: 25px;
          }
          
          .card-header h1 {
            font-size: 24px;
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

export default AnnouncementEdit;