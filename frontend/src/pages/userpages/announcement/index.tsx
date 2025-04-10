import React, { useState, useEffect } from "react";
import { message } from "antd";
import { GetAnnouncements, DownloadFile, getAuthToken } from "../../../services/https";
import { AnnouncementsInterface } from "../../../interfaces/IAnnouncement";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import Regulations from "../../../components/ranbow-text/ranbow_text";
import {
  FaFileDownload,
  FaRegCalendarAlt,
  FaListOl,
  FaBullhorn,
  FaInfoCircle,
  FaSearch,
  FaExternalLinkAlt
} from "react-icons/fa";
import './Announcement.css';
import Swal from "sweetalert2";

const Announcement: React.FC = () => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [announces, setAnnouncements] = useState<AnnouncementsInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await GetAnnouncements();
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error fetching Announcement:", error);
        messageApi.error("Failed to load announcements");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [messageApi]);

  const handleOpenFile = async (fileId: number, _title?: string) => {
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
      messageApi.loading({ content: 'Preparing file...', key: 'open' });
      const blob = await DownloadFile(fileId.toString());
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      messageApi.success({ content: 'File opened in new tab!', key: 'open' });
    } catch (error) {
      messageApi.error("Failed to open file");
      console.error("Open file error:", error);
    }
  };

  const filteredAnnouncements = announces.filter(announce =>
    announce.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announce.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const paginatedAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="announcement-page">
      {contextHolder}
      <div className="announcement-container">
        <div className="announcement-card">
          <div className="announcement-header">
            <Regulations text={t("announcement")} />
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder={t("search announcements")}
                className="search-input"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); 
                }}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>{t("loading_announcements")}</p>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FaBullhorn />
              </div>
              <h3>{t("no_announcements_found")}</h3>
              <p>{searchTerm ? t("no_matching_announcements") : t("no_announcements_available")}</p>
            </div>
          ) : (
            <>
              <div className="table-container">
                <table className="announcement-table">
                  <thead>
                    <tr>
                      <th>
                        <div className="header-cell">
                          <FaListOl className="header-icon" />
                          <span>{t("number")}</span>
                        </div>
                      </th>
                      <th>
                        <div className="header-cell">
                          <FaBullhorn className="header-icon" />
                          <span>{t("topic")}</span>
                        </div>
                      </th>
                      <th>
                        <div className="header-cell">
                          <FaInfoCircle className="header-icon" />
                          <span>{t("detail")}</span>
                        </div>
                      </th>
                      <th>
                        <div className="header-cell">
                          <FaRegCalendarAlt className="header-icon" />
                          <span>{t("upload_date")}</span>
                        </div>
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAnnouncements.map((announce, index) => (
                      <tr key={announce.ID} className="announcement-row">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>
                          <div
                            className="title-link"
                            onClick={() => handleOpenFile(announce.file_id ?? 0, announce.title)}
                          >
                            {announce.title}
                            <FaExternalLinkAlt className="external-icon" />
                          </div>
                        </td>
                        <td>
                          {announce.content && (announce.content.length > 100
                            ? `${announce.content.substring(0, 100)}...`
                            : announce.content)}
                        </td>
                        <td>
                          <div className="date-container">
                            <FaRegCalendarAlt className="date-icon" />
                            {dayjs(announce.created_at).format("DD/MM/YYYY HH:mm")}
                          </div>
                        </td>
                        <td>
                          <button
                            className="download-btn"
                            onClick={() => handleOpenFile(announce.file_id ?? 0, announce.title)}
                          >
                            <FaFileDownload className="download-icon" />
                            Open
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <button
                    className="pagination-btn"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    « Prev
                  </button>

                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`}
                      onClick={() => goToPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    className="pagination-btn"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next »
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcement;
