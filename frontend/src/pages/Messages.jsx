import { useEffect, useState } from "react";
import { Table, Tag, Button, Card, Modal, Form, Input, Select, message, Tabs, Space } from "antd";
import { SendOutlined, NotificationOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getMessages, sendMessage, getGuests, sendCampaign } from "../services/api";

const statusColors = { sent: "green", failed: "red", pending: "orange" };
const statusLabels = { sent: "נשלח", failed: "נכשל", pending: "ממתין" };
const typeLabels = {
  pre_arrival: "לפני הגעה",
  entry_code: "קוד כניסה",
  checkout: "יציאה",
  campaign: "קמפיין",
  manual: "ידני",
};

export default function Messages() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendModal, setSendModal] = useState(false);
  const [campaignModal, setCampaignModal] = useState(false);
  const [guests, setGuests] = useState([]);
  const [sending, setSending] = useState(false);
  const [form] = Form.useForm();
  const [campForm] = Form.useForm();

  const loadLogs = () => {
    setLoading(true);
    getMessages()
      .then((r) => setLogs(r.data))
      .catch(() => message.error("שגיאה בטעינת ההודעות"))
      .finally(() => setLoading(false));
  };

  useEffect(loadLogs, []);

  const openCampaign = () => {
    getGuests({ returning_only: true }).then((r) => setGuests(r.data));
    setCampaignModal(true);
  };

  const handleSend = (values) => {
    setSending(true);
    sendMessage({ ...values, message_type: "manual" })
      .then((r) => {
        message.success(r.data.status === "sent" ? "הודעה נשלחה בהצלחה" : "שליחה נכשלה");
        setSendModal(false);
        form.resetFields();
        loadLogs();
      })
      .finally(() => setSending(false));
  };

  const handleCampaign = (values) => {
    setSending(true);
    sendCampaign({ template_key: values.template_key, guest_ids: values.guest_ids })
      .then((r) => {
        message.success(`קמפיין נשלח ל-${r.data.sent} אורחים`);
        setCampaignModal(false);
        campForm.resetFields();
        loadLogs();
      })
      .finally(() => setSending(false));
  };

  const logColumns = [
    { title: "טלפון", dataIndex: "phone", key: "phone" },
    {
      title: "סוג",
      dataIndex: "message_type",
      key: "message_type",
      render: (t) => <Tag>{typeLabels[t] ?? t}</Tag>,
    },
    { title: "הודעה", dataIndex: "body", key: "body", ellipsis: true },
    {
      title: "סטטוס",
      dataIndex: "status",
      key: "status",
      render: (s) => <Tag color={statusColors[s]}>{statusLabels[s] ?? s}</Tag>,
    },
    {
      title: "נשלח",
      dataIndex: "sent_at",
      key: "sent_at",
      render: (v) => (v ? dayjs(v).format("DD/MM/YY HH:mm") : "—"),
    },
  ];

  const tabItems = [
    {
      key: "log",
      label: "יומן הודעות",
      children: (
        <Table
          dataSource={logs}
          columns={logColumns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (t) => `סה"כ ${t} הודעות` }}
          locale={{ emptyText: "אין הודעות" }}
        />
      ),
    },
  ];

  return (
    <>
      <Card
        title="הודעות WhatsApp"
        extra={
          <Space>
            <Button icon={<SendOutlined />} onClick={() => setSendModal(true)}>
              שלח הודעה
            </Button>
            <Button type="primary" icon={<NotificationOutlined />} onClick={openCampaign}>
              קמפיין לאורחים חוזרים
            </Button>
          </Space>
        }
        style={{ borderRadius: 12 }}
      >
        <Tabs items={tabItems} />
      </Card>

      {/* Send single message */}
      <Modal
        title="שלח הודעת WhatsApp"
        open={sendModal}
        onCancel={() => { setSendModal(false); form.resetFields(); }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSend} style={{ marginTop: 16 }}>
          <Form.Item name="phone" label="מספר טלפון" rules={[{ required: true, message: "נדרש מספר טלפון" }]}>
            <Input placeholder="+972501234567" dir="ltr" />
          </Form.Item>
          <Form.Item name="body" label="תוכן ההודעה" rules={[{ required: true, message: "נדרש תוכן" }]}>
            <Input.TextArea rows={4} placeholder="כתוב את ההודעה..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={sending} icon={<SendOutlined />} block>
              שלח
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Campaign modal */}
      <Modal
        title="קמפיין לאורחים חוזרים"
        open={campaignModal}
        onCancel={() => { setCampaignModal(false); campForm.resetFields(); }}
        footer={null}
      >
        <Form form={campForm} layout="vertical" onFinish={handleCampaign} style={{ marginTop: 16 }}>
          <Form.Item name="template_key" label="תבנית הודעה" rules={[{ required: true }]}>
            <Select placeholder="בחר תבנית">
              <Select.Option value="pre_arrival">לפני הגעה</Select.Option>
              <Select.Option value="checkout">לאחר יציאה</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="guest_ids" label="אורחים" rules={[{ required: true, message: "בחר לפחות אורח אחד" }]}>
            <Select
              mode="multiple"
              placeholder="בחר אורחים חוזרים"
              options={guests.map((g) => ({ value: g.id, label: `${g.name} (${g.phone})` }))}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={sending} icon={<NotificationOutlined />} block>
              שלח קמפיין
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
