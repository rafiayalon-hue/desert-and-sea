import { useState } from "react";

function Section({ title, children }) {
  return (
    <div className="detail-section" style={{ marginBottom: 16 }}>
      <div className="detail-section-title">{title}</div>
      {children}
    </div>
  );
}

export default function Settings() {
  const [checkinTime,    setCheckinTime]    = useState("15:00");
  const [checkoutTime,   setCheckoutTime]   = useState("11:00");
  const [preArrivalDays, setPreArrivalDays] = useState(2);
  const [saved,          setSaved]          = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ maxWidth: 620 }}>
      <div className="page-header">
        <div className="page-title">הגדרות</div>
      </div>

      <Section title="זמני כניסה ויציאה">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: ".82rem", color: "var(--text-muted)", marginBottom: 6 }}>
              שעת כניסה (ברירת מחדל)
            </div>
            <input className="input" type="time" value={checkinTime}
              onChange={e => setCheckinTime(e.target.value)} />
          </div>
          <div>
            <div style={{ fontSize: ".82rem", color: "var(--text-muted)", marginBottom: 6 }}>
              שעת יציאה (ברירת מחדל)
            </div>
            <input className="input" type="time" value={checkoutTime}
              onChange={e => setCheckoutTime(e.target.value)} />
          </div>
        </div>
      </Section>

      <Section title="הודעות אוטומטיות">
        <div>
          <div style={{ fontSize: ".82rem", color: "var(--text-muted)", marginBottom: 6 }}>
            ימים לפני הגעה לשליחת הודעת תזכורת
          </div>
          <select className="select" value={preArrivalDays}
            onChange={e => setPreArrivalDays(Number(e.target.value))}>
            <option value={1}>יום אחד לפני</option>
            <option value={2}>יומיים לפני</option>
            <option value={3}>שלושה ימים לפני</option>
          </select>
        </div>
        <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--sand-bg)",
          borderRadius: 8, fontSize: ".82rem", color: "var(--text-secondary)" }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>לוח זמנים הודעות:</div>
          <div>📨 הודעה 2 (תזכורת) — {preArrivalDays} ימים לפני, 09:00</div>
          <div>🔑 הודעה 3 (כניסה) — בוקר יום הכניסה, 09:00</div>
          <div>💳 הודעה 4 (יציאה) — בוקר יום היציאה, 09:00</div>
          <div>⭐ הודעה 5 (ביקורת) — יום היציאה, 14:00</div>
        </div>
      </Section>

      <Section title="MiniHotel">
        <div className="detail-row">
          <span className="detail-label">מלון</span>
          <span className="detail-value">desert89</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">מצב</span>
          <span className="detail-value" style={{ color: "var(--warning)" }}>
            🟡 Mock Data (ממתין לendpoints מיובל)
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">סנכרון אחרון</span>
          <span className="detail-value">—</span>
        </div>
      </Section>

      <Section title="TTLock">
        <div className="detail-row">
          <span className="detail-label">מדבר (דלת חומה)</span>
          <span className="detail-value" style={{ color: "var(--text-muted)" }}>לא מוגדר</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">ים (דלת כחולה)</span>
          <span className="detail-value" style={{ color: "var(--text-muted)" }}>לא מוגדר</span>
        </div>
        <div style={{ fontSize: ".78rem", color: "var(--text-muted)", marginTop: 8 }}>
          להגדרת Lock IDs — עדכן ב-backend/app/integrations/ttlock.py
        </div>
      </Section>

      <button className="btn btn-primary" onClick={save}>
        {saved ? "✅ נשמר!" : "שמור הגדרות"}
      </button>
    </div>
  );
}
