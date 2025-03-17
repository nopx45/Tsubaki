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
import { GetAnnouncements, DeleteAnnouncementsById } from "../../../services/https/index";
import { Link, useNavigate } from "react-router-dom";
import { AnnouncementsInterface } from "../../../interfaces/IAnnouncement";
import dayjs from "dayjs";

const { Title } = Typography;
dayjs.locale("th");

function Announcement() {
  const navigate = useNavigate();
  const [announces, setAnnounces] = useState<AnnouncementsInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const myId = localStorage.getItem("id");

  const columns: ColumnsType<AnnouncementsInterface> = [
    {
      title: "ประกาศฉบับที่",
      dataIndex: "ID",
      key: "id",
      width: 80,
      align: "center",
      render: (text) => <b style={{ color: "#0D47A1" }}>{text}</b>,
    },
    {
      title: "วันที่ประกาศ",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "ชื่อประกาศ",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "รายละเอียด",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "ID ไฟล์ประกาศ",
      dataIndex: "file_id",
      key: "file_id",
    },
    {
      title: "จัดการ",
      align: "center",
      render: (record) => (
        <Space size="middle">
          {myId !== record?.ID && (
            <Button
              type="default"
              danger
              icon={<DeleteOutlined />}
              onClick={() => deleteAnnounceById(record.ID)}
              style={{ borderRadius: "6px" }}
            />
          )}

          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/announcement/edit/${record.ID}`)}
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

  const deleteAnnounceById = async (id: string) => {
    let res = await DeleteAnnouncementsById(id);

    if (res.status === 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      await getAnnouncements();
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getAnnouncements = async () => {
    let res = await GetAnnouncements();

    if (res.status === 200) {
      setAnnounces(res.data);
    } else {
      setAnnounces([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getAnnouncements();
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
              จัดการประกาศบริษัทฯ
            </Title>
          </Col>
          <Col>
            <Link to="/admin/announcement/create">
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
          dataSource={announces}
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

export default Announcement;