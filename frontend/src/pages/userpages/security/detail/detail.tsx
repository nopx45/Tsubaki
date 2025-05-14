import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetSecurityById } from "../../../../services/https";
import { SecurityInterface } from "../../../../interfaces/ISecurity";
import { FaCalendarAlt, FaFilePdf, FaImage, FaVideo, FaFileImage } from "react-icons/fa";
import { motion } from "framer-motion";

const SecurityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [security, setSecurity] = useState<SecurityInterface | null>(null);

  useEffect(() => {
    const fetchSecurity = async () => {
      try {
        const res = await GetSecurityById(id!);
        if (res.status === 200) {
          setSecurity(res.data);
        }
      } catch (error) {
        console.error("Error fetching Security", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSecurity();
  }, [id]);

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>กำลังโหลดข้อมูล...</p>
    </div>
  );
  
  if (!security) return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h2>ไม่พบข้อมูล</h2>
      <p>ไม่พบบทความที่คุณกำลังค้นหา</p>
      <button className="back-button">กลับไปหน้าหลัก</button>
    </div>
  );

  return (
    <motion.div 
      className="security-detail-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="security-header">
        <motion.h1 
          className="security-title"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {security.title}
        </motion.h1>
        
        <div className="security-meta">
          <span className="meta-item">
            <FaCalendarAlt className="meta-icon" />
            {new Date(security.created_at!).toLocaleDateString("th-TH", {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

      <motion.div 
        className="security-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {security.content}
      </motion.div>

      <div className="security-media">
        {security.Image && (
          <motion.div 
            className="media-block image-block"
            whileHover={{ scale: 1.01 }}
          >
            <div className="media-header">
              <FaImage className="media-icon" />
              <h3>รูปภาพประกอบ</h3>
            </div>
            <img 
              src={security.Image} 
              alt="Image" 
              className="media-image" 
              loading="lazy"
            />
          </motion.div>
        )}

        {security.video && (
          <motion.div 
            className="media-block video-block"
            whileHover={{ scale: 1.01 }}
          >
            <div className="media-header">
              <FaVideo className="media-icon" />
              <h3>วิดีโอประกอบ</h3>
            </div>
            <video 
              src={security.video} 
              controls 
              className="media-video"
            />
          </motion.div>
        )}

        {security.gif && (
          <motion.div 
            className="media-block gif-block"
            whileHover={{ scale: 1.01 }}
          >
            <div className="media-header">
              <FaFileImage className="media-icon" />
              <h3>ภาพเคลื่อนไหว</h3>
            </div>
            <img 
              src={security.gif} 
              alt="Gif" 
              className="media-gif" 
              loading="lazy"
            />
          </motion.div>
        )}

        {security.pdf && (
          <motion.div 
            className="media-block pdf-block"
            whileHover={{ scale: 1.02 }}
          >
            <div className="media-header">
              <FaFilePdf className="media-icon" />
              <h3>เอกสารประกอบ</h3>
            </div>
            <iframe
              src={security.pdf}
              title="PDF Viewer"
              className="pdf-viewer"
              width="100%"
              height="600px"
            ></iframe>
          </motion.div>
        )}
      </div>

      <style>{`
        :root {
          --primary-blue: #1a73e8;
          --secondary-blue: #4285f4;
          --light-blue: #e8f0fe;
          --dark-blue: #0d47a1;
          --gradient-blue: linear-gradient(135deg, #1a73e8, #4285f4);
        }
        
        .security-detail-container {
          max-width: 90%;
          margin: 2rem auto;
          padding: 2.5rem;
          font-family: 'Mali', 'Prompt', sans-serif;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          position: relative;
          overflow: hidden;
        }
        
        .security-detail-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 6px;
          height: 100%;
          background: var(--gradient-blue);
        }
        
        .security-header {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .security-title {
          font-size: 2.2rem;
          margin-bottom: 1rem;
          color: var(--dark-blue);
          line-height: 1.3;
          position: relative;
          padding-left: 1rem;
        }
        
        .security-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 60px;
          height: 4px;
          background: var(--gradient-blue);
          border-radius: 2px;
        }
        
        .security-meta {
          display: flex;
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #666;
          font-size: 0.9rem;
        }
        
        .meta-icon {
          color: var(--primary-blue);
          font-size: 0.9rem;
        }
        
        .security-content {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #333;
          margin-bottom: 3rem;
        }
        
        .security-media {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          margin-top: 3rem;
        }
        
        .media-block {
          background: var(--light-blue);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }
        
        .media-header {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 1.2rem;
        }
        
        .media-icon {
          color: var(--primary-blue);
          font-size: 1.2rem;
        }
        
        .media-block h3 {
          font-size: 1.2rem;
          color: var(--dark-blue);
          margin: 0;
        }
        
        .media-image, .media-video, .media-gif {
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          display: block;
          max-height: 500px;
          object-fit: contain;
        }
        
        .media-video {
          aspect-ratio: 16/9;
          background: #000;
        }
        
        .pdf-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1.5rem;
          background: var(--gradient-blue);
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          box-shadow: 0 4px 8px rgba(26, 115, 232, 0.2);
        }
        
        .pdf-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(26, 115, 232, 0.3);
        }
        
        .pdf-viewer {
          border: none;
          margin-top: 10px;
        }

        .link-icon {
          font-size: 0.9rem;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
          gap: 1rem;
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #e0e0e0;
          border-top: 5px solid var(--primary-blue);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-container {
          text-align: center;
          padding: 3rem;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .error-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: #f44336;
        }
        
        .error-container h2 {
          color: #333;
          margin-bottom: 0.5rem;
        }
        
        .error-container p {
          color: #666;
          margin-bottom: 1.5rem;
        }
        
        .back-button {
          padding: 0.8rem 1.5rem;
          background: var(--primary-blue);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .back-button:hover {
          background: var(--dark-blue);
        }
        
        @media (max-width: 768px) {
          .security-detail-container {
            padding: 1.5rem;
            margin: 1rem;
          }
          
          .security-title {
            font-size: 1.8rem;
          }
          
          .security-content {
            font-size: 1rem;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default SecurityDetail;