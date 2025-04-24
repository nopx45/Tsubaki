import { useEffect, useState } from "react";
import { DeleteUserSocketsById, GetUserSockets } from "../../../../services/https";
import { UserSocketsInterface } from "../../../../interfaces/IUserSocket";
import { FaTrash, FaPlug } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import dayjs from "dayjs";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import Pagination from "../../../../components/Pagination/Pagination";
import "dayjs/locale/th";

dayjs.locale("th");
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function UserSocketLog() {
  const [exportOnlyCurrentPage, setExportOnlyCurrentPage] = useState(false);

  const [userSockets, setUserSockets] = useState<UserSocketsInterface[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const perPage = 30;

  const showNotification = (type: string, message: string) => {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add("show"), 10);
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  const fetchUserSockets = async () => {
    try {
      const res = await GetUserSockets();
      if (res.status === 200) {
        setUserSockets(res.data);
      } else {
        showNotification("error", res.data.error);
      }
    } catch {
      showNotification("error", "โหลดข้อมูลล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  const deleteSocket = async (id: string) => {
    if (!window.confirm("คุณแน่ใจที่จะลบข้อมูลนี้ใช่หรือไม่?")) return;
    const res = await DeleteUserSocketsById(id);
    if (res.status === 200) {
      showNotification("success", res.data.message);
      await fetchUserSockets();
    } else {
      showNotification("error", res.data.error);
    }
  };

  useEffect(() => {
    fetchUserSockets();
  }, []);

  const filtered = userSockets.filter((v) => {
    const matchSearch =
    v.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.socketId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.role?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });  

  const totalPages = Math.ceil(filtered.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = filtered.slice(indexOfFirst, indexOfLast);

  const handleExportCSV = () => {
    const csvRows: string[] = [];
  
    const headers = ['ID', 'ชื่อผู้ใช้', 'Socket ID', 'role'];
    csvRows.push(headers.join(','));
  
    const dataToExport = exportOnlyCurrentPage ? currentData : filtered;
  
    dataToExport.forEach((v) => {
      const row = [
        `"${v.id || ''}"`,
        `"${v.username || ''}"`,
        `"${v.socketId || ''}"`,
        `"${v.role || ''}"`,
      ];
      csvRows.push(row.join(','));
    });
  
    const csvContent = '\uFEFF' + csvRows.join('\n'); // มี BOM รองรับภาษาไทย
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `visitor-log-${dayjs().format('YYYY-MM-DD')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="activity-management-container">
      <div className="activity-card">
        <div className="header-section">
          <div className="title-wrapper">
            <FaPlug className="title-icon" />
            <h1>บันทึกการเชื่อมต่อ Socket ของผู้ใช้</h1>
          </div>
          <div className="header-actions" style={{ display: "flex", gap: 35, alignItems: "center", flexWrap: "wrap" }}>
            <div className="search-container">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="ค้นหาด้วย User / SocketID / Role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="checkbox"
                checked={exportOnlyCurrentPage}
                onChange={(e) => setExportOnlyCurrentPage(e.target.checked)}
              />
              Export เฉพาะหน้าปัจจุบัน
            </label>

            <button className="export-button" onClick={handleExportCSV}>
              📤 Export CSV
            </button>
          </div>
        </div>

        <div className="divider"></div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        ) : (
          <div className="table-container">
            {filtered.length === 0 ? (
              <div className="no-results">ไม่พบข้อมูลที่ตรงกับการค้นหา</div>
            ) : (
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>ชื่อผู้ใช้</th>
                    <th>Socket ID</th>
                    <th>Role</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((v) => (
                    <tr key={v.id} className="activity-row">
                      <td style={{ color: "#17d632" }}>{v.id}</td>
                      <td style={{ color: "#17d632" }}>{v.username}</td>
                      <td style={{ color: "#c19c1c" }}>{v.socketId}</td>
                      <td style={{ color: "#0D47A1" }}>{v.role}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="delete-button" onClick={() => deleteSocket(String(v.id))}>
                            <FaTrash />
                            <span className="tooltip">ลบ</span>
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
        .activity-management-container {
          font-family: 'Mali', Tahoma, Geneva, Verdana, sans-serif;
          min-height: 100vh;
          border-radius: 20px;
          padding: 30px;
          background: linear-gradient(135deg, #f0f4f8 0%, #e0e8f5 100%);
        }

        .activity-card {
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

        .activity-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(106, 17, 203, 0.2);
        }

        .activity-card::before {
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

        .activity-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 12px;
          overflow: hidden;
        }

        .activity-table th {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          color: #2c3e50;
          font-weight: 600;
          padding: 16px 12px;
          text-align: left;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .activity-table td {
          padding: 2px 12px;
          border-bottom: 1px solid #f0f0f0;
          transition: all 0.2s ease;
        }

        .activity-table tr:last-child td {
          border-bottom: none;
        }

        .activity-row {
          transition: all 0.3s ease;
        }

        .activity-row:hover {
          transform: translateX(5px);
          background: rgba(106, 17, 203, 0.03);
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

        .title-cell, .content-cell {
          font-weight: 500;
          color: #2c3e50;
        }

        .no-results {
          text-align: center;
          padding: 40px;
          color: #666;
          font-size: 16px;
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

        .edit-button:hover .tooltip,
        .delete-button:hover .tooltip {
          opacity: 1;
          visibility: visible;
          top: -40px;
        }
        
        .export-button {
          padding: 10px 16px;
          background: linear-gradient(135deg, #00c9ff 0%,rgb(120, 82, 245) 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 201, 255, 0.3);
          transition: all 0.3s ease;
        }

        .export-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 201, 255, 0.4);
        }
      `}</style>
    </div>
  );
}

export default UserSocketLog;
