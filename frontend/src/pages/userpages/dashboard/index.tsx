import { Badge, Button, Card, Col, Row, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnnouncementsInterface } from "../../../interfaces/IAnnouncement";
import { GetAnnouncements, DownloadFile, GetActivities, GetArticles, getAuthToken } from "../../../services/https";
import { ActivitiesInterface } from "../../../interfaces/IActivity";
import newIcon from "../../../assets/new_icon.png";
import CustomButton from "../../../components/custom-button/custom_button";
import { ArticlesInterface } from "../../../interfaces/IArticle";
import Regulations from "../../../components/ranbow-text/ranbow_text";
import { useTranslation } from "react-i18next";
const { Title, Paragraph, Text } = Typography;

export default function Announcements() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [buttons, setButtons] = useState<AnnouncementsInterface[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  // Activities
  const [activity, setActivity] = useState<ActivitiesInterface[]>([]);
  const MAX_ITEMS = 1;
  // Articles
    const [articles, setArticles] = useState<ArticlesInterface[]>([]);

  const formatThaiDateTime = (date: string | 0) => {
    if (typeof date === "number") return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Date";
    const thaiYear = d.getFullYear() + 543;
    const thaiDate = d.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).replace(/\d{4}/, thaiYear.toString());
    const thaiTime = d.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  
    return `${thaiDate} ${thaiTime}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetAnnouncements();
        setButtons(response.data);
      } catch (error) {
        console.error("Error fetching Announcement:", error);
      }
    };
    fetchData();
    const fetchActivity = async () => {
      try {
        const response = await GetActivities();
        setActivity(response.data);
      } catch (error) {
        console.error("Error fetching Activities:", error);
      }
    };
    fetchActivity();
    const fetchArticles = async () => {
      try {
        const response = await GetArticles();
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetchArticles();
  }, []);

  const handleMoreClick = () => {
    navigate("/announcement");
  };
  const handleMoreActClick = () => {
    navigate("/activity");
  };
  const handleMoreArtClick = () => {
    navigate("/article");
  };
  const handleActivityClick = (id: number) => {
    navigate(`/activity/detail/${id}`);
  };
  const handleArticleClick = (id: number) => {
    navigate(`/article/detail/${id}`);
  };

  return (
    <>
    {contextHolder}
      <Row gutter={[16, 16]}>
        <Col span={24}>
        <Card
          style={{
            background: "#ffff",
            padding: "10px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
          }}
        >
      <Regulations text={t("announcement")} />
      <Row gutter={[16, 16]} justify="start">
        {buttons.slice(-16).reverse().map((item, index) => {
          const isNew = index === 0;
          return (
            <Col key={index} xs={24} sm={16} md={12} lg={6}>
              <Button
                type="primary"
                block
                style={{
                  backgroundImage: "linear-gradient(90deg,rgb(134, 185, 252),rgb(0, 108, 180),rgb(134, 185, 252))",
                  borderRadius: "6px",
                  boxShadow: "0px 8px 16px rgba(11, 96, 255, 0.8)",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  setHoveredId(index);
                  e.currentTarget.style.transform = "translate(-5px, -5px)";
                  e.currentTarget.style.boxShadow = "0px 10px 20px rgba(43, 107, 226, 0.8)";
                }}
                onMouseLeave={(e) => {
                  setHoveredId(null);
                  e.currentTarget.style.transform = "translate(0, 0)";
                  e.currentTarget.style.boxShadow = "0px 4px 12px rgba(15, 91, 224, 0.8)";
                }}
              >
                <Badge
                  count={isNew ? "New" : 0}
                  offset={[30, 7]}
                  style={{
                    position: "absolute",        
                    top: "5px",                  
                    right: "10px",               
                    transform: "scale(0.9)", 
                    whiteSpace: "nowrap",    
                  }}
                />
                <span style={{ 
                  flex: 1, 
                  whiteSpace: "nowrap", 
                  overflow: "hidden", 
                  textOverflow: "ellipsis",
                  textAlign: "center",
                }}>
                  {item.title}
                </span>
                <Badge
                count={isNew ? "New" : 0}
                offset={[10, -5]}

                style={{
                  backgroundColor: "#ff4d4f",
                  color: "#fff",
                  fontSize: "10px",
                  boxShadow: "0 0 0 1px #fff"
                }}
                />
              </Button>
              {hoveredId === index && (
                <Card
                  style={{
                    position: "absolute",
                    top: "85%",
                    left: 0,
                    width: "100%",
                    zIndex: 10,
                    background: "white",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    border: "1px solid #e6e8eb",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={() => setHoveredId(index)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Paragraph 
                    style={{ 
                      color: "#5B6EAA", 
                      marginBottom: "8px", 
                      fontSize: "14px" 
                    }}
                  >
                    <strong>{formatThaiDateTime(item.created_at ?? 0)}</strong>
                  </Paragraph>
                  <Paragraph 
                    style={{ 
                      fontSize: "16px", 
                      lineHeight: "1.5", 
                      marginBottom: "12px",
                      color: "#333" 
                    }}
                  >
                    {item.title}
                  </Paragraph>
                  
                  {item.file_id && (
                    <div 
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        marginTop: "10px",
                        background: "#f7f9fc",
                        padding: "8px 12px",
                        borderRadius: "8px"
                      }}
                    >
                      <span
                        onClick={async () => {
                          try {
                            const authToken = await getAuthToken();
                            const isLoggedIn = Boolean(authToken);
                            if (!isLoggedIn) {
                              messageApi.open({
                                type: "error",
                                content: "please login first!",
                              });
                              return;
                            }
                            const blob = await DownloadFile((item.file_id ?? 0).toString());
                            const url = window.URL.createObjectURL(blob);
                            window.open(url, "_blank");
                          } catch (error) {
                            message.error("Failed to open file");
                          }
                        }}
                        style={{
                          color: "#5B6EAA",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        {t("open_file")}
                      </span>
                    </div>
                  )}
                </Card>
              )}
            </Col>
          );
        })}
      </Row>
      {/* ✅ ปุ่ม MORE THAN (เพิ่มเติม) */}
      {buttons.length > 5 && (
        <Row justify="center" style={{ marginTop: "20px" }}>
          <CustomButton onClick={handleMoreClick}>
            {t("more")}
          </CustomButton>
        </Row>
      )}
    </Card>
        </Col>
        <Col span={24}>
        <Card
          style={{
            background: "#ffff",
            padding: "10px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)"
          }}
        >
        <Regulations text={t("activity")} />
      <Row gutter={[16, 16]} justify="start">
      {activity.slice(-6).reverse().map((activity, index) => {
          const isNew = index === 0;
          return (
          <Col xs={24} sm={12} md={8} key={activity.ID}>
            <Card
              hoverable
              cover={
                <img
                  alt={activity.title}
                  src={activity.Image}
                  style={{ height: "180px", objectFit: "cover" }}
                />
              }
              style={{
                background: "linear-gradient(90deg,rgb(4, 26, 68),rgb(7, 65, 132)",
                borderRadius: "10px",
                borderColor: "#002641",
                boxShadow: "0px 4px 12px rgba(43, 107, 226, 0.8)",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-5px, -5px) rotate(-2deg)";
                e.currentTarget.style.boxShadow = "0px 10px 20px rgba(43, 107, 226, 0.8)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0, 0) rotate(0)";
                e.currentTarget.style.boxShadow = "0px 4px 12px rgba(43, 107, 226, 0.8)";
              }}
              onClick={() => handleActivityClick(activity.ID ?? 0)}
            >
              <Badge
                count={isNew ? "New" : 0}
                offset={[20, -5]}

                style={{
                  backgroundColor: "#ff4d4f",
                  color: "#fff",
                  fontSize: "10px",
                  boxShadow: "0 0 0 1px #fff"
                }}
            >
              <Typography.Title
                level={5}
                style={{
                  marginBottom: "15px",
                  marginTop: "-10px",
                  color: "#fff",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00aaff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
              >
                {activity.title?.substring(0,30)+ "..."}
              </Typography.Title>
              <Paragraph
                style={{
                  fontSize: "0.75rem",
                  color: "#fff",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00aaff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
              >
                {new Date(activity.created_at ?? "").toLocaleDateString("th-TH", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </Paragraph>
              </Badge>
            </Card>
          </Col>
          );
      })}
      </Row>
      {activity.length > MAX_ITEMS && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CustomButton onClick={handleMoreActClick}>{t("more")}</CustomButton>
        </div>
      )}
    </Card>
    </Col>
    <Col span={24}>
          <Card
            style={{
            background: "#ffff",
            padding: "10px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)"
            }}
          >
                <Regulations text={t("article")}/>
                {articles.slice(-6).reverse().map((article, index) => {
                  const isLatest = index === 0;
                  return (
                    <Card
                    hoverable
                      key={article.ID}
                      style={{
                        background: "#ecffff",
                        borderRadius: "10px",
                        marginBottom: "5px",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        overflow: "hidden",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translate(-1px, -1px)";
                        e.currentTarget.style.boxShadow = "0px 10px 20px rgba(43, 107, 226, 0.8)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translate(0, 0)";
                        e.currentTarget.style.boxShadow = "0px 8px 16px rgba(0, 0, 0, 0.1)";
                      }}

                    >
                      <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={6}>
                          <img
                            alt={article.title || "Image"}
                            src={article.Image}
                            style={{
                              width: "100%",
                              height: "180px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        </Col>
            
                        <Col xs={24} sm={18}>
                          <div
                            style={{
                              borderBottom: "2px solid rgb(17, 65, 120)",
                              paddingBottom: "8px",
                              marginBottom: "10px",
                            }}
                          >
                            <Title level={4} style={{ marginBottom: "4px", color: "#0D47A1" }}>
                              {article.title}
                              {isLatest && (
                                <img src={newIcon} alt="New" style={{ width: "30px", height: "30px" }} />
                              )}
                            </Title>
                            <Text type="secondary">
                              By: <b>TAT</b> | {new Date(article.created_at ?? "").toLocaleDateString("th-TH")}
                            </Text>
                          </div>
            
                          {/* ✅ คอนเทนต์ (ตัดตอน) */}
                          <Paragraph style={{ fontSize: "14px", color: "#424242" }}>
                              {article.content?.substring(0, 300)}...
                          </Paragraph>
            
                          {/* ✅ ปุ่มอ่านเพิ่มเติม */}
                          <CustomButton onClick={() => handleArticleClick(article.ID ?? 0)}>{t("more")}</CustomButton>
                        </Col>
                      </Row>
                    </Card>
                    );
                  })}
                  {articles.length > 1 && (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <CustomButton onClick={handleMoreArtClick}>{t("view_all_articles")}</CustomButton>
                    </div>
                  )}
          </Card>
        </Col>
      </Row>
      
    </>
  );
}
