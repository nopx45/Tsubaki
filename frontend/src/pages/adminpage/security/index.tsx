import { useState, useEffect } from "react";
import { DeleteSecurityById, GetSecurity } from "../../../services/https/index";
import { Link, Outlet, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { SecurityInterface } from "../../../interfaces/ISecurity";
import { FaPlus, FaTrash, FaEdit, FaShieldAlt, FaIdCard, FaImage, FaSearch, FaCalendarAlt } from "react-icons/fa";
import Pagination from "../../../components/Pagination/Pagination";

function Security() {
  const navigate = useNavigate();
  dayjs.locale("th");

  const [security, setSecurity] = useState<SecurityInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const filteredSecurity = security.filter(security => 
    security.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    security.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(security.ID).includes(searchTerm)
  );

  const [currentPage, setCurrentPage] = useState(1);
  const securityPerPage = 10;
  const totalPages = Math.ceil(filteredSecurity.length / securityPerPage);
  const indexOfLastsecurity = currentPage * securityPerPage;
  const indexOfFirstsecurity = indexOfLastsecurity - securityPerPage;
  const currentsecurity = filteredSecurity.slice(indexOfFirstsecurity, indexOfLastsecurity);

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

  const deleteSecurityById = async (id: string) => {
    if (!window.confirm("คุณแน่ใจที่จะลบบทความนี้ใช่หรือไม่?")) return;
    let res = await DeleteSecurityById(id);

    if (res.status === 200) {
      showNotification("success", res.data.message);
      await getSecurity();
    } else {
      showNotification("error", res.data.error);
    }
  };

  const getSecurity = async () => {
    setLoading(true);
    try {
      let res = await GetSecurity();
      if (res.status === 200) {
        setSecurity(res.data);
      } else {
        setSecurity([]);
        showNotification("error", res.data.error);
      }
    } catch (error) {
      showNotification("error", "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSecurity();
  }, []);

  return (
    <div className="security-management-container">
      <Outlet />
      <div className="security-card">
        <div className="header-section">
          <div className="title-wrapper">
            <FaShieldAlt className="title-icon" />
            <h1>จัดการข่าวสารด้านความปลอดภัย</h1>
          </div>
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="ค้นหาข่าวสาร..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <div className="search-underline"></div>
          </div>
          <Link to="/admin/security/create" className="create-button">
            <FaPlus className="button-icon" />
            <span>สร้างข้อมูล</span>
            <div className="button-hover-effect"></div>
          </Link>
        </div>

        <div className="divider"></div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        ) : (
          <div className="table-container">
            {security.length === 0 ? (
              <div className="no-results">
                <img src="/no-results.png" alt="No results" className="no-results-image" />
                <h3>ไม่พบข้อมูลบทความ</h3>
                <p>ลองสร้างบทความใหม่หรือรีเฟรชหน้าเว็บ</p>
              </div>
            ) : (
              <table className="security-table">
                <thead>
                  <tr>
                  <th>
                      <div className="header-cell">
                        <FaCalendarAlt className="column-icon" />
                        <span>วันที่สร้าง</span>
                      </div>
                    </th>
                    <th>
                      <div className="header-cell">
                        <FaIdCard className="column-icon" />
                        <span>ไอดี</span>
                      </div>
                    </th>
                    <th>
                      <div className="header-cell">
                        <FaShieldAlt className="column-icon" />
                        <span>หัวข้อ</span>
                      </div>
                    </th>
                    <th>
                      <div className="header-cell">
                        <FaShieldAlt className="column-icon" />
                        <span>รายละเอียด</span>
                      </div>
                    </th>
                    <th>
                      <div className="header-cell">
                        <FaImage className="column-icon" />
                        <span>รูปภาพ</span>
                      </div>
                    </th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {currentsecurity.map((item) => (
                    <tr 
                      key={item.ID} 
                      className={`security-row ${hoveredRow === item.ID ? "hovered" : ""}`}
                      onMouseEnter={() => setHoveredRow(item.ID ?? 0)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td>
                      <span className="id-cell">
                        {dayjs(item.created_at).format("DD/MM/YYYY HH:mm")}
                      </span>
                      </td>
                      <td>
                        <span className="id-cell">{item.ID}</span>
                      </td>
                      <td>
                        <span className="title-cell">
                          {(item.title?.length ?? 0) > 30 ? `${item.title?.substring(0, 30)}...` : item.title}
                        </span>
                      </td>
                      <td>
                        <span className="content-cell">
                          {(item.content?.length ?? 0) > 30 ? `${item.content?.substring(0, 30)}...` : item.content}
                        </span>
                      </td>
                      <td>
                        {item.thumbnail ? (
                          <div className="image-container">
                            <img
                              src={item.thumbnail}
                              alt="รูปภาพบทความ"
                              className="security-image"
                            />
                          </div>
                        ) : (
                          <span className="no-image">ไม่มีรูปภาพ</span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="delete-button"
                            onClick={() => deleteSecurityById(String(item.ID))}
                            title="ลบบทความ"
                          >
                            <FaTrash />
                            <span className="tooltip">ลบ</span>
                            <span className="button-hover-effect"></span>
                          </button>
                          <button
                            className="edit-button"
                            onClick={() => navigate(`/admin/security/edit/${item.ID}`)}
                            title="แก้ไขบทความ"
                          >
                            <FaEdit />
                            <span className="tooltip">แก้ไข</span>
                            <span className="button-hover-effect"></span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        />
      </div>

      <div className="floating-bubbles">
        {[...Array(15)].map((_, i) => (
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
        .security-management-container {
          min-height: 100vh;
          border-radius: 20px;
          padding: 30px;
          background: linear-gradient(135deg, #f0f4f8 0%, #e0e8f5 100%);
          position: relative;
          overflow: hidden;
        }
        
        .security-card {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 30px;
          border-left: 0;
          box-shadow: 0 15px 35px rgba(106, 17, 203, 0.15);
          transition: transform 0.3s ease;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }
        
        .security-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(106, 17, 203, 0.2);
        }
        
        .security-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
        }
        
        .header-section {
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
        
        .title-icon {
          font-size: 32px;
          color: #6a11cb;
          background: rgba(106, 17, 203, 0.1);
          padding: 12px;
          border-radius: 50%;
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

        .search-container {
          position: relative;
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
          width: 50px;
          height: 50px;
          border: 5px solid rgba(106, 17, 203, 0.1);
          border-radius: 50%;
          border-top-color: #6a11cb;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 20px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .table-container {
          overflow-x: auto;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .security-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .security-table th {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          color: #2c3e50;
          font-weight: 600;
          padding: 16px 12px;
          text-align: left;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .security-table td {
          padding: 7px;
          border-bottom: 1px solid #f0f0f0;
          transition: all 0.3s ease;
        }
        
        .security-table tr:last-child td {
          border-bottom: none;
        }
        
        .security-row:hover td {
          background: rgba(106, 17, 203, 0.03);
        }
        
        .security-row.hovered {
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
          width: 50px;
          height: 50px;
          margin: 0 auto;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }
        
        .security-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .image-hover {
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
        
        .image-container:hover .security-image {
          transform: scale(1.1);
        }
        
        .image-container:hover .image-hover {
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
          .security-management-container {
            padding: 15px;
          }
          
          .security-card {
            padding: 25px;
          }
          
          .header-section {
            flex-direction: column;
            align-items: flex-start;
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

export default Security;