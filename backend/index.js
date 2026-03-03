const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const MH_BASE = process.env.MH_BASE || 'https://api2.minihotel.cloud';
const MH_USER = process.env.MH_USER || 'desertsea';
const MH_PASS = process.env.MH_PASS || 'desert@@003';

function xmlRequest(functionName, params = '') {
  return `<?xml version="1.0" encoding="UTF-8"?>
<request>
  <username>${MH_USER}</username>
  <password>${MH_PASS}</password>
  <function>${functionName}</function>
  ${params}
</request>`;
}

async function callMH(functionName, params = '') {
  const xml = xmlRequest(functionName, params);
  const response = await axios.post(`${MH_BASE}/${functionName}`, xml, {
    headers: { 'Content-Type': 'application/xml' }
  });
  return response.data;
}

// הזמנות
app.get('/api/bookings', async (req, res) => {
  try {
    const { from_date, to_date } = req.query;
    const params = `<from_date>${from_date || ''}</from_date><to_date>${to_date || ''}</to_date>`;
    const data = await callMH('GetReservationKey', params);
    res.send(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// חדרים
app.get('/api/rooms', async (req, res) => {
  try {
    const data = await callMH('getRooms');
    res.send(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.get('/myip', async (req, res) => {
  const r = await axios.get('https://api.ipify.org?format=json');
  res.json(r.data);
});
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));