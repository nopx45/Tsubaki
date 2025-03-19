import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { ReadOutlined } from "@ant-design/icons";
import { Layout, Menu, Button, message, Typography } from "antd";
import logo from "../../assets/logo.png";
import { Logouts, stopvisit } from "../../services/https";

const { Header, Content, Footer, Sider } = Layout;

const HRadminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const Logout = async () => {
    try {
      await stopvisit();
      await Logouts();
      messageApi.success("Logout successful");
      setTimeout(() => {
        location.href = "/signin";
      }, 2000);
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
          <Menu.Item key="it-knowledge" icon={<ReadOutlined />}>
            <Link to="/admin/it-knowledge">ข่าวสารไอที</Link>
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
        </Footer>
      </Layout>
    </Layout>
  );
};

export default HRadminLayout;