import axios from "axios";

const api = axios.create({ baseURL: "/api" });

// Bookings
export const getBookings = (params) => api.get("/bookings/", { params });
export const syncBookings = (from_date, to_date) =>
  api.post("/bookings/sync", null, { params: { from_date, to_date } });
export const getOccupancyStats = (month) =>
  api.get("/bookings/stats/occupancy", { params: { month } });

// Locks
export const getLocks = () => api.get("/locks/");
export const generateEntryCode = (bookingId) =>
  api.post(`/locks/bookings/${bookingId}/generate-code`);

// Guests
export const getGuests = (params) => api.get("/guests/", { params });
export const updateGuestNotes = (guestId, notes) =>
  api.patch(`/guests/${guestId}/notes`, null, { params: { notes } });

// Messages
export const getMessages = () => api.get("/messages/");
export const sendMessage = (data) => api.post("/messages/send", data);
export const sendCampaign = (data) => api.post("/messages/campaign", data);
