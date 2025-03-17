import { useState, useEffect } from "react";
import {
  Space,
  Table,
  Button,
  Col,
  Row,
  Divider,
  message,
  Card,
  Statistic,
  Popconfirm,
  Select,
} from "antd";
import { BarChart } from '@mui/x-charts/BarChart';
import { DeleteOutlined, HistoryOutlined, UserOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { DeleteVisitorsById, GetAllTotalVisitors, GetTopPageVisitors, GetTopVisitors, GetTotalVisitors } from "../../../services/https/index";
import { VisitsInterface } from "../../../interfaces/IVisit";
import dayjs from "dayjs";
import useResponsiveFontSize from "../../../components/fontsize/fontsize";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import Regulations from "../../../components/ranbow-text/ranbow_text";

dayjs.locale("th");

type TopVisitor = {
  Username: string;
  Count: number;
};

type TopPageVisitor = {
  page_name: string;
  count: number;
};

function Dashboard() {

  const [visitors, setVisitors] = useState<VisitsInterface[]>([]);
  const [topvisitors, setTopVisitors] = useState<TopVisitor[]>([]);
  const [toppagevisitors, setTopPageVisitors] = useState<TopPageVisitor[]>([]);
  const [totalvisitors, setTotalVisitors] = useState<number>(0);
  const [averageDuration, setAverageDuration] = useState<number>(0);
  const [messageApi, contextHolder] = message.useMessage();
  const fontSize = useResponsiveFontSize();

  // select month and years
  const [selectedMonthPages, setSelectedMonthPages] = useState<number>(dayjs().month() + 1);
  const [selectedYearPages, setSelectedYearPages] = useState<number>(dayjs().year());
  const [selectedMonthVisitors, setSelectedMonthVisitors] = useState<number>(dayjs().month() + 1);
  const [selectedYearVisitors, setSelectedYearVisitors] = useState<number>(dayjs().year());

   // **Handle Change สำหรับ Top Pages**
   const handleMonthChangePages = (value: number) => {
    setSelectedMonthPages(value);
    getTopPageVisitors(value, selectedYearPages);
  };
  const handleYearChangePages = (value: number) => {
    setSelectedYearPages(value);
    getTopPageVisitors(selectedMonthPages, value);
  };

  //**Handle Change สำหรับ Top Visitors**
  const handleMonthChangeVisitors = (value: number) => {
    setSelectedMonthVisitors(value);
    getTopVisitors(value, selectedYearVisitors);
  };
  const handleYearChangeVisitors = (value: number) => {
    setSelectedYearVisitors(value);
    getTopVisitors(selectedMonthVisitors, value);
  };

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

  const chartSetting1 = {
    yAxis: [
      {
        label: "Pages Categories",
      },
    ],
    width: 460,
    height: 300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-1px, 0)",
      },
    },
  };
  
  const chartSetting2 = {
    yAxis: [
      {
        label: "Top Visitors",
      },
    ],
    width: 460,
    height: 300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-5px, 0)",
      },
    },
  };
  
  const valueFormatter = (value: number | null) => {
    return value !== null ? `${value} ครั้ง` : "-";
  };
  
  const getAllTotalVisitors = async () => {
    let res = await GetAllTotalVisitors();
    
    if (res.status === 200) {
      setVisitors(res.data);

      const durations = res.data.map((item: VisitsInterface) => item.duration || 0);

      if (durations.length > 0) {
        const totalDuration = durations.reduce((acc: any, cur: any) => acc + cur, 0);
        const avgDurationSec = totalDuration / durations.length;
        const avgDurationMin = avgDurationSec / 60; // แปลงเป็นนาที

        setAverageDuration(parseFloat(avgDurationMin.toFixed(2)));
      } else {
        setAverageDuration(0);
      }
    } else {
      setVisitors([]);
      setAverageDuration(0);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getTotalVisitors = async () => {
    let res = await GetTotalVisitors();

    if (res.status === 200) {
        setTotalVisitors(res.data);
    } else {
        setTotalVisitors(0);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getTopVisitors = async (month: number, year: number) => {
    let res = await GetTopVisitors(month, year);
    if (res.status === 200) {
      setTopVisitors((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(res.data)) {
          return res.data || [];
        }
        return prev;
      });
    } else {
      setTopVisitors([]);
    }
  };
  
  const getTopPageVisitors = async (month: number, year: number) => {
    let res = await GetTopPageVisitors(month, year);
    if (res.status === 200) {
      setTopPageVisitors((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(res.data)) {
          return res.data || [];
        }
        return prev;
      });
    } else {
      setTopPageVisitors([]);
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
    getTotalVisitors();
  }, []);
  useEffect(() => {
    getTopPageVisitors(selectedMonthPages, selectedYearPages);
  }, [selectedMonthPages, selectedYearPages]);
  
  useEffect(() => {
    getTopVisitors(selectedMonthVisitors, selectedYearVisitors);
  }, [selectedMonthVisitors, selectedYearVisitors]);
  
  return (
    <div style={{ background: "#E3F2FD", minHeight: "100vh", padding: "30px" }}>
      {contextHolder}
      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          background: "white",
          padding: "10px",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        <Regulations text="Dashboard" />
        <Row gutter={[16, 16]} justify="start">
        <Col xs={24} sm={12} md={8} lg={6}>
                <Card
                    hoverable
                    style={{
                    background: "linear-gradient(135deg,rgb(179, 212, 248) 30%,rgb(255, 255, 255) 100%)",
                    color: "white",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 123, 255, 0.89)",
                    textAlign: "center",
                    height: 300,
                    }}
                >
                    <h3 style={{ color: "#17d632", fontSize: fontSize, fontWeight: "bold", marginBottom: "20px", marginTop: "-10px" }}>
                    📚 หมวดหมู่ทีมีการเข้าชมมากที่สุด
                    </h3>
                    {toppagevisitors && toppagevisitors.length > 0 ? (
                    <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                      {toppagevisitors.map((visitors, index) => (
                        <li
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "5px 10px",
                            background: index % 2 === 0 ? "#f0f8ff" : "white",
                            borderRadius: "8px",
                            marginBottom: "5px",
                          }}
                        >
                          <span style={{fontWeight: "bold", color: "#0D47A1" }}>
                            {visitors.page_name}
                          </span>
                          <span style={{fontWeight: "bold", color: "#0D47A1" }}>
                            {visitors.count} ครั้ง
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: "#d63e17", fontWeight: "bold" }}>ไม่มีข้อมูล</p>
                  )}
                </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
                <Card
                    hoverable
                    style={{
                    background: "linear-gradient(135deg,rgb(179, 212, 248) 30%,rgb(255, 255, 255) 100%)",
                    color: "white",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 123, 255, 0.89)",
                    textAlign: "center",
                    height: 130,
                    }}
                >
                    <h3 style={{ color: "#17d632", fontSize: fontSize, fontWeight: "bold", marginBottom: "10px", marginTop: "-10px" }}>
                    🧑 จำนวนผู้เข้าชมเว็บไซต์ทั้งหมด
                    </h3>
                    <Statistic
                    title=""
                    valueStyle={{ color: "orange", fontSize: fontSize, fontWeight: "bold" }}
                    prefix={<UserOutlined />}
                    value={totalvisitors}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
                <Card
                    hoverable
                    style={{
                    background: "linear-gradient(135deg,rgb(179, 212, 248) 30%,rgb(255, 255, 255) 100%)",
                    color: "white",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 123, 255, 0.89)",
                    textAlign: "center",
                    height: 130,
                    }}
                >
                    <h3 style={{ color: "#17d632", fontSize: fontSize, fontWeight: "bold", marginBottom: "10px", marginTop: "-10px" }}>
                    ⏱️ เวลาที่เข้าชมเว็บไซต์ (Min.)
                    </h3>
                    <Statistic
                    title=""
                    valueStyle={{ color: "orange", fontSize: fontSize, fontWeight: "bold" }}
                    prefix={<HistoryOutlined />}
                    value={averageDuration}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                style={{
                  background: "linear-gradient(135deg,rgb(179, 212, 248) 30%,rgb(255, 255, 255) 100%)",
                  color: "white",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 123, 255, 0.89)",
                  textAlign: "center",
                  height: 300,
                  overflow: "hidden",
                }}
              >
                <h3 style={{ color: "#17d632", fontSize: fontSize, fontWeight: "bold", marginBottom: "20px", marginTop: "-10px" }}>
                  📈 5 ผู้ใช้ที่เข้าชม<br />มากที่สุด
                </h3>
                <div style={{ maxHeight: "180px", overflowY: "auto", paddingRight: "10px" }}>
                  {topvisitors && topvisitors.length > 0 ? (
                    <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                      {topvisitors.map((visitor, index) => (
                        <li
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "5px 10px",
                            background: index % 2 === 0 ? "#f0f8ff" : "white",
                            borderRadius: "8px",
                            marginBottom: "5px",
                          }}
                        >
                          <span style={{fontWeight: "bold", color: "#0D47A1" }}>
                            {visitor.Username}
                          </span>
                          <span style={{fontWeight: "bold", color: "#0D47A1" }}>
                            {visitor.Count} ครั้ง
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: "#d63e17", fontWeight: "bold" }}>ไม่มีข้อมูล</p>
                  )}
                </div>
              </Card>
            </Col>
            <Divider style={{margin: 0, border: "1px solid #0D47A1"}} />
            <Col xs={24} sm={12} md={12} lg={12}>
              <Card
                hoverable
                style={{
                  background: "linear-gradient(135deg,rgb(179, 212, 248) 30%,rgb(255, 255, 255) 100%)",
                  color: "white",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 123, 255, 0.89)",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  minHeight: "300px",
                }}
              >
                <Row justify="center" gutter={16} style={{ marginBottom: "20px" }}>
                  <Col>
                    <Select
                      value={selectedMonthPages}
                      onChange={handleMonthChangePages}
                      style={{
                        width: 150,
                        borderRadius: "8px",
                        background: "#E3F2FD",
                        color: "#0D47A1",
                        fontWeight: "bold",
                        textAlign: "center",
                        boxShadow: "0 4px 6px rgba(4, 84, 202, 0.55)",
                      }}
                      dropdownStyle={{
                        background: "#E3F2FD",
                        color: "#0D47A1",
                        borderRadius: "8px",
                      }}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <Select.Option key={i + 1} value={i + 1} style={{ color: "#0D47A1", fontWeight: "bold" }}>
                          {dayjs().month(i).format("MMMM")}
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                  <Col>
                    <Select value={selectedYearPages}
                      style={{
                        width: 150,
                        borderRadius: "8px",
                        background: "#E3F2FD",
                        color: "#0D47A1",
                        fontWeight: "bold",
                        textAlign: "center",
                        boxShadow: "0 4px 6px rgba(4, 84, 202, 0.55)",
                      }}
                      dropdownStyle={{
                        background: "#E3F2FD",
                        color: "#0D47A1",
                        borderRadius: "8px",
                      }}
                      onChange={handleYearChangePages}
                    >
                      {Array.from({ length: 5 }, (_, i) => (
                        <Select.Option key={i} value={dayjs().year() - i}>
                          {dayjs().year() - i}
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                </Row>
                <div style={{ width: "100%", maxWidth: "100%", overflow: "hidden"}}> 
                  <BarChart
                    dataset={toppagevisitors && toppagevisitors.length > 0 ? toppagevisitors : []}
                    xAxis={[{ scaleType: 'band', dataKey: 'page_name'}]}
                    series={[
                      { dataKey: 'count', label: 'จำนวนครั้งในการเข้าชม', valueFormatter, color: "#16b1fd"},
                    ]}
                    {...chartSetting1}
                  />
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <Card
                hoverable
                style={{
                  background: "linear-gradient(135deg,rgb(179, 212, 248) 30%,rgb(255, 255, 255) 100%)",
                  color: "white",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 123, 255, 0.89)",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  minHeight: "300px",
                }}
              >
                <Row justify="center" gutter={16} style={{ marginBottom: "20px" }}>
                  <Col>
                    <Select 
                      value={selectedMonthVisitors} 
                      style={{
                        width: 150,
                        borderRadius: "8px",
                        background: "#E3F2FD",
                        color: "#0D47A1",
                        fontWeight: "bold",
                        textAlign: "center",
                        boxShadow: "0 4px 6px rgba(4, 84, 202, 0.55)",
                      }}
                      dropdownStyle={{
                        background: "#E3F2FD",
                        color: "#0D47A1",
                        borderRadius: "8px",
                      }}
                      onChange={handleMonthChangeVisitors}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <Select.Option key={i + 1} value={i + 1}>
                          {dayjs().month(i).format("MMMM")}
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                  <Col>
                    <Select 
                      value={selectedYearVisitors}
                      style={{
                        width: 150,
                        borderRadius: "8px",
                        background: "#E3F2FD",
                        color: "#0D47A1",
                        fontWeight: "bold",
                        textAlign: "center",
                        boxShadow: "0 4px 6px rgba(4, 84, 202, 0.55)",
                      }}
                      dropdownStyle={{
                        background: "#E3F2FD",
                        color: "#0D47A1",
                        borderRadius: "8px",
                      }}
                      onChange={handleYearChangeVisitors}
                    >
                      {Array.from({ length: 5 }, (_, i) => (
                        <Select.Option key={i} value={dayjs().year() - i}>
                          {dayjs().year() - i}
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                </Row>
                <div style={{ width: "100%", maxWidth: "100%", overflow: "hidden"}}> 
                  <BarChart
                    dataset={topvisitors && topvisitors.length > 0 ? topvisitors : []}
                    xAxis={[{ scaleType: 'band', dataKey: 'Username'}]}
                    series={[
                      { dataKey: 'Count', label: 'จำนวนครั้งในการเข้าชม', valueFormatter, color: "#16b1fd"},
                    ]}
                    {...chartSetting2}
                  />
                </div>
              </Card>
            </Col>
        </Row>
      </Card>
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
            <Regulations text="ข้อมูล Log" />
          </Col>
        </Row>
        <Divider />
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={visitors}
          style={{ width: "100%", borderRadius: "8px", overflow: "hidden" }}
          pagination={{ pageSize: 10 }}
          bordered
        />
      </Card>
    </div>
  );
}

export default Dashboard;