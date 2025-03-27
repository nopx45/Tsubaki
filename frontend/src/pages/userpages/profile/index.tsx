import { useState, useEffect } from 'react';
import {
  FaUser, FaEnvelope, FaPhone, FaKey, FaUserTag, FaEdit, FaSave, FaTimes
} from 'react-icons/fa';
import { GetProfile, UpdateUsersById } from '../../../services/https';
import { UsersInterface } from '../../../interfaces/IUser';


const UserProfile = () => {
  const [user, setUser] = useState<UsersInterface | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState<UsersInterface | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await GetProfile();
        setUser(response);
        setEditUser(response);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleEdit = () => {
    if (user) {
      setEditUser({ ...user });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (editUser) {
      setUser({ ...editUser });
      await UpdateUsersById(String(editUser.ID ?? ''),editUser);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditUser(prev => prev ? { ...prev, [name]: value } : null);
  };

  if (!user || !editUser) return <div>Loading...</div>;

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <div className="avatar">
          <FaUser size={80} />
        </div>
        <h2>{user.first_name} {user.last_name}</h2>
        <p className="username">@{user.username}</p>
        
        {isEditing ? (
          <div className="edit-actions">
            <button onClick={handleSave} className="save-btn">
              <FaSave /> Save
            </button>
            <button onClick={handleCancel} className="cancel-btn">
              <FaTimes /> Cancel
            </button>
          </div>
        ) : (
          <button onClick={handleEdit} className="edit-btn">
            <FaEdit /> Edit Profile
          </button>
        )}
      </div>

      <div className="profile-details">
        <div className="detail-item">
          <div className="detail-icon">
            <FaUser />
          </div>
          <div className="detail-content">
            <label>First Name</label>
            {isEditing ? (
              <input
                type="text"
                name="first_name"
                value={editUser.first_name}
                onChange={handleChange}
              />
            ) : (
              <p>{user.first_name}</p>
            )}
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">
            <FaUser />
          </div>
          <div className="detail-content">
            <label>Last Name</label>
            {isEditing ? (
              <input
                type="text"
                name="last_name"
                value={editUser.last_name}
                onChange={handleChange}
              />
            ) : (
              <p>{user.last_name}</p>
            )}
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">
            <FaUserTag />
          </div>
          <div className="detail-content">
            <label>Username</label>
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={editUser.username}
                onChange={handleChange}
              />
            ) : (
              <p>@{user.username}</p>
            )}
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">
            <FaEnvelope />
          </div>
          <div className="detail-content">
            <label>Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editUser.email}
                onChange={handleChange}
              />
            ) : (
              <p>{user.email}</p>
            )}
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">
            <FaPhone />
          </div>
          <div className="detail-content">
            <label>Phone</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={editUser.phone}
                onChange={handleChange}
              />
            ) : (
              <p>{user.phone}</p>
            )}
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">
            <FaKey />
          </div>
          <div className="detail-content">
            <label>Role</label>
            <p>{user.role}</p>
          </div>
        </div>
      </div>
      <style>{`
        /* src/components/UserProfile.css */
        .user-profile-container {
        max-width: 800px;
        margin: 2rem auto;
        padding: 2rem;
        background: #ffffff;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 120, 255, 0.1);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .profile-header {
        text-align: center;
        margin-bottom: 2rem;
        }

        .avatar {
        width: 120px;
        height: 120px;
        margin: 0 auto 1rem;
        background: #e6f2ff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0078ff;
        border: 4px solid #b3d7ff;
        }

        .profile-header h2 {
        margin: 0.5rem 0;
        color: #003366;
        font-size: 1.8rem;
        }

        .username {
        color: #666;
        margin-bottom: 1.5rem;
        font-size: 1.1rem;
        }

        .edit-btn, .save-btn, .cancel-btn {
        padding: 0.7rem 1.5rem;
        border: none;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        }

        .edit-btn {
        background: #0078ff;
        color: white;
        }

        .edit-btn:hover {
        background: #005bbf;
        transform: translateY(-2px);
        }

        .edit-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
        }

        .save-btn {
        background: #00aa55;
        color: white;
        }

        .save-btn:hover {
        background: #008844;
        transform: translateY(-2px);
        }

        .cancel-btn {
        background: #ff4444;
        color: white;
        }

        .cancel-btn:hover {
        background: #cc0000;
        transform: translateY(-2px);
        }

        .profile-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        }

        .detail-item {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        border-radius: 10px;
        background: #f5f9ff;
        transition: all 0.3s ease;
        }

        .detail-item:hover {
        background: #e6f2ff;
        transform: translateY(-2px);
        }

        .detail-icon {
        width: 40px;
        height: 40px;
        background: #0078ff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
        }

        .detail-content {
        flex-grow: 1;
        }

        .detail-content label {
        display: block;
        font-size: 0.8rem;
        color: #666;
        margin-bottom: 0.3rem;
        }

        .detail-content p {
        margin: 0;
        color: #003366;
        font-weight: 500;
        }

        .detail-content input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #b3d7ff;
        border-radius: 5px;
        font-family: inherit;
        background: white;
        color: #003366;
        }

        .detail-content input:focus {
        outline: none;
        border-color: #0078ff;
        box-shadow: 0 0 0 2px rgba(0, 120, 255, 0.2);
        }

        @media (max-width: 768px) {
        .profile-details {
            grid-template-columns: 1fr;
        }
        
        .user-profile-container {
            padding: 1.5rem;
        }
        }
      `}</style>
    </div>
  );
};

export default UserProfile;