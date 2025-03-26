import Table, { ColumnsType } from "antd/es/table";
import { PageVisitorsInterface } from "../../../../interfaces/IPageVisitor";
import { Button, Card, Col, Divider, Popconfirm, Row, Space, message} from "antd";
import dayjs from "dayjs";
import { DeletePageVisitorsById, GetAllPageVisitors } from "../../../../services/https";
import { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import Regulations from "../../../../components/ranbow-text/ranbow_text";

dayjs.locale("th");

function PageVisitorsLog() {
    const [PageVisitors, setPageVisitor] = useState<PageVisitorsInterface[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    const columns: ColumnsType<PageVisitorsInterface> = [
        {
            title: "Created At",
            dataIndex: "create_at",
            key: "crate_at",
            align: "center",
            render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm"),
        },
        {
          title: "Username",
          dataIndex: "username",
          key: "username",
          align: "center",
          render: (text) => <b style={{ color: "#17d632" }}>{text}</b>,
        },
        {
          title: "Page Name",
          dataIndex: "page_name",
          key: "page_name",
          align: "center",
          render: (text) => <b style={{ color: "#c19c1c" }}>{text}</b>,
        },
        {
          title: "Page Path",
          dataIndex: "page_path",
          key: "page_path",
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
                      await deletePagevisitorsByID(record.id);
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
    
      const getPageVisitors = async () => {
        let res = await GetAllPageVisitors();
        
        if (res.status === 200) {
          setPageVisitor(res.data); 
        } else {
            setPageVisitor([]);
          messageApi.open({
            type: "error",
            content: res.data.error,
          });
        }
      };
      
      const deletePagevisitorsByID = async (id: string) => {
        let res = await DeletePageVisitorsById(id);
    
        if (res.status === 200) {
          messageApi.open({
            type: "success",
            content: res.data.message,
          });
          await getPageVisitors();
        } else {
          messageApi.open({
            type: "error",
            content: res.data.error,
          });
        }
      };
      
    
      useEffect(() => {
        getPageVisitors();
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
                        <Regulations text="Page Visitor Log" />
                    </Col>
                    </Row>
                    <Divider />
                    <Table
                    rowKey="ID"
                    columns={columns}
                    dataSource={PageVisitors}
                    style={{ width: "100%", borderRadius: "8px", overflowX: "auto" }}
                    pagination={{ pageSize: 10 }}
                    bordered
                    scroll={{ x: "max-comtent"}}
                    />
                </Card>
        </div>
    );
}
export default PageVisitorsLog;