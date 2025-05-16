import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrainingsInterface } from "../../../interfaces/ITraining";
import { GetTrainings } from "../../../services/https";
import { useTranslation } from "react-i18next";
import { FaLaptopCode, FaCalendarAlt, FaUserTie, FaExternalLinkAlt } from "react-icons/fa";
import { IoIosRocket } from "react-icons/io";
import { BsFillLightbulbFill } from "react-icons/bs";
import { RiNotification3Fill } from "react-icons/ri";
import Regulations from "../../../components/ranbow-text/ranbow_text";

const Training: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [trainings, setTrainings] = useState<TrainingsInterface[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetTrainings();
        const sortedData = response.data.sort(
          (a: TrainingsInterface, b: TrainingsInterface) =>
            new Date(b.CreatedAt!).getTime() - new Date(a.CreatedAt!).getTime()
        );
        setTrainings(sortedData);
      } catch (error) {
        console.error("Error fetching trainings:", error);
      }
    };
    fetchData();
  }, []);

  const icons = [
    <FaLaptopCode style={{ color: "#6a5acd" }} />, 
    <IoIosRocket style={{ color: "#ff6b6b" }} />, 
    <BsFillLightbulbFill style={{ color: "#ffd166" }} />
  ];

  const getRandomIcon = () => {
    const randomIndex = Math.floor(Math.random() * icons.length);
    return icons[randomIndex];
  };

  return (
    <div className="training-container">
      <div className="training-header-right">
        <Regulations text={t("Training")} />
      </div>

      <div className="articles-list">
        {trainings.slice(0, 10).map((training, index) => {
          const isNew = index === 0;
          return (
            <div
              key={training.ID}
              className="article-card"
              onClick={() => navigate(`/training/detail/${training.ID}`)}
            >
              <img
                className="article-image"
                src={training.thumbnail || "/default-thumbnail.jpg"}
                alt={training.title}
                style={{
                  flex: 1,
                  maxHeight: 250,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              />
              <div className="article-content">
                <h3>
                  <span className="title-icon">{getRandomIcon()}</span>
                  {training.title}
                </h3>
                <div className="article-meta">
                  <span className="meta-item">
                    <FaUserTie className="meta-icon" /> TAT
                  </span>
                  <span className="meta-item">
                    <FaCalendarAlt className="meta-icon" />
                    {new Date(training.CreatedAt ?? "").toLocaleDateString("th-TH")}
                  </span>
                </div>
                <p className="article-excerpt">
                  {training.content?.substring(0, 200)}...
                </p>
                <button className="read-more-button">
                  {t("read_more")} <FaExternalLinkAlt className="arrow-icon" />
                </button>
                {isNew && (
                  <div className="new-badge">
                    <RiNotification3Fill className="new-icon" /> NEW
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => navigate(`/training/all`)}
        className="more-button"
      >
        {t("view_all")} <FaExternalLinkAlt className="arrow" />
      </button>

      <style>{`
        .training-container {
          padding: 2rem;
          max-width: 90%;
          margin: 0 auto;
        }

        .training-header-right {
          display: flex;
          justify-content: flex-end;
          padding-right: 20px;
        }

        .articles-list {
          display: grid;
          gap: 25px;
          margin-bottom: 20px;
        }

        .article-card {
          display: flex;
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        }

        .article-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
          
        @media (max-width: 768px) {
          .article-card {
            flex-direction: column;
          }
        }

        .article-image {
          flex: 1;
          max-height: 250px;
          background-size: cover;
          background-position: center;
        }

        @media (min-width: 769px) {
          .article-image {
            min-width: 300px;
          }
        }

        .article-content {
          flex: 2;
          padding: 25px;
        }

        .article-content h3 {
          font-size: 1.3rem;
          color: #4a148c;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }

        .title-icon {
          margin-right: 10px;
        }

        .article-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          color: #757575;
          font-size: 0.9rem;
        }

        .meta-icon {
          margin-right: 5px;
        }

        .article-excerpt {
          color: #757575;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .read-more-button {
          display: flex;
          align-items: center;
          padding: 8px 20px;
          background: linear-gradient(90deg, #7b1fa2, #1976d2);
          color: white;
          border: none;
          border-radius: 30px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .read-more-button .arrow-icon {
          margin-left: 8px;
          transition: all 0.3s ease;
        }

        .read-more-button:hover .arrow-icon {
          transform: translateX(5px);
        }

        .new-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: red;
          color: white;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: bold;
          display: flex;
          align-items: center;
        }

        .new-icon {
          margin-right: 5px;
          font-size: 0.8rem;
        }

        .more-button {
          display: flex;
          align-items: center;
          margin: 0 auto;
          padding: 10px 25px;
          background: linear-gradient(90deg, #1976d2, #7b1fa2);
          color: white;
          border: none;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .more-button .arrow {
          margin-left: 8px;
          transition: all 0.3s ease;
        }

        .more-button:hover .arrow {
          transform: translateX(5px);
        }
      `}</style>
    </div>
  );
};

export default Training;
