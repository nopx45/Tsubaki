import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DeleteArticlesById, GetArticles } from "../../../services/https";
import { ArticlesInterface } from "../../../interfaces/IArticle";
import { FaPlus, FaEdit, FaTrash, FaBook, FaImage, FaIdBadge, FaNewspaper } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import Pagination from "../../../components/Pagination/Pagination";

function Article() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<ArticlesInterface[]>([]);
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ArticlePerPage = 10;
  const filteredArticles = articles.filter(article => 
    article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(article.ID).includes(searchTerm)
  );

  const totalPages = Math.ceil(articles.length / ArticlePerPage);
  const indexOfLastArticle = currentPage * ArticlePerPage;
  const indexOfFirstArticle = indexOfLastArticle - ArticlePerPage;
  const currentArticle = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  const showNotification = (type: string, message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const deleteArticlesById = async (id: string) => {
    const confirmDelete = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบทความนี้?");
    if (!confirmDelete) return;
  
    const res = await DeleteArticlesById(id);
    if (res.status === 200) {
      showNotification("success", res.data.message);
      await getArticles();
    } else {
      showNotification("error", res.data.error);
    }
  };
  

  const getArticles = async () => {
    const res = await GetArticles();
    if (res.status === 200) {
      setArticles(res.data);
    } else {
      setArticles([]);
      showNotification("error", res.data.error);
    }
  };

  useEffect(() => {
    getArticles();
  }, []);

  return (
    <div className="it-knowledge-container">
      <div className="floating-bubbles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="bubble" style={{
            left: `${Math.random() * 100}%`,
            width: `${20 + Math.random() * 60}px`,
            height: `${20 + Math.random() * 60}px`,
            animationDuration: `${5 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 5}s`
          }} />
        ))}
      </div>

      {notification && (
        <div className={`notification show ${notification.type}`}>
          <span className="notification-icon">{notification.type === "success" ? "✔️" : "❌"}</span>
          {notification.message}
        </div>
      )}

      <div className="it-knowledge-card">
        <div className="card-header">
          <div className="title-wrapper">
            <div className="header-icon">
              <FaBook />
            </div>
            <h1>จัดการบทความ</h1>
          </div>
          <div className="header-actions">
            <div className="search-container">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="ค้นหาบทความ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <Link to="/admin/article/create" className="create-button">
              <FaPlus className="button-icon" />
              สร้างข้อมูล
              <span className="button-hover-effect" />
            </Link>
          </div>
        </div>

        <div className="divider" />

        <div className="table-container">
          <table className="knowledge-table">
            <thead>
              <tr>
                <th><div className="header-cell"><span className="column-icon"><FaIdBadge className="column-icon" /></span> ไอดี</div></th>
                <th><div className="header-cell"><span className="column-icon"><FaNewspaper className="column-icon" /></span>ชื่อบทความ</div></th>
                <th><div className="header-cell"><span className="column-icon"><FaNewspaper className="column-icon" /></span>รายละเอียด</div></th>
                <th><div className="header-cell"><span className="column-icon"><FaImage className="column-icon" /></span>รูปภาพ</div></th>
                <th><div className="header-cell"><span className="column-icon"></span>จัดการ</div></th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.length > 0 ? currentArticle.map((article, _index) => (
                <tr className="knowledge-row" key={article.ID}>
                  <td><span className="id-cell">{article.ID}</span></td>
                  <td><span className="title-cell">{article.title}</span></td>
                  <td><span className="content-cell">{(article.content?.length ?? 0) > 60 ? article.content?.slice(0, 40) + "..." : article.content}</span></td>
                  <td>
                    {article.Image ? (
                      <div className="image-container">
                        <img src={article.thumbnail} alt="Article" className="knowledge-image" />
                      </div>
                    ) : (
                      <span className="no-image">ไม่มีรูปภาพ</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="delete-button" onClick={() => deleteArticlesById(String(article.ID))}>
                        <FaTrash />
                        <span className="tooltip">ลบ</span>
                      </button>
                      <button className="edit-button" onClick={() => navigate(`/admin/article/edit/${article.ID}`)}>
                        <FaEdit />
                        <span className="tooltip">แก้ไข</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5}>
                    <div className="no-results">
                      <img src="/no-results.jpg" className="no-results-image" alt="No Data" />
                      <h3>ไม่พบข้อมูลบทความ</h3>
                      <p>กรุณาเพิ่มบทความใหม่</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
        </div>
      </div>
      <style>{`
        .it-knowledge-container {
          font-family: 'Mali', Tahoma, Geneva, Verdana, sans-serif;
          min-height: 100vh;
          border-radius: 20px;
          padding: 30px;
          background: linear-gradient(135deg, #f0f4f8 0%, #e0e8f5 100%);
          position: relative;
          overflow: hidden;
        }
        
        .it-knowledge-card {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 15px 35px rgba(106, 17, 203, 0.15);
          transition: transform 0.3s ease;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }
        
        .it-knowledge-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(106, 17, 203, 0.2);
        }
        
        .it-knowledge-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .title-wrapper {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .title-wrapper h1 {
          margin: 0;
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
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 4px 12px rgba(106, 17, 203, 0.3);
        }
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .search-container {
          position: relative;
        }
        
        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #6a11cb;
          font-size: 16px;
        }
        
        .search-input {
          padding: 12px 15px 12px 40px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s ease;
          width: 250px;
          background-color: #f5f7fa;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        
        .search-input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.1);
        }
        
        .search-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #6a11cb, #2575fc);
          transition: width 0.3s ease;
        }
        
        .search-input:focus ~ .search-underline {
          width: 100%;
        }
        
        .create-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .create-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(106, 17, 203, 0.4);
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
        
        .create-button:hover .button-hover-effect {
          left: 100%;
        }
        
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(106, 17, 203, 0.1), transparent);
          margin: 25px 0;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 0;
        }
        
        .loading-spinner {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          animation: spin 1s linear infinite;
        }
        
        .spinner-icon {
          font-size: 30px;
          color: #6a11cb;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .loading-container p {
          color: #6a11cb;
          font-weight: 500;
        }
        
        .table-container {
          overflow-x: auto;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .knowledge-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .knowledge-table th {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          color: #2c3e50;
          font-weight: 600;
          padding: 16px 12px;
          text-align: left;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .knowledge-table td {
          padding: 7px;
          border-bottom: 1px solid #f0f0f0;
          transition: all 0.3s ease;
        }
        
        .knowledge-table tr:last-child td {
          border-bottom: none;
        }
        
        .knowledge-row:hover td {
          background: rgba(106, 17, 203, 0.03);
        }
        
        .knowledge-row.hovered {
          transform: translateX(5px);
          box-shadow: 0 5px 15px rgba(106, 17, 203, 0.1);
        }
        
        .header-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .column-icon {
          color: #6a11cb;
          font-size: 16px;
        }
        
        .id-cell {
          font-weight: bold;
          color: #2575fc;
          background: rgba(37, 117, 252, 0.1);
          padding: 6px 10px;
          border-radius: 20px;
          display: inline-block;
        }
        
        .title-cell, .content-cell {
          font-weight: 500;
          color: #2c3e50;
        }
        
        .no-image {
          color: #999;
          font-style: italic;
          padding: 6px 10px;
          background: #f5f5f5;
          border-radius: 4px;
          display: inline-block;
        }
        
        .image-container {
          position: relative;
          width: 40px;
          height: 40px;
          margin: 0 auto;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }
        
        .knowledge-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(106, 17, 203, 0.7);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          font-size: 12px;
        }
        
        .image-container:hover .knowledge-image {
          transform: scale(1.1);
        }
        
        .image-container:hover .image-overlay {
          opacity: 1;
        }
        
        .no-results {
          text-align: center;
          padding: 40px;
        }
        
        .no-results-image {
          width: 200px;
          height: auto;
          margin-bottom: 20px;
          opacity: 0.7;
        }
        
        .no-results h3 {
          color: #6a11cb;
          margin-bottom: 10px;
        }
        
        .no-results p {
          color: #666;
        }
        
        .action-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
        }
        
        .edit-button, .delete-button {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        
        .edit-button {
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          color: white;
        }
        
        .delete-button {
          background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
          color: white;
        }
        
        .edit-button:hover, .delete-button:hover {
          transform: scale(1.1);
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        }
        
        .tooltip {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #2c3e50;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        
        .edit-button:hover .tooltip, .delete-button:hover .tooltip {
          opacity: 1;
          visibility: visible;
          top: -40px;
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
          display: flex;
          align-items: center;
          gap: 10px;
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
          .it-knowledge-container {
            padding: 15px;
          }
          
          .it-knowledge-card {
            padding: 20px;
          }
          
          .card-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .header-actions {
            width: 100%;
            flex-direction: column;
            gap: 15px;
          }
          
          .search-input {
            width: 100%;
          }
          
          .create-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

export default Article;
