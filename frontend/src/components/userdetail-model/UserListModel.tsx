import React from "react";
import { UsersInterface } from "../../interfaces/IUser";
import { useTranslation } from "react-i18next";
import "./UserListModel.css";

import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaTimes,
  FaUserFriends,
  FaStar,
} from "react-icons/fa";

interface UserListModalProps {
  open: boolean;
  users: UsersInterface[];
  onClose: () => void;
}

const UserListModal: React.FC<UserListModalProps> = ({ open, users, onClose }) => {
  const { t } = useTranslation();
  
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="user-modal">
        <div className="modal-header2">
          <div className="title-container">
            <FaUserFriends className="title-icon" />
            <h2>{t("user_detail")}</h2>
          </div>
          <button onClick={onClose} className="close-btn2">
            <FaTimes size={"20px"}/>
          </button>
        </div>
        
        <div className="modal-content">
          <div className="user-list">
            {users.map((user, index) => (
              <div key={user.ID} className="user-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="user-avatar">
                  <div className="avatar-circle">
                    <FaUser className="avatar-icon" />
                  </div>
                  {index < 3 && (
                    <div className="top-user-badge">
                      <FaStar />
                    </div>
                  )}
                </div>
                
                <div className="user-info">
                  <h3>
                    {user.first_name} {user.last_name}
                  </h3>
                  
                  <div className="user-contact">
                    <div className="contact-item">
                      <FaEnvelope className="contact-icon" />
                      <span>{user.email}</span>
                    </div>
                    <div className="contact-item">
                      <FaPhone className="contact-icon" />
                      <span>{user.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="modal-footer2">
          <div className="total-users">
            Total: {users.length} users
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserListModal;