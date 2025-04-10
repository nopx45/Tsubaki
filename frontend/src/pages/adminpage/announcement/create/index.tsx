import { useState, useEffect } from "react";
import { CreateAnnouncement, GetFiles } from "../../../../services/https";
import { useNavigate, Link } from "react-router-dom";
import { FaPlus, FaTimes, FaFileAlt, FaBullhorn, FaAlignLeft } from "react-icons/fa";
import { FilesInterface } from "../../../../interfaces/IFile";

function AnnouncementCreate() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<FilesInterface[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const fetchFiles = async () => {
    try {
      const data = await GetFiles();
      setFiles(data);
    } catch (error: any) {
      showNotification("error", error.message);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const onFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    
    const form = e.currentTarget as HTMLFormElement;
    const file_id = parseInt((form.elements.namedItem("file_id") as HTMLSelectElement).value);
    const file = files.find(f => f.ID === file_id);

    const formData = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      content: (form.elements.namedItem("content") as HTMLInputElement).value,
      file_id: parseInt((form.elements.namedItem("file_id") as HTMLSelectElement).value),
      file_name: file?.file_name || "",
    };

    try {
      const res = await CreateAnnouncement(formData);
      if (res.status === 201) {
        showNotification("success", "สร้างประกาศสำเร็จ!");
        setTimeout(() => {
          navigate("/admin/announcement");
        }, 2000);
      } else {
        showNotification("error", res.data.error || "สร้างประกาศไม่สำเร็จ");
      }
    } catch (error: any) {
      showNotification("error", error.response?.data?.error || "เกิดข้อผิดพลาด!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="announcement-create-container">
      <div className="announcement-create-card">
        <div className="header-section">
          <div className="title-wrapper">
            <FaBullhorn className="title-icon" />
            <h1>เพิ่มข้อมูลประกาศของบริษัท</h1>
          </div>
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
              <span className="file-hint"> (หากไม่พบไฟล์ที่ต้องการ ให้ไปอัพโหลดไฟล์ประกาศก่อน)</span>
            </label>
            <div className="input-wrapper">
              <select
                id="file_id"
                name="file_id"
                required
                className="select-dropdown"
                defaultValue=""
              >
                <option value="" disabled>เลือกไฟล์ประกาศ</option>
                {files.map((file) => (
                  <option key={file.ID} value={file.ID}>
                    {file.file_name}
                  </option>
                ))}
              </select>
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
              <FaPlus className="button-icon" />
              {isSubmitting ? "กำลังดำเนินการ..." : "สร้างประกาศ"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .announcement-create-container {
          font-family: 'Mali', Tahoma, Geneva, Verdana, sans-serif;
          min-height: 80vh;
          border-radius: 20px;
          padding: 30px;
          background: linear-gradient(135deg, #f0f4f8 0%, #e0e8f5 100%);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .announcement-create-card {
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
        
        .announcement-create-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(106, 17, 203, 0.2);
        }
        
        .announcement-create-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
        }
        
        .header-section {
          margin-bottom: 25px;
          text-align: center;
        }
        
        .title-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }
        
        .title-wrapper h1 {
          margin: 10px 0 5px;
          font-size: 28px;
          font-weight: 700;
        }
        
        .title-icon {
          font-size: 32px;
          color: #6a11cb;
          background: rgba(106, 17, 203, 0.1);
          padding: 15px;
          border-radius: 50%;
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
        
        .file-hint {
          font-size: 14px;
          color: #666;
          font-weight: normal;
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
        }
        
        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(106, 17, 203, 0.4);
          background: linear-gradient(135deg, #5a0db5 0%, #1565d8 100%);
        }
        
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .button-icon {
          font-size: 16px;
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
          .announcement-create-card {
            padding: 25px;
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

export default AnnouncementCreate;