import { useState, useEffect } from "react";

let cache = null;
async function loadBookings() {
  if (cache) return cache;
  const res = await fetch("/mock_data/mock_bookings.json");
  cache = await res.json();
  return cache;
}

function extractBaseName(fullName) {
  if (!fullName) return "";
  // הסר סיומות כמו " - אמא", " חברות", " (תיכון)" וכו'
  return fullName
    .replace(/\s*[-–]\s*.+$/, "")
    .replace(/\s*\(.+\)$/, "")
    .replace(/\s+(חברות|אמא|אבא|דודה|דוד|חברים|אח|אחות|הורים)$/, "")
    .trim();
}

export function useGuests() {
  const [guests, setGuests]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings().then(bookings => {
      // בנה מפה: key → אורח
      const phoneMap = {};  // טלפון → guestKey
      const guestMap = {};  // guestKey → אורח

      for (const b of bookings) {
        if (b.status === "cancelled") continue;

        const baseName = extractBaseName(b.full_name);
        const phone    = b.phone || "";

        // קבע key: קודם לפי טלפון, אחר כך לפי שם בסיסי
        let key = null;
        if (phone && phoneMap[phone]) {
          key = phoneMap[phone];
        } else if (guestMap[baseName]) {
          key = baseName;
        } else {
          key = baseName || b.full_name;
        }

        if (phone && !phoneMap[phone]) phoneMap[phone] = key;

        if (!guestMap[key]) {
          guestMap[key] = {
            key,
            display_name: baseName || b.full_name,
            phone,
            email:   b.email || "",
            country: b.country || "",
            bookings: [],
            notes: "",
            aliases: new Set(),
          };
        }

        const g = guestMap[key];
        if (phone && !g.phone) g.phone = phone;
        if (b.email && !g.email) g.email = b.email;
        if (b.full_name !== g.display_name) g.aliases.add(b.full_name);

        g.bookings.push({
          id:        b.id,
          checkin:   b.checkin,
          checkout:  b.checkout,
          nights:    b.nights,
          room:      b.rooms?.[0] || "",
          source:    b.source,
          price:     b.total_price || 0,
          full_name: b.full_name,
        });
      }

      // חשב סטטיסטיקות וסדר
      const result = Object.values(guestMap).map(g => {
        g.aliases = [...g.aliases];
        g.visits       = g.bookings.length;
        g.total_nights = g.bookings.reduce((s, b) => s + (b.nights || 0), 0);
        g.total_spent  = g.bookings.reduce((s, b) => s + (b.price || 0), 0);
        g.last_visit   = g.bookings.map(b => b.checkin).sort().reverse()[0] || "";
        g.is_returning = g.visits > 1;
        // חשוד כפול: אותו שם בסיסי מופיע פעמים בלי טלפון
        g.suspect_duplicate = g.aliases.length > 2 && !g.phone;
        g.bookings.sort((a, b) => b.checkin.localeCompare(a.checkin));
        return g;
      });

      result.sort((a, b) => b.last_visit.localeCompare(a.last_visit));
      setGuests(result);
      setLoading(false);
    });
  }, []);

  return { guests, loading };
}
