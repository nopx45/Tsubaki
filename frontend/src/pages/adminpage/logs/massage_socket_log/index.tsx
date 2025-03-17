import Table, { ColumnsType } from "antd/es/table";
import { MessagesInterface } from "../../../../interfaces/IMessage";
import { Button, Card, Col, Divider, Popconfirm, Row, Space, message} from "antd";
import dayjs from "dayjs";
import { DeleteMessagesById, GetMessages } from "../../../../services/https";
import { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import Regulations from "../../../../components/ranbow-text/ranbow_text";

dayjs.locale("th");

function MessagesLog() {
    const [Messages, setMessage] = useState<MessagesInterface[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    const columns: ColumnsType<MessagesInterface> = [
        {
            title: "Created At",
            dataIndex: "create_at",
            key: "crate_at",
            align: "center",
            render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm"),
        },
        {
          title: "From",
          dataIndex: "from",
          key: "from",
          align: "center",
          render: (text) => <b style={{ color: "#17d632" }}>{text}</b>,
        },
        {
          title: "Role",
          dataIndex: "role",
          key: "role",
          align: "center",
          render: (text) => <b style={{ color: "#c19c1c" }}>{text}</b>,
        },
        {
          title: "Content",
          dataIndex: "content",
          key: "content",
          render: (text) => <b style={{ color: "#0D47A1" }}>{text}</b>,
        },   
        {
          title: "จัดการ",
          align: "center",
          render: (record) => (
            <Space size="middle">
              <Popconfirm
                placement="top"
                title="Delete!"
                description="Are you sure to delete this data?"
                okText="Yes"
                cancelText="No"
                onConfirm={async () => {
                    if (record?.id) {
                      await deleteMessagesByID(record.id);
                    } else {
                      setTimeout(() => {
                        messageApi.open({
                          type: "error",
                          content: "ไม่พบ ID ที่ต้องการลบ",
                        });
                      }, 100);
                    }
                  }}
                  
                >
                <Button
                    type="default"
                    danger
                    icon={<DeleteOutlined />}
                    style={{ borderRadius: "6px" }}
                />
                </Popconfirm>
            </Space>
          ),      
        },
      ];
    
      const getMessages = async () => {
        let res = await GetMessages();
        
        if (res.status === 200) {
          setMessage(res.data); 
        } else {
            setMessage([]);
          messageApi.open({
            type: "error",
            content: res.data.error,
          });
        }
      };
      
      const deleteMessagesByID = async (id: string) => {
        let res = await DeleteMessagesById(id);
    
        if (res.status === 200) {
          messageApi.open({
            type: "success",
            content: res.data.message,
          });
          await getMessages();
        } else {
          messageApi.open({
            type: "error",
            content: res.data.error,
          });
        }
      };
      
    
      useEffect(() => {
        getMessages();
      }, []);
        
    return (
        <div>
            {contextHolder}
            <Card
                    style={{
                    borderRadius: "12px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    background: "white",
                    padding: "10px",
                    maxWidth: "1200px",
                    margin: "auto",
                    marginTop: "10px",
                    }}
                >
                    <Row justify="space-between" align="middle">
                    <Col>
                        <Regulations text="Message Log" />
                    </Col>
                    </Row>
                    <Divider />
                    <Table
                    rowKey="ID"
                    columns={columns}
                    dataSource={Messages}
                    style={{ width: "100%", borderRadius: "8px", overflow: "hidden" }}
                    pagination={{ pageSize: 10 }}
                    bordered
                    />
                </Card>
        </div>
    );
}
export default MessagesLog;