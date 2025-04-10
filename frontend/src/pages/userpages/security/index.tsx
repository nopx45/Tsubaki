import React, { useState, useEffect } from "react";
import { SecurityInterface } from "../../../interfaces/ISecurity";
import { GetSecurity } from "../../../services/https";
import { useTranslation } from "react-i18next";
import Regulations from "../../../components/ranbow-text/ranbow_text";
import { FaChevronDown, FaChevronUp, FaCalendarAlt, FaUserTag } from "react-icons/fa";
import { IoShieldCheckmark } from "react-icons/io5";
import './security.css'

const Security: React.FC = () => {
  const { t } = useTranslation();
  const [security, setSecurity] = useState<SecurityInterface[]>([]);
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetSecurity();
        setSecurity(response.data);
      } catch (error) {
        console.error("Error fetching security:", error);
      }
    };
    fetchData();
  }, []);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="security-container">
      <div className="knowledge-header-right">
        <Regulations text={t("security")} />
      </div>
      {security.map((securities) => (
        <div 
          key={securities.ID}
          className={`security-card ${expanded[securities.ID!] ? 'expanded' : ''}`}
        >
          <div className="security-card-header">
            <IoShieldCheckmark className="security-icon" />
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

          <div className="security-content">
            <div className="image-container">
              <img
                alt={securities.title || "Image"}
                src={securities.Image}
                className="security-image"
              />
              <div className="image-overlay"></div>
            </div>

            <div className="text-content">
              <p className={`security-paragraph ${expanded[securities.ID!] ? 'expanded' : ''}`}>
                {expanded[securities.ID!]
                  ? securities.content
                  : `${securities.content?.substring(0, 300)}...`}
              </p>

              <button 
                onClick={() => toggleExpand(securities.ID!)} 
                className="toggle-button"
              >
                {expanded[securities.ID!] ? (
                  <>
                    <span>{t("collapse_text")}</span>
                    <FaChevronUp className="button-icon" />
                  </>
                ) : (
                  <>
                    <span>{t("read_more")}</span>
                    <FaChevronDown className="button-icon" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Security;