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
import { GetLinks, DeleteLinksById } from "../../../services/https/index";
import { Link, useNavigate } from "react-router-dom";
import { LinksInterface } from "../../../interfaces/ILink";
import dayjs from "dayjs";

const { Title } = Typography;
dayjs.locale("th");

function Central() {
  const navigate = useNavigate();
  const [links, setLinks] = useState<LinksInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const columns: ColumnsType<LinksInterface> = [
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
      title: "ชื่อเว็บไซต์",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "url ของเว็บไซต์",
      dataIndex: "link_url",
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
              onClick={() => deleteLinksById(record.ID)}
              style={{ borderRadius: "6px" }}
            />

          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/central-web/edit/${record.ID}`)}
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

  const deleteLinksById = async (id: string) => {
    let res = await DeleteLinksById(id);

    if (res.status === 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      await getLinks();
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getLinks = async () => {
    let res = await GetLinks();

    if (res.status === 200) {
      setLinks(res.data);
    } else {
      setLinks([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getLinks();
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
              จัดการเว็บศูนย์กลาง (Central Web)
            </Title>
          </Col>
          <Col>
            <Link to="/admin/central-web/create">
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
          dataSource={links}
          style={{
            width: "100%",
            borderRadius: "8px",
            overflowX: "auto",
          }}
          pagination={{ pageSize: 5 }}
          bordered
          scroll={{ x: "max-comtent"}}
        />
      </Card>
    </div>
  );
}

export default Central;