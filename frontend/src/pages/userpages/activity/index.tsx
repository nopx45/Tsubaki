import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GetActivities } from "../../../services/https";
import { ActivitiesInterface } from "../../../interfaces/IActivity";
import dayjs from "dayjs";
import Regulations from "../../../components/ranbow-text/ranbow_text";
import {
  FaCalendarAlt,
  FaInfoCircle,
  FaListOl,
  FaNewspaper,
  FaArrowRight,
  FaSearch
} from "react-icons/fa";
import './Activity.css';

const Activity: React.FC = () => {
  const { t } = useTranslation();
  dayjs.locale("th");
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivitiesInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        const response = await GetActivities();
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const filteredActivities = activities.filter(activity =>
    activity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedData = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="activity-page">
      <div className="activity-container">
        <div className="activity-card">
          <div className="activity-header">
            <Regulations text={t("activity")} />
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder={t("search activities")}
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>{t("loading_activities")}</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FaNewspaper />
              </div>
              <h3>{t("no_activities_found")}</h3>
              <p>{searchTerm ? t("no_matching_activities") : t("no_activities_available")}</p>
            </div>
          ) : (
            <>
              <div className="table-container">
                <table className="activity-table">
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
                          <FaNewspaper className="header-icon" />
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
                          <FaCalendarAlt className="header-icon" />
                          <span>{t("upload_date")}</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((activity, index) => (
                      <tr
                        key={activity.ID}
                        className="activity-row"
                        onClick={() => navigate(`/activity/detail/${activity.ID}`)}
                      >
                        <td className="activity-id">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="activity-title">
                          <div className="title-container">
                          {activity.title && (activity.title.length > 60
                            ? `${activity.title.substring(0, 60)}...`
                            : activity.title)}
                            <FaArrowRight className="arrow-icon" />
                          </div>
                        </td>
                        <td className="activity-content">
                          {activity.content && (activity.content.length > 40
                            ? `${activity.content.substring(0, 40)}...`
                            : activity.content)}
                        </td>
                        <td className="activity-date">
                          <div className="date-container">
                            <FaCalendarAlt className="date-icon" />
                            {dayjs(activity.created_at).format("DD/MM/YYYY HH:mm")}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ✅ Pagination Controls */}
              <div className="pagination-controls">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                  ⬅ Prev
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                  Next ➡
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Activity;
