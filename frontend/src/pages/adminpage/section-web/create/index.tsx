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
    Typography,
    Select,
  } from "antd";
  import { PlusOutlined } from "@ant-design/icons";
  import { CreateSection } from "../../../../services/https";
  import { useNavigate, Link } from "react-router-dom";
import { SectionsInterface } from "../../../../interfaces/ISection";
  
  const { Title } = Typography;
  
  function SectionCreate() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    
    const onFinish = async (values: SectionsInterface) => {
      let res = await CreateSection(values);
  
      if (res.status === 201) {
        messageApi.open({
          type: "success",
          content: res.data.message,
        });
        setTimeout(() => {
          navigate("/admin/section-web");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: res.data.error,
        });
      }
    };
  
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
            เพิ่มเว็บไซต์ (Section Web)
          </Title>
          <Divider />
  
          <Form
            name="basic"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  label="ฝ่าย"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาเลือกฝ่าย !",
                    },
                  ]}
                >
                  <Select
                    placeholder="กรุณาเลือกฝ่าย"
                    style={{ width: "40%" }}
                    options={[
                        { value: 'HR', label: 'HR' },
                        { value: 'ACC', label: 'ACC' },
                        { value: 'QA', label: 'QA' },
                        { value: 'MKT', label: 'MKT' },
                        { value: 'IT', label: 'IT' },
                        { value: 'ME/PE', label: 'ME/PE' },
                        { value: 'Safety', label: 'Safety' },
                        { value: 'WH', label: 'WH' },
                        { value: 'PC', label: 'PC' },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  label="ชื่อเว็บไซต์"
                  name="name_link"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกชื่อเว็บไซต์ !",
                    },
                  ]}
                >
                  <Input placeholder="กรอกชื่อเว็บไซต์" />
                </Form.Item>
              </Col>
  
              <Col xs={24}>
                <Form.Item
                  label="url เว็บไซต์"
                  name="link_url"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอก url เว็บไซต์ !",
                    },
                  ]}
                >
                  <Input.TextArea rows={4} placeholder="กรุณากรอก url เว็บไซต์ !" />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Col>
                <Form.Item>
                  <Space>
                    <Link to="/admin/section-web">
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
  
  export default SectionCreate;