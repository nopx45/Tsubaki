import React, { useState, useEffect } from "react";
import { Table, Card } from "antd";
import { GetActivities } from "../../../services/https";
import { ActivitiesInterface } from "../../../interfaces/IActivity";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Regulations from "../../../components/ranbow-text/ranbow_text";

const Activity: React.FC = () => {
  const { t } = useTranslation();
  dayjs.locale("th");
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivitiesInterface[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await GetActivities();
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
    fetchActivities();
  }, []);

  const columns = [
    { title: t("number"), dataIndex: "ID", key: "ID" },
    {
      title: t("topic"),
      dataIndex: "title",
      key: "title",
      render: (_: any, record: ActivitiesInterface) => (
        <a
          onClick={() => navigate(`/activity/detail/${record.ID}`)}
          style={{ color: "#0D47A1", textDecoration: "underline", cursor: "pointer" }}
        >
          {record.title}
        </a>
      ),
    },
    { title: t("detail"), dataIndex: "content", key: "content",
      render: (text: string) => text.length > 100 ? text.substring(0, 100) + "..." : text,
     },
    {
      title: t("upload_date"),
      dataIndex: "date",
      key: "date",
      render: (text: Date) => dayjs(text).format("DD/MM/YYYY HH:mm"),
    },
  ];

  return (
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
        <Regulations text={t("activity")}/>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={activities}
          pagination={{ pageSize: 10 }}
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

export default Activity;