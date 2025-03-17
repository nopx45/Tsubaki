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
import { useNavigate, Link, useParams } from "react-router-dom";
import { ImageUpload } from "../../../../interfaces/IUpload";
import { GetArticlesById, UpdateArticlesById } from "../../../../services/https";

const { Title } = Typography;

function ArticleEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  /////// image /////////
  const [article, setArticle] = useState<ImageUpload>();
  const [prevArticleImage, setprevArticleImage] = useState<string | undefined>(); 

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    setArticle(e?.fileList[0]);
    return e?.fileList;
  };

  const getArticlesById = async (id: string) => {
    try {
      let res = await GetArticlesById(id);
      if (res.status === 200) {
        setprevArticleImage(res.data.image);
        form.setFieldsValue({
          title: res.data.title,
          content: res.data.content,
        });
      } else {
        messageApi.open({
          type: "error",
          content: "ไม่พบข้อมูลบทความ",
        });
        setTimeout(() => {
          navigate("/admin/article");
        }, 2000);
      }
    } catch (error) {
      console.error("Error fetching article:", error);
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

    if (article?.originFileObj && article.originFileObj instanceof File) {
      formData.append("image", article.originFileObj);
    } 
    else if (prevArticleImage) {
      formData.append("image", prevArticleImage);
    }

    try {
      let res = await UpdateArticlesById(id, formData);
      if (res?.data?.message === "Updated successfully" || res?.data?.message === "Upload successful") {
        messageApi.open({
          type: "success",
          content: res?.message || "Upload successful!",
        });
        setTimeout(() => {
          navigate("/admin/article");
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
    getArticlesById(id);
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
          แก้ไขข้อมูลบทความ
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
                label="ชื่อบทความ"
                name="title"
                rules={[{ required: true, message: "กรุณากรอกชื่อบทความ !" }]}
              >
                <Input placeholder="กรอกชื่อบทความ" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="รายละเอียดบทความ"
                name="content"
                rules={[{ required: true, message: "กรุณากรอกรายละเอียดบทความ !" }]}
              >
                <Input.TextArea rows={4} placeholder="กรอกรายละเอียดบทความ" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="รูปภาพบทความ"
                name="image"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  listType="picture-card"
                  beforeUpload={() => false}
                  maxCount={1}
                  style={{
                    borderRadius: "6px",
                    border: "2px dashed #0D47A1",
                  }}
                >
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8, color: "#0D47A1" }}>อัพโหลด</div>
                  </div>
                </Upload>
              </Form.Item>

              {prevArticleImage && (
                <img
                  src={prevArticleImage}
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
                  <Link to="/admin/article">
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

export default ArticleEdit;