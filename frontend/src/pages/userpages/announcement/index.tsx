import React, { useState, useEffect } from "react";
import { Table, Card, message } from "antd";
import { GetAnnouncements, DownloadFile, getAuthToken } from "../../../services/https";
import { AnnouncementsInterface } from "../../../interfaces/IAnnouncement";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import Regulations from "../../../components/ranbow-text/ranbow_text";

const Announcement: React.FC = () => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();

  dayjs.locale("th");
  const [announces, setAnnouncements] = useState<AnnouncementsInterface[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetAnnouncements();
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error fetching Announcement:", error);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { title: t("number"), dataIndex: "ID", key: "ID" },
    {
      title: t("topic"),
      dataIndex: "title",
      key: "title",
      render: (_: any, record: AnnouncementsInterface) => (
        <a
          onClick={async () => {
            try {
              const isLoggedIn = Boolean(getAuthToken());
              if (!isLoggedIn) {
                messageApi.open({
                  type: "error",
                  content: "please login first!",
                });
                return;
              }
              const blob = await DownloadFile((record.file_id ?? 0).toString());
              const url = window.URL.createObjectURL(blob);
              window.open(url, "_blank"); // เปิดไฟล์ในแท็บใหม่
            } catch (error) {
              message.error("Failed to open file");
            }
          }}
          style={{ color: "#0D47A1", textDecoration: "underline", cursor: "pointer" }}
        >
          {record.title}
        </a>
      ),      
    },
    { title: t("detail"), dataIndex: "content", key: "content" },
    { title: t("upload_date"), dataIndex: "created_at", key: "created_at", render: (text: Date) => dayjs(text).format("DD/MM/YYYY HH:mm"), },
  ];

  return (
    <div style={{ background: "#E3F2FD", minHeight: "100vh", padding: "30px" }}>
      {contextHolder}
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
        <Regulations text={t("announcement")}/>

        <Table
          rowKey="ID"
          columns={columns}
          dataSource={announces}
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
  );
};

export default Announcement;
