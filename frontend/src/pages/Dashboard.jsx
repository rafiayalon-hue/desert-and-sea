import { useEffect, useState } from "react";
import { Row, Col, Card, Table, Tag, Typography, DatePicker, message } from "antd";
import { HomeOutlined, CalendarOutlined, UserOutlined, RiseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import StatCard from "../components/StatCard";
import { getBookings, getOccupancyStats } from "../services/api";

const { Title } = Typography;
const { MonthPicker } = DatePicker;

const statusColors = {
  confirmed: "green",
  cancelled: "red",
  pending: "orange",
  checked_in: "blue",
};

const statusLabels = {
  confirmed: "מאושר",
  cancelled: "בוטל",
  pending: "ממתין",
  checked_in: "שוהה",
};

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));

  useEffect(() => {
    const today = dayjs();
    Promise.all([
      getBookings({ from_date: today.format("YYYY-MM-DD"), to_date: today.add(30, "day").format("YYYY-MM-DD") }),
      getOccupancyStats(month).catch(() => ({ data: null })),
    ])
      .then(([bRes, sRes]) => {
        setBookings(bRes.data);
        setStats(sRes.data);
      })
      .catch(() => message.error("שגיאה בטעינת הנתונים"))
      .finally(() => setLoading(false));
  }, [month]);

  const upcoming = bookings.filter((b) => dayjs(b.check_in).isAfter(dayjs(), "day"));
  const activeNow = bookings.filter(
    (b) => !dayjs(b.check_in).isAfter(dayjs(), "day") && !dayjs(b.check_out).isBefore(dayjs(), "day")
  );

  const columns = [
    { title: "אורח", dataIndex: "guest_name", key: "guest_name" },
    { title: "חדר", dataIndex: "room_name", key: "room_name" },
    { title: "כניסה", dataIndex: "check_in", key: "check_in" },
    { title: "יציאה", dataIndex: "check_out", key: "check_out" },
    {
      title: "סטטוס",
      dataIndex: "status",
      key: "status",
      render: (s) => <Tag color={statusColors[s] ?? "default"}>{statusLabels[s] ?? s}</Tag>,
    },
  ];

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="שוהים כעת" value={activeNow.length} prefix={<HomeOutlined />} loading={loading} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="הזמנות קרובות (30 יום)" value={upcoming.length} prefix={<CalendarOutlined />} loading={loading} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="תפוסה חודשית"
            value={stats?.occupancy_rate ?? "—"}
            suffix="%"
            prefix={<RiseOutlined />}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="הכנסה חודשית"
            value={stats?.total_revenue ?? "—"}
            suffix="₪"
            prefix={<UserOutlined />}
            color="#cf1322"
            loading={loading}
          />
        </Col>
      </Row>

      <Card
        title="הזמנות קרובות"
        extra={
          <MonthPicker
            value={dayjs(month)}
            onChange={(d) => d && setMonth(d.format("YYYY-MM"))}
            allowClear={false}
          />
        }
        style={{ borderRadius: 12 }}
      >
        <Table
          dataSource={upcoming}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
          locale={{ emptyText: "אין הזמנות קרובות" }}
        />
      </Card>
    </>
  );
}
