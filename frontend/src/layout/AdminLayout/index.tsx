import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { UserOutlined, FileOutlined, NotificationOutlined, ReadOutlined, BulbOutlined, RocketOutlined, WarningOutlined, DashboardOutlined, ExceptionOutlined, IeOutlined, GlobalOutlined, SafetyOutlined } from "@ant-design/icons";
import { Layout, Menu, Button, message, Typography } from "antd";
import logo from "../../assets/logo.png";
import { stopvisit, Logouts } from "../../services/https";
import Chat from "../../components/chat/chat";
import SubMenu from "antd/es/menu/SubMenu";
import Swal from "sweetalert2";

const { Header, Content, Footer, Sider } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const Logout = async () => {
    try {
      await stopvisit();
      await Logouts();
      localStorage.setItem("isLoggedIn", "false");
      await Swal.fire({
        icon: "success",
        title: "ออกจากระบบสำเร็จ",
        text: "กำลังเปลี่ยนเส้นทาง...",
        timer: 1800,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      messageApi.error("Logout failed");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {contextHolder}
      
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ textAlign: "center", padding: 20 }}>
          <img src={logo} alt="Logo" style={{ width: "80%" }} />
        </div>

        <Menu theme="dark" mode="inline">
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            <Link to="/admin">แดชบอร์ด</Link>
          </Menu.Item>
          <Menu.Item key="customer" icon={<UserOutlined />}>
            <Link to="/admin/customer">ข้อมูลสมาชิก</Link>
          </Menu.Item>
          <Menu.Item key="file" icon={<FileOutlined />}>
            <Link to="/admin/file">ไฟล์</Link>
          </Menu.Item>
          <Menu.Item key="announce" icon={<NotificationOutlined />}>
            <Link to="/admin/announcement">ประกาศ</Link>
          </Menu.Item>
          <Menu.Item key="activity" icon={<RocketOutlined />}>
            <Link to="/admin/activity">กิจกรรม</Link>
          </Menu.Item>
          <Menu.Item key="itknowledge" icon={<BulbOutlined />}>
            <Link to="/admin/it-knowledge">ข่าวสารไอที</Link>
          </Menu.Item>
          <Menu.Item key="security" icon={<SafetyOutlined />}>
            <Link to="/admin/security">ข่าวสารด้านความปลอดภัย</Link>
          </Menu.Item>
          <Menu.Item key="article" icon={<ReadOutlined />}>
            <Link to="/admin/article">บทความ</Link>
          </Menu.Item>
          <Menu.Item key="regulation" icon={<WarningOutlined />}>
            <Link to="/admin/regulation">ระเบียบข้อบังคับ</Link>
          </Menu.Item>
          
          <SubMenu key="links" icon={<IeOutlined />} title = "ลิงก์ & เว็บไซต์">
            <Menu.Item key="central" icon={<GlobalOutlined />}>
              <Link to="/admin/central-web">Central Web</Link>
            </Menu.Item>
            <Menu.Item key="Section Web" icon={<GlobalOutlined />}>
              <Link to="/admin/section-web">Section Web</Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu key="logs" icon={<ExceptionOutlined />} title = "log">
            <Menu.Item key="visitor" icon={<ExceptionOutlined />}>
              <Link to="/admin/log-visitor">Visitor logs</Link>
            </Menu.Item>
            <Menu.Item key="pagevisitor" icon={<ExceptionOutlined />}>
              <Link to="/admin/log-page-visitor">Page visit logs</Link>
            </Menu.Item>
            <Menu.Item key="user_socket" icon={<ExceptionOutlined />}>
              <Link to="/admin/log-user-socket">User socket logs</Link>
            </Menu.Item>
            <Menu.Item key="message_socket" icon={<ExceptionOutlined />}>
              <Link to="/admin/log-message">Message logs</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>

        <Button onClick={Logout} style={{ margin: 10, width: "90%" }}>
          ออกจากระบบ
        </Button>
      </Sider>

      <Layout>
        <Header style={{ backgroundColor: "#fff", padding: "0 20px" }}>
          <Typography.Text strong style={{ fontSize: "18px" }}>
            📌 Admin Panel
          </Typography.Text>
        </Header>

        <Content style={{ margin: "16px", padding: 24, background: "#303248" }}>
          <Outlet />
        </Content>

        <Footer style={{ textAlign: "center" }}>
          Copyright © 2024 TSUBAKIMOTO AUTOMOTIVE (THAILAND) Co,.Ltd
        </Footer>
      </Layout>
      <Chat isLoggedIn={localStorage.getItem("isLoggedIn") === "true"} />
    </Layout>
  );
};

export default AdminLayout;