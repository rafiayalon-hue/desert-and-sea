import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import BookingsList from "./pages/BookingsList";
import BookingDetail from "./pages/BookingDetail";
import Settings from "./pages/Settings";
import Guests from "./pages/Guests";

function MobileHeader({ currentPage }) {
  const titles = {
    dashboard: "לוח בקרה",
    bookings:  "הזמנות",
    booking:   "פרטי הזמנה",
    guests:    "אורחים",
    settings:  "הגדרות",
  };
  return (
    <header className="mobile-header">
      <div className="mobile-header-logo">
        <div className="mobile-header-logo-circle">
          <svg width="16" height="16" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#A84D3A" strokeWidth="16"/>
            <path d="M15 65 Q35 50 50 58 Q65 66 85 55" stroke="#D4956A" strokeWidth="10" fill="none" strokeLinecap="round"/>
            <path d="M8 80 Q35 65 50 72 Q65 79 92 68" stroke="#2BBFBF" strokeWidth="9" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="mobile-header-title">מדבר וים</span>
      </div>
      <span className="mobile-header-date">
        {new Date().toLocaleDateString("he-IL", { weekday: "short", day: "numeric", month: "short" })}
      </span>
    </header>
  );
}

function BottomNav({ currentPage, navigate }) {
  const items = [
    { id: "dashboard", label: "בקרה",   icon: "🏠" },
    { id: "bookings",  label: "הזמנות", icon: "📋" },
    { id: "guests",    label: "אורחים",  icon: "👥" },
    { id: "settings",  label: "הגדרות", icon: "⚙️" },
  ];
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-items">
        {items.map(item => (
          <button
            key={item.id}
            className={`bottom-nav-item ${
              currentPage === item.id ||
              (currentPage === "booking" && item.id === "bookings")
                ? "active" : ""
            }`}
            onClick={() => navigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  function navigate(page, bookingId = null) {
    setCurrentPage(page);
    if (bookingId) setSelectedBookingId(bookingId);
    window.scrollTo(0, 0);
  }

  function renderPage() {
    switch (currentPage) {
      case "dashboard": return <Dashboard navigate={navigate} />;
      case "bookings":  return <BookingsList navigate={navigate} />;
      case "booking":   return <BookingDetail bookingId={selectedBookingId} navigate={navigate} />;
      case "guests":    return <Guests navigate={navigate} />;
      case "settings":  return <Settings />;
      default:          return <Dashboard navigate={navigate} />;
    }
  }

  return (
    <div className="app-shell">
      <MobileHeader currentPage={currentPage} />
      <Sidebar currentPage={currentPage} navigate={navigate} />
      <main className="main-content">
        {renderPage()}
      </main>
      <BottomNav currentPage={currentPage} navigate={navigate} />
    </div>
  );
}
