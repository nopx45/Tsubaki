import React, { useState, useEffect } from "react";
import { KnowledgesInterface } from "../../../interfaces/IKnowledge";
import { GetKnowledges } from "../../../services/https";
import { useTranslation } from "react-i18next";
import Regulations from "../../../components/ranbow-text/ranbow_text";
import { FaLaptopCode, FaCalendarAlt, FaUserTie, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoIosRocket } from "react-icons/io";
import { BsFillLightbulbFill } from "react-icons/bs";
import './ITKnowledge.css'

const ITKnowledge: React.FC = () => {
  const { t } = useTranslation();
  const [knowledges, setKnowledges] = useState<KnowledgesInterface[]>([]);
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetKnowledges();
        setKnowledges(response.data);
      } catch (error) {
        console.error("Error fetching knowledges:", error);
      }
    };
    fetchData();
  }, []);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Get a random icon for each knowledge card
  const getRandomIcon = (id: number) => {
    const icons = [
      <FaLaptopCode className="knowledge-icon" style={{ color: "#6a5acd" }} />,
      <IoIosRocket className="knowledge-icon" style={{ color: "#ff6b6b" }} />,
      <BsFillLightbulbFill className="knowledge-icon" style={{ color: "#ffd166" }} />
    ];
    return icons[id % icons.length];
  };

  return (
    <div className="knowledge-container">
      <div className="knowledge-header-right">
        <Regulations text={t("it_knowledge")} />
      </div>
      {knowledges.map((knowledge) => (
        <div 
          key={knowledge.ID}
          className={`knowledge-card ${expanded[knowledge.ID!] ? 'expanded' : ''}`}
        >
          <div className="knowledge-card-header">
            {getRandomIcon(knowledge.ID!)}
            <h3 className="knowledge-title">{knowledge.title}</h3>
            <div className="knowledge-meta">
              <span className="meta-item">
                <FaUserTie className="meta-icon" />
                <span>TAT</span>
              </span>
              <span className="meta-item">
                <FaCalendarAlt className="meta-icon" />
                <span>{new Date(knowledge.created_at ?? "").toLocaleDateString("th-TH")}</span>
              </span>
            </div>
          </div>

          <div className="knowledge-content">
            <div className="image-container">
              <img
                alt={knowledge.title || "Image"}
                src={knowledge.Image}
                className="knowledge-image"
              />
              <div className="image-overlay"></div>
            </div>

            <div className="text-content">
              <p className={`knowledge-paragraph ${expanded[knowledge.ID!] ? 'expanded' : ''}`}>
                {expanded[knowledge.ID!]
                  ? knowledge.content
                  : `${knowledge.content?.substring(0, 300)}...`}
              </p>

              <button 
                onClick={() => toggleExpand(knowledge.ID!)} 
                className="toggle-button"
              >
                {expanded[knowledge.ID!] ? (
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

export default ITKnowledge;