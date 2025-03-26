import React from 'react';
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

const SignUpPages: React.FC = () => {
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
        navigate("/signin");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  return (
    <div className="signup-container">
      {contextHolder}
      <div className="background-overlay" style={backgroundStyle} />
      
      <Flex 
        justify="center" 
        align="center" 
        className="signup-wrapper"
      >
        <Card 
          className="signup-card" 
          style={{ 
            width: 500, 
            borderRadius: '16px', 
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Row 
            align="middle" 
            justify="center" 
            className="signup-content"
          >
            <Col span={24} className="text-center mb-4">
              <img 
                alt="logo" 
                src={logo} 
                style={{ 
                  width: '60%', 
                  maxHeight: '120px', 
                  objectFit: 'contain' 
                }} 
              />
              <h2 className="signup-title">Create Your Account</h2>
            </Col>
            
            <Col span={24}>
              <Form
                name="register"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
                className="signup-form"
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                      label="First Name"
                      name="first_name"
                      rules={[{ required: true, message: "Please enter your first name" }]}
                    >
                      <Input 
                        size="large" 
                        placeholder="Enter first name"
                        className="rounded-input"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                      label="Last Name"
                      name="last_name"
                      rules={[{ required: true, message: "Please enter your last name" }]}
                    >
                      <Input 
                        size="large" 
                        placeholder="Enter last name"
                        className="rounded-input"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col span={24}>
                    <Form.Item
                      label="Username"
                      name="username"
                      rules={[{ required: true, message: "Please enter a username" }]}
                    >
                      <Input 
                        size="large" 
                        placeholder="Choose a username"
                        className="rounded-input"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col span={24}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { type: "email", message: "Invalid email format" },
                        { required: true, message: "Please enter your email" }
                      ]}
                    >
                      <Input 
                        size="large" 
                        placeholder="Enter your email"
                        className="rounded-input"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col span={24}>
                    <Form.Item
                      label="Phone Number"
                      name="phone"
                      rules={[{ required: true, message: "Please enter your phone number" }]}
                    >
                      <Input 
                        size="large" 
                        placeholder="Enter phone number"
                        className="rounded-input"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col span={24}>
                    <Form.Item
                      label="Password"
                      name="password"
                      rules={[
                        { required: true, message: "Please enter a password" },
                        { min: 6, message: "Password must be at least 6 characters" }
                      ]}
                      hasFeedback
                    >
                      <Input.Password 
                        size="large" 
                        placeholder="Create a password"
                        className="rounded-input"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col span={24}>
                    <Form.Item
                      label="Confirm Password"
                      name="confirm_password"
                      dependencies={["password"]}
                      rules={[
                        { required: true, message: "Please confirm your password" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Passwords do not match")
                            );
                          },
                        }),
                      ]}
                      hasFeedback
                    >
                      <Input.Password 
                        size="large" 
                        placeholder="Confirm password"
                        className="rounded-input"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col span={24}>
                    <Form.Item>
                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        size="large" 
                        block
                        className="signup-button"
                        style={{
                          borderRadius: '8px',
                          fontWeight: 600,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}
                      >
                        Sign Up
                      </Button>
                    </Form.Item>
                    
                    <div className="signup-footer text-center">
                      Already have an account? 
                      <a 
                        onClick={() => navigate("/signin")} 
                        className="signin-link ml-2"
                      >
                        Sign in now
                      </a>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Card>
      </Flex>

      <style>{`
        .signup-container {
          min-height: 100vh;
          padding: 2rem 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: auto;
          background-color: #f0f2f5;
        }

        .background-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-size: cover;
          background-position: 80% 30%;
          background-repeat: no-repeat;
          filter: blur(10px) brightness(0.9);
          z-index: 0;
        }

        .signup-wrapper {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 600px;
        }

        .signup-card {
          transition: all 0.3s ease;
        }

        .signup-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
        }

        .signup-title {
          text-align: center;
          margin-top: 16px;
          color: #333;
          font-weight: 600;
        }

        .signup-footer {
          margin-top: 16px;
          text-align: center;
        }

        .signin-link {
          color: #1890ff;
          font-weight: 500;
          margin-left: 4px;
          cursor: pointer;
        }

        .signin-link:hover {
          text-decoration: underline;
        }

        .rounded-input {
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default SignUpPages;

const backgroundStyle: React.CSSProperties = {
  backgroundImage: `url(${image})`,
  backgroundSize: "cover",
  backgroundPosition: "80% 30%",
};