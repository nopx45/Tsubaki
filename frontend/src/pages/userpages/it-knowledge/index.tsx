import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { KnowledgesInterface } from "../../../interfaces/IKnowledge";
import { GetKnowledges } from "../../../services/https";
import { useTranslation } from "react-i18next";
import Regulations from "../../../components/ranbow-text/ranbow_text";
import { FaLaptopCode, FaCalendarAlt, FaUserTie, FaExternalLinkAlt } from "react-icons/fa";
import { IoIosRocket } from "react-icons/io";
import { BsFillLightbulbFill } from "react-icons/bs";
import './ITKnowledge.css';
import { RiNotification3Fill } from "react-icons/ri";

const ITKnowledge: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [knowledges, setKnowledges] = useState<KnowledgesInterface[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetKnowledges();
        console.log("API Response:", response.data);
        const sortedData = response.data.sort((a: KnowledgesInterface, b: KnowledgesInterface) =>
          new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
        );
        setKnowledges(sortedData);
      } catch (error) {
        console.error("Error fetching knowledges:", error);
      }
    };    
    fetchData();
  }, []);

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
      {knowledges.map((knowledge, index) => {
        const isNew = index === 0;
          return (
            <div key={knowledge.ID} className="knowledge-card">
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
              {isNew && (
                <div className="new-badge">
                  <RiNotification3Fill className="new-icon" />
                  <span>NEW</span>
                </div>
              )}
              <div className="knowledge-content">
                <div className="image-container">
                  <img
                    alt={knowledge.title || "Image"}
                    src={knowledge.thumbnail}
                    className="knowledge-image"
                  />
                  <div className="image-overlay"></div>
                </div>

                <div className="text-content">
                  <p className="knowledge-paragraph">
                    {knowledge.content?.substring(0, 300)}...
                  </p>

                  <button
                    onClick={() => navigate(`/it-knowledge/detail/${knowledge.ID}`)}
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
    </div>
  );
};

export default ITKnowledge;
