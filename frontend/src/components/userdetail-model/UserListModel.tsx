import React from "react";
import { Modal, List, Avatar, Divider } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { UsersInterface } from "../../interfaces/IUser";
import { useTranslation } from "react-i18next";

interface UserListModalProps {
  open: boolean;
  users: UsersInterface[];
  onClose: () => void;
}

const UserListModal: React.FC<UserListModalProps> = ({ open, users, onClose }) => {
  const { t } = useTranslation();
  return (
    <Modal
      title={<span style={{ color: "white" }}>{t("user_detail")}</span>}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      styles={{
        content: { backgroundColor: "#001529", borderRadius: "10px" },
        header: { backgroundColor: "#002244", color: "white" },
      }}
    >
      <List
        dataSource={users}
        renderItem={(user) => (
          <>
            <List.Item
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "10px", 
                padding: "10px",
                backgroundColor: "#003366",
                borderRadius: "8px"
              }}
            >
              <Avatar 
                icon={<UserOutlined />} 
                size="large" 
                style={{ backgroundColor: "#1890ff" }} 
              />
              <div style={{ flexGrow: 1, color: "white" }}>
                <strong>{user.first_name} {user.last_name}</strong>
                <div style={{ fontSize: "12px", color: "#aad4ff" }}>{user.email}</div>
                <div style={{ fontSize: "12px", color: "#aad4ff" }}>{user.phone}</div>
              </div>
            </List.Item>
            <Divider style={{ margin: "8px 0", backgroundColor: "#1890ff" }} />
          </>
        )}
      />
    </Modal>
  );
};

export default UserListModal;