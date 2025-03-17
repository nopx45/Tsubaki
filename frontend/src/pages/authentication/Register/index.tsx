import {
  Button,
  Card,
  Form,
  Input,
  message,
  Flex,
  Row,
  Col,
} from "antd";
import { useNavigate } from "react-router-dom";
import { CreateUser } from "../../../services/https";
import { UsersInterface } from "../../../interfaces/IUser";
import logo from "../../../assets/logo.png";
import image from "../../../assets/header.jpg";

function SignUpPages() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: UsersInterface) => {
    let res = await CreateUser(values);
    if (res.status === 201) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(function () {
        navigate("/");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  return (
    <>
      {contextHolder}
      <div style={backgroundStyle} />
      <Flex justify="center" align="center" className="login">
        <Card className="card-login" style={{ width: 600 }}>
          <Row align={"middle"} justify={"center"}>
            <Col xs={24} sm={24} md={24} lg={10} xl={10}>
              <img alt="logo" src={logo} className="images-logo" />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <h2 className="header">Sign Up</h2>
              <Form
                name="register"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Row gutter={[16, 0]} align={"middle"}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="ชื่อจริง"
                      name="first_name"
                      rules={[{ required: true, message: "กรุณากรอกชื่อ !" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="นามสกุล"
                      name="last_name"
                      rules={[
                        { required: true, message: "กรุณากรอกนามสกุล !" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="Username (ต้องตรงกับชื่อในคอมพิวเตอร์)"
                      name="username"
                      rules={[
                        { required: true, message: "กรุณากรอกชื่อผู้ใช้ !" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="อีเมล"
                      name="email"
                      rules={[
                        { type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง !" },
                        { required: true, message: "กรุณากรอกอีเมล !" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="เบอร์โทร"
                      name="phone"
                      rules={[
                        { required: true, message: "กรุณากรอกเบอร์โทร !" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="รหัสผ่าน"
                      name="password"
                      rules={[
                        { required: true, message: "กรุณากรอกรหัสผ่าน !" },
                        { min: 6, message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร !" },
                      ]}
                      hasFeedback
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="ยืนยันรหัสผ่าน"
                      name="confirm_password"
                      dependencies={["password"]}
                      rules={[
                        { required: true, message: "กรุณากรอกยืนยันรหัสผ่าน !" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("รหัสผ่านไม่ตรงกัน !")
                            );
                          },
                        }),
                      ]}
                      hasFeedback
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                        style={{ marginBottom: 20 }}
                      >
                        Sign up
                      </Button>
                      Or <a onClick={() => navigate("/signin")}>signin now !</a>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Card>
      </Flex>
    </>
  );
}

export default SignUpPages;

const backgroundStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundImage: `url(${image})`,
  backgroundSize: "cover",
  backgroundPosition: "80% 30%",
  filter: "blur(10px)",
};