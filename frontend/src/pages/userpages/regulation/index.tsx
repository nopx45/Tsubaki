import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import Regulations from "../../../components/ranbow-text/ranbow_text";
import dayjs from "dayjs";
import { RegulationsInterface } from "../../../interfaces/IRegulation";
import { DownloadRegulation, GetRegulations } from "../../../services/https";
import { useTranslation } from "react-i18next";
import {
  FaFileDownload,
  FaRegCalendarAlt,
  FaListOl,
  FaFileAlt,
  FaTimes,
  FaExternalLinkAlt,
} from "react-icons/fa";
import "./RegulationModal.css";

interface RegulationModalProps {
  visible: boolean;
  onClose: () => void;
}

const RegulationModal: React.FC<RegulationModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [regulation, setRegulation] = useState<RegulationsInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalWidth, setModalWidth] = useState(1000);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  dayjs.locale("th");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await GetRegulations();
        setRegulation(response.data);
      } catch (error) {
        console.error("Error fetching Regulation:", error);
        messageApi.error("Failed to load regulations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const updateWidth = () => {
      if (window.innerWidth < 768) {
        setModalWidth(300);
      } else if (window.innerWidth < 1024) {
        setModalWidth(600);
      } else {
        setModalWidth(1000);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [messageApi]);

  const handleOpenFile = async (record: RegulationsInterface) => {
    try {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (!isLoggedIn) {
        messageApi.error("Please login first!");
        return;
      }

      messageApi.loading({ content: "Preparing file...", key: "open" });
      const blob = await DownloadRegulation((record.ID ?? 0).toString());
      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");

      messageApi.success({ content: "File opened in new tab!", key: "open" });
    } catch (error) {
      messageApi.error("Failed to open file");
      console.error("Open file error:", error);
    }
  };

  const totalPages = Math.ceil(regulation.length / itemsPerPage);
  const paginatedData = regulation.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <Modal
      title=""
      open={visible}
      onCancel={onClose}
      footer={null}
      width={modalWidth}
      centered
      closeIcon={<FaTimes className="modal-close-icon" />}
      className="regulation-modal"
    >
      {contextHolder}
      <div className="modal-container">
        <div className="modal-header">
          <Regulations text={t("regulation")} />
        </div>

        <div className="modal-body">
          <div className="regulation-card">
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading regulations...</p>
              </div>
            ) : regulation.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <FaFileAlt />
                </div>
                <h5>No Regulations Found</h5>
                <p>There are currently no regulations available.</p>
              </div>
            ) : (
              <>
                <div className="table-container">
                  <table className="regulation-table">
                    <thead>
                      <tr>
                        <th>
                          <div className="header-content">
                            <FaListOl className="header-icon" />
                            {t("number")}
                          </div>
                        </th>
                        <th>
                          <div className="header-content">
                            <FaFileAlt className="header-icon" />
                            {t("file_name")}
                          </div>
                        </th>
                        <th>
                          <div className="header-content">
                            <FaRegCalendarAlt className="header-icon" />
                            {t("upload_date")}
                          </div>
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((item) => (
                        <tr key={item.ID} className="table-row">
                          <td>{item.ID}</td>
                          <td>
                            <div className="file-link" onClick={() => handleOpenFile(item)}>
                              <FaFileAlt className="file-icon" />
                              <span className="file-name">{item.name}</span>
                              <FaExternalLinkAlt className="external-icon" />
                            </div>
                          </td>
                          <td>
                            <div className="date-cell">
                              <FaRegCalendarAlt className="date-icon" />
                              {dayjs(item.created_at).format("DD/MM/YYYY HH:mm")}
                            </div>
                          </td>
                          <td>
                            <button className="download-btn" onClick={() => handleOpenFile(item)}>
                              <FaFileDownload className="download-icon" />
                              Open
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ✅ Pagination Buttons */}
                <div className="pagination-controls">
                  <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    ⬅ Prev
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next ➡
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="close-btn" onClick={onClose}>
            <FaTimes className="close-icon" />
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RegulationModal;
