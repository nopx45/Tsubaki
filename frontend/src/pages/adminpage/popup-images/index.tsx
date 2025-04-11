import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaCloudUploadAlt, FaImage, FaSpinner } from 'react-icons/fa';
import {
  DeletePopupImage,
  GetPopupImages,
  UploadPopupImages,
  UpdatePopupOrder
} from '../../../services/https';
import SortableImage from '../../../components/sortableImage/SortableImage';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const ImagePopupManager = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const fetchPopup = async () => {
      setIsLoading(true);
      try {
        const res = await GetPopupImages();
        if (res.success && res.image) {
          setImages(res.image);
        } else {
          console.error(res.error);
        }
      } catch (err) {
        console.error('Error fetching popup images:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopup();
  }, []);

  const UploadPopupImage = async (files: FileList | null) => {
    if (!files || files.length === 0) return { success: false, error: 'ไม่พบไฟล์' };

    setIsUploading(true);
    try {
      const fileArray = Array.from(files);
      const response = await UploadPopupImages(fileArray);

      if (response.success) {
        Swal.fire('สำเร็จ', response.message, 'success');
        return response;
      } else {
        Swal.fire('ผิดพลาด', response.error || 'อัพโหลดไม่สำเร็จ', 'error');
        return response;
      }
    } catch (error) {
      console.error('Upload error:', error);
      Swal.fire('ผิดพลาด', 'เกิดข้อผิดพลาดในการอัพโหลด', 'error');
      return { success: false, error: 'เกิดข้อผิดพลาดในการอัพโหลด' };
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (imgId: string) => {
    const result = await Swal.fire({
      title: 'ยืนยันการลบ?',
      text: 'คุณแน่ใจหรือไม่ว่าต้องการลบรูปนี้',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบเลย',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#ff3b3b',
      cancelButtonColor: '#6c757d',
    });

    if (result.isConfirmed) {
      const response = await DeletePopupImage(imgId);
      if (response.success) {
        Swal.fire('สำเร็จ', response.message, 'success');
        setImages((prev) => prev.filter((img) => img !== imgId));
      } else {
        Swal.fire('ผิดพลาด', response.error || 'ลบไม่สำเร็จ', 'error');
      }
    }
  };

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const response = await UploadPopupImage(files);
    if (response.success) {
      setImages((prev) => [...response.paths, ...prev]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((img) => img === active.id);
      const newIndex = images.findIndex((img) => img === over?.id);
      const newImages = arrayMove(images, oldIndex, newIndex);
      setImages(newImages);

      try {
        await UpdatePopupOrder(newImages);
      } catch (err) {
        console.error("Failed to save popup order", err);
      }
    }
  };

  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <div className="image-popup-manager">
      <h1 className="title">จัดการรูปภาพ Popup</h1>

      {isLoading ? (
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>กำลังโหลดรูปภาพ...</p>
        </div>
      ) : (
        <>
          {images.length === 0 ? (
            <div className="empty-state">
              <FaImage className="empty-icon" />
              <p>ยังไม่มีรูปภาพ</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={images} strategy={verticalListSortingStrategy}>
                <div className="image-grid">
                  {images.map((img) => (
                    <SortableImage key={img} id={img} url={img} onDelete={handleDeleteImage} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          <div
            className={`upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files)}
              className="file-input"
              multiple
            />
            <label htmlFor="file-upload" className="upload-label">
              {isUploading ? (
                <>
                  <FaSpinner className="spinner" />
                  <span>กำลังอัพโหลด...</span>
                </>
              ) : (
                <>
                  <FaCloudUploadAlt className="upload-icon" />
                  <span>ลากและวางไฟล์ที่นี่ หรือคลิกเพื่อเลือกไฟล์</span>
                  <p className="upload-hint">รองรับไฟล์รูปภาพขนาด 1200x1500 เท่านั้น (JPG, PNG, GIF)</p>
                </>
              )}
            </label>
          </div>
        </>
      )}
      <style>{`
      /* src/components/ImagePopupManager.css */
.image-popup-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.2rem;
  background: linear-gradient(90deg, #3498db, #9b59b6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  position: relative;
}

.title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #3498db, #9b59b6);
  border-radius: 2px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #7f8c8d;
}

.spinner {
  animation: spin 1s linear infinite;
  font-size: 3rem;
  color: #3498db;
  margin-bottom: 1rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #bdc3c7;
  text-align: center;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.image-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.image-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.image-container {
  position: relative;
  padding-top: 66.67%; /* 3:2 aspect ratio */
  overflow: hidden;
}

.popup-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.image-card:hover .popup-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-card:hover .image-overlay {
  opacity: 1;
}

.delete-btn {
  background: rgba(231, 76, 60, 0.9);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.delete-btn:hover {
  background: #e74c3c;
  transform: scale(1.1);
}

.image-meta {
  padding: 1rem;
  background: #f8f9fa;
  color: #7f8c8d;
  font-size: 0.9rem;
  text-align: right;
}

.upload-area {
  border: 2px dashed #bdc3c7;
  border-radius: 10px;
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
  margin-top: 2rem;
  background: #f8f9fa;
}

.upload-area.drag-active {
  border-color: #3498db;
  background: rgba(52, 152, 219, 0.1);
}

.file-input {
  display: none;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #7f8c8d;
  transition: all 0.3s ease;
}

.upload-area:hover .upload-label,
.upload-area.drag-active .upload-label {
  color: #3498db;
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.upload-area:hover .upload-icon,
.upload-area.drag-active .upload-icon {
  transform: translateY(-5px);
  color: #9b59b6;
}

.upload-hint {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #95a5a6;
}

/* Pulse animation for upload area when empty */
.empty-state p {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  .title {
    font-size: 1.8rem;
  }
}
      `}</style>
    </div>
  );
};

export default ImagePopupManager;