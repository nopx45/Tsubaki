import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Col,
  Row,
  Divider,
  message,
  Modal,
  Popconfirm,
  Card,
  Typography,
} from "antd";
import { PlusOutlined, DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { GetFiles, DeleteFilesById, DownloadFile } from "../../../services/https/index";
import FileUpload from "./create"; // นำเข้า FileUpload

const { Title } = Typography;

function Files() {
  const [files, setFiles] = useState<{ id: string; filename?: string; filepath?: string; filetype?: string }[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false); // สร้าง state สำหรับ Modal

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

  useEffect(() => {
    fetchFiles();
  }, []);

  const deleteFileById = async (id: string) => {
    let res = await DeleteFilesById(id);
    if (res.status === 200) {
      messageApi.success(res.data.message);
      await fetchFiles();
    } else {
      messageApi.error(res.data.error);
    }
  };

  // ฟังก์ชันเปิด/ปิด Modal
  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const columns = [
    {
      title: "ลบไฟล์",
      render: (_: any, record: { id: string }) => (
        <Popconfirm
          title="ลบไฟล์"
          description="ต้องการลบไฟล์นี้หรือไม่?"
          okText="ใช่"
          cancelText="ไม่"
          onConfirm={() => deleteFileById(record.id)}
        >
          <Button type="default" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
    { title: "ลำดับการอัพโหลด", dataIndex: "id", key: "id" },
    { title: "ชื่อไฟล์", dataIndex: "file_name", key: "file_name" },
    { title: "ประเภทไฟล์", dataIndex: "file_type", key: "file_type" },
    {
      title: "ดาวน์โหลด",
      key: "Download",
      render: (_: any, record: { id: string; filename?: string }) => (
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={async () => {
            try {
              const blob = await DownloadFile(record.id);
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = record.filename || "downloaded-file";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            } catch (error) {
              message.error("Failed to download file");
            }
          }}
          style={{
            background: "#0D47A1",
            borderColor: "#0D47A1",
            color: "white",
            borderRadius: "6px",
          }}
        >
          Download
        </Button>
      ),
    },
  ];

  return (
    <div style={{ background: "#E3F2FD", minHeight: "100vh", padding: "30px" }}>
      {contextHolder}
      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          background: "white",
          padding: "20px",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ color: "#0D47A1", marginBottom: 0 }}>
              จัดการไฟล์
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showModal}
              style={{
                background: "#1976D2",
                borderColor: "#1976D2",
                borderRadius: "6px",
                fontWeight: "bold",
              }}
            >
              Upload File
            </Button>
          </Col>
        </Row>

        <Divider />

        <Table
          rowKey="ID"
          columns={columns}
          dataSource={files}
          pagination={{ pageSize: 5 }}
          bordered
          scroll={{ x: "max-comtent"}}
          style={{
            width: "100%",
            borderRadius: "8px",
            overflowX: "auto",
          }}
          components={{
            header: {
              cell: (props) => (
                <th
                  {...props}
                  style={{
                    backgroundColor: "#0D47A1",
                    color: "white",
                    fontWeight: "bold",
                    padding: "10px",
                    border: "none",
                  }}
                />
              ),
            },
          }}
          onRow={(_record, index) => ({
            style: {
              backgroundColor: (index ?? 0) % 2 === 0 ? "#f6ffff" : "#E8F9FF",
            },
          })}
        />
      </Card>

      {/* ✅ Modal สำหรับ Upload */}
      <Modal
        title="Upload File"
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
      >
        <FileUpload onUploadSuccess={fetchFiles} onClose={closeModal} />
      </Modal>
    </div>
  );
}

export default Files;