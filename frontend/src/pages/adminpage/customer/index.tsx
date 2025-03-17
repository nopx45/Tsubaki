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
import { GetUsers, DeleteUsersById } from "../../../services/https/index";
import { UsersInterface } from "../../../interfaces/IUser";
import { Link, useNavigate } from "react-router-dom";

const { Title } = Typography;

function Customers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UsersInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const myId = localStorage.getItem("id");

  const columns: ColumnsType<UsersInterface> = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
      width: 80,
      align: "center",
      render: (text) => <b style={{ color: "#0D47A1" }}>{text}</b>,
    },
    {
      title: "ชื่อ",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "นามสกุล",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "ชื่อผู้ใช้",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "อีเมล",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "สิทธิ์การใช้งาน",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (text) => (
        <span
          style={{
            padding: "5px 10px",
            borderRadius: "6px",
            background: text === "admin" ? "ORANGE" :   text === "adminit" ? "GREEN" : text === "adminhr" ? "GREEN" : "BLUE",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {text}
        </span>
      ),
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
              onClick={() => deleteUserById(record.ID)}
              style={{ borderRadius: "6px" }}
            />
          )}

          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/customer/edit/${record.ID}`)}
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

  const deleteUserById = async (id: string) => {
    let res = await DeleteUsersById(id);

    if (res.status === 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      await getUsers();
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getUsers = async () => {
    let res = await GetUsers();

    if (res.status === 200) {
      setUsers(res.data);
    } else {
      setUsers([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getUsers();
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
              จัดการข้อมูลสมาชิก
            </Title>
          </Col>
          <Col>
            <Link to="/admin/customer/create">
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
          dataSource={users}
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

export default Customers;