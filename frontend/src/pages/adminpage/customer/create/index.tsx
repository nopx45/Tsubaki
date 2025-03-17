import {
  Space,
  Button,
  Col,
  Row,
  Divider,
  Form,
  Input,
  Card,
  message,
  Select,
  Typography,
} from "antd";
import { useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { UsersInterface } from "../../../../interfaces/IUser";
import { CreateUser } from "../../../../services/https";
import { useNavigate, Link } from "react-router-dom";

const { Title } = Typography;

function CustomerCreate() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: UsersInterface) => {
    let res = await CreateUser(values);

    if (res.status == 201) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(() => {
        navigate("/admin/customer");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {}, []);

  return (
    <div style={{ background: "#E3F2FD", minHeight: "100vh", padding: "30px" }}>
      {contextHolder}
      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          background: "white",
          padding: "20px",
          maxWidth: "800px",
          margin: "auto",
        }}
      >
        <Title level={3} style={{ color: "#0D47A1", textAlign: "center" }}>
          เพิ่มข้อมูลผู้ใช้
        </Title>
        <Divider />

        <Form name="basic" layout="vertical" onFinish={onFinish} autoComplete="off">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="ชื่อจริง"
                name="first_name"
                rules={[{ required: true, message: "กรุณากรอกชื่อ !" }]}
              >
                <Input placeholder="กรอกชื่อจริง" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="นามสกุล"
                name="last_name"
                rules={[{ required: true, message: "กรุณากรอกนามสกุล !" }]}
              >
                <Input placeholder="กรอกนามสกุล" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="ชื่อผู้ใช้"
                name="username"
                rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้ !" }]}
              >
                <Input placeholder="กรอกชื่อผู้ใช้" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="อีเมล"
                name="email"
                rules={[
                  { type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง !" },
                  { required: true, message: "กรุณากรอกอีเมล !" },
                ]}
              >
                <Input placeholder="กรอกอีเมล" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="เบอร์โทรศัพท์"
                name="phone"
                rules={[{ required: true, message: "กรุณากรอกเบอร์โทรศัพท์ !" }]}
              >
                <Input placeholder="กรอกเบอร์โทรศัพท์" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="รหัสผ่าน"
                name="password"
                rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน !" }]}
              >
                <Input.Password placeholder="กรอกรหัสผ่าน" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="สิทธิ์การเข้าถึง"
                name="role"
                rules={[{ required: true, message: "กรุณาให้สิทธิ์ !" }]}
              >
                <Select
                  placeholder="เลือกสิทธิ์การเข้าถึง"
                  options={[
                    { value: "admin", label: "Admin" },
                    { value: "adminit", label: "Admin IT" },
                    { value: "adminhr", label: "Admin HR" },
                    { value: "user", label: "User" },
                  ]}
                  style={{ borderRadius: "6px" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Col>
              <Form.Item>
                <Space>
                  <Link to="/admin/customer">
                    <Button htmlType="button" style={{ borderRadius: "6px" }}>
                      ยกเลิก
                    </Button>
                  </Link>

                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                    style={{
                      background: "#1976D2",
                      borderColor: "#1976D2",
                      borderRadius: "6px",
                      fontWeight: "bold",
                    }}
                  >
                    ยืนยัน
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default CustomerCreate;