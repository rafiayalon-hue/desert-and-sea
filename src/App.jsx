import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import BookingsList from "./pages/BookingsList";
import BookingDetail from "./pages/BookingDetail";
import Settings from "./pages/Settings";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const navigate = (p, id = null) => {
    setPage(p);
    if (id) setSelectedBookingId(id);
  };

  return (
    <div className="app-shell" dir="rtl">
      <Sidebar currentPage={page} navigate={navigate} />
      <main className="main-content">
        {page === "dashboard"  && <Dashboard navigate={navigate} />}
        {page === "bookings"   && <BookingsList navigate={navigate} />}
        {page === "booking"    && <BookingDetail bookingId={selectedBookingId} navigate={navigate} />}
        {page === "settings"   && <Settings />}
      </main>
    </div>
  );
}
