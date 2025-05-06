import { useState } from "react";
import { CreateActivity } from "../../../../services/https";
import { useNavigate, Link } from "react-router-dom";
import { FaPlus, FaTimes, FaImage, FaBullhorn, FaAlignLeft } from "react-icons/fa";
import { FiTrash, FiUpload,  } from "react-icons/fi";

function ActivityCreate() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string[]>([]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      // รวมไฟล์ใหม่กับไฟล์เก่า
      const updatedFiles = [...file, ...selectedFiles];
      setFile(updatedFiles);

      // สร้างพรีวิวสำหรับไฟล์ที่เลือกใหม่ทั้งหมด
      const previews = updatedFiles.map(file => URL.createObjectURL(file));
      setPreviewImage(previews);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = [...file];
    updatedFiles.splice(index, 1); // ลบไฟล์ตาม index
    setFile(updatedFiles);

    const updatedPreviews = [...previewImage];
    updatedPreviews.splice(index, 1); // ลบพรีวิวภาพตาม index
    setPreviewImage(updatedPreviews);
  };  

  const onFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData();
  
    formData.append("title", (form.elements.namedItem("title") as HTMLInputElement).value);
    formData.append("content", (form.elements.namedItem("content") as HTMLInputElement).value);
  
    // เพิ่มไฟล์ภาพทั้งหมด
    file.forEach(file => {
      formData.append("image", file); // ส่งเป็นอาร์เรย์
    });
  
    try {
      let res = await CreateActivity(formData);
      if (res?.message === "Upload successful") {
        showNotification("success", "สร้างกิจกรรมสำเร็จ!");
        setTimeout(() => {
          navigate("/admin/activity");
        }, 2000);
      } else {
        console.error("Upload failed:", res);
        showNotification("error", res?.error || "สร้างกิจกรรมไม่สำเร็จ");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      showNotification("error", err?.response?.data?.error || "เกิดข้อผิดพลาด!");
    }
  };

  return (
    <div className="activity-create-container">
      <div className="activity-create-card">
        <div className="header-section">
          <div className="title-wrapper">
            <FaBullhorn className="title-icon" />
            <h1>เพิ่มข้อมูลกิจกรรม</h1>
          </div>
        </div>

        <div className="divider"></div>

        <form onSubmit={onFinish} className="activity-form">
          <div className="form-group">
            <label htmlFor="title">
              <FaBullhorn className="input-icon" />
              ชื่อกิจกรรม
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="title"
                name="title"
                placeholder="กรอกชื่อกิจกรรม"
                required
              />
              <span className="input-focus"></span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="content">
              <FaAlignLeft className="input-icon" />
              รายละเอียดกิจกรรม
            </label>
            <div className="input-wrapper">
              <textarea
                id="content"
                name="content"
                placeholder="กรอกรายละเอียดกิจกรรม"
                rows={4}
                required
              ></textarea>
              <span className="input-focus"></span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">
              <FaImage className="input-icon" />
              รูปภาพกิจกรรม
            </label>
            <div className="image-upload-container">
              <label htmlFor="image-upload" className="upload-button">
                <FiUpload className="upload-icon" />
                <span>เลือกไฟล์ภาพ</span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  multiple
                  required
                  style={{ display: 'none' }}
                />
              </label>
              {previewImage.length > 0 && (
                <div className="image-preview-container">
                  {previewImage.map((src, index) => (
                    <div key={index} className="image-preview-item">
                      <img 
                        src={src} 
                        alt={`Preview ${index}`} 
                        className="image-preview" 
                      />
                      
                      <div className="image-overlay">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="delete-button"
                          aria-label="Remove image"
                        >
                          <FiTrash />
                        </button>
                        
                        <span className="image-number">Image {index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <Link to="/admin/activity" className="cancel-button">
              <FaTimes className="button-icon" />
              ยกเลิก
            </Link>
            <button type="submit" className="submit-button">
              <FaPlus className="button-icon" />
              สร้างกิจกรรม
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .activity-create-container {
          font-family: 'Mali', Tahoma, Geneva, Verdana, sans-serif;
          min-height: 80vh;
          border-radius: 20px;
          padding: 30px;
          background: linear-gradient(135deg, #f0f4f8 0%, #e0e8f5 100%);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .activity-create-card {
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
        
        .activity-create-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(106, 17, 203, 0.2);
        }
        
        .activity-create-card::before {
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
        
        .activity-form {
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
        
        input, textarea {
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
        
        input:focus, textarea:focus {
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
        textarea:focus ~ .input-focus {
          width: 100%;
        }
        
        .image-upload-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .upload-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          color: #6a11cb;
          border: 1px dashed #6a11cb;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: fit-content;
        }
        
        .upload-button:hover {
          background: linear-gradient(135deg, #e4e8f0 0%, #d5dde8 100%);
        }
        
        .upload-icon {
          font-size: 18px;
        }

        /* Container for all preview images */
        .image-preview-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin: 16px 0;
        }

        /* Each individual image item */
        .image-preview-item {
          position: relative;
          width: 100%;
          aspect-ratio: 1/1; /* Square aspect ratio */
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* The actual preview image */
        .image-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Overlay that appears on hover */
        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 8px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .image-preview-item:hover .image-overlay {
          opacity: 1;
        }

        /* Delete button styles */
        .delete-button {
          align-self: flex-end;
          background: #ff4444;
          border: none;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }

        .delete-button:hover {
          background: #cc0000;
        }

        .delete-button svg {
          width: 16px;
          height: 16px;
        }

        /* Image number text */
        .image-number {
          color: white;
          font-size: 14px;
          font-weight: 500;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
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
        
        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(106, 17, 203, 0.4);
          background: linear-gradient(135deg, #5a0db5 0%, #1565d8 100%);
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
          .activity-create-card {
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

export default ActivityCreate;