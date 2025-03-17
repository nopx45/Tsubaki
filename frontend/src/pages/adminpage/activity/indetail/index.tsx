import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { GetActivitiesById } from "../../../../services/https";
import { ActivitiesInterface } from "../../../../interfaces/IActivity";
import { Card, Button, Typography, Spin } from "antd";
import { useTranslation } from "react-i18next";

dayjs.locale("th");

const { Title, Paragraph } = Typography;

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
    <div style={{ background: "#E3F2FD", minHeight: "100vh", padding: "30px" }}>
      <Card
        style={{
          maxWidth: "800px",
          margin: "auto",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          background: "white",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Spin size="large" />
            <Paragraph>{t("loading")}</Paragraph>
          </div>
        ) : activity ? (
          <>
            <Title level={2} style={{ color: "#0D47A1", textAlign: "center" }}>
              {activity.title}
            </Title>

            <img
              src={activity.Image}
              alt={activity.title}
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            />

            <Paragraph style={{ fontSize: "1rem", color: "#37474F", textAlign: "justify" }}>
              {activity.content}
            </Paragraph>

            <Paragraph style={{ fontSize: "1rem", color: "#FF5722", fontWeight: "bold" }}>
              📅 {t("upload_date")}: {dayjs(activity.created_at).format("DD/MM/YYYY HH:mm")}
            </Paragraph>

            <Button
              type="primary"
              onClick={() => navigate(-1)}
              style={{
                marginTop: "20px",
                background: "#0D47A1",
                borderColor: "#0D47A1",
                fontWeight: "bold",
                width: "100%",
                padding: "10px",
                fontSize: "1.2rem",
              }}
            >
              🔙 {t("back")}
            </Button>
          </>
        ) : (
          <Paragraph style={{ textAlign: "center", fontSize: "1.2rem", color: "red" }}>
            {t("nodata")}
          </Paragraph>
        )}
      </Card>
    </div>
  );
}
