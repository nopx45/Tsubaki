import { useState, useEffect } from "react";
import {
  Space,
  Table,
  Button,
  Col,
  Row,
  Divider,
  message,
  Card,
  Typography,
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetSections, DeleteSectionsById } from "../../../services/https/index";
import { Link, useNavigate } from "react-router-dom";
import { SectionsInterface } from "../../../interfaces/ISection";
import dayjs from "dayjs";

const { Title } = Typography;
dayjs.locale("th");

function Section() {
  const navigate = useNavigate();
  const [sections, setSections] = useState<SectionsInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const columns: ColumnsType<SectionsInterface> = [
    {
      title: "ID",
      dataIndex: "ID",
      key: "id",
      width: 80,
      align: "center",
      render: (text) => <b style={{ color: "#0D47A1" }}>{text}</b>,
    },
    {
      title: "วันที่เพิ่ม",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "ฝ่าย",
      dataIndex: "name",
      key: "name",
    },
    {
        title: "ชื่อเว็บไซต์",
        dataIndex: "name_link",
        key: "name_link",
    },
    {
      title: "url ของเว็บไซต์",
      dataIndex: "link_url",
      key: "link_url",
      render: (text: string) =>
          text.length > 60 ? `${text.slice(0,60)}...` : text
    },
    {
      title: "จัดการ",
      align: "center",
      render: (record) => (
        <Space size="middle">
            <Button
              type="default"
              danger
              icon={<DeleteOutlined />}
              onClick={() => deleteSectionsById(record.ID)}
              style={{ borderRadius: "6px" }}
            />

          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/section-web/edit/${record.ID}`)}
            style={{
              background: "#0D47A1",
              borderColor: "#0D47A1",
              borderRadius: "6px",
            }}
          >
            แก้ไข
          </Button>
        </Space>
      ),
    },
  ];

  const deleteSectionsById = async (id: string) => {
    let res = await DeleteSectionsById(id);

    if (res.status === 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      await getSections();
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getSections = async () => {
    let res = await GetSections();

    if (res.status === 200) {
      setSections(res.data);
    } else {
      setSections([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getSections();
  }, []);

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
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ color: "#0D47A1", marginBottom: 0 }}>
              จัดการเว็บไซต์ที่เกี่ยวข้อง (Section Web)
            </Title>
          </Col>
          <Col>
            <Link to="/admin/section-web/create">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{
                  background: "#1976D2",
                  borderColor: "#1976D2",
                  borderRadius: "6px",
                  fontWeight: "bold",
                }}
              >
                สร้างข้อมูล
              </Button>
            </Link>
          </Col>
        </Row>

        <Divider />

        <Table
          rowKey="ID"
          columns={columns}
          dataSource={sections}
          style={{
            width: "100%",
            borderRadius: "8px",
            overflowX: "auto",
          }}
          pagination={{ pageSize: 10 }}
          bordered
          scroll={{ x: "max-comtent"}}
        />
      </Card>
    </div>
  );
}

export default Section;