import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, Layout, Menu, message, Modal, Typography} from "antd";
import { GlobalOutlined, SearchOutlined, SolutionOutlined, BulbOutlined, LinkOutlined, CloseOutlined, UserOutlined } from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import headerlogo from "../../assets/header.jpg"
import SubMenu from "antd/es/menu/SubMenu";
import { GetLinks, GetNUsers, GetSections, GetTotalVisitors, Logouts, stopvisit } from "../../services/https";
import { LinksInterface } from "../../interfaces/ILink";
import { SectionsInterface } from "../../interfaces/ISection";
import { UsersInterface } from "../../interfaces/IUser";
import UserDetailsModal from "../../components/userdetail-model/UserDetailsModal"
import UserListModal from "../../components/userdetail-model/UserListModel";
import RegulationModal from "../../pages/userpages/regulation";
import AppHeader from "../../components/traslation/header";
import { useTranslation } from "react-i18next";
import ChatComponent from "../../components/chat-component/chat";

const { Content, Footer } = Layout;
const { Title } = Typography;
const categories = ["HR", "IT", "ACC", "QA", "MKT", "ME/PE", "Safety", "WH", "PC"];

const UserLayout: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [links, setLinks] = useState<LinksInterface[]>([]);
  const [sections, setSections] = useState<Record<string, SectionsInterface[]>>({});

  // Popup welcome
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // search user value
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState<UsersInterface[]>([]);
  const [visitors, setVisitors] = useState<number>(0);
  const [matchedUsers, setMatchedUsers] = useState<UsersInterface[]>([]);
  const [selectedUser, setSelectedUser] = useState<UsersInterface | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isListVisible, setIsListVisible] = useState(false);
  const [isRegulationModalVisible, setIsRegulationModalVisible] = useState(false);

  const Logout = async () => {
    try {
      await stopvisit();
      await Logouts();
      messageApi.success("Logout successful");
  
      setTimeout(() => {
        localStorage.setItem("isLoggedIn", "false");
        setIsLoggedIn(false);
        location.href = "/";
      }, 1000);
    } catch (error) {
      console.error("Logout error:", error);
      messageApi.error("Logout failed");
    }
  };
  
  const handleAuthClick = async () => {
    if (isLoggedIn) {
      await Logout();
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
    } else {
      navigate("/signin");
    }
  };

  const getnUsers = async () => {
    try {
      let response = await GetNUsers();
      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getLinks = async () => {
    let res = await GetLinks();   
    if (res.status === 200) {
      const formattedData = res.data.map((item: { ID: any; name: any; link_url: any; }) => ({
        ID: item.ID,
        Title: item.name,
        LinkUrl: item.link_url,
      }));
  
      setLinks(formattedData);
    } else {
      setLinks([]);
      messageApi.open({
        type: "error",
        content: res.data?.error || "Failed to fetch links",
      });
    }
  };

  const getSections = async () => {
    try {
      const response = await GetSections();
      if (response.status === 200) {
        const data: SectionsInterface[] = response.data;
        // จัดกลุ่มข้อมูลตามหมวดหมู่
        const groupedData: Record<string, SectionsInterface[]> = {};
        categories.forEach((category) => {
          groupedData[category] = data.filter((item) => item.name === category);
        });
        setSections(groupedData);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  const getTotalVisitors = async () => {
    try {
      let response = await GetTotalVisitors();
      if (response.status === 200) {
        setVisitors(response.data);
      }
    } catch (error) {
      console.error("Error fetching visitors:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getLinks();
      await getSections();
      await getnUsers();
      await getTotalVisitors();
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        setIsPopupVisible(true);
      }
    };
    fetchData();
  }, []);

  const handlePopupClose = () => {
    setIsPopupVisible(false);
  };
  
  const handleSearch = async () => {
    if (!searchValue.trim()) {
      message.warning("กรุณากรอกข้อมูลสำหรับค้นหา");
      return;
    }

    const foundUser = users.filter((user: UsersInterface) => {
      return (
        (user.first_name && user.first_name.toLowerCase().includes(searchValue.toLowerCase())) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchValue.toLowerCase())) ||
        (user.phone && user.phone.includes(searchValue)) ||
        (user.email && user.email.toLowerCase().includes(searchValue.toLowerCase()))
      );
    });

    if (foundUser.length > 1) {
      setMatchedUsers(foundUser);
      setIsListVisible(true);
    } else if (foundUser.length === 1) {
      setSelectedUser(foundUser[0]);
      setIsModalVisible(true);
    } else {
      setMatchedUsers([]);
      setSelectedUser(null);
      messageApi.open({
        type: 'error',
        content: 'ไม่พบผู้ใช้',
      });

    }
  };
  const [form] = Form.useForm();
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setIsListVisible(false);
    setSearchValue("");
    setMatchedUsers([]);
    setSelectedUser(null);
    setSearchValue("");
    setMatchedUsers([]);
    setSelectedUser(null);
    form.resetFields();
  };

  return (
    <Layout
    style={{
        minHeight: "100vh",
        backgroundImage: `url(${headerlogo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: isPopupVisible ? "blur(10px)" : "none",
        transition: "filter 0.3s ease-in-out",
      }}
    >
      {contextHolder}

      <Modal
        open={isPopupVisible}
        onCancel={handlePopupClose}
        footer={null}
        centered
        width={"50%"}
        closable={false}
      >
        <Button
          onClick={handlePopupClose}
          shape="circle"
          icon={<CloseOutlined style={{ fontSize: "15px", color: "white" }} />}
          style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "40px",
            height: "40px",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            border: "none",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 0, 0, 0.8)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.7)")}
        />
        <img src="http://localhost:8080/uploads/images/article/e.g.infographic-1536x1409.png.webp" alt="Welcome" style={{ width: "100%" }} />
      </Modal>
      <AppHeader />
      <Layout style={{background: "transparent", backdropFilter: "blur(10px)"}}>
        <Sider style={{lineHeight: '100px',backgroundColor: "rgba(0, 21, 41, 0.9)"}} collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <Menu theme="dark" style={{ backgroundColor: "rgba(0, 21, 41, 0.4)" }} mode="inline">
            <SubMenu
              key="link"
              icon={<GlobalOutlined />}
              title={
                <div style={{ 
                  display: "flex",
                  alignItems: "center", 
                  height: "100%", 
                  paddingLeft: "10px", 
                  color: "white" 
                }}>
                  <Title level={5} style={{ margin: 0, color: "white" }}>
                  {t("weblink")}
                  </Title>
                </div>
              }
              style={{ borderBottom: "1px solid #999999", borderRadius: "0px", color: "#fffff" }}
            >
              {links && links.length > 0 ? (
                links.map((item) => (
                  <Menu.Item
                    key={item.ID}
                    style={{
                      backgroundColor: "rgba(0, 21, 41, 0.5)",
                      borderRadius: "0px",
                      paddingLeft: "60px",
                    }}
                  >
                    <a href={item.LinkUrl} target="_blank" rel="noopener noreferrer">
                      {item.Title}
                    </a>
                  </Menu.Item>
                ))
              ) : (
                <Menu.Item key="no-links" disabled>
                  {t("nodata")}
                </Menu.Item>
              )}
            </SubMenu>
            <SubMenu
              key="Section"
              icon={<GlobalOutlined />}
              title={
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  height: "100%", 
                  paddingLeft: "10px", 
                  color: "white" 
                }}>
                  <Title level={5} style={{ margin: 0, color: "white" }}>
                  {t("section")}
                  </Title>
                </div>
              }
              style={{borderBottom: "1px solid #999999", borderRadius: "0px", color: "#fffff" }}
            >
              {categories.map((category) => (
                <SubMenu key={category} title={category} style={{backgroundColor: "rgba(83, 92, 192, 0.26)", color:"white",borderRadius:"0px"}} icon={<SolutionOutlined />}>
                  {sections[category] && sections[category].length > 0 ? (
                    sections[category].map((link, index) => (
                      <Menu.Item key={`${category}-${index}`} icon={<LinkOutlined />} style={menustype1}>
                        <a href={link.link_url} target="_blank" rel="noopener noreferrer">
                          {link.name_link}
                        </a>
                      </Menu.Item>
                    ))
                  ) : (
                    <Menu.Item key={`${category}-empty`} disabled>
                      {t("nodata")}
                    </Menu.Item>
                  )}
                </SubMenu>
              ))}
            </SubMenu>
          </Menu>
          <Button onClick={handleAuthClick} style={{ margin: 10, width: "90%" }}>
          {isLoggedIn ? t("logout") : t("login")}
          </Button>

          <Card
            style={{
              marginTop: "auto",
              borderRadius: "0",
              border: "10px solid rgb(6, 36, 70)",
              backgroundColor: "#fff",
              textAlign: "center",
              cursor: "default"
            }}
            hoverable
            bodyStyle={{ padding: 0 }}
          >
            <div style={styles.cardContent}>
              <UserOutlined style={{ fontSize: "24px", color: "rgb(117, 117, 117)" }} />
              <h2 style={styles.visitorCount}>{visitors.toLocaleString()}</h2>
              <p style={styles.visitorText}>🌟 {t("visit")} 🌟</p>
            </div>
          </Card>
        </Sider>
        <Content style={{ margin: "16px", padding: 24, backgroundColor: "rgba(3, 11, 47, 0.82)" }}>
          <Outlet />
        </Content>
        <Sider theme="dark" style={{ backgroundColor: "rgba(0, 21, 41, 0.9)" }} collapsible>
          <Menu theme="dark" style={{ backgroundColor: "rgba(0, 21, 41, 0.4)" }}mode="inline">
            {/* ค้นหาผู้ใช้ */}
            <Menu.Item key="search-user" style={{ height: "auto", padding: "10px", backgroundColor: "rgba(0, 132, 255, 0)" }}>
              <div style={{ width: "100%" }}>
                <Title level={5} style={{ color: "white", textAlign: "center", marginBottom: "10px" }}>
                  {t("search_user")}
                </Title>
                <Form
                  form={form}
                  onFinish={handleSearch} 
                  style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    textAlign: "center", 
                    borderBottom: "1px solid #999999", 
                    paddingBottom: "10px",
                  }}
                >
                  <Input
                    placeholder={t("search_user")}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{ marginBottom: "10px" }}
                  />
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SearchOutlined />} 
                    style={{ width: "100%" }}
                  >
                  </Button>
                </Form>
              </div>
            </Menu.Item>
            <Menu.Item style={{backgroundColor: "rgba(0, 132, 255, 0)",
              borderBottom: "1px solid #999999"}} key="regulation" icon={<SolutionOutlined />}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Title level={5} style={{ color: "white", margin: 0 }} onClick={() => setIsRegulationModalVisible(true)}>
                    {t("regulation")}
                  </Title>
                </div>
            </Menu.Item>
            <Menu.Item style={{backgroundColor: "rgba(0, 132, 255, 0)",
              borderBottom: "1px solid #999999"}} key="it-knowledge" icon={<BulbOutlined />}>
              <Link to="/it-knowledge">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Title level={5} style={{ color: "white", margin: 0 }}>
                    {t("it_knowledge")}
                  </Title>
                </div>
              </Link>
            </Menu.Item>
            <SubMenu
              key="other-web"
              icon={<GlobalOutlined />}
              title={
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "white" }}>
                  <Title level={5} style={{ margin: 0, color: "white" }}>
                    {t("other_web")}
                  </Title>
                </div>
              }
              style={{ borderBottom: "1px solid #999999", borderRadius: "0px", color: "#fffff" }}
            >
              <Menu.Item
                key="google"
                style={{
                  backgroundColor: "rgba(0, 21, 41, 0.5)",
                  borderRadius: "0px",
                  paddingLeft: "30px",
                }}
              >
                <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
                  Google
                </a>
              </Menu.Item>
              <Menu.Item
                key="google-translate"
                style={{
                  backgroundColor: "rgba(0, 21, 41, 0.5)",
                  borderRadius: "0px",
                  paddingLeft: "30px",
                }}
              >
                <a href="https://translate.google.co.th/?sl=en&tl=th&op=translate" target="_blank" rel="noopener noreferrer">
                  Google Translate
                </a>
              </Menu.Item>
              <Menu.Item
                key="chatgpt"
                style={{
                  backgroundColor: "rgba(0, 21, 41, 0.5)",
                  borderRadius: "0px",
                  paddingLeft: "30px",
                }}
              >
                <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer">
                  ChatGPT
                </a>
              </Menu.Item>
              <Menu.Item
                key="google-map"
                style={{
                  backgroundColor: "rgba(0, 21, 41, 0.5)",
                  borderRadius: "0px",
                  paddingLeft: "30px",
                }}
              >
                <a href="https://maps.google.com/maps/dir/?entry=wc" target="_blank" rel="noopener noreferrer">
                  Google Map
                </a>
              </Menu.Item> 
            </SubMenu>
            <Menu.Item
              key="google-calendar"
              style={{
                backgroundColor: "rgba(0, 21, 41, 0.5)",
                borderBottom: "1px solid #999999",
                borderRadius: "0px",
                padding: 0,
                height: "auto",
                cursor: "pointer",
                overflow: "hidden"
              }}
            >
              <div style={{ transform: "scale(0.6)", transformOrigin: "top left", width: "170%", overflow: "hidden" }}>
                <iframe 
                  src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FBangkok&showPrint=0&src=YWZmYmM5ZWQwMTc2ZjVkMjY0MDhlMGI4OGUzN2IyZDVhNzgxNzJmNzk0ODdkYjUzNzJmYzQyN2U1NmFmMGJmN0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23D50000"
                  style={{
                    border: "solid 1px #777",
                    width: "100%",
                    height: "430px" // ลดความสูง
                  }}
                ></iframe>
              </div>
            </Menu.Item>
          </Menu>
        </Sider>
      </Layout>
      <Footer style={{ textAlign: "center", backgroundColor: "rgba(239, 239, 255, 0.9)"}}>
        Nopx create At 09/02/2568
      </Footer>
      {/* ✅ แสดง Modal รายละเอียดผู้ใช้ */}
      <UserDetailsModal
        open={isModalVisible}
        onClose={handleCloseModal}
        user={selectedUser}
      />
      <UserListModal
        open={isListVisible}
        users={matchedUsers}
        onClose={() => setIsListVisible(false)}
        onSelectUser={(user) => {
          setSelectedUser(user);
          setIsListVisible(false);
          setIsModalVisible(true);
        }}
      />
      <RegulationModal
        visible={isRegulationModalVisible}
        onClose={() => setIsRegulationModalVisible(false)}
      />
      <ChatComponent isLoggedIn={isLoggedIn} />
    </Layout>
  );
};
const styles = {
  cardContent: {
    padding: "10px 20px",
  },
  visitorCount: {
    fontSize: "24px",
    color: "rgb(10, 165, 255)",
    margin: "10px 0",
  },
  visitorText: {
    fontSize: "14px",
    color: "#555",
    margin: 0,
  },
};
export default UserLayout;


///////////////////   CSS Zone /////////////////////
const menustype1: React.CSSProperties = {
backgroundColor: "#001529",
borderRadius: "0px", 
paddingLeft: "30px"
};