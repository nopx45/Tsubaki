import { useState, useEffect } from "react";
import { GetRegulations, DeleteRegulationsById } from "../../../services/https/index";
import { Link, useNavigate } from "react-router-dom";
import { RegulationsInterface } from "../../../interfaces/IRegulation";
import dayjs from "dayjs";
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaFileAlt, FaBullhorn } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import Pagination from "../../../components/Pagination/Pagination";

dayjs.locale("th");

function Regulation() {
  const navigate = useNavigate();
  const [regulations, setRegulations] = useState<RegulationsInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const myId = localStorage.getItem("id");

  const getRegulations = async () => {
    setLoading(true);
    try {
      const res = await GetRegulations();
      if (res.status === 200) {
        setRegulations(res.data);
      } else {
        setRegulations([]);
        showNotification("error", res.data.error);
      }
    } catch (error) {
      showNotification("error", "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const deleteRegulationById = async (id: string) => {
    if (!window.confirm("คุณแน่ใจที่จะลบข้อมูลนี้ใช่หรือไม่?")) return;
    const res = await DeleteRegulationsById(id);
    if (res.status === 200) {
      showNotification("success", res.data.message);
      await getRegulations();
    } else {
      showNotification("error", res.data.error);
    }
  };

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

  useEffect(() => {
    getRegulations();
  }, []);

  const filtered = regulations.filter(r =>
    r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.file_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(r.ID).includes(searchTerm)
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = filtered.slice(indexOfFirst, indexOfLast);

  return (
    <div className="announcement-container">
      <div className="announcement-card">
        <div className="header-section">
          <div className="title-wrapper">
            <FaFileAlt className="title-icon" />
            <h1>จัดการระเบียบข้อบังคับ</h1>
          </div>
          <div className="header-actions">
            <div className="search-container">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="ค้นหาระเบียบ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <Link to="/admin/regulation/create" className="create-button">
              <FaPlus className="button-icon" />
              <span>สร้างข้อมูล</span>
              <span className="button-hover-effect"></span>
            </Link>
          </div>
        </div>

        <div className="divider"></div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>กำลังโหลดข้อมูลระเบียบ...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="announcement-table">
              <thead>
                <tr>
                  <th><div className="header-cell"><FaFileAlt className="column-icon" /> ฉบับที่</div></th>
                  <th><div className="header-cell"><FaCalendarAlt className="column-icon" /> วันที่แก้ไขล่าสุด</div></th>
                  <th><div className="header-cell"><FaBullhorn className="column-icon" />ชื่อระเบียบ</div></th>
                  <th><div className="header-cell"><FaFileAlt className="column-icon" />ชื่อไฟล์</div></th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? currentData.map((r) => (
                  <tr key={r.ID} className="announce-row">
                    <td><span className="id-cell">{r.ID}</span></td>
                    <td><span className="date-cell">{dayjs(r.UpdatedAt).format("DD/MM/YYYY HH:mm")}</span></td>
                    <td><span className="title-cell">{r.name}</span></td>
                    <td><span className="file-cell">{r.file_name}</span></td>
                    <td>
                      <div className="action-buttons">
                        {String(myId) !== String(r.ID) && (
                          <button className="delete-button" onClick={() => deleteRegulationById(String(r.ID))}>
                            <FaTrash />
                            <span className="tooltip">ลบ</span>
                          </button>
                        )}
                        <button className="edit-button" onClick={() => navigate(`/admin/regulation/edit/${r.ID}`)}>
                          <FaEdit />
                          <span className="tooltip">แก้ไข</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="empty-message">ไม่พบข้อมูลระเบียบ</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        />
      </div>
      <style>{`
        .announcement-container {
          font-family: 'Mali', Tahoma, Geneva, Verdana, sans-serif;
          min-height: 100vh;
          max-width: 100%;
          border-radius: 20px;
          padding: 30px;
          background: linear-gradient(135deg, #f0f4f8 0%, #e0e8f5 100%);
        }
        
        .announcement-card {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 15px 35px rgba(106, 17, 203, 0.15);
          transition: transform 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .announcement-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(106, 17, 203, 0.2);
        }
        
        .announcement-card::before {
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
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .search-container {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .search-icon {
          position: absolute;
          left: 15px;
          color: #6a11cb;
          font-size: 16px;
        }
        
        .search-input {
          padding: 10px 15px 10px 40px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s ease;
          width: 250px;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #6a11cb;
          box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.1);
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
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .create-button:hover .button-hover-effect {
          opacity: 1;
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
        
        .announcement-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .announcement-table th {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          color: #2c3e50;
          font-weight: 600;
          padding: 16px 12px;
          text-align: left;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .announcement-table td {
          padding: 5px 12px;
          border-bottom: 1px solid #f0f0f0;
          transition: all 0.2s ease;
        }
        
        .announcement-table tr:last-child td {
          border-bottom: none;
        }
        
        .announcement-table tr:hover td {
          background: rgba(106, 17, 203, 0.03);
        }
        
        .announce-row {
          transition: all 0.3s ease;
        }
        
        .announce-row:hover {
          transform: translateX(5px);
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
          padding: 4px 8px;
          border-radius: 4px;
        }
        
        .date-cell {
          color: #6a11cb;
          font-weight: 500;
        }
        
        .title-cell {
          font-weight: 500;
          color: #2c3e50;
        }
        
        .content-cell {
          color: #666;
          max-width: 300px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: inline-block;
        }
        
        .file-cell {
          color: #2575fc;
          font-weight: 500;
        }
        
        .empty-message {
          text-align: center;
          padding: 20px;
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
          background: linear-gradient(135deg, #ff5e62 0%, #ff9966 100%);
          color: white;
        }
        
        .edit-button:hover, .delete-button:hover {
          transform: scale(1.1);
        }
        
        .edit-button .tooltip, .delete-button .tooltip {
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
          .announcement-card {
            padding: 20px;
          }
          
          .header-section {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .header-actions {
            width: 100%;
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
          
          .content-cell {
            max-width: 150px;
          }
        }
      `}</style>
    </div>
  );
}

export default Regulation;
