import logo from "../../../assets/logo.png";
import { Button, Card, Form, Input, Flex, Row, Col } from "antd";
import { SignInInterface } from "../../../interfaces/SignIn";
import { ChangesPassword, startvisit } from "../../../services/https";

function ChangePassword() {
    
const onFinish = async (values: SignInInterface) => {
    let res = await ChangesPassword(values);
    if (res.status == 200) {
        await startvisit();
        alert("Change Password success!");
        setTimeout(() => {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = res.data.redirect_url;
        }, 2000);
    } else {
        alert("Error!");
    }
};

    return (
        <>
            <div />
            <Flex justify="center" align="center" className="login">
                <Card className="card-login" style={{ width: 500, position: "relative", zIndex: 2 }}>
                <Row align={"middle"} justify={"center"} style={{ height: "400px" }}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <img alt="logo" style={{ width: "80%" }} src={logo} />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form name="basic" onFinish={onFinish} autoComplete="off" layout="vertical">
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
                        <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" style={{ marginBottom: 10 }}>
                            Change password
                        </Button>
                        </Form.Item>
                    </Form>
                    </Col>
                </Row>
                </Card>
            </Flex>
        </>
    );
};
export default ChangePassword;