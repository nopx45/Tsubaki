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
  Typography,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { AnnouncementsInterface } from "../../../../interfaces/IAnnouncement";
import { GetAnnouncementsById, GetFiles, UpdateAnnouncementsById } from "../../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";
import { FilesInterface } from "../../../../interfaces/IFile";

const { Title } = Typography;

function AnnouncementEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [, setAnnounce] = useState<AnnouncementsInterface>();
  const [files, setFiles] = useState<FilesInterface[]>([]);

  const fetchFiles = async () => {
    try {
      const data = await GetFiles();
      const filesWithId = data.map((file) => ({
        ...file,
        id: file.ID ? file.ID.toString() : "",
      }));
      setFiles(filesWithId);
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  const getAnnouncementsById = async (id: string) => {
    let res = await GetAnnouncementsById(id);
    if (res.status == 200) {
        setAnnounce(res);
      form.setFieldsValue({
        title: res.data.title,
        content: res.data.content,
        file_id: res.data.file?.ID
      });
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลข่าวสารไอที",
      });
      setTimeout(() => {
        navigate("/admin/announcement");
      }, 2000);
    }
  };

  const onFinish = async (values: AnnouncementsInterface) => {
    const payload = {
      ...values
    };

    const res = await UpdateAnnouncementsById(id, payload);
    if (res.status == 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(() => {
        navigate("/admin/announcement");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getAnnouncementsById(id);
    fetchFiles();
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
          แก้ไขข้อมูล ประกาศ
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
                label="ชื่อประกาศ"
                name="title"
                rules={[{ required: true, message: "กรุณากรอกชื่อประกาศ !" }]}
              >
                <Input placeholder="กรอกชื่อประกาศ" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="รายละเอียด"
                name="content"
                rules={[{ required: true, message: "กรุณากรอกรายละเอียด !" }]}
              >
                <Input.TextArea rows={4} placeholder="กรอกรายละเอียด" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="ไฟล์ประกาศ"
                name="file_id"
                rules={[{ required: true, message: "กรุณาเลือกไฟล์ประกาศ !" }]}
              >
                <Select defaultValue="" style={{ width: "100%" }}>
                  {files?.map((item) => (
                    <Select.Option value={item?.ID}>
                      {item?.file_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Col>
              <Form.Item>
                <Space>
                  <Link to="/admin/announcement">
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

export default AnnouncementEdit;