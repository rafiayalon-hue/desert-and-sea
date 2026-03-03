import { useStats, useBookings, useOccupancyStats, formatDate } from "../hooks/useBookings";

function OccupancyBar({ pct, color }) {
  return (
    <div style={{ background: "var(--border-card)", borderRadius: 6, height: 8, overflow: "hidden", flex: 1 }}>
      <div style={{
        width: `${Math.min(pct, 100)}%`, height: "100%", borderRadius: 6,
        background: color, transition: "width .4s ease"
      }} />
    </div>
  );
}

function OccupancyStats() {
  const { months } = useOccupancyStats();
  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="card-title">תפוסה — חודש נוכחי + 2 חודשים קדימה</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 12 }}>
        {months.map(m => (
          <div key={m.month} style={{
            padding: "14px 16px", background: "var(--sand-bg)",
            borderRadius: 10, border: "1px solid var(--border-card)"
          }}>
            <div style={{ fontWeight: 700, fontSize: ".9rem", marginBottom: 12, color: "var(--terra)" }}>
              {m.label}
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".78rem", marginBottom: 4 }}>
                <span style={{ color: "var(--desert-color)", fontWeight: 600 }}>🏜️ מדבר</span>
                <span style={{ fontWeight: 700 }}>{m.desertPct}%
                  <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: ".72rem" }}>
                    {" "}({m.desertN}/{m.daysIn} לילות)
                  </span>
                </span>
              </div>
              <OccupancyBar pct={m.desertPct} color="var(--desert-color)" />
            </div>

            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".78rem", marginBottom: 4 }}>
                <span style={{ color: "var(--teal-dark)", fontWeight: 600 }}>🌊 ים</span>
                <span style={{ fontWeight: 700 }}>{m.seaPct}%
                  <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: ".72rem" }}>
                    {" "}({m.seaN}/{m.daysIn} לילות)
                  </span>
                </span>
              </div>
              <OccupancyBar pct={m.seaPct} color="var(--teal)" />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".78rem",
              paddingTop: 8, borderTop: "1px solid var(--border-card)" }}>
              <span style={{ color: "var(--text-muted)" }}>{m.count} הזמנות</span>
              <span style={{ fontWeight: 700 }}>₪{m.revenue.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ value, label, accent, icon }) {
  return (
    <div className={`stat-card ${accent}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function TodayItem({ booking, navigate }) {
  const room = booking.rooms?.includes("desert") && booking.rooms?.includes("sea")
    ? "מדבר + ים" : booking.rooms?.includes("desert") ? "מדבר" : "ים";
  const color = booking.rooms?.includes("desert") && booking.rooms?.includes("sea")
    ? "combined" : booking.rooms?.includes("desert") ? "desert" : "sea";
  return (
    <div className="today-item" onClick={() => navigate("booking", booking.id)}>
      <div>
        <div className="today-name">{booking.full_name}</div>
        <div className="today-meta">
          {booking.checkin_label} → {booking.checkout_label} · {booking.nights} לילות
        </div>
      </div>
      <span className={`room-tag ${color}`}>{room}</span>
    </div>
  );
}

function UpcomingItem({ booking, navigate }) {
  const color = booking.rooms?.includes("desert") && booking.rooms?.includes("sea")
    ? "combined" : booking.rooms?.includes("desert") ? "desert" : "sea";
  const room = booking.room_display;
  return (
    <div className="today-item" onClick={() => navigate("booking", booking.id)}>
      <div>
        <div className="today-name">{booking.full_name}</div>
        <div className="today-meta">{booking.checkin_label} → {booking.checkout_label}</div>
      </div>
      <span className={`room-tag ${color}`}>{room}</span>
    </div>
  );
}

export default function Dashboard({ navigate }) {
  const { confirmed, arrivals, departures, desertBookings, seaBookings, upcoming7 } = useStats();

  const today = new Date().toLocaleDateString("he-IL", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  // האם החדר תפוס היום
  const todayStr = new Date().toISOString().slice(0, 10);
  const desertOccupied = confirmed.some(b =>
    b.rooms?.includes("desert") && b.checkin <= todayStr && b.checkout > todayStr
  );
  const seaOccupied = confirmed.some(b =>
    b.rooms?.includes("sea") && b.checkin <= todayStr && b.checkout > todayStr
  );

  // הזמנות הבאות השבוע שלא היום
  const nextBookings = upcoming7.filter(b => b.checkin > todayStr);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">לוח בקרה</div>
          <div className="page-subtitle">{today}</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("bookings")}>
          כל ההזמנות ←
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard value={arrivals.length}   label="הגעות היום"     accent="terra"  icon="🛬" />
        <StatCard value={departures.length} label="עזיבות היום"    accent="teal"   icon="🛫" />
        <StatCard value={desertBookings.length} label="הזמנות מדבר (6 חודשים)" accent="desert" icon="🏜️" />
        <StatCard value={seaBookings.length}    label="הזמנות ים (6 חודשים)"   accent="sea"    icon="🌊" />
      </div>

      {/* Occupancy */}
      <OccupancyStats />

      {/* Room Status */}
      <div className="rooms-grid">
        <div className="room-card">
          <div className="room-card-header">
            <span className="room-name desert">🏜️ צימר מדבר</span>
            <span className={`room-badge ${desertOccupied ? "occupied" : "free"}`}>
              {desertOccupied ? "תפוס" : "פנוי"}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">דלת</span>
            <span className="detail-value">🟤 חומה</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">הזמנות קרובות (7 ימים)</span>
            <span className="detail-value">
              {upcoming7.filter(b => b.rooms?.includes("desert")).length}
            </span>
          </div>
        </div>

        <div className="room-card">
          <div className="room-card-header">
            <span className="room-name sea">🌊 צימר ים</span>
            <span className={`room-badge ${seaOccupied ? "occupied" : "free"}`}>
              {seaOccupied ? "תפוס" : "פנוי"}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">דלת</span>
            <span className="detail-value">🔵 כחולה</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">הזמנות קרובות (7 ימים)</span>
            <span className="detail-value">
              {upcoming7.filter(b => b.rooms?.includes("sea")).length}
            </span>
          </div>
        </div>
      </div>

      {/* Today */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div className="card">
          <div className="card-title">הגעות היום</div>
          {arrivals.length === 0
            ? <div style={{ color: "var(--text-muted)", fontSize: ".85rem" }}>אין הגעות היום</div>
            : <div className="today-list">
                {arrivals.map(b => <TodayItem key={b.id} booking={b} navigate={navigate} />)}
              </div>
          }
        </div>

        <div className="card">
          <div className="card-title">עזיבות היום</div>
          {departures.length === 0
            ? <div style={{ color: "var(--text-muted)", fontSize: ".85rem" }}>אין עזיבות היום</div>
            : <div className="today-list">
                {departures.map(b => <TodayItem key={b.id} booking={b} navigate={navigate} />)}
              </div>
          }
        </div>
      </div>

      {/* Upcoming this week */}
      {nextBookings.length > 0 && (
        <div className="card">
          <div className="card-title">הגעות קרובות — 7 ימים</div>
          <div className="today-list">
            {nextBookings.slice(0, 6).map(b => (
              <UpcomingItem key={b.id} booking={b} navigate={navigate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
