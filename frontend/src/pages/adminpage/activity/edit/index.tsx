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
import { GetActivitiesById, UpdateActivitiesById } from "../../../../services/https";

const { Title } = Typography;

function ActivityEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  /////// image /////////
  const [activity, setActivity] = useState<ImageUpload>();
  const [prevActivityImage, setprevActivityImage] = useState<string | undefined>(); 

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    setActivity(e?.fileList[0]);
    return e?.fileList;
  };

  const getActivitiesById = async (id: string) => {
    try {
      let res = await GetActivitiesById(id);
      if (res.status === 200) {
        setprevActivityImage(res.data.image);
        form.setFieldsValue({
          title: res.data.title,
          content: res.data.content,
        });
      } else {
        messageApi.open({
          type: "error",
          content: "ไม่พบข้อมูลกิจกรรม",
        });
        setTimeout(() => {
          navigate("/admin/activity");
        }, 2000);
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
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

    if (activity?.originFileObj && activity.originFileObj instanceof File) {
      formData.append("image", activity.originFileObj);
    } 
    else if (prevActivityImage) {
      formData.append("image", prevActivityImage);
    }

    try {
      let res = await UpdateActivitiesById(id, formData);
      if (res?.data?.message === "Updated successfully" || res?.data?.message === "Upload successful") {
        messageApi.open({
          type: "success",
          content: res?.message || "Upload successful!",
        });
        setTimeout(() => {
          navigate("/admin/activity");
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
    getActivitiesById(id);
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
          แก้ไขข้อมูล กิจกรรม
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
                label="ชื่อกิจกรรม"
                name="title"
                rules={[{ required: true, message: "กรุณากรอกชื่อกิจกรรม !" }]}
              >
                <Input placeholder="กรอกชื่อกิจกรรม" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="รายละเอียดกิจกรรม"
                name="content"
                rules={[{ required: true, message: "กรุณากรอกรายละเอียดกิจกรรม !" }]}
              >
                <Input.TextArea rows={4} placeholder="กรอกรายละเอียดกิจกรรม" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="รูปภาพกิจกรรม"
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

              {prevActivityImage && (
                <img
                  src={prevActivityImage}
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
                  <Link to="/admin/activity">
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

export default ActivityEdit;