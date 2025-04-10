import React, { useState, useEffect } from "react";
import { GetArticles } from "../../../services/https";
import { ArticlesInterface } from "../../../interfaces/IArticle";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaSearch,
  FaFileAlt,
  FaCalendarAlt,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { RiArticleLine } from "react-icons/ri";
import './article.css';

const ARTICLES_PER_PAGE = 5;

const ArticleList: React.FC = () => {
  const { t } = useTranslation();
  dayjs.locale("th");
  const navigate = useNavigate();
  const [articles, setArticles] = useState<ArticlesInterface[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await GetArticles();
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(article =>
    article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="artlist-container">
      <div className="artlist-card">
        <div className="artlist-header">
          <RiArticleLine className="artlist-header-icon" />
          <h2 className="artlist-title">{t("article")}</h2>
        </div>

        <div className="artlist-search-container">
          <FaSearch className="artlist-search-icon" />
          <input
            type="text"
            placeholder={t("search_articles")}
            className="artlist-search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset to page 1 on search
            }}
          />
        </div>

        <div className="artlist-table-container">
          <table className="artlist-table">
            <thead>
              <tr className="artlist-table-header">
                <th className="artlist-th">{t("number")}</th>
                <th className="artlist-th">{t("topic")}</th>
                <th className="artlist-th">{t("detail")}</th>
                <th className="artlist-th">{t("upload_date")}</th>
                <th className="artlist-th">{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {currentArticles.map((article, index) => (
                <tr
                  key={article.ID}
                  className={`artlist-tr ${index % 2 === 0 ? "artlist-even" : "artlist-odd"}`}
                >
                  <td className="artlist-td">{startIndex + index + 1}</td>
                  <td className="artlist-td">
                    <div
                      className="artlist-topic"
                      onClick={() => navigate(`/article/detail/${article.ID}`)}
                    >
                      <FaFileAlt className="artlist-topic-icon" />
                      <span>{article.title}</span>
                    </div>
                  </td>
                  <td className="artlist-td artlist-detail">
                    {article.content?.substring(0, 100)}
                    {article.content && article.content.length > 100 ? "..." : ""}
                  </td>
                  <td className="artlist-td">
                    <div className="artlist-date">
                      <FaCalendarAlt className="artlist-date-icon" />
                      <span>{dayjs(article.created_at).format("DD/MM/YYYY HH:mm")}</span>
                    </div>
                  </td>
                  <td className="artlist-td">
                    <button
                      className="artlist-view-btn"
                      onClick={() => navigate(`/article/detail/${article.ID}`)}
                    >
                      <span>{t("view")}</span>
                      <FaArrowRight className="artlist-view-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="artlist-pagination">
          <button
            className="artlist-page-btn"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <FaChevronLeft /> {t("prev")}
          </button>
          <span className="artlist-page-number">
            {t("page")} {currentPage} / {totalPages}
          </span>
          <button
            className="artlist-page-btn"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            {t("next")} <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
