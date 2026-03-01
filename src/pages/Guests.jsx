import { useState } from "react";
import { useGuests } from "../hooks/useGuests";

const SOURCE_LABELS = { direct: "ישיר", airbnb: "Airbnb", booking: "Booking", channel: "Channel" };
const ROOM_LABELS   = { desert: "🏜 מדבר", sea: "🌊 ים" };

function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

function formatPrice(p) {
  if (!p) return "—";
  return "₪" + Math.round(p).toLocaleString("he-IL");
}

// ===== כרטיס אורח מפורט =====
function GuestCard({ guest, onClose, onSaveNote }) {
  const [note, setNote]     = useState(guest.notes || "");
  const [editing, setEditing] = useState(false);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      zIndex: 1000, display: "flex", alignItems: "flex-start",
      justifyContent: "center", padding: "20px 12px", overflowY: "auto",
    }} onClick={onClose}>
      <div style={{
        background: "var(--bg-main)", borderRadius: 16, width: "100%", maxWidth: 560,
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)", maxHeight: "90vh", overflowY: "auto",
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ background: "var(--terra)", borderRadius: "16px 16px 0 0", padding: "18px 20px", color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>{guest.display_name}</div>
              {guest.is_returning && (
                <span style={{ fontSize: ".72rem", background: "rgba(255,255,255,0.25)", padding: "2px 8px", borderRadius: 20, marginTop: 4, display: "inline-block" }}>
                  ⭐ אורח חוזר
                </span>
              )}
              {guest.suspect_duplicate && (
                <span style={{ fontSize: ".72rem", background: "#FFA726", padding: "2px 8px", borderRadius: 20, marginTop: 4, marginRight: 6, display: "inline-block" }}>
                  🔄 בדוק כפילות
                </span>
              )}
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: "1rem" }}>✕</button>
          </div>
        </div>

        <div style={{ padding: "16px 18px" }}>
          {/* סטטיסטיקות */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
            {[
              { label: "ביקורים", value: guest.visits },
              { label: "לילות סה\"כ", value: guest.total_nights },
              { label: "הוצאה סה\"כ", value: formatPrice(guest.total_spent) },
            ].map(s => (
              <div key={s.label} style={{ background: "var(--terra-bg)", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--terra)" }}>{s.value}</div>
                <div style={{ fontSize: ".7rem", color: "var(--text-muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* פרטי קשר */}
          <div className="detail-section">
            <div className="detail-section-title">פרטי קשר</div>
            {[
              { label: "טלפון", value: guest.phone, href: guest.phone ? `tel:${guest.phone}` : null },
              { label: "מייל",  value: guest.email,  href: guest.email  ? `mailto:${guest.email}` : null },
              { label: "מדינה", value: guest.country || "—" },
            ].map(r => (
              <div key={r.label} className="detail-row">
                <span className="detail-label">{r.label}</span>
                <span className="detail-value">
                  {r.href
                    ? <a href={r.href} style={{ color: "var(--terra)", textDecoration: "none" }}>{r.value}</a>
                    : (r.value || "—")}
                </span>
              </div>
            ))}
            {guest.aliases?.length > 0 && (
              <div className="detail-row">
                <span className="detail-label">שמות נוספים</span>
                <span className="detail-value" style={{ fontSize: ".78rem", color: "var(--text-muted)" }}>
                  {guest.aliases.join(" · ")}
                </span>
              </div>
            )}
          </div>

          {/* הערות */}
          <div className="detail-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div className="detail-section-title" style={{ marginBottom: 0, paddingBottom: 0, border: "none" }}>📝 הערות והעדפות</div>
              <button className="btn btn-secondary btn-sm" onClick={() => setEditing(!editing)}>
                {editing ? "ביטול" : "✏️ עריכה"}
              </button>
            </div>
            {editing ? (
              <>
                <textarea className="textarea" value={note} onChange={e => setNote(e.target.value)}
                  placeholder="העדפות, הנחות, הערות אישיות..." rows={3} />
                <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }}
                  onClick={() => { onSaveNote(guest.key, note); setEditing(false); }}>
                  שמור
                </button>
              </>
            ) : (
              <div style={{ fontSize: ".84rem", color: note ? "var(--text-primary)" : "var(--text-muted)", minHeight: 36 }}>
                {note || "אין הערות עדיין"}
              </div>
            )}
          </div>

          {/* היסטוריית ביקורים */}
          <div className="detail-section">
            <div className="detail-section-title">היסטוריית ביקורים ({guest.visits})</div>
            {guest.bookings.map((b, i) => (
              <div key={b.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "9px 0", borderBottom: i < guest.bookings.length - 1 ? "1px solid var(--border-card)" : "none",
              }}>
                <div>
                  <div style={{ fontSize: ".84rem", fontWeight: 600 }}>
                    {formatDate(b.checkin)} → {formatDate(b.checkout)}
                    <span style={{ marginRight: 6, fontSize: ".75rem", color: "var(--text-muted)" }}>({b.nights} לילות)</span>
                  </div>
                  <div style={{ fontSize: ".75rem", color: "var(--text-muted)", marginTop: 2 }}>
                    {ROOM_LABELS[b.room] || b.room} · {SOURCE_LABELS[b.source] || b.source}
                  </div>
                </div>
                <div style={{ fontWeight: 600, color: "var(--terra)", fontSize: ".88rem" }}>
                  {formatPrice(b.price)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== שורת אורח ברשימה =====
function GuestRow({ guest, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: "var(--bg-card)", border: "1px solid var(--border-card)",
      borderRadius: 12, padding: "12px 14px", marginBottom: 8, cursor: "pointer",
      transition: "box-shadow .15s, border-color .15s",
      boxShadow: "var(--shadow-sm)",
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--terra)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-card)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 600, fontSize: ".92rem" }}>{guest.display_name}</span>
            {guest.is_returning && (
              <span style={{ fontSize: ".65rem", background: "var(--terra-bg)", color: "var(--terra)", padding: "1px 7px", borderRadius: 20, fontWeight: 700 }}>
                ⭐ חוזר
              </span>
            )}
            {guest.suspect_duplicate && (
              <span style={{ fontSize: ".65rem", background: "#FFF3E0", color: "#E65100", padding: "1px 7px", borderRadius: 20, fontWeight: 700 }}>
                🔄 בדוק
              </span>
            )}
          </div>
          <div style={{ fontSize: ".75rem", color: "var(--text-muted)", marginTop: 3 }}>
            {guest.phone || "ללא טלפון"} {guest.email ? "· " + guest.email : ""}
          </div>
        </div>
        <div style={{ textAlign: "left", flexShrink: 0, marginRight: 10 }}>
          <div style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--terra)" }}>{formatPrice(guest.total_spent)}</div>
          <div style={{ fontSize: ".7rem", color: "var(--text-muted)" }}>{guest.visits} ביקור{guest.visits !== 1 ? "ים" : ""} · {guest.total_nights} לילות</div>
          <div style={{ fontSize: ".68rem", color: "var(--text-muted)", marginTop: 2 }}>ביקור אחרון: {formatDate(guest.last_visit)}</div>
        </div>
      </div>
    </div>
  );
}

// ===== עמוד ראשי =====
export default function Guests() {
  const { guests, loading } = useGuests();
  const [search,      setSearch]      = useState("");
  const [filter,      setFilter]      = useState("all");
  const [selectedKey, setSelectedKey] = useState(null);
  const [notes,       setNotes]       = useState({});

  const filtered = guests.filter(g => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      g.display_name.toLowerCase().includes(q) ||
      (g.phone || "").includes(q) ||
      (g.email || "").toLowerCase().includes(q) ||
      g.aliases.some(a => a.toLowerCase().includes(q));
    const matchFilter =
      filter === "all"       ? true :
      filter === "returning" ? g.is_returning :
      filter === "suspect"   ? g.suspect_duplicate :
      filter === "no_phone"  ? !g.phone : true;
    return matchSearch && matchFilter;
  });

  const selectedGuest = selectedKey
    ? { ...guests.find(g => g.key === selectedKey), notes: notes[selectedKey] || guests.find(g => g.key === selectedKey)?.notes || "" }
    : null;

  function saveNote(key, note) {
    setNotes(prev => ({ ...prev, [key]: note }));
  }

  const stats = {
    total:     guests.length,
    returning: guests.filter(g => g.is_returning).length,
    no_phone:  guests.filter(g => !g.phone).length,
    suspect:   guests.filter(g => g.suspect_duplicate).length,
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>טוען אורחים...</div>;

  return (
    <div style={{ maxWidth: 700 }}>
      <div className="page-header">
        <div className="page-title">אורחים</div>
      </div>

      {/* סטטיסטיקות */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
        {[
          { label: "אורחים", value: stats.total, color: "var(--terra)" },
          { label: "חוזרים", value: stats.returning, color: "var(--teal)" },
          { label: "ללא טלפון", value: stats.no_phone, color: "var(--warning)" },
          { label: "בדוק כפילות", value: stats.suspect, color: "#E65100" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: 12, padding: "12px 10px", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: ".68rem", color: "var(--text-muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* חיפוש */}
      <div style={{ marginBottom: 10 }}>
        <input className="search-input" style={{ width: "100%", boxSizing: "border-box" }}
          placeholder="🔍 חיפוש לפי שם, טלפון, מייל..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* פילטרים */}
      <div style={{ display: "flex", gap: 7, marginBottom: 14, flexWrap: "wrap" }}>
        {[
          { id: "all",       label: "הכל" },
          { id: "returning", label: "⭐ חוזרים" },
          { id: "no_phone",  label: "📵 ללא טלפון" },
          { id: "suspect",   label: "🔄 בדוק כפילות" },
        ].map(f => (
          <button key={f.id} className={"filter-btn" + (filter === f.id ? " active" : "")}
            onClick={() => setFilter(f.id)}>{f.label}</button>
        ))}
        <span style={{ fontSize: ".78rem", color: "var(--text-muted)", alignSelf: "center", marginRight: "auto" }}>
          {filtered.length} אורחים
        </span>
      </div>

      {/* רשימה */}
      {filtered.length === 0
        ? <div style={{ textAlign: "center", color: "var(--text-muted)", padding: 40 }}>לא נמצאו אורחים</div>
        : filtered.map(g => (
            <GuestRow key={g.key} guest={{ ...g, notes: notes[g.key] || g.notes || "" }}
              onClick={() => setSelectedKey(g.key)} />
          ))
      }

      {/* מודאל כרטיס אורח */}
      {selectedGuest && (
        <GuestCard
          guest={selectedGuest}
          onClose={() => setSelectedKey(null)}
          onSaveNote={saveNote}
        />
      )}
    </div>
  );
}
