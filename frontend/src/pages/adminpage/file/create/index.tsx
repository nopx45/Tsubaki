import { useState } from "react";
import { Upload, Button, message, Card, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { UploadRequestFile } from "rc-upload/lib/interface";
import { UploadFile } from "../../../../services/https";

interface FileUploadProps {
  onUploadSuccess: () => void;
  onClose: () => void;
}

const { Title } = Typography;

function FileUpload({ onUploadSuccess, onClose }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<UploadRequestFile | null>(null);

  const handleUpload = async () => {
    if (!selectedFile) {
      message.warning("กรุณาเลือกไฟล์ก่อน!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await UploadFile(formData);
      message.success("อัปโหลดไฟล์สำเร็จ");
      setSelectedFile(null);
      onUploadSuccess(); // อัปเดตรายการไฟล์
      onClose(); // ปิด Modal
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card
        style={{
          textAlign: "center",
          background: "#E3F2FD",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          maxWidth: "500px",
        }}
      >
        <Title level={4} style={{ color: "#0D47A1", marginBottom: "20px" }}>
          อัปโหลดไฟล์
        </Title>

        <Upload 
          beforeUpload={(file) => {
            setSelectedFile(file);
            return false;
          }}
          showUploadList={false}
        >
          <Button
            icon={<UploadOutlined />}
            type="primary"
            size="large"
            style={{
              background: "#1976D2",
              borderColor: "#1976D2",
              borderRadius: "6px",
              fontWeight: "bold",
            }}
          >
            เลือกไฟล์
          </Button>
        </Upload>

        {selectedFile && typeof selectedFile === "object" && "name" in selectedFile && (
          <p style={{ marginTop: "15px", fontWeight: "bold", color: "#0D47A1" }}>
            📂 {selectedFile.name}
          </p>
        )}

        <Button
          type="primary"
          onClick={handleUpload}
          disabled={!selectedFile}
          style={{
            marginTop: 15,
            width: "100%",
            background: "#0D47A1",
            borderColor: "#0D47A1",
            borderRadius: "6px",
            fontWeight: "bold",
            color: "white"
          }}
        >
          อัปโหลดไฟล์
        </Button>
      </Card>
    </div>
  );
}

export default FileUpload;