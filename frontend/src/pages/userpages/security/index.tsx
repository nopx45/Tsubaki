import React, { useState, useEffect } from "react";
import { Card, Typography, Row, Col } from "antd";
import { SecurityInterface } from "../../../interfaces/ISecurity";
import { GetSecurity } from "../../../services/https";
import CustomButton from "../../../components/custom-button/custom_button";
import { useTranslation } from "react-i18next";
import Regulations from "../../../components/ranbow-text/ranbow_text";

const { Title, Paragraph, Text } = Typography;

const Security: React.FC = () => {
  const { t } = useTranslation();
  const [security, setSecurity] = useState<SecurityInterface[]>([]);
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetSecurity();
        setSecurity(response.data);
      } catch (error) {
        console.error("Error fetching security:", error);
      }
    };
    fetchData();
  }, []);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "900px",
        margin: "0 auto",
        background: "#E3F2FD",
      }}
    >
        <Regulations text ={t("security")} />
      {security.map((securities) => (
        <Card
          key={securities.ID}
          style={{
            marginBottom: "2px",
            borderRadius: "8px",
            background: "#FFFFFF",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "15px",
          }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={6}>
              <img
                alt={securities.title || "Image"}
                src={securities.Image}
                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Col>

            <Col xs={24} sm={18}>
              <div
                style={{
                  borderBottom: "4px solid #1565C0",
                  paddingBottom: "8px",
                  marginBottom: "10px",
                }}
              >
                <Title level={4} style={{ marginBottom: "4px", color: "#0D47A1" }}>
                  {securities.title}
                </Title>
                <Text type="secondary">
                  By: <b>TAT</b> | {new Date(securities.created_at ?? "").toLocaleDateString("th-TH")}
                </Text>
              </div>

              <Paragraph style={{ fontSize: "14px", color: "#424242" }}>
                {expanded[securities.ID!]
                  ? securities.content
                  : `${securities.content?.substring(0, 300)}...`}
              </Paragraph>

              <CustomButton onClick={() => toggleExpand(securities.ID!)}>
                {expanded[securities.ID!] ? t("collapse_text") : t("read_more")}
              </CustomButton>
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
};

export default Security;