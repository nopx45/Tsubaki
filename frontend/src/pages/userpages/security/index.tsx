import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SecurityInterface } from "../../../interfaces/ISecurity";
import { GetSecurity } from "../../../services/https";
import { useTranslation } from "react-i18next";
import Regulations from "../../../components/ranbow-text/ranbow_text";
import { FaUserTag, FaCalendarAlt, FaExternalLinkAlt, FaLock, FaShieldAlt, FaKey } from "react-icons/fa";
import { RiNotification3Fill } from "react-icons/ri";
import './security.css';

const Security: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [security, setSecurity] = useState<SecurityInterface[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetSecurity();
        console.log("API Response:", response.data);
        const sortedData = response.data.sort((a: SecurityInterface, b: SecurityInterface) =>
          new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
        );
        setSecurity(sortedData);
      } catch (error) {
        console.error("Error fetching security:", error);
      }
    };
    fetchData();
  }, []);

  const getRandomIcon = (id: number) => {
    const icons = [
      <FaShieldAlt className="security-icon" style={{ color: "#6a5acd" }} />,
      <FaLock className="security-icon" style={{ color: "#ff6b6b" }} />,
      <FaKey className="security-icon" style={{ color: "#ffd166" }} />
    ];
    return icons[id % icons.length];
  };

  return (
    <div className="security-container">
      <div className="knowledge-header-right">
        <Regulations text={t("security")} />
      </div>
      {security.slice(0, 10).map((securities, index) => {
        const isNew = index === 0;
        return (
          <div key={securities.ID} className="security-card">
            <div className="security-card-header">
              {getRandomIcon(securities.ID!)}
              <h3 className="security-title">{securities.title}</h3>
              <div className="security-meta">
                <span className="meta-item">
                  <FaUserTag className="meta-icon" />
                  <span>TAT</span>
                </span>
                <span className="meta-item">
                  <FaCalendarAlt className="meta-icon" />
                  <span>{new Date(securities.created_at ?? "").toLocaleDateString("th-TH")}</span>
                </span>
              </div>
            </div>
            {isNew && (
              <div className="new-badge">
                <RiNotification3Fill className="new-icon" />
                <span>NEW</span>
              </div>
            )}
            <div className="security-content">
              <div className="image-container">
                <img
                  alt={securities.title || "Image"}
                  src={securities.thumbnail}
                  className="security-image"
                />
                <div className="image-overlay"></div>
              </div>

              <div className="text-content">
                <p className="security-paragraph">
                  {securities.content?.substring(0, 700)}...
                </p>

                <button
                  onClick={() => navigate(`/security/detail/${securities.ID}`)}
                  className="toggle-button"
                >
                  <span>{t("read_more")}</span>
                  <FaExternalLinkAlt />
                </button>
              </div>
            </div>
          </div>
        );
      })}
      <button
        onClick={() => navigate(`/security/all`)}
        className="all-button"
      >
        <span>{t("view_all")}</span>
        <FaExternalLinkAlt />
      </button>
    </div>
  );
};

export default Security;
