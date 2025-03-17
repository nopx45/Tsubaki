import { Button, Card, Form, Input, message, Flex, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { SignIn, AutoLogin, startvisit } from "../../../services/https";
import { SignInInterface } from "../../../interfaces/SignIn";
import logo from "../../../assets/logo.png";
import image from "../../../assets/header.jpg";
import { useEffect } from "react";

function SignInPages() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: SignInInterface) => {
    let res = await SignIn(values);
    if (res.status == 200) {
      await startvisit();
      messageApi.success("Sign-in successful");
      setTimeout(() => {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = res.data.redirect_url;
      }, 2000);
    } else {
      messageApi.error(res.data.error);
    }
  };

  useEffect(() => {
    async function tryAutoLogin() {
      const result = await AutoLogin();
      if (result.success) {
        messageApi.success("Auto-login successful");
        setTimeout(() => {
          localStorage.setItem("isLoggedIn", "true");
          navigate(result.redirectUrl);
        }, 2000);
      }
    }
    tryAutoLogin();
  }, []);
  
  return (
    <>
      {contextHolder}
      <div style={backgroundStyle} /> {/* ✅ พื้นหลังที่อยู่ด้านหน้าสุด */}
      <Flex justify="center" align="center" className="login">
        <Card className="card-login" style={{ width: 500, position: "relative", zIndex: 2 }}>
          <Row align={"middle"} justify={"center"} style={{ height: "400px" }}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <img alt="logo" style={{ width: "80%" }} src={logo} />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form name="basic" onFinish={onFinish} autoComplete="off" layout="vertical">
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[{ required: true, message: "Please input your username!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: "Please input your password!" }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="login-form-button" style={{ marginBottom: 20 }}>
                    Log in
                  </Button>
                  Or <a onClick={() => navigate("/signup")}>signup now !</a>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Card>
      </Flex>
    </>
  );
}

export default SignInPages;

const backgroundStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundImage: `url(${image})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  zIndex: 1,
  opacity: 1,
  filter: "blur(10px)",
};
