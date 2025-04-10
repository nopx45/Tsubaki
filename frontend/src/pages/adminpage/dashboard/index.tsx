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
  Tooltip,
  Badge
} from "antd";
import { BarChart } from '@mui/x-charts/BarChart';
import { 
  DeleteOutlined, 
  HistoryOutlined, 
  UserOutlined,
  LineChartOutlined,
  BarChartOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  DatabaseOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { DeleteVisitorsById, GetAllTotalVisitors, GetTopPageVisitors, GetTopVisitors, GetTotalVisitors } from "../../../services/https/index";
import { VisitsInterface } from "../../../interfaces/IVisit";
import dayjs from "dayjs";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import Regulations from "../../../components/ranbow-text/ranbow_text";
import './dashboard.css';

dayjs.locale("en");

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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // select month and years
  const [selectedMonthPages, setSelectedMonthPages] = useState<number>(dayjs().month() + 1);
  const [selectedYearPages, setSelectedYearPages] = useState<number>(dayjs().year());
  const [selectedMonthVisitors, setSelectedMonthVisitors] = useState<number>(dayjs().month() + 1);
  const [selectedYearVisitors, setSelectedYearVisitors] = useState<number>(dayjs().year());

  const handleMonthChangePages = (value: number) => {
    setSelectedMonthPages(value);
    getTopPageVisitors(value, selectedYearPages);
  };
  
  const handleYearChangePages = (value: number) => {
    setSelectedYearPages(value);
    getTopPageVisitors(selectedMonthPages, value);
  };

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
      title: <span className="table-header">Username</span>,
      dataIndex: "username",
      key: "User_name",
      width: 80,
      align: "center",
      render: (text) => <span className="username-cell">{text}</span>,
    },
    {
      title: <span className="table-header">User IP</span>,
      dataIndex: "user_ip",
      key: "ip",
      width: 80,
      align: "center",
      render: (text) => <span className="ip-cell">{text}</span>,
    },
    {
      title: <span className="table-header">Login</span>,
      dataIndex: "start_time",
      key: "Start_time",
      render: (text) => (
        <Tooltip title={dayjs(text).format("dddd, MMMM D, YYYY HH:mm:ss")}>
          <span className="time-cell">{dayjs(text).format("DD/MM/YYYY HH:mm:ss")}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className="table-header">Logout</span>,
      dataIndex: "end_time",
      key: "End_time",
      render: (text) => (
        <Tooltip title={dayjs(text).format("dddd, MMMM D, YYYY HH:mm:ss")}>
          <span className="time-cell">{dayjs(text).format("DD/MM/YYYY HH:mm:ss")}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className="table-header">Duration (Min.)</span>,
      dataIndex: "duration",
      key: "duration",
      render: (seconds) => {
        const minutes = seconds / 60;
        const displayTime = minutes >= 1 ? Math.floor(minutes) : minutes.toFixed(2);
        return (
          <Badge 
            count={displayTime} 
            className="duration-badge"
            style={{ 
              backgroundColor: minutes >= 1 ? '#52c41a' : '#faad14',
              color: '#fff'
            }}
          />
        );
      },
    },      
    {
      title: <span className="table-header">Actions</span>,
      align: "center",
      render: (record) => (
        <Space size="middle">
          <Popconfirm
            placement="top"
            title="Delete Visitor Record"
            description="Are you sure to delete this visitor data?"
            okText="Yes"
            cancelText="No"
            icon={<DeleteOutlined style={{ color: 'red' }} />}
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
              className="delete-btn"
              shape="circle"
            />
          </Popconfirm>
        </Space>
      ),      
    },
  ];

  const chartSetting1 = {
    yAxis: [
      {
        label: "Pages Categories (Q'ty)",
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
        label: "Top Visitors (Q'ty)",
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
    return value !== null ? `${value} visits` : "-";
  };
  
  const getAllTotalVisitors = async () => {
    setIsLoading(true);
    let res = await GetAllTotalVisitors();
    
    if (res.status === 200) {
      setVisitors(res.data);

      const durations = res.data.map((item: VisitsInterface) => item.duration || 0);

      if (durations.length > 0) {
        const totalDuration = durations.reduce((acc: any, cur: any) => acc + cur, 0);
        const avgDurationSec = totalDuration / durations.length;
        const avgDurationMin = avgDurationSec / 60;

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
    setIsLoading(false);
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
    <div className="dashboards-containers">
      {contextHolder}
      <Card className="main-card">
        <Regulations text="Dashboard Analytics" />
        
        <Row gutter={[16, 16]} justify="start">
          {/* Top Pages Card */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              className="stats-card top-pages-card"
              loading={isLoading}
            >
              <div className="card-header">
                <LineChartOutlined className="card-icon" />
                <h3 className="card-title">Top Visited Pages</h3>
              </div>
              <div className="card-content">
                {toppagevisitors && toppagevisitors.length > 0 ? (
                  <ul className="top-list">
                    {toppagevisitors.map((visitors, index) => (
                      <li key={index} className={`top-item ${index % 2 === 0 ? 'even' : 'odd'}`}>
                        <span className="item-name">
                          {index === 0 && <span className="rank-badge">🥇</span>}
                          {index === 1 && <span className="rank-badge">🥈</span>}
                          {index === 2 && <span className="rank-badge">🥉</span>}
                          {visitors.page_name}
                        </span>
                        <span className="item-value">{visitors.count} visits</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-data">
                    <DatabaseOutlined />
                    <p>No data available</p>
                  </div>
                )}
              </div>
            </Card>
          </Col>
          
          {/* Total Visitors Card */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              className="stats-card total-visitors-card"
              loading={isLoading}
            >
              <div className="card-header">
                <TeamOutlined className="card-icon" />
                <h3 className="card-title">Total Visitors</h3>
              </div>
              <div className="card-content">
                <Statistic
                  value={totalvisitors}
                  precision={0}
                  valueStyle={{ 
                    color: '#1890ff',
                    fontSize: '2.2rem',
                    fontWeight: 600,
                    textShadow: '0 2px 4px rgba(24, 144, 255, 0.3)'
                  }}
                  prefix={<GlobalOutlined />}
                  suffix="visitors"
                />
              </div>
            </Card>
          </Col>
          
          {/* Average Duration Card */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              className="stats-card duration-card"
              loading={isLoading}
            >
              <div className="card-header">
                <ClockCircleOutlined className="card-icon" />
                <h3 className="card-title">Avg. Visit Duration</h3>
              </div>
              <div className="card-content">
                <Statistic
                  value={averageDuration}
                  precision={2}
                  valueStyle={{ 
                    color: '#722ed1',
                    fontSize: '2.2rem',
                    fontWeight: 600,
                    textShadow: '0 2px 4px rgba(114, 46, 209, 0.3)'
                  }}
                  suffix="minutes"
                />
                <div className="duration-bar">
                  <div 
                    className="duration-progress" 
                    style={{ width: `${Math.min(averageDuration * 10, 100)}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          </Col>
          
          {/* Top Visitors Card */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              className="stats-card top-visitors-card"
              loading={isLoading}
            >
              <div className="card-header">
                <UserOutlined className="card-icon" />
                <h3 className="card-title">Top Visitors</h3>
              </div>
              <div className="card-content">
                {topvisitors && topvisitors.length > 0 ? (
                  <ul className="top-list">
                    {topvisitors.map((visitor, index) => (
                      <li key={index} className={`top-item ${index % 2 === 0 ? 'even' : 'odd'}`}>
                        <span className="item-name">
                          {index === 0 && <span className="rank-badge">👑</span>}
                          {visitor.Username}
                        </span>
                        <span className="item-value">{visitor.Count} visits</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-data">
                    <DatabaseOutlined />
                    <p>No data available</p>
                  </div>
                )}
              </div>
            </Card>
          </Col>
          
          <Divider className="section-divider" />
          
          {/* Top Pages Chart */}
          <Col xs={24} sm={12} md={12} lg={12}>
            <Card
              hoverable
              className="chart-card"
              loading={isLoading}
            >
              <div className="chart-header">
                <BarChartOutlined />
                <h3>Top Pages by Visits</h3>
                <div className="date-selectors">
                  <Select
                    value={selectedMonthPages}
                    onChange={handleMonthChangePages}
                    className="month-selector"
                    suffixIcon={<CalendarOutlined />}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <Select.Option key={i + 1} value={i + 1}>
                        {dayjs().month(i).format("MMMM")}
                      </Select.Option>
                    ))}
                  </Select>
                  <Select 
                    value={selectedYearPages}
                    className="year-selector"
                    onChange={handleYearChangePages}
                    suffixIcon={<CalendarOutlined />}
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <Select.Option key={i} value={dayjs().year() - i}>
                        {dayjs().year() - i}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="chart-container">
                <BarChart
                  dataset={toppagevisitors && toppagevisitors.length > 0 ? toppagevisitors : []}
                  xAxis={[{ scaleType: 'band', dataKey: 'page_name'}]}
                  series={[
                    { 
                      dataKey: 'count', 
                      label: 'Visits', 
                      valueFormatter, 
                      color: "#4f46e5",
                      highlightScope: {
                        highlighted: 'series',
                        faded: 'global'
                      }
                    },
                  ]}
                  {...chartSetting1}
                />
              </div>
            </Card>
          </Col>
          
          {/* Top Visitors Chart */}
          <Col xs={24} sm={12} md={12} lg={12}>
            <Card
              hoverable
              className="chart-card"
              loading={isLoading}
            >
              <div className="chart-header">
                <BarChartOutlined />
                <h3>Top Users by Visits</h3>
                <div className="date-selectors">
                  <Select 
                    value={selectedMonthVisitors} 
                    className="month-selector"
                    onChange={handleMonthChangeVisitors}
                    suffixIcon={<CalendarOutlined />}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <Select.Option key={i + 1} value={i + 1}>
                        {dayjs().month(i).format("MMMM")}
                      </Select.Option>
                    ))}
                  </Select>
                  <Select 
                    value={selectedYearVisitors}
                    className="year-selector"
                    onChange={handleYearChangeVisitors}
                    suffixIcon={<CalendarOutlined />}
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <Select.Option key={i} value={dayjs().year() - i}>
                        {dayjs().year() - i}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="chart-container">
                <BarChart
                  dataset={topvisitors && topvisitors.length > 0 ? topvisitors : []}
                  xAxis={[{ scaleType: 'band', dataKey: 'Username'}]}
                  series={[
                    { 
                      dataKey: 'Count', 
                      label: 'Visits', 
                      valueFormatter, 
                      color: "#10b981",
                      highlightScope: {
                        highlighted: 'series',
                        faded: 'global'
                      }
                    },
                  ]}
                  {...chartSetting2}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
      
      {/* Visitor Log Table */}
      <Card className="log-table-card">
        <div className="table-header">
          <Regulations text="Visitor Log Records" />
          <Tooltip title="Refresh data">
            <Button 
              type="primary" 
              shape="circle" 
              icon={<HistoryOutlined />} 
              onClick={getAllTotalVisitors}
              loading={isLoading}
            />
          </Tooltip>
        </div>
        <Divider className="table-divider" />
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={visitors}
          className="visitor-log-table"
          loading={isLoading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: false,
            showQuickJumper: true
          }}
          bordered
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
}

export default Dashboard;