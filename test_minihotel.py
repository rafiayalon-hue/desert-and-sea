"""
בדיקת חיבור ל-MiniHotel API
הרץ: python test_minihotel.py
"""
import requests
import xml.etree.ElementTree as ET

SANDBOX_URL = "https://sandbox.minihotel.cloud"
USERNAME = "avishag"
PASSWORD = "2024"
HOTEL_ID = "desert89"

def test_get_rooms():
    """שליפת חדרים — בדיקת חיבור בסיסית"""
    url = f"{SANDBOX_URL}/SCI/getRooms"
    xml_body = f"""<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <getRooms>
      <username>{USERNAME}</username>
      <password>{PASSWORD}</password>
      <hotelId>{HOTEL_ID}</hotelId>
    </getRooms>
  </soap:Body>
</soap:Envelope>"""
    
    print("🔍 בודק חיבור ל-MiniHotel Sandbox...")
    print(f"   URL: {url}")
    
    try:
        response = requests.post(
            url,
            data=xml_body.encode("utf-8"),
            headers={"Content-Type": "text/xml; charset=utf-8"},
            timeout=15
        )
        print(f"   Status: {response.status_code}")
        print(f"   Response:\n{response.text[:2000]}")
        return response
    except Exception as e:
        print(f"❌ שגיאה: {e}")
        return None


def test_get_reservation_key():
    """שליפת הזמנות — הפונקציה המרכזית"""
    url = f"{SANDBOX_URL}/SCI/GetReservationKey"
    
    from datetime import datetime, timedelta
    today = datetime.now()
    six_months = today + timedelta(days=180)
    
    xml_body = f"""<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetReservationKey>
      <username>{USERNAME}</username>
      <password>{PASSWORD}</password>
      <hotelId>{HOTEL_ID}</hotelId>
      <dateFrom>{today.strftime('%Y-%m-%d')}</dateFrom>
      <dateTo>{six_months.strftime('%Y-%m-%d')}</dateTo>
    </GetReservationKey>
  </soap:Body>
</soap:Envelope>"""
    
    print("\n🔍 שולף הזמנות...")
    print(f"   URL: {url}")
    print(f"   טווח: {today.strftime('%Y-%m-%d')} עד {six_months.strftime('%Y-%m-%d')}")
    
    try:
        response = requests.post(
            url,
            data=xml_body.encode("utf-8"),
            headers={"Content-Type": "text/xml; charset=utf-8"},
            timeout=15
        )
        print(f"   Status: {response.status_code}")
        print(f"   Response:\n{response.text[:3000]}")
        return response
    except Exception as e:
        print(f"❌ שגיאה: {e}")
        return None


if __name__ == "__main__":
    test_get_rooms()
    test_get_reservation_key()
    
    print("\n" + "="*50)
    print("העתק את ה-Response והדבק בשיחה עם Claude")
    print("="*50)
