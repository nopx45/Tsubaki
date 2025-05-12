import { useState, useEffect } from "react";
import { UsersInterface } from "../../../interfaces/IUser";
import { Link, useNavigate } from "react-router-dom";
import { GetUsers, DeleteUsersById, getAuthToken } from "../../../services/https/index";
import { FaUserPlus, FaEdit, FaTrash, FaUsers, FaIdBadge, FaUserTag, FaEnvelope, FaSearch } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { IoMdPerson } from "react-icons/io";
import Pagination from "../../../components/Pagination/Pagination";

function Customers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UsersInterface[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<UsersInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const usersPerPage = 15;

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  
  const myId = localStorage.getItem("id");

  // Search function
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term === "") {
      setFilteredUsers(users);
      setCurrentPage(1);
      return;
    }
    
    const filtered = users.filter(user => 
      user.first_name?.toLowerCase().includes(term.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(term.toLowerCase()) ||
      user.username?.toLowerCase().includes(term.toLowerCase()) ||
      user.email?.toLowerCase().includes(term.toLowerCase()) ||
      user.role?.toLowerCase().includes(term.toLowerCase()) ||
      String(user.ID).includes(term)
    );
    
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const columns = [
    {
      title: (
        <div className="header-cell">
          <FaIdBadge className="column-icon" />
          <span>ลำดับ</span>
        </div>
      ),
      dataIndex: "ID",
      key: "id",
      render: (text: UsersInterface) => <span className="id-cell">{text.ID}</span>,
    },
    {
      title: (
        <div className="header-cell">
          <IoMdPerson className="column-icon" />
          <span>ชื่อ</span>
        </div>
      ),
      dataIndex: "first_name",
      key: "first_name",
      render: (text: UsersInterface) => <span className="name-cell">{text.first_name}</span>,
    },
    {
      title: (
        <div className="header-cell">
          <IoMdPerson className="column-icon" />
          <span>นามสกุล</span>
        </div>
      ),
      dataIndex: "last_name",
      key: "last_name",
      render: (text: UsersInterface) => <span className="name-cell">{text.last_name}</span>,
    },
    {
      title: (
        <div className="header-cell">
          <FaUserTag className="column-icon" />
          <span>ชื่อผู้ใช้</span>
        </div>
      ),
      dataIndex: "username",
      key: "username",
      render: (text: UsersInterface) => <span className="username-cell">@{text.username}</span>,
    },
    {
      title: (
        <div className="header-cell">
          <FaEnvelope className="column-icon" />
          <span>อีเมล</span>
        </div>
      ),
      dataIndex: "email",
      key: "email",
      render: (text: UsersInterface) => <span className="email-cell">{text.email}</span>,
    },
    {
      title: (
        <div className="header-cell">
          <RiAdminFill className="column-icon" />
          <span>สิทธิ์การใช้งาน</span>
        </div>
      ),
      dataIndex: "role",
      key: "role",
      render: (text: UsersInterface) => (
        <span className={`role-badge ${text.role}`}>
          {text.role === "admin" && <RiAdminFill className="role-icon" />}
          {text.role}
        </span>
      ),
    },
    {
      title: "จัดการ",
      key: "action",
      render: (record: UsersInterface) => (
        <div className="action-buttons">
          {Number(myId) !== record?.ID && userRole === "admin" && (
            <button 
              className="delete-button"
              onClick={() => {
                if (record.ID !== undefined) {
                  deleteUserById(String(record.ID));
                }
              }}              
              title="ลบผู้ใช้"
            >
              <FaTrash />
              <span className="tooltip">ลบ</span>
            </button>
          )}
          <button
            className="edit-button"
            onClick={() => navigate(`/admin/customer/edit/${record.ID}`)}
            title="แก้ไขผู้ใช้"
          >
            <FaEdit />
            <span className="tooltip">แก้ไข</span>
          </button>
        </div>
      ),
    },
  ];

  const deleteUserById = async (id: string) => {
    if (!window.confirm("คุณแน่ใจที่จะลบผู้ใช้นี้ใช่หรือไม่?")) return;
    
    let res = await DeleteUsersById(id);
    
    if (res.status === 200) {
      showNotification("success", res.data.message);
      await getUsers();
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

  const getUsers = async () => {
    setLoading(true);
    try {
      let res = await GetUsers();
      if (res.status === 200) {
        setUsers(res.data);
        setFilteredUsers(res.data);
      } else {
        setUsers([]);
        setFilteredUsers([]);
        showNotification("error", res.data.error);
      }
    } catch (error) {
      showNotification("error", "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
    const fetchRole = async () => {
      try {
        const token = await getAuthToken();
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUserRole(payload?.role ?? null);
        }
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    };
    fetchRole();
  }, []);

  return (
    <div className="customer-management-container">
      <div className="customer-management-card">
        <div className="header-section">
          <div className="title-wrapper">
            <FaUsers className="title-icon" />
            <h1>จัดการข้อมูลสมาชิก</h1>
          </div>
          <div className="header-actions">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="ค้นหาสมาชิก..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />
            </div>
            {userRole === "admin" &&(
            <Link to="/admin/customer/create" className="create-button">
              <FaUserPlus className="button-icon" />
              <span>สร้างข้อมูล</span>
            </Link>
            )}
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
            {filteredUsers.length === 0 ? (
              <div className="no-results">
                <p>ไม่พบข้อมูลสมาชิกที่ตรงกับการค้นหา</p>
              </div>
            ) : (
              <>
                <table className="customer-table">
                  <thead>
                    <tr>
                      {columns.map((column, index) => (
                        <th key={index}>{column.title}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user) => (
                      <tr key={user.ID} className="user-row">
                        {columns.map((column, colIndex) => (
                          <td key={colIndex}>
                            {column.render
                              ? column.render(user)
                              : user[column.dataIndex as keyof UsersInterface]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                />
              </>
            )}
          </div>
        )}
      </div>
      
      <style>{`
        :global(body) {
          margin: 0;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        .customer-management-container {
          font-family: 'Mali', Tahoma, Geneva, Verdana, sans-serif;
          min-height: 100vh;
          border-radius: 20px;
          padding: 30px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        .customer-management-card {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          padding: 30px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .customer-management-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #ff9a9e 0%, #fad0c4 50%, #a18cd1 100%);
        }
        
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .title-wrapper {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .title-wrapper h1 {
          margin: 0;
          color: #2c3e50;
          font-size: 28px;
          font-weight: 600;
          background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .title-icon {
          font-size: 32px;
          color: #6a11cb;
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
        }
        
        .create-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(106, 17, 203, 0.4);
        }
        
        .button-icon {
          font-size: 16px;
        }
        
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent);
          margin: 20px 0;
        }
        
        .table-container {
          overflow-x: auto;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .customer-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .customer-table th {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          color: #2c3e50;
          font-weight: 600;
          padding: 16px 12px;
          text-align: left;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .customer-table td {
          padding: 7px 12px;
          border-bottom: 1px solid #f0f0f0;
          transition: all 0.2s ease;
        }
        
        .customer-table tr:last-child td {
          border-bottom: none;
        }
        
        .customer-table tr:hover td {
          background: rgba(106, 17, 203, 0.03);
        }
        
        .user-row {
          transition: all 0.3s ease;
        }
        
        .user-row:hover {
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
        
        .name-cell {
          font-weight: 500;
          color: #2c3e50;
        }
        
        .username-cell {
          color: #6a11cb;
          font-weight: 500;
        }
        
        .email-cell {
          color: #2575fc;
        }
        
        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: white;
        }
        
        .role-badge.admin {
          background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
        }
        
        .role-badge.adminit,
        .role-badge.adminhr {
          background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
        }
        
        .role-badge.user {
          background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
        }
        
        .role-icon {
          font-size: 14px;
        }
        
        .action-buttons {
          display: flex;
          gap: 10px;
        }
        
        .edit-button, .delete-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
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
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 0;
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
        
        .no-results {
          text-align: center;
          padding: 40px;
          color: #666;
          font-size: 16px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
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
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        
        .notification.error {
          background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
        }
        
        @media (max-width: 768px) {
          .customer-management-card {
            padding: 20px;
          }
          
          .header-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
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
          
          .customer-table th, .customer-table td {
            padding: 12px 8px;
          }
        }
      `}</style>
    </div>
  );
}

export default Customers;