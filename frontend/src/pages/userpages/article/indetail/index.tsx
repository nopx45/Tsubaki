import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { GetArticlesById } from "../../../../services/https";
import { ArticlesInterface } from "../../../../interfaces/IArticle";
import { useTranslation } from "react-i18next";
import { FaArrowLeft, FaCalendarAlt, FaShareAlt, FaBookmark, FaHeart } from "react-icons/fa";
import './article_detail.css'

dayjs.locale("th");

export default function ArticleDetails() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const [article, setArticle] = useState<ArticlesInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchArticleById = async (id: string) => {
      if (!id) return;
      try {
        const response = await GetArticlesById(id);
        setArticle(response.data);
      } catch (error) {
        console.error("Error fetching article details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticleById(id);
  }, [id]);

  return (
    <div className="artdet-container">
      {loading ? (
        <div className="artdet-loading">
          <div className="artdet-spinner"></div>
          <p>{t("loading")}</p>
        </div>
      ) : article ? (
        <div className="artdet-card">
          <div className="artdet-header">
            <button onClick={() => navigate(-1)} className="artdet-back-btn">
              <FaArrowLeft className="artdet-back-icon" />
              <span>{t("back")}</span>
            </button>
            <div className="artdet-actions">
              <button 
                className={`artdet-action-btn ${isBookmarked ? 'artdet-active' : ''}`}
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <FaBookmark className="artdet-action-icon" />
              </button>
              <button 
                className={`artdet-action-btn ${isLiked ? 'artdet-active' : ''}`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <FaHeart className="artdet-action-icon" />
              </button>
              <button className="artdet-action-btn">
                <FaShareAlt className="artdet-action-icon" />
              </button>
            </div>
          </div>

          <div className="artdet-img-container">
            <img
              src={article.Image}
              alt={article.title}
              className="artdet-img"
            />
          </div>
          <div className="artdet-content">
            <h1 className="artdet-title">{article.title}</h1>
            
            <div className="artdet-meta">
              <div className="artdet-meta-item">
                <FaCalendarAlt className="artdet-meta-icon" />
                <span>{t("upload_date")}: {dayjs(article.created_at).format("DD MMMM YYYY HH:mm")}</span>
              </div>
            </div>

            <div className="artdet-text">
              <p>{article.content}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="artdet-empty">
          <p>{t("nodata")}</p>
        </div>
      )}
    </div>
  );
}