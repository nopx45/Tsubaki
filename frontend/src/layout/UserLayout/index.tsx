import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button, Form, Input, Layout, Menu, message, Modal, Typography} from "antd";
import { GlobalOutlined, SearchOutlined, SolutionOutlined, BulbOutlined,
CloseOutlined, UserOutlined, SafetyOutlined, 
ExportOutlined,
LogoutOutlined,
LoginOutlined, 
GoogleOutlined,
TranslationOutlined,
CommentOutlined,
EnvironmentOutlined} from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import headerlogo from "../../assets/header.jpg"
import SubMenu from "antd/es/menu/SubMenu";
import { getAuthToken, GetLinks, GetNUsers, GetPopupImages, GetSections, GetTotalVisitors, Logouts, stopvisit, UploadPopupImages, apiUrl } from "../../services/https";
import { LinksInterface } from "../../interfaces/ILink";
import { SectionsInterface } from "../../interfaces/ISection";
import { UsersInterface } from "../../interfaces/IUser";
import UserListModal from "../../components/userdetail-model/UserListModel";
import RegulationModal from "../../pages/userpages/regulation";
import AppHeader from "../../components/traslation/header";
import { useTranslation } from "react-i18next";
import ChatComponent from "../../components/chat-component/chat";
import CustomCalendar from "../../components/carlendar/Carlendar";
import Swal from "sweetalert2";

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

  const [openKeys, setOpenKeys] = useState<string[]>(["link", "other-web"]);

  // Popup welcome
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [imgpopup, setImgPopup] = useState<string>("")

  // search user value
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState<UsersInterface[]>([]);
  const [visitors, setVisitors] = useState<number>(0);
  const [matchedUsers, setMatchedUsers] = useState<UsersInterface[]>([]);
  const [isListVisible, setIsListVisible] = useState(false);
  const [isRegulationModalVisible, setIsRegulationModalVisible] = useState(false);

  const checkLoginAndShowPopup = async () => {
    const token = await getAuthToken();
    const loggedIn = Boolean(token); 

    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      setIsPopupVisible(true);
    } else {
      setIsLoggedIn(false);
      setIsPopupVisible(false);
    }
  };

  const Logout = async () => {
    try {
      await stopvisit();
      await Logouts();
      localStorage.setItem("isLoggedIn", "false");
      setIsLoggedIn(false);
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
        name: item.name,
        link_url: item.link_url,
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
    const fetchPopup = async () => {
      const res = await GetPopupImages();
      console.log(res)
      if (res.success) {
        setImgPopup(`${apiUrl}${res.image}`);
        console.log(imgpopup)
      } else {
        console.error(res.error);
      }
    };
  
    fetchPopup();

    const fetchData = async () => {
      await getLinks();
      await getSections();
      await getnUsers();
      await getTotalVisitors();
      await getAuthToken();
      await checkLoginAndShowPopup();
    };
    fetchData();

    const fetchRole = async () => {
          try {
            const token = await getAuthToken();
            if (token) {
              // decode token หรือดึง profile จาก API
              const payload = JSON.parse(atob(token.split(".")[1]));
              setUserRole(payload?.role ?? null);
            }
          } catch (err) {
            console.error("Error decoding token:", err);
          }
        };
        fetchRole();
  }, []);

  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
  
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
  
      const result = await UploadPopupImages(file);
      if (result.success) {
        setImgPopup(result.path); // อัปเดตรูป popup
        Swal.fire("สำเร็จ", result.message, "success");
      } else {
        Swal.fire("ผิดพลาด", result.error, "error");
      }
    };
  };

  
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

    if (foundUser.length >= 1) {
      setMatchedUsers(foundUser);
      setIsListVisible(true);
    } else {
      setMatchedUsers([]);
      await Swal.fire({
        icon: "error",
        title: "ไม่พบผู้ใช้",
        text: "กรุณากรอกผู้ใช้ที่มีในระบบ...",
        timer: 1800,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    }
  };
  const [form] = Form.useForm();

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
        <img src={imgpopup} alt="Welcome" style={{ width: "100%" }} />
        {(userRole === "admin" || userRole === "adminhr" || userRole === "adminit") && (
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <Button onClick={handleImageUpload} type="primary">
              📤 อัปโหลดรูปภาพใหม่
            </Button>
          </div>
        )}
      </Modal>
      <AppHeader />
      <Layout style={{background: "transparent", backdropFilter: "blur(10px)"}}>
        <Sider style={{lineHeight: '100px',backgroundColor: "rgba(0, 21, 41, 0.9)"}} collapsible collapsed={collapsed} onCollapse={setCollapsed}
          width={250}
        >
          <Menu
            openKeys={openKeys}
            onOpenChange={(keys) => setOpenKeys(keys)}
            theme="dark"
            style={{ backgroundColor: "rgba(0, 21, 41, 0.4)" }}
            mode="inline"
          >
            <SubMenu
              key={"link"}
              icon={<GlobalOutlined style={{ 
                color: "#1890ff",
                fontSize: "16px",
                transition: "all 0.3s ease",
              }} />}
              title={
                <div style={{ 
                  display: "flex",
                  alignItems: "center", 
                  height: "100%", 
                  paddingLeft: 0, 
                  color: "white" 
                }}>
                  <Title level={5} style={{ margin: 0, color: "white" }}>
                  {t("centralweb")}
                  </Title>
                </div>
              }
              style={{
                borderBottom: "1px solid #00a0a0",
                borderRadius: "0px",
                margin: "0 8px",
                padding: "8px 0",
              }}
              popupClassName="custom-submenu"
            >
              {links && links.length > 0 ? (
                links.map((item, index) => (
                  <Menu.Item
                    key={item.ID}
                    style={{
                      backgroundColor: index % 2 === 0 ? 'rgb(206, 231, 240)' : 'rgb(255, 255, 255)',
                      borderRadius: "8px",
                      margin: "4px 8px",
                      padding: "8px 16px 8px 20px",
                      position: "relative",
                      transition: "all 0.3s ease",
                      borderLeft: "4px solid #1890ff",
                      color: index % 2 === 0 ? '#2f54eb' : '#1890ff',
                      fontWeight: 500,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
                    }}
                    className="custom-menu-item"
                  >
                    <a href={item.link_url} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "inherit",
                        textDecoration: "none"
                      }}
                      >
                      <span style={{ position: "relative" }}>
                        {item.name}
                        {/* เอฟเฟกต์ขีดเส้นใต้เมื่อโฮเวอร์ */}
                        <span className="link-underline" style={{
                          position: "absolute",
                          bottom: "-2px",
                          left: 0,
                          width: "0%",
                          height: "2px",
                          backgroundColor: "#1890ff",
                          transition: "width 0.3s ease"
                        }}></span>
                      </span>
                      <ExportOutlined style={{ 
                        fontSize: "14px", 
                        marginLeft: "8px",
                        opacity: 0.7,
                        transition: "all 0.3s ease"
                      }} />
                    </a>
                  </Menu.Item>
                  ))
                ) : (
                <Menu.Item key="no-links" disabled>
                  {t("nodata")}
                </Menu.Item>
              )}
            </SubMenu>
            </Menu>
            <Menu
            openKeys={openKeys}
            onOpenChange={(keys) => setOpenKeys(keys)}
            theme="dark"
            style={{ backgroundColor: "rgba(0, 21, 41, 0.4)" }}
            mode="inline"
          >
            <SubMenu
              key="Section"
              icon={<GlobalOutlined style={{ 
                color: "#1890ff",
                fontSize: "16px",
                transition: "all 0.3s ease",
              }} />}
              title={
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  height: "100%", 
                  paddingLeft: 0, 
                  color: "#e6fffb",
                  transition: "all 0.3s ease"
                }} className="section-title">
                  <Title level={5} style={{ 
                    margin: 0, 
                    color: "#e6fffb",
                    fontWeight: 500,
                    textShadow: "0 0 5px rgba(0, 255, 255, 0.3)"
                  }}>
                    {t("section")}
                  </Title>
                </div>
              }
              style={{
                borderBottom: "1px solid #00a0a0",
                borderRadius: "0px",
                margin: "0 8px",
                padding: "8px 0",
              }}
              popupClassName="custom-submenu"
            >
              {categories.map((category) => (
                <SubMenu 
                  key={category} 
                  title={
                    <span style={{ 
                      display: "flex",
                      alignItems: "center",
                      color: "#b5f5ec",
                      fontWeight: 500
                    }}>
                      <SolutionOutlined style={{ 
                        marginRight: "12px",
                        color: "#11beff",
                        fontSize: "16px"
                      }} />
                      {category}
                    </span>
                  } 
                  style={{
                    backgroundColor: "rgba(52, 142, 206, 0.2)",
                    color: "#b5f5ec",
                    borderRadius: "6px",
                    margin: "4px 0",
                    borderLeft: "3px solid #1890ff",
                    transition: "all 0.3s ease"
                  }}
                  popupClassName="custom-submenu-popup"
                >
                  {sections[category] && sections[category].length > 0 ? (
                    sections[category].map((link, index) => (
                      <Menu.Item 
                        key={`${category}-${index}`} 
                        style={{
                          backgroundColor: index % 2 === 0 ? 'rgb(206, 231, 240)' : 'rgb(255, 255, 255)',
                          borderRadius: "4px",
                          margin: "4px 8px",
                          padding: "8px 16px 8px 20px",
                          position: "relative",
                          transition: "all 0.3s ease",
                          borderLeft: "3px solid #1890ff",
                          color: index % 2 === 0 ? '#2f54eb' : '#1890ff',
                          fontWeight: 500,
                        }}
                        className="custom-menu-item"
                      >
                        <a 
                          href={link.link_url}
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            color: "inherit",
                            textDecoration: "none"
                          }}
                        >
                          <span style={{ position: "relative" }}>
                            {link.name_link}
                            {/* เอฟเฟกต์ขีดเส้นใต้เมื่อโฮเวอร์ */}
                            <span className="link-underline" style={{
                              position: "absolute",
                              bottom: "-2px",
                              left: 0,
                              width: "0%",
                              height: "2px",
                              backgroundColor: "#36cfc9",
                              transition: "width 0.3s ease"
                            }}></span>
                          </span>
                          <ExportOutlined style={{ 
                          fontSize: "14px", 
                          marginLeft: "8px",
                          opacity: 0.7,
                          transition: "all 0.3s ease" }} />
                        </a>
                      </Menu.Item>
                    ))
                  ) : (
                    <Menu.Item 
                      key={`${category}-empty`} 
                      disabled
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        color: "#8c8c8c",
                        fontStyle: "italic",
                        borderRadius: "4px"
                      }}
                    >
                      {t("nodata")}
                    </Menu.Item>
                  )}
                </SubMenu>
              ))}
            </SubMenu>
            <SubMenu
              key="other-web"
              icon={<GlobalOutlined style={{
                color: "#69c0ff",
                fontSize: "18px",
                transition: "all 0.3s ease"
              }} />}
              title={
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  height: "100%", 
                  paddingLeft: 0, 
                  color: "#e6fffb",
                  transition: "all 0.3s ease"
                }} className="section-title">
                  <Title level={5} style={{ 
                    margin: 0, 
                    color: "#e6fffb",
                    fontWeight: 500,
                    textShadow: "0 0 5px rgba(0, 255, 255, 0.3)"
                  }}>
                    {t("other_web")}
                  </Title>
                </div>
              }
              style={{
                borderBottom: "1px solid #00a0a0",
                borderRadius: "0px",
                margin: "0 8px",
                padding: "8px 0",
              }}
              popupClassName="custom-submenu"
              onTitleMouseEnter={(e) => {
                const target = e.domEvent.currentTarget as HTMLElement;
                target.style.background = "rgba(24, 144, 255, 0.1)";
                const arrow = target.querySelector('.anticon-arrow-right') as HTMLElement;
                if (arrow) {
                  arrow.style.transform = "translateX(3px)";
                }
              }}
              
              onTitleMouseLeave={(e) => {
                const target = e.domEvent.currentTarget as HTMLElement;
                target.style.background = "transparent";
                const arrow = target.querySelector('.anticon-arrow-right') as HTMLElement;
                if (arrow) {
                  arrow.style.transform = "translateX(0)";
                }
              }}              
            >
              {[
                { 
                  key: "google", 
                  url: "https://www.google.com", 
                  name: "Google", 
                  icon: <GoogleOutlined />,
                  color: "#4285F4"
                },
                { 
                  key: "google-translate", 
                  url: "https://translate.google.co.th/?sl=en&tl=th&op=translate", 
                  name: "Google Translate", 
                  icon: <TranslationOutlined />,
                  color: "#34a853"
                },
                { 
                  key: "chatgpt", 
                  url: "https://chatgpt.com", 
                  name: "ChatGPT", 
                  icon: <CommentOutlined />,
                  color: "#10a37f"
                },
                { 
                  key: "google-map", 
                  url: "https://maps.google.com/maps/dir/?entry=wc", 
                  name: "Google Map", 
                  icon: <EnvironmentOutlined />,
                  color: "#1a73e8"
                }
              ].map((item, index) => (
                <Menu.Item
                  key={item.key}
                  style={{
                    backgroundColor: index % 2 === 0 ? 'rgba(230, 247, 255, 0.15)' : 'rgba(111, 207, 255, 0.15)',
                    borderRadius: "6px",
                    margin: "4px 8px",
                    padding: "8px 16px 8px 50px",
                    position: "relative",
                    transition: "all 0.3s ease",
                    borderLeft: `3px solid ${item.color}`
                  }}
                  className="other-web-item"
                >
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: index % 2 === 0 ? '#d2fffe' : '#6aecf3',
                      textDecoration: "none",
                      fontWeight: 400
                    }}
                  >
                    <span style={{
                      position: "absolute",
                      left: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "24px",
                      height: "24px",
                      borderRadius: "4px",
                      backgroundColor: `${item.color}20`,
                      color: item.color
                    }}>
                      {React.cloneElement(item.icon, { 
                        style: { 
                          fontSize: "16px",
                          transition: "all 0.3s ease"
                        } 
                      })}
                    </span>
                    
                    {item.name}
                    
                    <ExportOutlined style={{
                      fontSize: "14px",
                      marginLeft: "auto",
                      opacity: 0.7,
                      color: "skyblue",
                      transition: "all 0.3s ease"
                    }} />
                  </a>
                </Menu.Item>
              ))}
            </SubMenu>
          </Menu>
          {/* layout ข้างขวามือ */}
        </Sider>
        <Content style={{ margin: "16px", borderRadius: 60 , padding: 24, backgroundColor: "rgba(98, 187, 247, 0.3)" }}>
          <Outlet />
        </Content>
        <Sider theme="dark" style={{ backgroundColor: "rgba(0, 21, 41, 0.9)" }} collapsible width={270}>
        <Button 
            onClick={handleAuthClick}
            style={{ 
              margin: "10px 5px", 
              width: "90%",
              height: "40px",
              borderRadius: "6px",
              border: "none",
              fontWeight: 500,
              fontSize: "15px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              // เงื่อนไขสีตามสถานะการล็อกอิน
              backgroundColor: isLoggedIn ? "#ff4d4f" : "#1890ff",
              color: "white",
              // เอฟเฟกต์กราดิเอนต์เมื่อโฮเวอร์
              backgroundImage: isLoggedIn 
                ? "linear-gradient(to right, #ff4d4f, #ff7875)" 
                : "linear-gradient(to right, #1890ff, #69c0ff)"
            }}
            className="auth-button"
            icon={
              isLoggedIn ? (
                <LogoutOutlined style={{ fontSize: "16px" }} />
              ) : (
                <LoginOutlined style={{ fontSize: "16px" }} />
              )
            }
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = isLoggedIn 
                ? "0 6px 12px rgba(255, 77, 79, 0.3)" 
                : "0 6px 12px rgba(24, 144, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.98)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
          >
            {isLoggedIn ? (
              <span style={{ marginLeft: "8px" }}>{t("logout")}</span>
            ) : (
              <span style={{ marginLeft: "8px" }}>{t("login")}</span>
            )}
          </Button>
          <Menu theme="dark" style={{ 
                borderRight: "1px solid #00b4b4", 
                boxShadow: "0 0 15px rgba(0, 180, 180, 0.3)"
              }} mode="inline">
          <div 
            style={{
              margin: 5, 
              display: "flex",
              alignItems: "center",
              width: "90% ",
              height: "3%",
              padding: "8px 12px",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(24, 144, 255, 0.1)",
              transition: "all 0.3s ease",
              borderLeft: "3px solid #1890ff",
              gap: "30%"
            }}
            className="compact-visitor-card"
          >
            {/* ไอคอนผู้ใช้ */}
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#e6f7ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              border: "1px solid #1890ff"
            }}>
              <UserOutlined style={{ 
                fontSize: "14px", 
                color: "#1890ff"
              }} />
            </div>

            {/* ข้อมูลผู้เยี่ยมชม */}
            <div style={{ 
              display: "flex",
              alignItems: "baseline",
            }}>
              <span style={{
                fontSize: "24px",
                color: "#096dd9",
                fontWeight: 600,
                marginRight: 20,
              }}>
                {visitors.toLocaleString()}
              </span>
              <span style={{
                fontSize: "18px",
                color: "#595959",
              }}>
                {t("visit")}
              </span>
            </div>
          </div>
          </Menu>
          <Menu theme="dark" style={{ 
                borderRight: "1px solid #00b4b4", 
                boxShadow: "0 0 15px rgba(0, 180, 180, 0.3)"
              }} mode="inline">
            {/* ค้นหาผู้ใช้ */}
            <Menu.Item 
              key="search-user" 
              style={{ 
                height: "auto", 
                width: "90%",
                padding: "5px",
                backgroundColor: "rgba(24, 144, 255, 0.05)",
                borderBottom: "1px solid #00a0a0",
                borderRadius: "0",
                transition: "all 0.3s ease"
              }}
              className="custom-menu-popup"
            >
              <div style={{ 
                width: "100%",
                padding: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(9, 109, 217, 0.1)"
              }}>
                <Title 
                  level={5} 
                  style={{ 
                    color: "#096dd9",
                    textAlign: "center", 
                    marginBottom: "16px",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  <SearchOutlined style={{ color: "#1890ff" }} />
                  {t("search_user")}
                </Title>
                
                <Form
                  form={form}
                  onFinish={handleSearch} 
                  style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    textAlign: "center",
                    gap: "12px"
                  }}
                >
                  <Input
                    placeholder={t("search_user")}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{ 
                      marginBottom: "0",
                      borderRadius: "6px",
                      border: "1px solid #d9d9d9",
                      padding: "8px 12px",
                      transition: "all 0.3s ease"
                    }}
                    className="search-input"
                  />
                  
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SearchOutlined />} 
                    style={{ 
                      width: "100%",
                      height: "40px",
                      backgroundColor: "#1890ff",
                      borderColor: "#1890ff",
                      borderRadius: "6px",
                      fontWeight: 500,
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                    className="search-button"
                  >
                    {t("search")}
                  </Button>
                </Form>
              </div>
            </Menu.Item>
            <>
              {/* Regulation Menu Item */}
              <Menu.Item 
                style={{
                  backgroundColor: "rgba(24, 144, 255, 0.1)",
                  borderBottom: "1px solid rgba(24, 144, 255, 0.3)",
                  borderRadius: "8px",
                  margin: "12px 8px",
                  padding: "12px 16px",
                  transition: "all 0.3s ease",
                }}
                className="custom-menu-item regulation-item"
                key="regulation" 
                icon={
                  <SolutionOutlined style={{
                    color: "#1890ff",
                    fontSize: "22px",
                    transition: "all 0.3s ease"
                  }} />
                }
              >
                <div 
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "12px",
                    cursor: "pointer"
                  }}
                  onClick={() => setIsRegulationModalVisible(true)}
                >
                  <Title level={5} style={{ 
                    color: "#79d9ff", 
                    margin: 0,
                    fontWeight: 400,
                    transition: "all 0.3s ease"
                  }}>
                    {t("regulation")}
                  </Title>
                </div>
              </Menu.Item>

              {/* IT Knowledge Menu Item */}
              <Menu.Item 
                style={{
                  backgroundColor: "rgba(24, 144, 255, 0.1)",
                  borderBottom: "1px solid rgba(24, 144, 255, 0.2)",
                  borderRadius: "8px",
                  margin: "12px 8px",
                  padding: "12px 16px",
                  transition: "all 0.3s ease",
                }}
                className="custom-menu-item it-knowledge-item"
                key="it-knowledge" 
                icon={
                  <BulbOutlined style={{
                    color: "#faad14",
                    fontSize: "22px",
                    transition: "all 0.3s ease"
                  }} />
                }
              >
                <Link to="/it-knowledge" style={{ textDecoration: "none" }}>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "12px" 
                  }}>
                    <Title level={5} style={{ 
                      color: "#79d9ff", 
                      margin: 0,
                      fontWeight: 400,
                      transition: "all 0.3s ease"
                    }}>
                      {t("it_knowledge")}
                    </Title>
                  </div>
                </Link>
              </Menu.Item>

              {/* Security Menu Item */}
              <Menu.Item 
                style={{
                  backgroundColor: "rgba(24, 144, 255, 0.1)",
                  borderBottom: "1px solid rgba(24, 144, 255, 0.2)",
                  borderRadius: "8px",
                  margin: "12px 8px",
                  padding: "12px 16px",
                  transition: "all 0.3s ease",
                }}
                className="custom-menu-item security-item"
                key="security" 
                icon={
                  <SafetyOutlined style={{
                    color: "#52c41a",
                    fontSize: "22px",
                    transition: "all 0.3s ease"
                  }} />
                }
              >
                <Link to="/security" style={{ textDecoration: "none" }}>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "12px" 
                  }}>
                    <Title level={5} style={{ 
                      color: "#79d9ff", 
                      margin: 0,
                      fontWeight: 400,
                      transition: "all 0.3s ease"
                    }}>
                      {t("security")}
                    </Title>
                  </div>
                </Link>
              </Menu.Item>
            </>
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
              <CustomCalendar />
            </Menu.Item>
          </Menu>
        </Sider>
      </Layout>
      <Footer style={{ textAlign: "center", backgroundColor: "rgba(239, 239, 255, 0.9)"}}>
        <p>Copyright © 2024 TSUBAKIMOTO AUTOMOTIVE (THAILAND) Co,.Ltd</p>
        <p style={{color: '#989898'}}>Powered by Nopx</p>
      </Footer>
      {/* ✅ แสดง Modal รายละเอียดผู้ใช้ */}
      <UserListModal
        open={isListVisible}
        users={matchedUsers}
        onClose={() => setIsListVisible(false)}
      />
      <RegulationModal
        visible={isRegulationModalVisible}
        onClose={() => setIsRegulationModalVisible(false)}
      />
      <ChatComponent isLoggedIn={isLoggedIn} />
      <style>{`
              /* เอฟเฟกต์เมื่อโฮเวอร์ SubMenu หลัก */
              .section-title:hover {
                color: #36cfc9 !important;
                text-shadow: 0 0 10px rgba(54, 207, 201, 0.5) !important;
              }

              /* เอฟเฟกต์ SubMenu เมื่อโฮเวอร์ */
              .ant-menu-submenu-title:hover {
                background-color: rgba(0, 168, 168, 0.2) !important;
              }

              /* เอฟเฟกต์ Menu.Item เมื่อโฮเวอร์ */
              .custom-menu-item:hover {
                transform: translateX(5px);
                background-color: rgba(54, 207, 201, 0.25) !important;
                box-shadow: 0 2px 8px rgba(54, 207, 201, 0.2) !important;
              }

              .custom-menu-item:hover .link-underline {
                width: 100%;
              }

              .custom-menu-item:hover .anticon-export {
                opacity: 1;
                transform: translateX(3px);
              }

              /* เอฟเฟกต์เมื่อคลิก */
              .custom-menu-item:active {
                transform: scale(0.98);
              }

              /* ปรับแต่งเมนูย่อย */
              .custom-submenu-popup {
                background-color: rgba(0, 41, 41, 0.95) !important;
                border: 1px solid #00a0a0 !important;
                box-shadow: 0 0 15px rgba(0, 180, 180, 0.4) !important;
                border-radius: 8px !important;
                padding: 8px 0 !important;
              }

              .custom-submenu-popup .ant-menu-item {
                margin: 0 8px !important;
                border-radius: 4px !important;
              }

              /* เพิ่มในไฟล์ CSS หรือ style ส่วนกลาง */
             /* เอฟเฟกต์เมื่อโฮเวอร์ */
              .horizontal-visitor-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 28px rgba(24, 144, 255, 0.25);
                border-color: rgba(24, 144, 255, 0.4);
              }

              .horizontal-visitor-card:hover .anticon {
                transform: scale(1.1);
              }

              /* เอฟเฟกต์ gradient flow */
              @keyframes gradientFlow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }

              /* เอฟเฟกต์ pulse สำหรับดาว */
              @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.3); opacity: 0.7; }
                100% { transform: scale(1); opacity: 1; }
              }

              /* เอฟเฟกต์วงกลมน้ำเงินเมื่อโฮเวอร์ */
              .horizontal-visitor-card:hover::after {
                content: "";
                position: absolute;
                right: -40px;
                top: -40px;
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(24, 144, 255, 0.15) 0%, rgba(24, 144, 255, 0) 70%);
                animation: expandCircle 0.6s ease-out;
              }

              @keyframes expandCircle {
                0% { transform: scale(0.5); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
              }

              /* เอฟเฟกต์เมื่อโฮเวอร์ Menu.Item */
              .search-user-item:hover {
                background-color: rgba(24, 144, 255, 0.1) !important;
              }

              /* เอฟเฟกต์ Input */
              .search-input:hover {
                border-color: #40a9ff !important;
              }

              .search-input:focus {
                border-color: #1890ff !important;
                box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
              }

              /* เอฟเฟกต์ปุ่มค้นหา */
              .search-button:hover {
                background-color: #40a9ff !important;
                border-color: #40a9ff !important;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
              }

              .search-button:active {
                transform: translateY(0);
                background-color: #096dd9 !important;
                border-color: #096dd9 !important;
              }

              /* เอฟเฟกต์การโหลดเมื่อค้นหา */
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }

              .search-button.loading .anticon {
                animation: spin 1s linear infinite;
              }

              .custom-menu-popup {
                background-color: rgba(0, 41, 41, 0.34) !important;
                border-buttom: 1px solid #00a0a0 !important;
                box-shadow: 0 4px 15px rgba(0, 180, 180, 0.4) !important;
                border-radius: 0px !important;
                padding: 10px 0 !important;
              }

              /* เอฟเฟกต์ทั่วไปสำหรับ Menu Items */
              .custom-menu-item {
                position: relative;
                overflow: hidden;
              }

              .custom-menu-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
              }

              .custom-menu-item:active {
                transform: translateY(0);
              }

              /* เอฟเฟกต์เฉพาะสำหรับแต่ละเมนู */
              .regulation-item:hover {
                background-color: rgba(24, 144, 255, 0.2) !important;
              }

              .regulation-item:hover .anticon {
                transform: scale(1.1);
              }

              .regulation-item:hover h5 {
                color: #0050b3 !important;
              }

              .it-knowledge-item:hover {
                background-color: rgba(250, 173, 20, 0.1) !important;
              }

              .it-knowledge-item:hover .anticon-bulb {
                color: #ffc53d !important;
                transform: rotate(10deg);
              }

              .security-item:hover {
                background-color: rgba(82, 196, 26, 0.1) !important;
              }

              .security-item:hover .anticon-safety {
                color: #73d13d !important;
                transform: scale(1.1);
              }

              /* เอฟเฟกต์เส้นขอบเมื่อโฮเวอร์ */
              .custom-menu-item::after {
                content: "";
                position: absolute;
                bottom: 0;
                left: 0;
                width: 0;
                height: 2px;
                background: linear-gradient(90deg, #1890ff, #69c0ff);
                transition: width 0.3s ease;
              }

              .custom-menu-item:hover::after {
                width: 100%;
              }

              /* เอฟเฟกต์พื้นหลังเมื่อโฮเวอร์ */
              .custom-menu-item:hover::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(
                  135deg,
                  rgba(24, 144, 255, 0.05),
                  rgba(105, 192, 255, 0.05)
                );
                z-index: -1;
              }

              /* เอฟเฟกต์ SubMenu เมื่อโฮเวอร์ */
              .other-web-title:hover {
                background-color: rgba(24, 144, 255, 0.1) !important;
              }

              .other-web-title:hover .anticon {
                color: #1890ff !important;
              }

              .other-web-title:hover h5 {
                text-shadow: 0 0 12px rgba(105, 192, 255, 0.5) !important;
              }

              /* เอฟเฟกต์ Menu Items */
              .other-web-item:hover {
                transform: translateX(5px);
                box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
                background-color: rgba(24, 144, 255, 0.2) !important;
              }

              .other-web-item:hover .anticon {
                transform: scale(1.1);
              }

              .other-web-item:hover .anticon-export {
                opacity: 1 !important;
                transform: translateX(3px);
              }

              /* เอฟเฟกต์ไอคอนวงกลม */
              .other-web-item:hover a span:first-child {
                background-color: rgba(24, 144, 255, 0.3) !important;
                transform: scale(1.1);
              }

              /* เอฟเฟกต์ Popup */
              .other-web-popup {
                background-color: rgba(0, 21, 41, 0.95) !important;
                border: 1px solid rgba(24, 144, 255, 0.3) !important;
                box-shadow: 0 8px 24px rgba(0, 105, 255, 0.2) !important;
                border-radius: 8px !important;
                padding: 8px !important;
              }

              .other-web-popup .ant-menu-item {
                margin: 4px 0 !important;
                border-radius: 6px !important;
              }

              /* เอฟเฟกต์เส้นขอบเมื่อโฮเวอร์ */
              .other-web-item::after {
                content: "";
                position: absolute;
                bottom: 0;
                left: 0;
                width: 0;
                height: 2px;
                background: linear-gradient(90deg, #1890ff, #69c0ff);
                transition: width 0.3s ease;
              }

              .other-web-item:hover::after {
                width: 100%;
              }
            `}</style>
    </Layout>
  );
};

export default UserLayout;