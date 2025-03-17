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
  Typography,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { SectionsInterface } from "../../../../interfaces/ISection";
import { GetSectionsById, UpdateSectionsById } from "../../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";

const { Title } = Typography;

function SectionEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const getSectionsById = async (id: string) => {
    let res = await GetSectionsById(id);
    if (res.status == 200) {
      form.setFieldsValue({
        name: res.data.name,
        name_link: res.data.name_link,
        link_url: res.data.link_url,
      });
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลเว็บไซต์",
      });
      setTimeout(() => {
        navigate("/admin/section-web");
      }, 2000);
    }
  };

  const onFinish = async (values: SectionsInterface) => {
    const payload = {
      ...values
    };

    const res = await UpdateSectionsById(id, payload);
    if (res.status == 200) {
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

  useEffect(() => {
    getSectionsById(id);
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
          maxWidth: "800px",
          margin: "auto",
        }}
      >
        <Title level={3} style={{ color: "#0D47A1", textAlign: "center" }}>
          แก้ไขข้อมูลเว็บไซต์ (Section Web)
        </Title>
        <Divider />

        <Form
          name="basic"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 16]}>
          <Col xs={24}>
              <Form.Item
                label="ฝ่าย"
                name="name"
                rules={[{ required: true, message: "กรุณาเลือกฝ่าย !" }]}
              >
                  <Select
                    placeholder="กรุณาเลือกฝ่าย !"
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
                rules={[{ required: true, message: "กรุณากรอกชื่อเว็บไซต์ !" }]}
              >
                <Input placeholder="กรอกชื่อเว็บไซต์" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="url ของเว็บไซต์"
                name="link_url"
                rules={[{ required: true, message: "กรุณากรอก url ของเว็บไซต์ !" }]}
              >
                <Input.TextArea rows={4} placeholder="กรอก url ของเว็บไซต์" />
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

export default SectionEdit;