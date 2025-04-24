import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { DashboardOutlined, ReadOutlined, SafetyOutlined } from "@ant-design/icons";
import { Layout, Menu, Button, message, Typography } from "antd";
import logo from "../../assets/logo.png";
import { Logouts, stopvisit } from "../../services/https";
import Swal from "sweetalert2";

const { Header, Content, Footer, Sider } = Layout;

const HRadminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const Logout = async () => {
    try {
      await stopvisit();
      await Logouts();
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
          <Menu.Item key="it-knowledge" icon={<ReadOutlined />}>
            <Link to="/admin/it-knowledge">ข่าวสารไอที</Link>
          </Menu.Item>
          <Menu.Item key="popupimages" icon={<ReadOutlined />}>
            <Link to="/admin/popup-images">รูปภาพป๊อบอัพ</Link>
          </Menu.Item>          
          <Menu.Item key="security" icon={<SafetyOutlined />}>
            <Link to="/admin/security">ข่าวสารด้านความปลอดภัย</Link>
          </Menu.Item>
        </Menu>

        <Button onClick={Logout} style={{ margin: 10, width: "90%" }}>
          ออกจากระบบ
        </Button>
      </Sider>

      <Layout>
        <Header style={{ backgroundColor: "#fff", padding: "0 20px" }}>
          <Typography.Text strong style={{ fontSize: "18px" }}>
            📌 IT Admin Panel
          </Typography.Text>
        </Header>

        <Content style={{ margin: "16px", padding: 24, background: "#fff" }}>
          <Outlet />
        </Content>

        <Footer style={{ textAlign: "center" }}>
          Copyright © 2024 TSUBAKIMOTO AUTOMOTIVE (THAILAND) Co,.Ltd
          <a>Design & Developed by Nopx</a>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default HRadminLayout;