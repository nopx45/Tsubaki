import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message, Card, Typography } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { DeleteActivitiesById, GetActivities } from "../../../services/https/index";
import { ActivitiesInterface } from "../../../interfaces/IActivity";
import { Link, Outlet, useNavigate } from "react-router-dom";

const { Title } = Typography;

function Activity() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivitiesInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const columns: ColumnsType<ActivitiesInterface> = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
      width: 80,
      align: "center",
      render: (text) => <b style={{ color: "#0D47A1" }}>{text}</b>,
    },
    {
      title: "ชื่อกิจกรรม",
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
            onClick={() => deleteActivitiesById(record.ID)}
            style={{ borderRadius: "6px" }}
          />

          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/activity/edit/${record.ID}`)}
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

  const deleteActivitiesById = async (id: string) => {
    let res = await DeleteActivitiesById(id);

    if (res.status === 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      await getActivities();
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getActivities = async () => {
    let res = await GetActivities();

    if (res.status === 200) {
      setActivities(res.data);
    } else {
      setActivities([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getActivities();
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
              จัดการกิจกรรม
            </Title>
          </Col>
          <Col>
            <Link to="/admin/activity/create">
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
          dataSource={activities}
          style={{
            width: "100%",
            borderRadius: "8px",
            overflow: "hidden",
          }}
          pagination={{ pageSize: 5 }}
          bordered
        />
      </Card>
    </div>
  );
}

export default Activity;