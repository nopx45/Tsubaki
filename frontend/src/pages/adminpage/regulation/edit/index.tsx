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
    Upload,
  } from "antd";
  import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
  import { UpdateRegulationsById, GetRegulationsById } from "../../../../services/https";
  import { useNavigate, Link, useParams } from "react-router-dom";
  import { useEffect, useState } from "react";
  import { UploadRequestFile } from "rc-upload/lib/interface";
  
  const { Title } = Typography;
  
  function RegulationEdit() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: any }>();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedFile, setSelectedFile] = useState<UploadRequestFile | null>(null);
    
    const handleFinish = async (values: any) => {
      const formData = new FormData();
      formData.append("name", values.name);
      if (selectedFile) {
        formData.append("file", selectedFile as Blob);
      }
  
      try {
        await UpdateRegulationsById(id, formData);
        message.success("อัปเดตข้อมูลสำเร็จ");
        setSelectedFile(null);
        navigate("/admin/regulation");
      } catch (error) {
        message.error((error as Error).message);
      }
    };
    
    const getRegulationsById = async (id: string) => {
      try {
        let res = await GetRegulationsById(id);
        if (res.status === 200) {
          form.setFieldsValue({
            name: res.data.name,
          });
        } else {
          messageApi.open({
            type: "error",
            content: "ไม่พบข้อมูลกฏระเบียบ",
          });
          setTimeout(() => {
            navigate("/admin/regulation");
          }, 2000);
        }
      } catch (error) {
        console.error("Error fetching regulation:", error);
        messageApi.open({
          type: "error",
          content: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
        });
      }
    };
    
    useEffect(() => {
      getRegulationsById(id);
    }, [id]);
  
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
            แก้ไขกฏข้อบังคับบริษัท
          </Title>
          <Divider />
  
          <Form form={form} name="basic" layout="vertical" onFinish={handleFinish} autoComplete="off">
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  label="ชื่อไฟล์"
                  name="name"
                  rules={[{ required: true, message: "กรุณากรอกชื่อไฟล์!" }]}
                >
                  <Input placeholder="กรอกชื่อไฟล์" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item label="อัพโหลดไฟล์" name="file">
                  <Upload 
                    beforeUpload={(file) => {
                      setSelectedFile(file);
                      return false;
                    }}
                    showUploadList={{ showRemoveIcon: true }}
                    onRemove={() => setSelectedFile(null)}
                  >
                    <Button icon={<UploadOutlined />}>เลือกไฟล์</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Col>
                <Form.Item>
                  <Space>
                    <Link to="/admin/regulation">
                      <Button htmlType="button" style={{ borderRadius: "6px" }}>
                        ยกเลิก
                      </Button>
                    </Link>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<PlusOutlined />}
                      style={{ background: "#1976D2", borderColor: "#1976D2", borderRadius: "6px", fontWeight: "bold" }}
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
  
  export default RegulationEdit;  