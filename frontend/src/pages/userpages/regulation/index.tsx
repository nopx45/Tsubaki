import React, { useEffect, useState } from "react";
import { Modal, Card, message, Table } from "antd";
import Regulations from "../../../components/ranbow-text/ranbow_text";
import dayjs from "dayjs";
import { RegulationsInterface } from "../../../interfaces/IRegulation"
import {DownloadRegulation, GetRegulations } from "../../../services/https";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

interface RegulationModalProps {
  visible: boolean;
  onClose: () => void;
}
const RegulationModal: React.FC<RegulationModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();

  dayjs.locale("th");
  const [regulation, setRegulation] = useState<RegulationsInterface[]>([]);
  
  const [modalWidth, setModalWidth] = useState(1000);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetRegulations();
        setRegulation(response.data);
      } catch (error) {
        console.error("Error fetching Regulation:", error);
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
  }, []);

  const columns = [
    { title: t("number"), dataIndex: "ID", key: "ID" },
    {
      title: t("file_name"),
      dataIndex: "name",
      key: "name",
      render: (_: any, record: RegulationsInterface) => (
        <a
          onClick={async () => {
            try {
              const isLoggedIn = Boolean(Cookies.get("authToken"));
              if (!isLoggedIn) {
                messageApi.open({
                  type: "error",
                  content: "please login first!",
                })}
              const blob = await DownloadRegulation((record.ID ?? 0).toString());
              const url = window.URL.createObjectURL(blob);
              window.open(url, "_blank"); // เปิดไฟล์ในแท็บใหม่
            } catch (error) {
              message.error("Failed to open file");
            }
          }}
          style={{ color: "#0D47A1", textDecoration: "underline", cursor: "pointer" }}
        >
          {record.name}
        </a>
      ),      
    },
    { title: t("upload_date"), dataIndex: "created_at", key: "created_at", render: (text: Date) => dayjs(text).format("DD/MM/YYYY HH:mm"), },
  ];

  return (
    <Modal
      title=""
      open={visible}
      onCancel={onClose}
      footer={null}
      width={modalWidth}
    >
      {contextHolder}
<div style={{ background: "#E3F2FD", minHeight: "100vh", padding: "30px" }}>
      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          background: "white",
          padding: "20px",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        <Regulations text={t("regulation")}></Regulations>

        <Table
          rowKey="ID"
          columns={columns}
          dataSource={regulation}
          pagination={{ pageSize: 15 }}
          bordered
          style={{ width: "100%", borderRadius: "8px", overflow: "hidden" }}
          components={{
            header: {
              cell: (props) => (
                <th
                  {...props}
                  style={{
                    backgroundColor: "#0D47A1",
                    color: "white",
                    fontWeight: "bold",
                    padding: "10px",
                    border: "none",
                  }}
                />
              ),
            },
          }}
          onRow={(_record, index) => ({
            style: {
              backgroundColor: (index ?? 0) % 2 === 0 ? "#f6ffff" : "#E8F9FF",
            },
          })}
        />
      </Card>
    </div>
    </Modal>
  );
};

export default RegulationModal;
