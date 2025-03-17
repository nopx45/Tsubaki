import React from "react";
import { Modal, Button, Card, Typography, Divider } from "antd";
import { UsersInterface } from "../../interfaces/IUser"; // ✅ ใช้ UsersInterface จากโฟลเดอร์ที่ถูกต้อง
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

interface UserDetailsModalProps {
  open: boolean;
  onClose: () => void;
  user: UsersInterface | null;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ open, onClose, user }) => {
  const { t } = useTranslation();
  return (
    <Modal
      title={<Title level={3} style={{ color: "#fff", margin: 0 }}>{t("user_datail")}</Title>}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose} type="primary">
          {t("close")}
        </Button>,
      ]}
      centered
      width={500}
      styles={{ body: { backgroundColor: "#f0f5ff", borderRadius: "8px", padding: "20px" } }}
      style={{ top: 20, backgroundColor: "#1890ff" }}
    >
      {user ? (
        <Card
          variant="outlined" 
          style={{
            background: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <UserOutlined style={{ fontSize: "48px", color: "#1890ff" }} />
            <Title level={4} style={{ marginTop: "10px", color: "#1890ff" }}>
              {user.first_name} {user.last_name}
            </Title>
          </div>

          <Divider />

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Text>
              <MailOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
              <strong>{t("email")}:</strong> {user.email}
            </Text>

            <Text>
              <PhoneOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
              <strong>{t("phone")}:</strong> {user.phone}
            </Text>
          </div>
        </Card>
      ) : (
        <Text style={{ color: "red", textAlign: "center", display: "block" }}>
          {t("nodata")}
        </Text>
      )}
    </Modal>
  );
};

export default UserDetailsModal;