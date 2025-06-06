import { useEffect, useState } from "react";
import { GetSecurityById, UpdateSecurityById } from "../../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";
import { FaSave, FaTimes, FaAlignLeft, FaImage, FaUpload, FaNewspaper } from "react-icons/fa";

function SecurityEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();

  const [prevThumbnail, setPrevThumbnail] = useState<string | undefined>();
  const [prevImage, setPrevImage] = useState<string | undefined>();
  const [prevVideo, setPrevVideo] = useState<string | undefined>();
  const [prevGif, setPrevGif] = useState<string | undefined>();
  const [prevPdf, setPrevPdf] = useState<string | undefined>();

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [gifFile, setGifFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [previewGif, setPreviewGif] = useState<string | null>(null);

  const [formValues, setFormValues] = useState({ title: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showNotification = (type: string, message: string) => {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `<span class="notification-icon">${type === "success" ? "✓" : "✗"}</span><span>${message}</span>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add("show"), 10);
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  };

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
      // เช็คขนาดไม่เกิน 50MB
      if (file.size > 52428800) {
        showNotification("error", "ขนาดไฟล์ต้องไม่เกิน 50MB");
        return;
      }

      setPdfFile(file);
    }
  };

  const removeThumbnail = () => { setThumbnailFile(null); setPreviewThumbnail(null); setPrevThumbnail(undefined); };
  const removeImage = () => { setImageFile(null); setPreviewImage(null); setPrevImage(undefined); };
  const removeVideo = () => { setVideoFile(null); setPreviewVideo(null); setPrevVideo(undefined); };
  const removeGif = () => { setGifFile(null); setPreviewGif(null); setPrevGif(undefined); };
  const removePdf = () => { setPdfFile(null); setPrevPdf(undefined); };

  const getSecurityById = async (id: string) => {
    try {
      let res = await GetSecurityById(id);
      if (res.status === 200) {
        setPrevThumbnail(res.data.thumbnail);
        setPrevImage(res.data.Image);
        setPrevVideo(res.data.video);
        setPrevGif(res.data.gif);
        setPrevPdf(res.data.pdf);
        setFormValues({ title: res.data.title, content: res.data.content });
      } else {
        showNotification("error", "ไม่พบข้อมูล");
        setTimeout(() => navigate("/admin/security"), 2000);
      }
    } catch (error) {
      console.error("Error fetching security:", error);
      showNotification("error", "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const onFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", formValues.title);
    formData.append("content", formValues.content);

    if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
    else if (!prevThumbnail) formData.append("removeThumbnail", "true");

    if (imageFile) formData.append("image", imageFile);
    else if (!prevImage) formData.append("removeImage", "true");

    if (videoFile) formData.append("video", videoFile);
    else if (!prevVideo) formData.append("removeVideo", "true");

    if (gifFile) formData.append("gif", gifFile);
    else if (!prevGif) formData.append("removeGif", "true");

    if (pdfFile) formData.append("pdf", pdfFile);
    else if (!prevPdf) formData.append("removePdf", "true");

    try {
      let res = await UpdateSecurityById(id, formData);
      if (res?.data?.message === "Updated successfully" || res?.data?.message === "Upload successful") {
        showNotification("success", "อัปเดตข้อมูลสำเร็จ!");
        setTimeout(() => navigate("/admin/security"), 2000);
      } else {
        showNotification("error", res?.error || "อัปเดตข้อมูลไม่สำเร็จ");
      }
    } catch (err: any) {
      showNotification("error", err?.response?.data?.error || "เกิดข้อผิดพลาด!");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => { getSecurityById(id); }, [id]);

  return (
    <div className="security-edit-container">
      <div className="security-edit-card">
        <div className="card-header">
          <div className="header-icon">
            <FaNewspaper />
          </div>
          <h1>แก้ไขข้อมูลข่าวสารด้าน Security</h1>
          <div className="header-decoration"></div>
        </div>
        <div className="divider"></div>

        <form onSubmit={onFinish} className="security-form">
          <div className="form-group">
            <label htmlFor="title">
              <FaNewspaper className="input-icon" />
              หัวข้อข่าวสาร
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="title"
                name="title"
                value={formValues.title}
                onChange={handleInputChange}
                placeholder="กรอกหัวข้อข่าวสาร IT"
                required
                maxLength={150}
              />
              <span className="input-focus"></span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="content">
              <FaAlignLeft className="input-icon" />
              รายละเอียดข่าวสาร
            </label>
            <div className="input-wrapper">
              <textarea
                id="content"
                name="content"
                value={formValues.content}
                onChange={handleInputChange}
                placeholder="กรอกรายละเอียดข่าวสาร"
                rows={4}
                required
              ></textarea>
              <span className="input-focus"></span>
            </div>
          </div>

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
              
              {(previewThumbnail || prevThumbnail) && (
                <div className="image-preview-container">
                  <img
                    src={previewThumbnail || prevThumbnail}
                    alt="Thumbnail Preview"
                    className="image-preview"
                  />
                  <button 
                    type="button" 
                    className="remove-button"
                    onClick={removeThumbnail}
                    title="ลบรูปหน้าปก"
                  >
                    <svg className="remove-icon" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                  <div className="image-overlay">
                    <span>ภาพหน้าปก</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">
              <FaImage className="input-icon" />
              รูปภาพข่าวสาร
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
              
              {(previewImage || prevImage) && (
                <div className="image-preview-container">
                  <img
                    src={previewImage || prevImage}
                    alt="Image Preview"
                    className="image-preview"
                  />
                  <button 
                    type="button" 
                    className="remove-button"
                    onClick={removeImage}
                    title="ลบรูปภาพ"
                  >
                    <svg className="remove-icon" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                  <div className="image-overlay">
                    <span>ภาพข่าวสาร</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="video">
              <FaImage className="input-icon" />
              วิดีโอ (mp4 ไม่เกิน 500 MB)
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
              
              {(previewVideo || prevVideo) && (
                <div className="video-preview-container">
                  <video
                    src={previewVideo || prevVideo}
                    controls
                    className="video-preview"
                  />
                  <button 
                    type="button" 
                    className="remove-button video-remove-button"
                    onClick={removeVideo}
                    title="ลบวิดีโอ"
                  >
                    <svg className="remove-icon" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="gif">
              <FaImage className="input-icon" />
              รูปภาพ gif
            </label>
            <div className="image-upload-container">
              <label htmlFor="gif-upload" className="upload-button">
                <FaUpload className="upload-icon" />
                <span>เลือกไฟล์ภาพ gif</span>
                <input
                  id="gif-upload"
                  type="file"
                  accept="image/gif"
                  onChange={handleGifChange}
                  style={{ display: 'none' }}
                />
              </label>
              
              {(previewGif || prevGif) && (
                <div className="image-preview-container">
                  <img
                    src={previewGif || prevGif}
                    alt="GIF Preview"
                    className="image-preview"
                  />
                  <button 
                    type="button" 
                    className="remove-button"
                    onClick={removeGif}
                    title="ลบ GIF"
                  >
                    <svg className="remove-icon" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                  <div className="image-overlay">
                    <span>GIF</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pdf">
              <FaImage className="input-icon" />
              ไฟล์ pdf (ไม่เกิน 50 MB)
            </label>
            <div className="image-upload-container">
              <label htmlFor="pdf-upload" className="upload-button">
                <FaUpload className="upload-icon" />
                <span>เลือกไฟล์ pdf</span>
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                  style={{ display: 'none' }}
                />
              </label>
              
              {(pdfFile || prevPdf) && (
                <div className="pdf-file-container">
                  <div className="pdf-file-content">
                    <div className="pdf-icon">
                      <svg viewBox="0 0 24 24">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-1h8v1zm0-3H8v-1h8v1zm-3-5V3.5L18.5 10H13z"/>
                      </svg>
                    </div>
                    <a 
                      href={pdfFile ? URL.createObjectURL(pdfFile) : prevPdf} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="pdf-file-link"
                    >
                      {pdfFile ? pdfFile.name : "ไฟล์ PDF เดิม"}
                    </a>
                  </div>
                  <button 
                    type="button" 
                    className="remove-button pdf-remove-button"
                    onClick={removePdf}
                    title="ลบ PDF"
                  >
                    <svg className="remove-icon" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <Link to="/admin/security" className="cancel-button">
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
  .security-edit-container {
    font-family: 'Mali', Tahoma, Geneva, Verdana, sans-serif;
    min-height: 80vh;
    border-radius: 20px;
    padding: 30px;
    background: linear-gradient(135deg, #e3f2fd, #d1e3fa);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .security-edit-card {
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

  .security-edit-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(106, 17, 203, 0.2);
  }

  .security-edit-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, #6a11cb, #2575fc);
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
    background: linear-gradient(to right, #6a11cb, #2575fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .header-icon {
    background: linear-gradient(135deg, #6a11cb, #2575fc);
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

  .security-form {
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
    font-size: 14px;
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
    background: linear-gradient(90deg, #6a11cb, #2575fc);
    transition: width 0.3s ease;
  }

  input:focus ~ .input-focus, textarea:focus ~ .input-focus {
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
    background: linear-gradient(135deg, #f5f7fa, #e4e8f0);
    color: #6a11cb;
    border: 1px dashed #6a11cb;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    width: fit-content;
  }

  .upload-button:hover {
    background: linear-gradient(135deg, #e4e8f0, #d5dde8);
  }

  .upload-icon { font-size: 18px; }

  .remove-button, .video-remove-button{
    position: absolute;
    top: 10px;
    right: 10px;
    width: 28px;
    height: 28px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    padding: 0;
    z-index: 2;
  }

  .pdf-remove-button {
    position: relative;
    top: auto;
    right: auto;
    margin-left: 10px;
  }

  .remove-button:hover, .video-remove-button:hover, .pdf-remove-button:hover {
    background: #ff4b2b;
    transform: scale(1.1);
  }

  .remove-icon {
    width: 18px;
    height: 18px;
    fill: #ff4b2b;
    transition: all 0.3s ease;
  }

  .remove-button:hover .remove-icon,
  .video-remove-button:hover .remove-icon,
  .pdf-remove-button:hover .remove-icon {
    fill: white;
  }

  .pdf-file-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f5f7fa;
    border-radius: 8px;
    padding: 12px 15px;
    margin-top: 10px;
    border: 1px solid #e0e0e0;
  }

  .pdf-file-content {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
  }

  .pdf-icon { width: 24px; height: 24px; }
  .pdf-icon svg { width: 100%; height: 100%; fill: #e74c3c; }

  .pdf-file-link {
    color: #2c3e50;
    text-decoration: none;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.2s;
  }

  .pdf-file-link:hover {
    color: #6a11cb;
    text-decoration: underline;
  }

  .image-preview-container {
    position: relative;
    width: 100%;
    max-width: 300px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .image-preview { width: 100%; height: auto; display: block; transition: transform 0.3s ease; }

  .video-preview-container {
    position: relative;
    display: inline-block;
    width: 300px;
  }

  .video-preview { width: 300px; height: 225px; }

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

  .image-preview-container:hover .image-preview { transform: scale(1.05); }

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
    background: linear-gradient(135deg, #6a11cb, #2575fc);
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

  .button-icon { font-size: 16px; }

  .button-hover-effect {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: all 0.6s ease;
  }

  .submit-button:hover .button-hover-effect { left: 100%; }

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

  .notification.show { transform: translateX(0); }
  .notification.success { background: linear-gradient(135deg, #6a11cb, #2575fc); }
  .notification.error { background: linear-gradient(135deg, #ff416c, #ff4b2b); }

  .notification-icon { font-weight: bold; }

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
    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
    10% { opacity: 0.5; }
    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
  }

  @media (max-width: 768px) {
    .security-edit-container { padding: 15px; }
    .security-edit-card { padding: 25px; }
    .form-actions { flex-direction: column; }
    .cancel-button, .submit-button { width: 100%; justify-content: center; }
  }
`}</style>
    </div>
  );
}

export default SecurityEdit;