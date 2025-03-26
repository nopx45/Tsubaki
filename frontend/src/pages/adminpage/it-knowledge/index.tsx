import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message, Card, Typography } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { DeleteKnowledgesById, GetKnowledges } from "../../../services/https/index";
import { KnowledgesInterface } from "../../../interfaces/IKnowledge";
import { Link, Outlet, useNavigate } from "react-router-dom";

const { Title } = Typography;

function ITKnowledges() {
  const navigate = useNavigate();
  const [knowledges, setKnowledges] = useState<KnowledgesInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const columns: ColumnsType<KnowledgesInterface> = [
    {
      title: "ไอดี",
      dataIndex: "ID",
      key: "id",
      width: 80,
      align: "center",
      render: (text) => <b style={{ color: "#0D47A1" }}>{text}</b>,
    },
    {
      title: "หัวข้อข่าวสาร",
      dataIndex: "title",
      key: "title",
      render: (text) => text.length > 30 ? text.substring(0, 30) + "..." : text,
    },
    {
      title: "รายละเอียด",
      dataIndex: "content",
      key: "content",
      render: (text) => text.length > 30 ? text.substring(0, 30) + "..." : text,
    },
    {
      title: "รูปภาพ",
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (_text, record) => {
        return record.Image ? (
          <img
            src={record.Image}
            alt="รูปภาพ"
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              borderRadius: "5px",
              border: "2px solid #0D47A1",
            }}
          />
        ) : (
          <span style={{ color: "gray" }}>ไม่มีรูปภาพ</span>
        );
      },
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
            onClick={() => deleteKnowledgesById(record.ID)}
            style={{ borderRadius: "6px" }}
          />

          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/it-knowledge/edit/${record.ID}`)}
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

  const deleteKnowledgesById = async (id: string) => {
    let res = await DeleteKnowledgesById(id);

    if (res.status === 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      await getKnowledges();
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getKnowledges = async () => {
    let res = await GetKnowledges();

    if (res.status === 200) {
      setKnowledges(res.data);
    } else {
      setKnowledges([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getKnowledges();
  }, []);

  return (
    <div style={{ background: "#E3F2FD", minHeight: "100vh", padding: "30px" }}>
      <Outlet />
      {contextHolder}
      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          background: "white",
          padding: "20px",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ color: "#0D47A1", marginBottom: 0 }}>
              จัดการข่าวสารไอที
            </Title>
          </Col>
          <Col>
            <Link to="/admin/it-knowledge/create">
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
          dataSource={knowledges}
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

export default ITKnowledges;