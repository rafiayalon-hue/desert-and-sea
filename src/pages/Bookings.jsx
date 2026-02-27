import { useEffect, useState } from "react";
import { Table, Tag, Button, DatePicker, Space, Card, Tooltip, message, Popconfirm } from "antd";
import { SyncOutlined, KeyOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getBookings, syncBookings, generateEntryCode } from "../services/api";

const { RangePicker } = DatePicker;

const statusColors = { confirmed: "green", cancelled: "red", pending: "orange", checked_in: "blue" };
const statusLabels = { confirmed: "מאושר", cancelled: "בוטל", pending: "ממתין", checked_in: "שוהה" };

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [range, setRange] = useState([dayjs(), dayjs().add(60, "day")]);

  const load = () => {
    setLoading(true);
    getBookings({
      from_date: range[0].format("YYYY-MM-DD"),
      to_date: range[1].format("YYYY-MM-DD"),
    })
      .then((r) => setBookings(r.data))
      .catch(() => message.error("שגיאה בטעינת ההזמנות"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSync = () => {
    setSyncing(true);
    syncBookings(range[0].format("YYYY-MM-DD"), range[1].format("YYYY-MM-DD"))
      .then((r) => { message.success(`סונכרנו ${r.data.synced} הזמנות`); load(); })
      .catch(() => message.error("שגיאה בסנכרון"))
      .finally(() => setSyncing(false));
  };

  const handleGenerateCode = (bookingId) => {
    generateEntryCode(bookingId)
      .then((r) => { message.success(`קוד כניסה נוצר: ${r.data.code}`); load(); })
      .catch(() => message.error("שגיאה ביצירת קוד כניסה"));
  };

  const columns = [
    { title: "אורח", dataIndex: "guest_name", key: "guest_name", sorter: (a, b) => a.guest_name.localeCompare(b.guest_name) },
    { title: "טלפון", dataIndex: "guest_phone", key: "guest_phone" },
    { title: "חדר", dataIndex: "room_name", key: "room_name" },
    { title: "כניסה", dataIndex: "check_in", key: "check_in", sorter: (a, b) => a.check_in.localeCompare(b.check_in) },
    { title: "יציאה", dataIndex: "check_out", key: "check_out" },
    { title: 'מחיר', dataIndex: 'total_price', key: 'total_price', render: (v) => `₪${Number(v).toLocaleString("he-IL")}` },
    {
      title: "סטטוס",
      dataIndex: "status",
      key: "status",
      render: (s) => <Tag color={statusColors[s] ?? "default"}>{statusLabels[s] ?? s}</Tag>,
    },
    {
      title: "קוד כניסה",
      dataIndex: "entry_code",
      key: "entry_code",
      render: (code, record) =>
        code ? (
          <Tag color="purple">{code}</Tag>
        ) : (
          <Popconfirm title="ליצור קוד כניסה אוטומטי?" onConfirm={() => handleGenerateCode(record.id)} okText="כן" cancelText="לא">
            <Button size="small" icon={<KeyOutlined />}>צור קוד</Button>
          </Popconfirm>
        ),
    },
  ];

  return (
    <Card
      title="ניהול הזמנות"
      extra={
        <Space>
          <RangePicker value={range} onChange={(v) => v && setRange(v)} />
          <Button onClick={load}>סנן</Button>
          <Button type="primary" icon={<SyncOutlined spin={syncing} />} onClick={handleSync} loading={syncing}>
            סנכרן מ-MiniHotel
          </Button>
        </Space>
      }
      style={{ borderRadius: 12 }}
    >
      <Table
        dataSource={bookings}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10, showTotal: (t) => `סה"כ ${t} הזמנות` }}
        locale={{ emptyText: "אין הזמנות בטווח הנבחר" }}
      />
    </Card>
  );
}
