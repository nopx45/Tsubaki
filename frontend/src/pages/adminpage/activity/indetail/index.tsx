import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { GetActivitiesById } from "../../../../services/https";
import { ActivitiesInterface } from "../../../../interfaces/IActivity";
import { useTranslation } from "react-i18next";
import { FiArrowLeft, FiCalendar } from "react-icons/fi";
import './detail.css'

dayjs.locale("th");

export default function ActivityDetails() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const [activity, setActivity] = useState<ActivitiesInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchActivityById = async (id: string) => {
      if (!id) return;
      try {
        const response = await GetActivitiesById(id);
        setActivity(response.data);
      } catch (error) {
        console.error("Error fetching activity details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivityById(id);
  }, [id]);

  return (
    <div className="activity-details">
      {loading ? (
        <div className="activity-details__loading">
          <div className="activity-details__spinner"></div>
          <p>{t("loading")}</p>
        </div>
      ) : activity ? (
        <div className="activity-details__card">
          <div className="activity-details__header">
            <button 
              onClick={() => navigate(-1)} 
              className="activity-details__back-button"
            >
              <FiArrowLeft className="activity-details__back-icon" />
              {t("back")}
            </button>
          </div>

          <div className="activity-details__image-container">
            <img
              src={activity.Image}
              alt={activity.title}
              className="activity-details__image"
            />
          </div>

          <div className="activity-details__content">
            <h1 className="activity-details__title">{activity.title}</h1>
            
            <div className="activity-details__meta">
              <div className="activity-details__meta-item">
                <FiCalendar className="activity-details__meta-icon" />
                <span>{dayjs(activity.created_at).format("DD MMMM YYYY")}</span>
              </div>
            </div>

            <div className="activity-details__description">
              <p>{activity.content}</p>
            </div>

          </div>
        </div>
      ) : (
        <div className="activity-details__empty">
          <p>{t("nodata")}</p>
        </div>
      )}
    </div>
  );
}