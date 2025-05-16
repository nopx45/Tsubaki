import { useState } from "react";
import { CreateArticle } from "../../../../services/https";
import { useNavigate, Link } from "react-router-dom";
import { FaPlus, FaTimes, FaNewspaper, FaAlignLeft, FaImage, FaUpload } from "react-icons/fa";
import Swal from "sweetalert2";

function ArticleCreate() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

    // state ของไฟล์แต่ละประเภท
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [gifFile, setGifFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

    // state ของ preview
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [previewGif, setPreviewGif] = useState<string | null>(null);

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

  // handleChange ของแต่ละไฟล์
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewThumbnail(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
     // เช็คขนาดไม่เกิน 500MB
      if (file.size > 524288000) {
        showNotification("error", "ขนาดไฟล์วิดีโอต้องไม่เกิน 500MB");
        return;
      }

      setVideoFile(file);
      setPreviewVideo(URL.createObjectURL(file));
    }
  };

  const handleGifChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setGifFile(file);
      setPreviewGif(URL.createObjectURL(file));
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // เช็คขนาดไม่เกิน 500MB
      if (file.size > 52428800) {
        showNotification("error", "ขนาดไฟล์ต้องไม่เกิน 50MB");
        return;
      }

      setPdfFile(file);
    }
  };

  const onFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData();

    formData.append("title", (form.elements.namedItem("title") as HTMLInputElement).value);
    formData.append("content", (form.elements.namedItem("content") as HTMLInputElement).value);

    if (!thumbnailFile) {
          await Swal.fire({
            icon: 'warning',
            title: 'กรุณาเลือกรูปหน้าปก!!',
            text: 'คุณต้องเลือกภาพหน้าปก ก่อนทำการอัปโหลด',
          });
          setIsSubmitting(false);
          return;
        } else {
          formData.append("thumbnail", thumbnailFile);
        }
      
        if (imageFile) {
          formData.append("image", imageFile);
        }
        if (videoFile) {
          formData.append("video", videoFile);
        }
        if (gifFile) {
          formData.append("gif", gifFile);
        }
        if (pdfFile) {
          formData.append("pdf", pdfFile);
        }

    try {
      let res = await CreateArticle(formData);
      if (res?.message === "Upload successful") {
        showNotification("success", "สร้างบทความสำเร็จ!");
        setTimeout(() => {
          navigate("/admin/article");
        }, 2000);
      } else {
        console.error("Upload failed:", res);
        showNotification("error", res?.error || "สร้างบทความไม่สำเร็จ");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      showNotification("error", err?.response?.data?.error || "เกิดข้อผิดพลาด!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="it-knowledge-create-container">
      <div className="it-knowledge-create-card">
        <div className="card-header">
          <div className="header-icon">
            <FaNewspaper />
          </div>
          <h1>เพิ่มข้อมูลบทความ</h1>
          <div className="header-decoration"></div>
        </div>
        <div className="divider"></div>

        <form onSubmit={onFinish} className="it-knowledge-form">
          <div className="form-group">
            <label htmlFor="title">
              <FaNewspaper className="input-icon" />
              ชื่อบทความ
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="title"
                name="title"
                placeholder="กรอกชื่อบทความ"
                required
              />
              <span className="input-focus"></span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="content">
              <FaAlignLeft className="input-icon" />
              รายละเอียดบทความ
            </label>
            <div className="input-wrapper">
              <textarea
                id="content"
                name="content"
                placeholder="กรอกรายละเอียดบทความ"
                rows={4}
                required
              ></textarea>
              <span className="input-focus"></span>
            </div>
          </div>

          {/* thumbnail */}
          <div className="form-group">
            <label htmlFor="thumbnail">
              <FaImage className="input-icon" />
              รูปหน้าปก
            </label>
            <div className="image-upload-container">
              <label htmlFor="thumbnail-upload" className="upload-button">
                <FaUpload className="upload-icon" />
                <span>เลือกรูปหน้าปก</span>
                <input
                  id="thumbnail-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  style={{ display: 'none' }}
                />
              </label>
              
              {previewThumbnail && (
                <div className="image-preview-container">
                  <img
                    src={previewThumbnail ? previewThumbnail : undefined}
                    alt="Preview"
                    className="image-preview"
                  />
                  <div className="image-overlay">
                    <span>ภาพข่าวสาร</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">
              <FaImage className="input-icon" />
              รูปบทความ
            </label>
            <div className="image-upload-container">
              <label htmlFor="image-upload" className="upload-button">
                <FaUpload className="upload-icon" />
                <span>เลือกไฟล์ภาพ</span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
              
              {previewImage && (
                <div className="image-preview-container">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="image-preview"
                  />
                  <div className="image-overlay">
                    <span>ภาพข่าวสาร</span>
                  </div>
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="video">
                <FaUpload className="input-icon" />
                วิดีโอ (.mp4 ไม่เกิน 500 MB)
              </label>
              <div className="image-upload-container">
                <label htmlFor="video-upload" className="upload-button">
                  <FaUpload className="upload-icon" />
                  <span>เลือกไฟล์วิดีโอ</span>
                  <input
                    id="video-upload"
                    type="file"
                    accept="video/mp4"
                    onChange={handleVideoChange}
                    style={{ display: 'none' }}
                  />
                </label>

                {previewVideo && (
                  <div className="video-preview-container">
                    <video src={previewVideo} controls className="video-preview" />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="gif">
              <FaUpload className="input-icon" />
              ไฟล์ GIF (.gif)
            </label>
            <div className="image-upload-container">
              <label htmlFor="gif-upload" className="upload-button">
                <FaUpload className="upload-icon" />
                <span>เลือกไฟล์ GIF</span>
                <input
                  id="gif-upload"
                  type="file"
                  accept="image/gif"
                  onChange={handleGifChange}
                  style={{ display: 'none' }}
                />
              </label>

              {previewGif && (
                <div className="image-preview-container">
                  <img src={previewGif} alt="GIF Preview" className="image-preview" />
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pdf">
              <FaUpload className="input-icon" />
              ไฟล์ PDF (.pdf ไม่เกิน 50 MB)
            </label>
            <div className="image-upload-container">
              <label htmlFor="pdf-upload" className="upload-button">
                <FaUpload className="upload-icon" />
                <span>เลือกไฟล์ PDF</span>
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                  style={{ display: 'none' }}
                />
              </label>

              {pdfFile && (
                <div className="pdf-file-name">
                  <span>{pdfFile.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <Link to="/admin/article" className="cancel-button">
              <FaTimes className="button-icon" />
              ยกเลิก
            </Link>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              <FaPlus className="button-icon" />
              {isSubmitting ? "กำลังดำเนินการ..." : "ยืนยัน"}
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
      .it-knowledge-create-container {
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
        
        .it-knowledge-create-card {
          width: 100%;
          max-width: 800px;
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 15px 35px rgba(106, 17, 203, 0.15);
          transition: transform 0.3s ease;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }
        
        .it-knowledge-create-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(106, 17, 203, 0.2);
        }
        
        .it-knowledge-create-card::before {
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
          color: #6a11cb;
        }
        
        .header-icon {
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          color: white;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
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
        
        .it-knowledge-form {
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
        
        .image-preview-container {
          position: relative;
          width: 100%;
          max-width: 400px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .image-preview {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.3s ease;
        }
        
        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 10px;
          background: linear-gradient(transparent, rgba(106, 17, 203, 0.7));
          color: white;
          text-align: center;
          font-weight: 500;
        }
        
        .image-preview-container:hover .image-preview {
          transform: scale(1.05);
        }
        
        .video-preview-container {
          position: relative;
          display: inline-block;
          width: 300px;
        }

        .video-preview { width: 300px; height: 225px; }
        
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
          .it-knowledge-create-container {
            padding: 15px;
          }
          
          .it-knowledge-create-card {
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

export default ArticleCreate;