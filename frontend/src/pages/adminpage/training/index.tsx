import { useState, useEffect } from "react";
import { TrainingsInterface } from "../../../interfaces/ITraining";
import { DeleteTrainingsById, GetTrainings } from "../../../services/https/index";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaEdit, FaNewspaper, FaIdBadge, FaImage, FaSearch, FaSpinner } from "react-icons/fa";
import Pagination from "../../../components/Pagination/Pagination";

function Trainings() {
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState<TrainingsInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const filteredTrainings = trainings.filter(training => 
    training.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    training.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(training.ID).includes(searchTerm)
  );

  const [currentPage, setCurrentPage] = useState(1);
  const trainingPerPage = 10;
  const totalPages = Math.ceil(filteredTrainings.length / trainingPerPage);
  const indexOfLastTraining = currentPage * trainingPerPage;
  const indexOfFirstTraining = indexOfLastTraining - trainingPerPage;
  const currentTraining = filteredTrainings.slice(indexOfFirstTraining, indexOfLastTraining);

  const deleteTrainingById = async (id: string) => {
    if (!window.confirm("คุณแน่ใจที่จะลบรายการนี้ใช่หรือไม่?")) return;
    let res = await DeleteTrainingsById(id);

    if (res.status === 200) {
      showNotification("success", res.data.message);
      await getTrainings();
    } else {
      showNotification("error", res.data.error);
    }
  };

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

  const getTrainings = async () => {
    setLoading(true);
    try {
      let res = await GetTrainings();
      if (res.status === 200) {
        setTrainings(res.data);
      } else {
        setTrainings([]);
        showNotification("error", res.data.error);
      }
    } catch (error) {
      showNotification("error", "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTrainings();
  }, []);

  return (
    <div className="training-container">
      <Outlet />
      <div className="training-card">
        <div className="card-header">
          <div className="title-wrapper">
            <div className="header-icon">
              <FaNewspaper />
            </div>
            <h1>จัดการรายการอบรม</h1>
          </div>
          <div className="header-actions">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="ค้นหารายการ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="search-underline"></div>
            </div>
            <Link to="/admin/training/create" className="create-button">
              <FaPlus className="button-icon" />
              <span>สร้างรายการ</span>
              <div className="button-hover-effect"></div>
            </Link>
          </div>
        </div>

        <div className="divider"></div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner">
              <FaSpinner className="spinner-icon" />
            </div>
            <p>กำลังโหลดข้อมูลรายการอบรม...</p>
          </div>
        ) : (
          <div className="table-container">
            {currentTraining.length === 0 ? (
              <div className="no-results">
                <img src="/no-results.png" alt="No results" className="no-results-image" />
                <h3>ไม่พบข้อมูลที่ตรงกับการค้นหา</h3>
                <p>ลองเปลี่ยนคำค้นหาหรือสร้างรายการใหม่</p>
              </div>
            ) : (
              <table className="training-table">
                <thead>
                  <tr>
                    <th>
                      <div className="header-cell">
                        <FaIdBadge className="column-icon" />
                        <span>ไอดี</span>
                      </div>
                    </th>
                    <th>
                      <div className="header-cell">
                        <FaNewspaper className="column-icon" />
                        <span>หัวข้อ</span>
                      </div>
                    </th>
                    <th>
                      <div className="header-cell">
                        <FaNewspaper className="column-icon" />
                        <span>รายละเอียด</span>
                      </div>
                    </th>
                    <th>
                      <div className="header-cell">
                        <FaImage className="column-icon" />
                        <span>รูปหน้าปก</span>
                      </div>
                    </th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTraining.map((training) => (
                    <tr 
                      key={training.ID} 
                      className={`training-row ${hoveredRow === training.ID ? "hovered" : ""}`}
                      onMouseEnter={() => setHoveredRow(training.ID ?? 0)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td><span className="id-cell">{training.ID}</span></td>
                      <td><span className="title-cell">{training.title || "-"}</span></td>
                      <td><span className="content-cell">{training.content ? training.content.length > 30 ? training.content.substring(0, 30) + "..." : training.content : "-"}</span></td>
                      <td>
                        {training.thumbnail ? (
                          <div className="image-container">
                            <img src={training.thumbnail} alt="รูปภาพ" className="training-image" />
                          </div>
                        ) : (
                          <span className="no-image">ไม่มีรูปภาพ</span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="edit-button" onClick={() => navigate(`/admin/training/edit/${training.ID}`)}>
                            <FaEdit />
                            <span className="tooltip">แก้ไข</span>
                            <div className="button-hover-effect"></div>
                          </button>
                          <button className="delete-button" onClick={() => deleteTrainingById(String(training.ID))}>
                            <FaTrash />
                            <span className="tooltip">ลบ</span>
                            <div className="button-hover-effect"></div>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
          </div>
        )}
      </div>
      <style>{`
        .training-container {
          font-family: 'Mali', Tahoma, Geneva, Verdana, sans-serif;
          min-height: 100vh;
          border-radius: 20px;
          padding: 30px;
          background: linear-gradient(135deg, #f0f4f8 0%, #e0e8f5 100%);
          position: relative;
          overflow: hidden;
        }
        
        .training-card {
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
        
        .training-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(106, 17, 203, 0.2);
        }
        
        .training-card::before {
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
        
        .training-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .training-table th {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          color: #2c3e50;
          font-weight: 600;
          padding: 16px 12px;
          text-align: left;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .training-table td {
          padding: 7px;
          border-bottom: 1px solid #f0f0f0;
          transition: all 0.3s ease;
        }
        
        .training-table tr:last-child td {
          border-bottom: none;
        }
        
        .training-row:hover td {
          background: rgba(106, 17, 203, 0.03);
        }
        
        .training-row.hovered {
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
        
        .training-image {
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
        
        .image-container:hover .training-image {
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
          .training-container {
            padding: 15px;
          }
          
          .training-card {
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

export default Trainings;
