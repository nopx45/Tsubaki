import { useEffect, useState } from "react";
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
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { GetKnowledgesById, UpdateKnowledgesById } from "../../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";
import { ImageUpload } from "../../../../interfaces/IUpload";

const { Title } = Typography;

function ITKnowledgeEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  /////// image /////////
  const [itKnowledge, setIIKnowledge] = useState<ImageUpload>();
  const [prevKnowledgeImage, setPrevKnowledgeImage] = useState<string | undefined>();

  // ฟังก์ชันแปลงไฟล์ที่อัปโหลดเป็นค่าที่ใช้งานได้ใน Form
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    setIIKnowledge(e?.fileList[0]);
    return e?.fileList;
  };

  // โหลดข้อมูลข่าวสาร IT จาก API
  const getKnowledgesById = async (id: string) => {
    try {
      let res = await GetKnowledgesById(id);
      if (res.status === 200) {
        setPrevKnowledgeImage(res.data.image);
        form.setFieldsValue({
          title: res.data.title,
          content: res.data.content,
        });
      } else {
        messageApi.open({
          type: "error",
          content: "ไม่พบข้อมูลข่าวสารไอที",
        });
        setTimeout(() => {
          navigate("/admin/it-knowledge");
        }, 2000);
      }
    } catch (error) {
      console.error("Error fetching knowledge:", error);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
      });
    }
  };

  const onFinish = async (values: any) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);

    if (itKnowledge?.originFileObj && itKnowledge.originFileObj instanceof File) {
      formData.append("image", itKnowledge.originFileObj);
    } 
    else if (prevKnowledgeImage) {
      formData.append("image", prevKnowledgeImage);
    }

    try {
      let res = await UpdateKnowledgesById(id, formData);
      if (res?.data?.message === "Updated successfully" || res?.data?.message === "Upload successful") {
        messageApi.open({
          type: "success",
          content: res?.message || "Upload successful!",
        });
        setTimeout(() => {
          navigate("/admin/it-knowledge");
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

  useEffect(() => {
    getKnowledgesById(id);
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
          แก้ไขข้อมูล ข่าวสารไอที
        </Title>
        <Divider />

        <Form name="basic" form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item
                label="หัวข้อข่าวสาร"
                name="title"
                rules={[{ required: true, message: "กรุณากรอกหัวข้อข่าว !" }]}
              >
                <Input placeholder="กรอกหัวข้อข่าวสาร IT" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="รายละเอียดข่าวสาร"
                name="content"
                rules={[{ required: true, message: "กรุณากรอกรายละเอียดข่าวสาร !" }]}
              >
                <Input.TextArea rows={4} placeholder="กรอกรายละเอียดข่าวสาร" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="รูปภาพข่าวสาร" name="image" valuePropName="fileList" getValueFromEvent={normFile}>
                <Upload listType="picture-card" beforeUpload={() => false} maxCount={1}>
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8, color: "#0D47A1" }}>อัพโหลด</div>
                  </div>
                </Upload>
              </Form.Item>

              {/* ✅ แสดงรูปเดิมถ้ามี */}
              {prevKnowledgeImage && (
                <img
                  src={`http://localhost:8080/${prevKnowledgeImage}`}
                  alt="Preview"
                  style={{
                    width: "100%",
                    borderRadius: "6px",
                    marginTop: "10px",
                    border: "2px solid #0D47A1",
                  }}
                />
              )}
            </Col>
          </Row>

          <Row justify="end">
            <Col>
              <Form.Item>
                <Space>
                  <Link to="/admin/it-knowledge">
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

export default ITKnowledgeEdit;