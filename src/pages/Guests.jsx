import { useEffect, useState } from "react";
import { Table, Tag, Button, Card, Switch, Input, Modal, message, Space } from "antd";
import { StarOutlined, EditOutlined } from "@ant-design/icons";
import { getGuests, updateGuestNotes } from "../services/api";

const langLabels = { he: "עברית", en: "English", ar: "عربي", ru: "Русский" };
const langColors = { he: "blue", en: "green", ar: "orange", ru: "purple" };

export default function Guests() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningOnly, setReturningOnly] = useState(false);
  const [notesModal, setNotesModal] = useState(null); // { guest }
  const [notesValue, setNotesValue] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const load = (returning = returningOnly) => {
    setLoading(true);
    getGuests(returning ? { returning_only: true } : {})
      .then((r) => setGuests(r.data))
      .catch(() => message.error("שגיאה בטעינת האורחים"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleToggleReturning = (val) => {
    setReturningOnly(val);
    load(val);
  };

  const openNotes = (guest) => {
    setNotesModal(guest);
    setNotesValue(guest.notes ?? "");
  };

  const saveNotes = () => {
    setSavingNotes(true);
    updateGuestNotes(notesModal.id, notesValue)
      .then(() => { message.success("הערות נשמרו"); setNotesModal(null); load(); })
      .catch(() => message.error("שגיאה בשמירה"))
      .finally(() => setSavingNotes(false));
  };

  const columns = [
    { title: "שם", dataIndex: "name", key: "name", sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: "טלפון", dataIndex: "phone", key: "phone" },
    { title: "אימייל", dataIndex: "email", key: "email", render: (v) => v ?? "—" },
    {
      title: "שפה",
      dataIndex: "language",
      key: "language",
      render: (l) => <Tag color={langColors[l] ?? "default"}>{langLabels[l] ?? l}</Tag>,
    },
    {
      title: "חוזר",
      dataIndex: "is_returning",
      key: "is_returning",
      render: (v, r) =>
        v ? <Tag color="gold" icon={<StarOutlined />}>{r.visit_count} ביקורים</Tag> : <Tag>חדש</Tag>,
    },
    { title: "הערות", dataIndex: "notes", key: "notes", ellipsis: true, render: (v) => v ?? "—" },
    {
      title: "פעולות",
      key: "actions",
      render: (_, record) => (
        <Button size="small" icon={<EditOutlined />} onClick={() => openNotes(record)}>
          הערות
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card
        title="מאגר אורחים"
        extra={
          <Space>
            <span>אורחים חוזרים בלבד</span>
            <Switch checked={returningOnly} onChange={handleToggleReturning} />
          </Space>
        }
        style={{ borderRadius: 12 }}
      >
        <Table
          dataSource={guests}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 12, showTotal: (t) => `סה"כ ${t} אורחים` }}
          locale={{ emptyText: "אין אורחים" }}
        />
      </Card>

      <Modal
        title={`הערות — ${notesModal?.name}`}
        open={!!notesModal}
        onOk={saveNotes}
        onCancel={() => setNotesModal(null)}
        okText="שמור"
        cancelText="ביטול"
        confirmLoading={savingNotes}
      >
        <Input.TextArea
          rows={4}
          value={notesValue}
          onChange={(e) => setNotesValue(e.target.value)}
          placeholder="הוסף הערות על האורח..."
        />
      </Modal>
    </>
  );
}
