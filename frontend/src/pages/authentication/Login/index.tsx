import React from 'react';
import { Button, Card, Form, Input, message, Flex, Row, Col } from "antd";
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { SignIn, startvisit } from "../../../services/https";
import { SignInInterface } from "../../../interfaces/SignIn";
import logo from "../../../assets/logo.png";
import image from "../../../assets/header.jpg";

const SignInPages: React.FC = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: SignInInterface) => {
    let res = await SignIn(values);
    if (res.status == 200) {
      localStorage.setItem("isLoggedIn", "true");
      await startvisit();
      messageApi.success("Sign-in successful");
    
      setTimeout(() => {
        if (res.data.force_password_change) {
          navigate("/change-password", { replace: true });
          window.location.reload();
        } else {
          navigate(res.data.redirect_url, { replace: true });
        }
      }, 2000);
    }
    else messageApi.error("username or password is wrong!!");
  };

  return (
    <div className="signin-container">
      {contextHolder}
      <div className="background-overlay" style={backgroundStyle} />
      
      <Flex 
        justify="center" 
        align="center" 
        className="login-wrapper"
      >
        <Card 
          className="login-card" 
          style={{ 
            width: 400, 
            borderRadius: '16px', 
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Row 
            align="middle" 
            justify="center" 
            className="login-content"
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
            </Col>
            
            <Col span={24}>
              <Form 
                name="signin" 
                onFinish={onFinish} 
                autoComplete="off" 
                layout="vertical"
                className="signin-form"
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[{ 
                    required: true, 
                    message: "Please input your username!" 
                  }]}
                >
                  <Input 
                    size="large" 
                    prefix={<AiOutlineUser />}
                    placeholder="Enter your username"
                    className="rounded-input"
                  />
                </Form.Item>
                
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ 
                    required: true, 
                    message: "Please input your password!" 
                  }]}
                >
                  <Input.Password 
                    size="large"
                    prefix={<AiOutlineLock />}
                    placeholder="Enter your password"
                    className="rounded-input"
                  />
                </Form.Item>
                
                <Form.Item className="mt-4">
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large" 
                    block
                    className="login-button"
                    style={{
                      borderRadius: '8px',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  >
                    Log In
                  </Button>
                </Form.Item>
                
                <div className="login-footer">
                  <div className="login-links">
                    <a 
                      onClick={() => navigate("/signup")} 
                      className="signup-link"
                    >
                      Create an account
                    </a>
                    <span 
                      className="forgot-password-text"
                    >
                      Contact IT if you forgot your password
                    </span>
                  </div>
                </div>
              </Form>
            </Col>
          </Row>
        </Card>
      </Flex>

      <style>{`
        .signin-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .background-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-size: cover;
          background-position: center;
          filter: blur(10px);
          z-index: 1;
        }
        
        .login-wrapper {
          position: relative;
          z-index: 2;
        }
        
        .login-card {
          transition: all 0.3s ease;
        }
        
        .login-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
        }
        
        .login-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
        }
        
        .signup-link {
          color: #1890ff;
          font-weight: 500;
        }
        
        .forgot-password-text {
          color: #8c8c8c;
          font-size: 12px;
        }
        
        .rounded-input {
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default SignInPages;

const backgroundStyle: React.CSSProperties = {
  backgroundImage: `url(${image})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};