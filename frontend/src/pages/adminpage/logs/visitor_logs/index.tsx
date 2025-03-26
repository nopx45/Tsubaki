import Table, { ColumnsType } from "antd/es/table";
import { VisitsInterface } from "../../../../interfaces/IVisit";
import { Button, Card, Col, Divider, Popconfirm, Row, Space, message} from "antd";
import dayjs from "dayjs";
import { DeleteVisitorsById, GetAllTotalVisitors } from "../../../../services/https";
import { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import Regulations from "../../../../components/ranbow-text/ranbow_text";

dayjs.locale("th");

function VisitorLog() {
    const [visitors, setVisitors] = useState<VisitsInterface[]>([]);
    const [messageApi, contextHolder ] = message.useMessage();

    const columns: ColumnsType<VisitsInterface> = [
        {
          title: "Username",
          dataIndex: "username",
          key: "User_name",
          width: 80,
          align: "center",
          render: (text) => <b style={{ color: "#17d632" }}>{text}</b>,
        },
        {
          title: "User IP",
          dataIndex: "user_ip",
          key: "ip",
          width: 80,
          align: "center",
          render: (text) => <b style={{ color: "#0D47A1" }}>{text}</b>,
        },
        {
          title: "Login",
          dataIndex: "start_time",
          key: "Start_time",
          render: (text) => (
            <b style={{ color: "#dab211" }}>{dayjs(text).format("DD/MM/YYYY HH:mm:ss")}</b>
          ),
        },
        {
          title: "Logout",
          dataIndex: "end_time",
          key: "End_time",
          render: (text) => (
            <b style={{ color: "#dab211" }}>{dayjs(text).format("DD/MM/YYYY HH:mm:ss")}</b>
          ),
        },
        {
            title: "Duration (Min.)",
            dataIndex: "duration",
            key: "duration",
            render: (seconds) => {
              const minutes = seconds / 60;
              const displayTime = minutes >= 1 ? Math.floor(minutes) : minutes.toFixed(2);
          
              return <b style={{ color: "#d63e17" }}>{displayTime}</b>;
            },
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
                onConfirm={() => {
                  if (record?.id) {
                    deleteVisitorsById(record.id);
                  } else {
                    messageApi.open({
                      type: "error",
                      content: "ไม่พบ ID ที่ต้องการลบ",
                    });
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
    
      const getAllTotalVisitors = async () => {
        let res = await GetAllTotalVisitors();
        
        if (res.status === 200) {
          setVisitors(res.data); 
        } else {
          setVisitors([]);
          messageApi.open({
            type: "error",
            content: res.data.error,
          });
        }
      };
      
      const deleteVisitorsById = async (id: string) => {
        let res = await DeleteVisitorsById(id);
    
        if (res.status === 200) {
          messageApi.open({
            type: "success",
            content: res.data.message,
          });
          await getAllTotalVisitors();
        } else {
          messageApi.open({
            type: "error",
            content: res.data.error,
          });
        }
      };
      
    
      useEffect(() => {
        getAllTotalVisitors();
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
                        <Regulations text="Visitor Log" />
                    </Col>
                    </Row>
                    <Divider />
                    <Table
                    rowKey="ID"
                    columns={columns}
                    dataSource={visitors}
                    style={{ width: "100%", borderRadius: "8px", overflowX: "auto" }}
                    pagination={{ pageSize: 10 }}
                    bordered
                    scroll={{ x: "max-comtent"}}
                    />
                </Card>
        </div>
    );
}
export default VisitorLog;