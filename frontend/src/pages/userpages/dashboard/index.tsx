import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnnouncementsInterface } from "../../../interfaces/IAnnouncement";
import { GetAnnouncements, DownloadFile, GetActivities, GetArticles, getAuthToken, UpdateMarquee, GetMarquee } from "../../../services/https";
import { ActivitiesInterface } from "../../../interfaces/IActivity";
import { ArticlesInterface } from "../../../interfaces/IArticle";
import { useTranslation } from "react-i18next";
import { FaArrowRight, FaCalendarAlt, FaUserTie, FaRocket } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { CiFaceSmile } from "react-icons/ci";
import { RiNotification3Fill, RiFilePdf2Line } from "react-icons/ri";
import { MdNotificationsActive } from "react-icons/md";
import { IoIosRocket, IoMdNotifications } from "react-icons/io";
import { LuFlower } from "react-icons/lu";
import Swal from "sweetalert2";
import './dashboard.css'; 

export default function Announcements() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [buttons, setButtons] = useState<AnnouncementsInterface[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [activity, setActivity] = useState<ActivitiesInterface[]>([]);
  const [articles, setArticles] = useState<ArticlesInterface[]>([]);
  const MAX_ITEMS = 1;

  const [marqueeText, setMarqueeText] = useState(
    "ระบบจะปิดปรับปรุงชั่วคราวในวันศุกร์ที่ 5 เมษายน 2570 เวลา 22:00 - 23:30 น. เพื่อพัฒนาประสิทธิภาพการให้บริการ ขออภัยในความไม่สะดวก 🙏"
  );
  const [userRole, setUserRole] = useState<string | null>(null);
  

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
        const res = await GetActivities();
        const mappedData = res.data.map((activity: any) => ({
          ...activity,
          Image: activity.image ? activity.image.split(",") : [], // ✅ สร้าง property ชื่อ Image (array)
        }));
        setActivity(mappedData);
        
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
    const fetchMarquee = async () => {
      const result = await GetMarquee();
      if (result.success) {
        setMarqueeText(result.message);
      } else {
        console.error("โหลดข้อความล้มเหลว:", result.error);
      }
    };
  
    fetchMarquee();
  }, []);
  
  const updateMarquee = async (newText: string) => {
    const result = await UpdateMarquee(newText);
  
    if (result.success) {
      await Swal.fire({
        icon: "success",
        title: "อัปเดตสำเร็จ",
        text: result.message,
        timer: 1800,
        showConfirmButton: false,
      });
  
      setMarqueeText(newText); // 👈 อัปเดตข้อความใน state ด้วย
    } else {
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: result.error,
      });
    }
  };  

  const handleMoreClick = () => navigate("/announcement");
  const handleMoreActClick = () => navigate("/activity");
  const handleMoreArtClick = () => navigate("/article");
  const handleActivityClick = (id: number) => navigate(`/activity/detail/${id}`);
  const handleArticleClick = (id: number) => navigate(`/article/detail/${id}`);
  const [isHovered, setIsHovered] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [repeatCount, setRepeatCount] = useState(1);

  useEffect(() => {
  if (contentRef.current) {
    const container = contentRef.current.parentElement;
    if (!container) return;

    const contentWidth = contentRef.current.scrollWidth;
    const containerWidth = container.clientWidth;
    const minRepeat = Math.ceil((containerWidth * 2) / contentWidth);
    setRepeatCount(minRepeat);
  }
}, [marqueeText]);

  return (
    <div className="dashboard-container">
      {/* Animated Background Elements */}
      <div className="bg-bubbles">
        {[...Array(10)].map((_, i) => <div key={i} className="bubble"></div>)}
      </div>
      
      {/* Marquee Notification */}
      <div className="marquee-notification">
        <div className="marquee-container">
          <div
            className="marquee-content"
            ref={contentRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
              animation: 'marquee 20s linear infinite',
              animationPlayState: isHovered ? 'paused' : 'running'
            }}
          >
            {Array.from({ length: repeatCount }).map((_, index) => (
              <span key={index} style={{ marginRight: '3rem' }}>
                <IoMdNotifications
                  className="marquee-icon"
                  style={{
                    marginRight: '10px',
                    fontSize: '20px',
                    color: '#f39c12'
                  }}
                />
                <span style={{
                  fontSize: '1.2rem',
                  fontWeight: '700'
                }}>
                  {marqueeText}
                </span>
              </span>
            ))}
          </div>
          {(userRole === "admin" || userRole === "adminhr" || userRole === "adminit") && (
            <button
              onClick={async () => {
                const { value: newText } = await Swal.fire({
                  title: "แก้ไขข้อความแจ้งเตือน",
                  input: "textarea",
                  inputValue: marqueeText,
                  inputPlaceholder: "กรอกข้อความใหม่ที่นี่...",
                  showCancelButton: true,
                  confirmButtonText: "บันทึก",
                  cancelButtonText: "ยกเลิก",
                });

                if (newText && newText.trim() !== "") {
                  setMarqueeText(newText.trim());
                  updateMarquee(newText.trim());
                }
              }}
              className="edit-marquee-button"
              style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                border: 'none',
                background: 'rgba(20, 4, 44, 0.52)',
                cursor: 'pointer',
                color: '#fff',
                fontSize: '16px',
                padding: '5px 10px',
                borderRadius: '4px',
                transition: 'background 0.3s',
                zIndex: 10
              }}
              title="แก้ไขข้อความ"
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.56)'}
            >
              ✏️ แก้ไข
            </button>
          )}

          <style>
            {`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
            `}
          </style>
        </div>
      </div>

      {/* Announcements Section */}
      <section className="dashboard-section announcements-section">
        <div className="section-header">
          <LuFlower className="section-icon spin" />
          <h2>{t("announcement")}</h2>
          <LuFlower className="section-icon spin-reverse" />
        </div>

        {buttons.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 4V6M12 18V20M6 12H4M20 12H18M17.6568 17.6568L16.2426 16.2426M7.75732 7.75732L6.34314 6.34314M17.6568 6.34314L16.2426 7.75732M7.75732 16.2426L6.34314 17.6568" />
              </svg>
            </div>
            <h3>{t("no_Announcement")}</h3>
            <p>{t("no_Announcement_detail")}</p>
          </div>
        ) : (
          <>
            <div className="announcements-grid">
              {buttons.slice(-16).reverse().map((item, index) => {
                const isNew = index === 0;
                return (
                  <div 
                    key={index}
                    onMouseEnter={() => setHoveredId(index)}
                    onMouseLeave={() => setHoveredId(null)}
                  >                    
                    <button 
                      className="announcement-button"
                      onClick={async () => {
                        try {
                          const authToken = await getAuthToken();
                          const isLoggedIn = Boolean(authToken);
                          if (!isLoggedIn) {
                            await Swal.fire({
                              icon: "error",
                              title: "Please Login!",
                              text: "กรุณา Login ก่อนเข้าใช้งาน...",
                              timer: 1800,
                              showConfirmButton: false,
                              timerProgressBar: true,
                            });
                            return;
                          }
                          const blob = await DownloadFile((item.file_id ?? 0).toString());
                          const url = window.URL.createObjectURL(blob);
                          window.open(url, "_blank");
                        } catch (error) {
                          Swal.fire("Error", "Failed to open file", "error");
                        }
                      }}
                    >
                      <RiFilePdf2Line className="pdf-icon" />
                      {isNew && (
                        <div className="new-badges">
                          <MdNotificationsActive className="new-icons" />
                        </div>
                      )}
                      <span>{item.title}</span>
                    </button>
                    {hoveredId === index && (
                      <div className="announcement-details">
                        <div className="detail-row">
                          <FiCalendar />
                          <span>{formatThaiDateTime(item.UpdatedAt ?? 0)}</span>
                        </div>
                        <p>{item.title}</p>
                        {item.file_id && (
                          <button className="open-file-button">
                            <RiFilePdf2Line />
                            <span>{t("open_file")}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {buttons.length > 5 && (
              <button className="more-button" onClick={handleMoreClick}>
                {t("more")} <FaArrowRight className="arrow" />
              </button>
            )}
          </>
        )}
      </section>

      {/* Articles Section */}
      <section className="dashboard-section articles-section">
        <div className="section-header">
          <FaRocket className="section-icon float" />
          <h2>{t("article")}</h2>
          <FaRocket className="section-icon float-delay" />
        </div>

        {articles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 4V6M12 18V20M6 12H4M20 12H18M17.6568 17.6568L16.2426 16.2426M7.75732 7.75732L6.34314 6.34314M17.6568 6.34314L16.2426 7.75732M7.75732 16.2426L6.34314 17.6568" />
              </svg>
            </div>
            <h3>{t("no_article")}</h3>
            <p>{t("no_article_detail")}</p>
          </div>
        ) : (
          <>
            <div className="articles-list">
              {articles.slice(-2).reverse().map((article, index) => {
                const isLatest = index === 0;
                return (
                  <div 
                    key={article.ID} 
                    className="article-card"
                    onClick={() => handleArticleClick(article.ID ?? 0)}
                  >
                    {isLatest && (
                      <div className="new-badge">
                        <RiNotification3Fill className="new-icon" />
                        <span>NEW</span>
                      </div>
                    )}
                    <div className="article-image"> <img
                        alt={article.title}
                        src={article.thumbnail}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderTopLeftRadius: "15px",
                          borderTopRightRadius: "15px"
                        }}
                      /></div>
                    <div className="article-content">
                      <h3>
                        <IoIosRocket className="title-icon" />
                        {article.title}
                      </h3>
                      <div className="article-meta">
                        <div className="meta-item">
                          <FaUserTie className="meta-icon" />
                          <span>TAT</span>
                        </div>
                        <div className="meta-item">
                          <FaCalendarAlt className="meta-icon" />
                          <span>{new Date(article.created_at ?? "").toLocaleDateString("th-TH")}</span>
                        </div>
                      </div>
                      <p className="article-excerpt">
                        {article.content?.substring(0, 300)}...
                      </p>
                      <button className="read-more-button">
                        <span>{t("more")}</span>
                        <FaArrowRight className="arrow-icon" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {articles.length > 1 && (
              <button className="more-button" onClick={handleMoreArtClick}>
                {t("view_all_articles")} <FaArrowRight className="arrow" />
              </button>
            )}
          </>
        )}
      </section>

      {/* Activities Section */}
      <section className="dashboard-section activities-section">
        <div className="section-header">
          <CiFaceSmile className="section-icon bounce" />
          <h2>{t("activity")}</h2>
          <CiFaceSmile className="section-icon bounce-delay" />
        </div>

        {activity.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 4V6M12 18V20M6 12H4M20 12H18M17.6568 17.6568L16.2426 16.2426M7.75732 7.75732L6.34314 6.34314M17.6568 6.34314L16.2426 7.75732M7.75732 16.2426L6.34314 17.6568" />
              </svg>
            </div>
            <h3>{t("no_activity")}</h3>
            <p>{t("no_activity_detail")}</p>
          </div>
        ) : (
          <>
            <div className="activities-grid">
              {activity.slice(-3).reverse().map((activity, index) => {
                const isNew = index === 0;
                return (
                  <div 
                    key={activity.ID}
                    className="activity-card"
                    onClick={() => handleActivityClick(activity.ID ?? 0)}
                  >
                    {isNew && (
                      <div className="new-badge">
                        <RiNotification3Fill className="new-icon" />
                        <span>NEW</span>
                      </div>
                    )}
                    <div className="activity-image">
                      <img
                        alt={activity.title}
                        src={activity.Image?.[0]}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderTopLeftRadius: "15px",
                          borderTopRightRadius: "15px"
                        }}
                      />
                    </div>
                    <div className="activity-content">
                      <h3>
                        <CiFaceSmile className="title-icon" />
                        {activity.title && activity.title.length > 30
                          ? activity.title.substring(0, 30) + "..."
                          : activity.title}
                      </h3>
                      <div className="activity-meta">
                        <FiCalendar className="meta-icon" />
                        <span>
                          {new Date(activity.created_at ?? "").toLocaleDateString("th-TH", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {activity.length > MAX_ITEMS && (
              <button className="more-button" onClick={handleMoreActClick}>
                {t("more")} <FaArrowRight className="arrow" />
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
}