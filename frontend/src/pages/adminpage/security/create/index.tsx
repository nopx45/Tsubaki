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
  Upload,
  Typography,
} from "antd";
import { useState } from "react";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { CreateSecurity } from "../../../../services/https";

const { Title } = Typography;

function SecurityCreate() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: any) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);
    if (file) {
      formData.append("image", file);
    }
  
    try {
      let res = await CreateSecurity(formData);
      if (res?.message === "Upload successful") {
        messageApi.open({
          type: "success",
          content: res?.message || "Upload successful!",
        });
        setTimeout(() => {
          navigate("/admin/security");
        }, 2000);
      } else {
        console.error("Upload failed:", res);
        messageApi.open({
          type: "error",
          content: res?.error || "Upload failed",
        });
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      messageApi.open({
        type: "error",
        content: err?.response?.data?.error || "Something went wrong!",
      });
    }
  };  

  const handleUpload = (info: any) => {
    if (info.file.status === "done" || info.file.status === "uploading") {
      setFile(info.file.originFileObj);
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
          เพิ่มข้อมูล ข่าวสารความปลอดภัย
        </Title>
        <Divider />

        <Form name="basic" layout="vertical" onFinish={onFinish} autoComplete="off">
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item
                label="ชื่อหัวข้อ"
                name="title"
                rules={[
                  { required: true, message: "กรุณากรอกหัวข้อ !" },
                ]}
              >
                <Input placeholder="กรอกหัวข้อ" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="รายละเอียด"
                name="content"
                rules={[
                  { required: true, message: "กรุณากรอกรายละเอียด !" },
                ]}
              >
                <Input.TextArea rows={4} placeholder="กรอกรายละเอียด" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="รูป"
                name="Image"
                rules={[
                  { required: true, message: "กรุณาอัพโหลดรูปภาพ !" },
                ]}
              >
                <Upload
                  beforeUpload={(file) => {
                    setFile(file);
                    return false;
                  }}
                  listType="picture-card"
                  maxCount={1}
                  onChange={handleUpload}
                >
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8, color: "#0D47A1" }}>อัพโหลด</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Col>
              <Form.Item>
                <Space>
                  <Link to="/admin/security">
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

export default SecurityCreate;