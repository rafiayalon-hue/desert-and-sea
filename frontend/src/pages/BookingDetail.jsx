import { useState } from "react";
import { useBooking } from "../hooks/useBookings";

const LANGUAGES = [
  { value: "he", label: "🇮🇱 עברית" },
  { value: "en", label: "🇬🇧 English" },
  { value: "es", label: "🇪🇸 Español" },
  { value: "fr", label: "🇫🇷 Français" },
];

const MESSAGES = [
  { type: "booking_confirmation", label: "1. אישור הזמנה" },
  { type: "pre_arrival",          label: "2. לפני הגעה" },
  { type: "checkin_code",         label: "3. כניסה + קוד" },
  { type: "checkout_payment",     label: "4. יציאה + תשלום" },
  { type: "review_request",       label: "5. ביקורת" },
];

const CANCELLATION_TAGS = [
  { value: "internal_block", label: "🔒 חסימה פנימית" },
  { value: "guest_cancel",   label: "❌ ביטול אורח" },
  { value: "direct_switch",  label: "🔄 מעבר ישיר מ-Airbnb" },
];

function Section({ title, children }) {
  return (
    <div className="detail-section">
      <div className="detail-section-title">{title}</div>
      {children}
    </div>
  );
}

function Row({ label, value, children }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{children || value || "—"}</span>
    </div>
  );
}

export default function BookingDetail({ bookingId, navigate }) {
  const { booking, loading } = useBooking(bookingId);

  const [language,       setLanguage]       = useState("");
  const [paymentMethod,  setPaymentMethod]  = useState("credit_link");
  const [paymentLink,    setPaymentLink]    = useState("");
  const [cancelTag,      setCancelTag]      = useState("");
  const [internalNotes,  setInternalNotes]  = useState("");
  const [ttlockCode,     setTtlockCode]     = useState(null);
  const [backupOpen,     setBackupOpen]     = useState(false);
  const [backup,         setBackup]         = useState({ first_name: "", phone: "", language: "he" });
  const [sentMessages,   setSentMessages]   = useState([]);

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>טוען...</div>;
  if (!booking) return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <div style={{ color: "var(--text-muted)", marginBottom: 16 }}>הזמנה לא נמצאה</div>
      <button className="btn btn-secondary" onClick={() => navigate("bookings")}>← חזרה</button>
    </div>
  );

  const isCancelled = booking.status === "cancelled";
  const isAirbnb    = booking.source === "airbnb";
  const lang        = language || booking.language || "he";

  const generateCode = () => {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setTtlockCode(code);
  };

  const sendMessage = (type) => {
    setSentMessages(prev => [...prev, type]);
    alert(`✅ הודעה "${type}" נשלחה (Mock)`);
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("bookings")}>← הזמנות</button>
          <div>
            <div className="page-title" style={{ fontSize: "1.3rem" }}>{booking.full_name}</div>
            <div className="page-subtitle">הזמנה #{booking.id}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className={`room-tag ${booking.room_color}`} style={{ fontSize: ".85rem" }}>
            {booking.room_display}
          </span>
          <span className={`status-badge ${booking.status}`}>{booking.status_label}</span>
        </div>
      </div>

      <div className="detail-grid">
        {/* Left column */}
        <div>
          {/* Guest Info */}
          <Section title="פרטי אורח">
            <Row label="שם">{booking.full_name}</Row>
            <Row label="טלפון">{booking.phone || <span style={{color:"var(--text-muted)"}}>לא קיים במיניהוטל</span>}</Row>
            <Row label="אימייל">{booking.email || "—"}</Row>
            <Row label="מדינה">{booking.country || "—"}</Row>
            <Row label="מבוגרים / ילדים">{booking.adults} / {booking.children}</Row>
          </Section>

          {/* Stay Info */}
          <Section title="פרטי שהייה">
            <Row label="כניסה">{booking.checkin_label} · שעה {booking.checkin_time}</Row>
            <Row label="יציאה">{booking.checkout_label} · שעה {booking.checkout_time}</Row>
            <Row label="לילות">{booking.nights}</Row>
            <Row label="חדר">{booking.room_display}</Row>
            <Row label="מקור">{booking.source_label}</Row>
            <Row label="מחיר">₪{booking.total_price?.toLocaleString()}</Row>
            <Row label="יתרה">
              <span style={{ color: booking.balance > 0 ? "var(--error)" : "var(--success)" }}>
                ₪{booking.balance?.toLocaleString()}
              </span>
            </Row>
          </Section>

          {/* Cancellation tag (if cancelled) */}
          {isCancelled && (
            <Section title="סיווג ביטול">
              {booking.cancellation_label
                ? <div style={{ fontWeight: 600, fontSize: ".9rem" }}>{booking.cancellation_label}</div>
                : (
                  <div>
                    <div style={{ fontSize: ".82rem", color: "var(--text-muted)", marginBottom: 8 }}>
                      סווג את הביטול כדי לשמור על סטטיסטיקות נקיות
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {CANCELLATION_TAGS.map(t => (
                        <button
                          key={t.value}
                          className={`filter-btn ${cancelTag === t.value ? "active" : ""}`}
                          onClick={() => setCancelTag(t.value)}
                        >{t.label}</button>
                      ))}
                    </div>
                    {cancelTag && (
                      <button className="btn btn-primary btn-sm" style={{ marginTop: 10 }}
                        onClick={() => alert("נשמר!")}>
                        שמור סיווג
                      </button>
                    )}
                  </div>
                )
              }
            </Section>
          )}

          {/* Notes */}
          <Section title="הערות">
            {booking.notes && (
              <div style={{ fontSize: ".85rem", color: "var(--text-secondary)", marginBottom: 12,
                background: "var(--sand-bg)", padding: "10px 12px", borderRadius: 8 }}>
                {booking.notes}
              </div>
            )}
            <textarea
              className="textarea"
              placeholder="הערות פנימיות (לא נשלחות לאורח)..."
              value={internalNotes}
              onChange={e => setInternalNotes(e.target.value)}
            />
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }}
              onClick={() => alert("נשמר!")}>
              שמור הערות
            </button>
          </Section>
        </div>

        {/* Right column */}
        <div>
          {/* Language */}
          <Section title="שפת אורח">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {LANGUAGES.map(l => (
                <button
                  key={l.value}
                  className={`filter-btn ${lang === l.value ? "active" : ""}`}
                  onClick={() => setLanguage(l.value)}
                >{l.label}</button>
              ))}
            </div>
            {!booking.language && (
              <div className="alert alert-warning" style={{ marginTop: 10 }}>
                ⚠️ יש לבחור שפה לפני שליחת הודעות
              </div>
            )}
          </Section>

          {/* Messages */}
          <Section title="הודעות WhatsApp">
            {!booking.phone && (
              <div className="alert alert-warning" style={{ marginBottom: 10 }}>
                ⚠️ אין מספר טלפון — לא ניתן לשלוח הודעות
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {MESSAGES.map(m => {
                const sent = sentMessages.includes(m.type);
                const disabled = !booking.phone || !lang;
                // הודעה 4 — רק ישירות
                const skipPayment = m.type === "checkout_payment" && isAirbnb;
                return (
                  <div key={m.type} style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "center", padding: "8px 0",
                    borderBottom: "1px solid var(--border-card)" }}>
                    <span style={{ fontSize: ".85rem", color: skipPayment ? "var(--text-muted)" : "inherit" }}>
                      {m.label}
                      {skipPayment && <span style={{ fontSize: ".72rem", marginRight: 6 }}>(Airbnb — לא רלוונטי)</span>}
                    </span>
                    {sent
                      ? <span style={{ fontSize: ".75rem", color: "var(--success)", fontWeight: 600 }}>✅ נשלח</span>
                      : <button
                          className="btn btn-teal btn-sm"
                          disabled={disabled || skipPayment || isCancelled}
                          style={{ opacity: disabled || skipPayment || isCancelled ? .4 : 1 }}
                          onClick={() => sendMessage(m.type)}
                        >שלח</button>
                    }
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Payment (direct only) */}
          {!isAirbnb && !isCancelled && (
            <Section title="תשלום">
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                {["credit_link", "cash", "bank"].map(pm => (
                  <button
                    key={pm}
                    className={`filter-btn ${paymentMethod === pm ? "active" : ""}`}
                    onClick={() => setPaymentMethod(pm)}
                  >{{ credit_link: "💳 לינק", cash: "💵 מזומן", bank: "🏦 העברה" }[pm]}</button>
                ))}
              </div>
              {paymentMethod === "credit_link" && (
                <input
                  className="input"
                  placeholder="הדבק לינק ישראכרט 360..."
                  value={paymentLink}
                  onChange={e => setPaymentLink(e.target.value)}
                  style={{ marginBottom: 8 }}
                />
              )}
              <button className="btn btn-secondary btn-sm" onClick={() => alert("נשמר!")}>
                שמור
              </button>
            </Section>
          )}

          {/* TTLock */}
          {!isCancelled && (
            <Section title="קוד כניסה — TTLock">
              {ttlockCode
                ? <>
                    <div className="code-display">{ttlockCode}#</div>
                    <div style={{ fontSize: ".78rem", color: "var(--text-muted)", textAlign: "center" }}>
                      פעיל מ-{booking.checkin_label} {booking.checkin_time} עד {booking.checkout_label} {booking.checkout_time}
                    </div>
                    <button className="btn btn-secondary btn-sm" style={{ marginTop: 10, width: "100%" }}
                      onClick={() => setTtlockCode(null)}>
                      צור קוד חדש
                    </button>
                  </>
                : <>
                    <div style={{ fontSize: ".82rem", color: "var(--text-muted)", marginBottom: 10 }}>
                      קוד יווצר אוטומטית ויתוכנת ב-TTLock
                    </div>
                    <button className="btn btn-primary" style={{ width: "100%" }} onClick={generateCode}>
                      🔑 צור קוד כניסה
                    </button>
                  </>
              }
            </Section>
          )}

          {/* Backup Guest */}
          {!isCancelled && (
            <Section title="אורח גיבוי">
              {!backupOpen
                ? <button className="btn btn-secondary" style={{ width: "100%" }}
                    onClick={() => setBackupOpen(true)}>
                    + הוסף אורח גיבוי
                  </button>
                : <div>
                    <div className="alert alert-info" style={{ marginBottom: 10 }}>
                      אורח גיבוי מנוהל בדשבורד בלבד — לא נשלח למיניהוטל
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <input className="input" placeholder="שם פרטי" value={backup.first_name}
                        onChange={e => setBackup({...backup, first_name: e.target.value})} />
                      <input className="input" placeholder="טלפון" value={backup.phone}
                        onChange={e => setBackup({...backup, phone: e.target.value})} />
                      <select className="select" value={backup.language}
                        onChange={e => setBackup({...backup, language: e.target.value})}>
                        {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                      </select>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => alert("גיבוי נשמר!")}>
                        שמור גיבוי
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setBackupOpen(false)}>
                        ביטול
                      </button>
                    </div>
                  </div>
              }
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}
