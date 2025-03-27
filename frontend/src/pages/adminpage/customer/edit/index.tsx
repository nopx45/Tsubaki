import { useEffect } from "react";
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
import { PlusOutlined } from "@ant-design/icons";
import { UsersInterface } from "../../../../interfaces/IUser";
import { GetUsersById, UpdateUsersById } from "../../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";

const { Title } = Typography;

function CustomerEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm(); // สำหรับข้อมูลทั่วไป
  const [resetForm] = Form.useForm(); // สำหรับ reset password

  const getUserById = async (id: string) => {
    let res = await GetUsersById(id);
    if (res.status == 200) {
      form.setFieldsValue({
        first_name: res.data.first_name,
        last_name: res.data.last_name,
        email: res.data.email,
        username: res.data.username,
        role: res.data.role,
      });
    } else {
      messageApi.error("ไม่พบข้อมูลผู้ใช้");
      setTimeout(() => navigate("/admin/customer"), 2000);
    }
  };

  const onFinish = async (values: UsersInterface) => {
    const res = await UpdateUsersById(id, values);
    if (res.status === 200) {
      messageApi.success(res.data.message);
      setTimeout(() => navigate("/admin/customer"), 2000);
    } else {
      messageApi.error(res.data.error);
    }
  };

  const onFinish_reset = async (values: { reset_password?: string; confirm_reset_password?: string }) => {
    if (values.reset_password !== values.confirm_reset_password) {
      messageApi.error("รหัสผ่านไม่ตรงกัน");
      return;
    }

    const payload: Partial<UsersInterface> = {
      password: values.reset_password,
      ForcePasswordChange: true,
      
    };

    const res = await UpdateUsersById(id, payload);
    if (res.status === 200) {
      messageApi.success(res.data.message);
      setTimeout(() => navigate("/admin/customer"), 2000);
    } else {
      messageApi.error(res.data.error);
    }
  };

  useEffect(() => {
    getUserById(id);
  }, []);

  return (
    <div style={{ background: "#E3F2FD", minHeight: "100vh", padding: "30px" }}>
      {contextHolder}

      {/* Form แก้ไขข้อมูล */}
      <Row>
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
            แก้ไขข้อมูลผู้ใช้
          </Title>
          <Divider />

          <Form
            name="editUserForm"
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
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
                  label="ชื่อผู้ใช้"
                  name="username"
                  rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้ !" }]}
                >
                  <Input placeholder="กรอกชื่อผู้ใช้" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="สิทธิ์การใช้งาน"
                  name="role"
                  rules={[{ required: true, message: "กรุณาเลือกสิทธิ์ของ User !" }]}
                >
                  <Select
                    placeholder="เลือกสิทธิ์การใช้งาน"
                    options={[
                      { value: "admin", label: "Admin" },
                      { value: "superuser", label: "SuperUser" },
                      { value: "user", label: "User" },
                    ]}
                    style={{ borderRadius: "6px", width: "100%" }}
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
                      บันทึก
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Row>

      {/* Form Reset Password */}
      <Divider />
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
        <Form
          name="resetPasswordForm"
          form={resetForm}
          layout="vertical"
          onFinish={onFinish_reset}
          autoComplete="off"
        >
          <Title level={3} style={{ color: "#0D47A1", textAlign: "center" }}>
            Reset รหัสผ่านผู้ใช้
          </Title>
          <Divider />
          <Row justify="center" gutter={16}>
            <Col xs={24} style={{ display: "flex", justifyContent: "center" }}>
              <Form.Item
                label="รหัสผ่านใหม่"
                name="reset_password"
                rules={[
                  {
                    validator: async (_, value) => {
                      if (value && value.length < 6) {
                        return Promise.reject("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input.Password style={{ width: "300px" }} />
              </Form.Item>
            </Col>
            <Col xs={24} style={{ display: "flex", justifyContent: "center" }}>
              <Form.Item
                label="ยืนยันรหัสผ่านใหม่"
                name="confirm_reset_password"
                dependencies={["reset_password"]}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("reset_password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("รหัสผ่านไม่ตรงกัน");
                    },
                  }),
                ]}
              >
                <Input.Password style={{ width: "300px" }} />
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
                    บันทึก
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

export default CustomerEdit;
