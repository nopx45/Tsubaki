import Table, { ColumnsType } from "antd/es/table";
import { UserSocketsInterface } from "../../../../interfaces/IUserSocket";
import { Button, Card, Col, Divider, Popconfirm, Row, Space, message} from "antd";
import dayjs from "dayjs";
import { DeleteUserSocketsById, GetUserSockets } from "../../../../services/https";
import { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import Regulations from "../../../../components/ranbow-text/ranbow_text";

dayjs.locale("th");

function UserSocketLog() {
    const [userSockets, setUserSocket] = useState<UserSocketsInterface[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    const columns: ColumnsType<UserSocketsInterface> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 50,
            align: "center",
            render: (text) => <b style={{ color: "#17d632" }}>{text}</b>,
        },
        {
          title: "Username",
          dataIndex: "username",
          key: "User_name",
          width: 80,
          align: "center",
          render: (text) => <b style={{ color: "#17d632" }}>{text}</b>,
        },
        {
          title: "Socket ID",
          dataIndex: "socketId",
          key: "socket_id",
          align: "center",
          render: (text) => <b style={{ color: "#c19c1c" }}>{text}</b>,
        },
        {
          title: "Role",
          dataIndex: "role",
          key: "role",
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
                      await deleteUserSocketsByID(record.id);
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
    
      const getUserSockets = async () => {
        let res = await GetUserSockets();
        
        if (res.status === 200) {
          setUserSocket(res.data); 
        } else {
            setUserSocket([]);
          messageApi.open({
            type: "error",
            content: res.data.error,
          });
        }
      };
      
      const deleteUserSocketsByID = async (id: string) => {
        let res = await DeleteUserSocketsById(id);
    
        if (res.status === 200) {
          messageApi.open({
            type: "success",
            content: res.data.message,
          });
          await getUserSockets();
        } else {
          messageApi.open({
            type: "error",
            content: res.data.error,
          });
        }
      };
      
    
      useEffect(() => {
        getUserSockets();
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
                        <Regulations text="User Socket Log" />
                    </Col>
                    </Row>
                    <Divider />
                    <Table
                    rowKey="ID"
                    columns={columns}
                    dataSource={userSockets}
                    style={{ width: "100%", borderRadius: "8px", overflowX: "auto" }}
                    pagination={{ pageSize: 10 }}
                    bordered
                    scroll={{ x: "max-comtent"}}
                    />
                </Card>
        </div>
    );
}
export default UserSocketLog;