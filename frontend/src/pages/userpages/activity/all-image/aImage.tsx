import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetActivitiesById } from "../../../../services/https";
import { ActivitiesInterface } from "../../../../interfaces/IActivity";

export default function ActivityAllImages() {
  const { id } = useParams<{ id: string }>();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await GetActivitiesById(id!);
        if (res.status === 200) {
          const activity: ActivitiesInterface = res.data;
          const imgArray = activity.image ? activity.image.split(",") : [];
          setImages(imgArray);
        }
      } catch (error) {
        console.error("Error fetching activity images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  const openImageModal = (imgUrl: string, index: number) => {
    setSelectedImage(imgUrl);
    setCurrentIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: "prev" | "next") => {
    let newIndex;
    if (direction === "next") {
      newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    }
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  return (
    <div className="gallery-container">
      <header className="gallery-header">
        <h1 className="gallery-title">
          <span className="title-icon">📸</span>
          รูปกิจกรรมทั้งหมด
        </h1>
        <div className="header-divider"></div>
        <p className="gallery-subtitle">ภาพบันทึกความทรงจำจากกิจกรรมของเรา</p>
      </header>

      {loading ? (
        <div className="loading-state">
          <div className="spinner">
            <div className="spinner-inner"></div>
          </div>
          <p className="loading-text">กำลังเตรียมภาพสวยๆ ให้คุณ...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="empty-state">
          <div className="empty-illustration">
            <div className="camera-icon">📷</div>
            <div className="empty-circle"></div>
          </div>
          <h3 className="empty-title">ไม่มีรูปภาพในกิจกรรมนี้</h3>
          <p className="empty-description">กิจกรรมนี้ยังไม่มีภาพถ่ายที่บันทึกไว้</p>
        </div>
      ) : (
        <>
          <div className="image-grid">
            {images.map((imgUrl, index) => (
              <div 
                key={index} 
                className="image-card"
                onClick={() => openImageModal(imgUrl, index)}
              >
                <div className="image-wrapper">
                  <img
                    src={imgUrl}
                    alt={`Activity Image ${index + 1}`}
                    className="gallery-image"
                    loading="lazy"
                  />
                </div>
                <div className="image-number">{index + 1}</div>
              </div>
            ))}
          </div>

          {selectedImage && (
            <div className="image-modal" onClick={closeImageModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="nav-button prev-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage("prev");
                  }}
                >
                  ❮
                </button>
                
                <img 
                  src={selectedImage} 
                  alt="Full size" 
                  className="modal-image"
                />
                
                <button 
                  className="nav-button next-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage("next");
                  }}
                >
                  ❯
                </button>
                
                <button 
                  className="close-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeImageModal();
                  }}
                >
                  ✕
                </button>
                
                <div className="image-counter">
                  {currentIndex + 1} / {images.length}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        .gallery-container {
          background-color: #e2e8f0;
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem 1.5rem;
          min-height: 80vh;
          border-radius: 30px;
        }

        .gallery-header {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
        }

        .gallery-title {
          font-size: 2.5rem;
          color: #2d3748;
          margin: 0 0 1rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .title-icon {
          font-size: 2.2rem;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .header-divider {
          width: 100px;
          height: 4px;
          background: linear-gradient(90deg, #6ee7b7, #3b82f6);
          margin: 0 auto 1.5rem;
          border-radius: 2px;
        }

        .gallery-subtitle {
          font-size: 1.1rem;
          color: #64748b;
          margin: 0;
          font-weight: 400;
        }

        /* Loading State */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          gap: 1.5rem;
        }

        .spinner {
          width: 60px;
          height: 60px;
          position: relative;
        }

        .spinner-inner {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 4px solid transparent;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner-inner::before,
        .spinner-inner::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          border: 4px solid transparent;
        }

        .spinner-inner::before {
          top: 5px;
          left: 5px;
          right: 5px;
          bottom: 5px;
          border-top-color: #6ee7b7;
          animation: spin 2s linear infinite;
        }

        .spinner-inner::after {
          top: 15px;
          left: 15px;
          right: 15px;
          bottom: 15px;
          border-top-color: #93c5fd;
          animation: spin 3s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text {
          font-size: 1.2rem;
          color: #64748b;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
          gap: 1.5rem;
        }

        .empty-illustration {
          position: relative;
          width: 150px;
          height: 150px;
        }

        .camera-icon {
          font-size: 4rem;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
        }

        .empty-circle {
          width: 120px;
          height: 120px;
          background-color: #e2e8f0;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 2s infinite;
        }

        .empty-title {
          font-size: 1.5rem;
          color: #334155;
          margin: 0;
        }

        .empty-description {
          font-size: 1rem;
          color: #64748b;
          margin: 0;
          max-width: 300px;
        }

        /* Image Grid */
        .image-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(20px, 1fr));
          gap: 0.5rem;
        }

        .image-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          aspect-ratio: 4/3;
          cursor: pointer;
          background: #f8fafc;
        }

        .image-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .image-wrapper {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .gallery-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .image-card:hover .gallery-image {
          transform: scale(1.04);
        }

        .image-number {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
        }

        /* Image Modal */
        .image-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(8px);
          animation: fadeIn 0.3s ease;
          padding: 2rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          position: relative;
          max-width: 90%;
          max-height: 90%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-image {
          max-width: 100%;
          max-height: 80vh;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          object-fit: contain;
        }

        .nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
          z-index: 10;
        }

        .nav-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-50%) scale(1.1);
        }

        .prev-button {
          left: 20px;
        }

        .next-button {
          right: 20px;
        }

        .close-button {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
        }

        .close-button:hover {
          background: rgba(255, 99, 71, 0.8);
          transform: rotate(90deg);
        }

        .image-counter {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .image-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .gallery-container {
            padding: 2rem 1rem;
          }
          
          .gallery-title {
            font-size: 2rem;
          }
          
          .image-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1.5rem;
          }
          
          .nav-button {
            width: 40px;
            height: 40px;
            font-size: 1.2rem;
          }
        }

        @media (max-width: 480px) {
          .gallery-title {
            font-size: 1.8rem;
          }
          
          .image-grid {
            grid-template-columns: 1fr;
          }
          
          .modal-content {
            max-width: 95%;
          }
        }
      `}</style>
    </div>
  );
}