import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetTrainingsById } from "../../../../services/https";
import { TrainingsInterface } from "../../../../interfaces/ITraining";
import { FaCalendarAlt, FaFilePdf, FaImage, FaVideo, FaFileImage } from "react-icons/fa";
import { motion } from "framer-motion";

const TrainingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState<TrainingsInterface | null>(null);

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const res = await GetTrainingsById(id!);
        if (res.status === 200) {
          setTraining(res.data);
        }
      } catch (error) {
        console.error("Error fetching training", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTraining();
  }, [id]);

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>กำลังโหลดข้อมูล...</p>
    </div>
  );
  
  if (!training) return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h2>ไม่พบข้อมูล</h2>
      <p>ไม่พบบทความที่คุณกำลังค้นหา</p>
      <button className="back-button">กลับไปหน้าหลัก</button>
    </div>
  );

  return (
    <motion.div 
      className="training-detail-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="training-header">
        <motion.h1 
          className="training-title"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {training.title}
        </motion.h1>
        
        <div className="training-meta">
          <span className="meta-item">
            <FaCalendarAlt className="meta-icon" />
            {new Date(training.CreatedAt!).toLocaleDateString("th-TH", {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

      <motion.div 
        className="training-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="formatted-content">
          {(training.content ?? "")
            .split('\n')
            .map((line, index) => (
              <p
                key={index}
                dangerouslySetInnerHTML={{
                  __html: line
                    ? line.replace(
                        /(https?:\/\/[^\s]+)/g,
                        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
                      )
                    : '&nbsp;'
                }}
              ></p>
            ))}
        </div>
      </motion.div>

      <div className="training-media">
        {training.image && (
          <motion.div 
            className="media-block image-block"
            whileHover={{ scale: 1.01 }}
          >
            <div className="media-header">
              <FaImage className="media-icon" />
              <h3>รูปภาพประกอบ</h3>
            </div>
            <img 
              src={training.image} 
              alt="Image" 
              className="media-image" 
              loading="lazy"
            />
          </motion.div>
        )}

        {training.video && (
          <motion.div 
            className="media-block video-block"
            whileHover={{ scale: 1.01 }}
          >
            <div className="media-header">
              <FaVideo className="media-icon" />
              <h3>วิดีโอประกอบ</h3>
            </div>
            <video 
              src={training.video} 
              controls 
              className="media-video"
            />
          </motion.div>
        )}

        {training.gif && (
          <motion.div 
            className="media-block gif-block"
            whileHover={{ scale: 1.01 }}
          >
            <div className="media-header">
              <FaFileImage className="media-icon" />
              <h3>ภาพเคลื่อนไหว</h3>
            </div>
            <img 
              src={training.gif} 
              alt="Gif" 
              className="media-gif" 
              loading="lazy"
            />
          </motion.div>
        )}

        {training.pdf && (
          <motion.div 
            className="media-block pdf-block"
            whileHover={{ scale: 1.02 }}
          >
            <div className="media-header">
              <FaFilePdf className="media-icon" />
              <h3>เอกสารประกอบ</h3>
            </div>
            <iframe
              src={training.pdf}
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
        
        .training-detail-container {
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
        
        .training-detail-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 6px;
          height: 100%;
          background: var(--gradient-blue);
        }
        
        .training-header {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .training-title {
          font-size: 2.2rem;
          margin-bottom: 1rem;
          color: var(--dark-blue);
          line-height: 1.3;
          position: relative;
          padding-left: 1rem;
        }
        
        .training-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 60px;
          height: 4px;
          background: var(--gradient-blue);
          border-radius: 2px;
        }

        .formatted-content {
          white-space: pre-wrap;
          font-family: sans-serif;
          font-size: 1rem;
          color: #333;
        }

        .formatted-content a {
          color: #1a0dab;
          text-decoration: underline;
          word-break: break-word;
        }
        
        .training-meta {
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
        
        .training-content {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #333;
          margin-bottom: 3rem;
        }
        
        .training-media {
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
          .training-detail-container {
            padding: 1.5rem;
            margin: 1rem;
          }
          
          .training-title {
            font-size: 1.8rem;
          }
          
          .training-content {
            font-size: 1rem;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default TrainingDetail;
