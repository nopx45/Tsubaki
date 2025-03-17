import React, { useState, useEffect } from "react";
import { Card, Typography, Row, Col } from "antd";
import { KnowledgesInterface } from "../../../interfaces/IKnowledge";
import { GetKnowledges } from "../../../services/https";
import CustomButton from "../../../components/custom-button/custom_button";
import { useTranslation } from "react-i18next";
import Regulations from "../../../components/ranbow-text/ranbow_text";

const { Title, Paragraph, Text } = Typography;

const ITKnowledge: React.FC = () => {
  const { t } = useTranslation();
  const [knowledges, setKnowledges] = useState<KnowledgesInterface[]>([]);
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetKnowledges();
        setKnowledges(response.data);
      } catch (error) {
        console.error("Error fetching knowledges:", error);
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
        <Regulations text ={t("it_knowledge")} />
      {knowledges.map((knowledge) => (
        <Card
          key={knowledge.ID}
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
                alt={knowledge.title || "Image"}
                src={knowledge.Image}
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
                  {knowledge.title}
                </Title>
                <Text type="secondary">
                  By: <b>TAT</b> | {new Date(knowledge.created_at ?? "").toLocaleDateString("th-TH")}
                </Text>
              </div>

              <Paragraph style={{ fontSize: "14px", color: "#424242" }}>
                {expanded[knowledge.ID!]
                  ? knowledge.content
                  : `${knowledge.content?.substring(0, 300)}...`}
              </Paragraph>

              <CustomButton onClick={() => toggleExpand(knowledge.ID!)}>
                {expanded[knowledge.ID!] ? t("collapse_text") : t("read_more")}
              </CustomButton>
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
};

export default ITKnowledge;