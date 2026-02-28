import { useState } from "react";

const PREVIEW_GUEST = "יובל";
const PREVIEW_CHECKIN = "04.01.26";
const PREVIEW_CHECKOUT = "07.01.26";
const PREVIEW_CHECKIN_TIME = "15:00";
const PREVIEW_CHECKOUT_TIME = "11:00";
const PREVIEW_ROOM = "מדבר";
const PREVIEW_CODE = "4829";
const PREVIEW_PRICE = "1,200";
const PREVIEW_PAYMENT = "https://isracard360.link/xxx";

function fillPreview(text) {
  return text
    .replace(/{{שם_אורח}}/g, PREVIEW_GUEST)
    .replace(/{{צימר}}/g, PREVIEW_ROOM)
    .replace(/{{קוד}}/g, PREVIEW_CODE)
    .replace(/{{תאריך_כניסה}}/g, PREVIEW_CHECKIN)
    .replace(/{{תאריך_יציאה}}/g, PREVIEW_CHECKOUT)
    .replace(/{{שעת_כניסה}}/g, PREVIEW_CHECKIN_TIME)
    .replace(/{{שעת_יציאה}}/g, PREVIEW_CHECKOUT_TIME)
    .replace(/{{מחיר}}/g, PREVIEW_PRICE)
    .replace(/{{לינק_סליקה}}/g, PREVIEW_PAYMENT);
}

const DEFAULT_MESSAGES = [
  {
    id: 1, title: "✅ אישור הזמנה", timing: "מיד עם הרישום", auto: true,
    langs: {
      he: `שלום {{שם_אורח}}, איזה כיף שהצטרפתם אלינו! 🎉\n\nשמחים לאשר את הזמנתכם ל{{צימר}} בתאריכים {{תאריך_כניסה}} - {{תאריך_יציאה}}\n\nאנחנו זמינים למתן המלצות באזור, ניתן גם להיכנס לאתר שלנו להתעדכן.\nhttps://desert-sea.co.il/\n\nמדבר וים — מקום של חופש 🕊️`,
      en: `Hi {{שם_אורח}}, so happy you're joining us! 🎉\n\nWe're pleased to confirm your booking for the {{צימר}} cabin, {{תאריך_כניסה}} - {{תאריך_יציאה}}\n\nWe're happy to give recommendations for the area. You can also visit our website for more info.\nhttps://desert-sea.co.il/\n\nDesert and Sea — A Place of Freedom 🕊️`,
      es: `¡Hola {{שם_אורח}}, qué alegría que os unáis a nosotros! 🎉\n\nConfirmamos vuestra reserva para la cabaña {{צימר}}, del {{תאריך_כניסה}} al {{תאריך_יציאה}}\n\nEstamos disponibles para recomendaciones de la zona. También podéis visitar nuestra web.\nhttps://desert-sea.co.il/\n\nDesert and Sea — Un lugar de libertad 🕊️`,
      fr: `Bonjour {{שם_אורח}}, quelle joie de vous accueillir ! 🎉\n\nNous confirmons votre réservation pour le chalet {{צימר}} du {{תאריך_כניסה}} au {{תאריך_יציאה}}\n\nNous sommes disponibles pour des recommandations. Vous pouvez aussi consulter notre site.\nhttps://desert-sea.co.il/\n\nDesert and Sea — Un endroit de liberté 🕊️`,
    },
  },
  {
    id: 2, title: "📍 לפני הגעה", timing: "יומיים לפני כניסה", auto: true,
    langs: {
      he: `שלום {{שם_אורח}}! 👋\nמחכים לכם בעוד יומיים ב{{צימר}} 🏜️🌊\n\nביום הגעתכם תקבלו קוד כניסה והוראות הגעה מפורטות.\n\nלכל שאלה — אנחנו כאן!\nמדבר וים 🕊️`,
      en: `Hi {{שם_אורח}}! 👋\nWe're looking forward to welcoming you in 2 days at the {{צימר}} cabin 🏜️🌊\n\nOn the day of your arrival, you'll receive your entry code and detailed directions.\n\nAny questions? We're here!\nDesert and Sea 🕊️`,
      es: `¡Hola {{שם_אורח}}! 👋\n¡Os esperamos en 2 días en la cabaña {{צימר}}! 🏜️🌊\n\nEl día de vuestra llegada recibiréis el código de entrada e instrucciones detalladas.\n\n¿Alguna pregunta? ¡Aquí estamos!\nDesert and Sea 🕊️`,
      fr: `Bonjour {{שם_אורח}} ! 👋\nNous vous attendons dans 2 jours au chalet {{צימר}} 🏜️🌊\n\nLe jour de votre arrivée, vous recevrez votre code d'entrée et les instructions détaillées.\n\nDes questions ? Nous sommes là !\nDesert and Sea 🕊️`,
    },
  },
  {
    id: 3, title: "🔑 כניסה + קוד דלת", timing: "בוקר יום הכניסה + מפת חניה", auto: true,
    langs: {
      he: `ברוכים הבאים למדבר וים 🏜️🌊\n\n🗝️ הקוד שלכם לצימר {{צימר}} הוא {{קוד}}#\nפעיל מ-{{תאריך_כניסה}} שעה {{שעת_כניסה}} עד {{תאריך_יציאה}} שעה {{שעת_יציאה}}\n\n🎯 כתובת בווייז: חניית אורחים, עין גדי\n\nהוראות הגעה:\nחנו במגרש חניה צרויה. עלו למפלס השני או השלישי בחניה לא משולטת. לכו לסוף המפלס, לצד הרחוק מההר. קחו ימינה במשתלבות, רדו במדרכה כ-40 מטר עד הפניה שמאלה לרחוב מעלה צרויה (מדרכה רחבה). בפניה השנייה מהשביל הראשי, לאחר כ-70 מטר קחו ימינה. אנחנו הבית השני משמאל, הצימר במעלה המדרגות.\n\n🛜 WiFi: midbar&yam  |  סיסמה: 1122334455\n\nשתהיה לכם חופשה מעולה! 🌟\n\n📞 רפי 058-4222666\n📞 אבישג 052-3960773\n\nמדבר וים — מקום של חופש 🕊️\ndesert-sea.co.il/#contact`,
      en: `Welcome to Desert and Sea! 🏜️🌊\n\n🗝️ Your entry code for the {{צימר}} cabin is {{קוד}}#\nValid from {{תאריך_כניסה}} at {{שעת_כניסה}} until {{תאריך_יציאה}} at {{שעת_יציאה}}\n\n🎯 Waze: Guests Parking, Ein Gedi\n\nDirections:\nPark at Tzruya parking lot, 2nd or 3rd level (unsignposted). Walk to the far end away from the mountain, turn right, go down the sidewalk ~40m to the left turn onto Ma'ale Tzruya St (wide sidewalk). At the second turn, after ~70m turn right. We are the second house on the left — the cabin is up the stairs.\n\n🛜 WiFi: midbar&yam  |  Password: 1122334455\n\nHave a wonderful vacation! 🌟\n\n📞 Rafi: 058-4222666\n📞 Avishag: 052-3960773\n\nDesert and Sea — A Place of Freedom 🕊️\ndesert-sea.co.il/#contact`,
      es: `¡Bienvenidos a Desert and Sea! 🏜️🌊\n\n🗝️ Vuestro código para la cabaña {{צימר}} es {{קוד}}#\nVálido del {{תאריך_כניסה}} a las {{שעת_כניסה}} hasta el {{תאריך_יציאה}} a las {{שעת_יציאה}}\n\n🎯 Waze: Guests Parking, Ein Gedi\n\nCómo llegar:\nEstacione en el aparcamiento Tzruya, nivel 2 o 3. Camine hasta el extremo alejado de la montaña, gire a la derecha, baje ~40m hasta girar a la izquierda en Ma'ale Tzruya St. Al segundo giro, después de ~70m gire a la derecha. Somos la segunda casa a la izquierda — la cabaña está subiendo las escaleras.\n\n🛜 WiFi: midbar&yam  |  Contraseña: 1122334455\n\n¡Que tengan unas vacaciones increíbles! 🌟\n\n📞 Rafi: 058-4222666\n📞 Avishag: 052-3960773\n\nDesert and Sea — Un lugar de libertad 🕊️\ndesert-sea.co.il/#contact`,
      fr: `Bienvenue à Desert and Sea ! 🏜️🌊\n\n🗝️ Votre code pour le chalet {{צימר}} est le {{קוד}}#\nValide du {{תאריך_כניסה}} à {{שעת_כניסה}} jusqu'au {{תאריך_יציאה}} à {{שעת_יציאה}}\n\n🎯 Waze : Guests Parking, Ein Gedi\n\nInstructions d'accès :\nGarez-vous au parking Tzruya, 2e ou 3e niveau. Marchez jusqu'au bout côté opposé à la montagne, tournez à droite, descendez ~40m jusqu'au virage à gauche sur Ma'ale Tzruya St. Au deuxième virage, après ~70m tournez à droite. Nous sommes la deuxième maison à gauche — le chalet est en haut des escaliers.\n\n🛜 WiFi : midbar&yam  |  Mot de passe : 1122334455\n\nPassez d'excellentes vacances ! 🌟\n\n📞 Rafi : 058-4222666\n📞 Avishag : 052-3960773\n\nDesert and Sea — Un endroit de liberté 🕊️\ndesert-sea.co.il/#contact`,
    },
  },
  {
    id: 4, title: "💳 תזכורת יציאה + תשלום", timing: "בוקר יום העזיבה — הזמנות ישירות בלבד", auto: true,
    langs: {
      he: `בוקר טוב {{שם_אורח}} ☀️\nתודה שבחרתם להתארח אצלנו!\n\nלפני היציאה:\n🕐 צ'ק אאוט עד שעה {{שעת_יציאה}}\n🔑 זכרו לכבות אורות ומזגנים\n🗄️ בדקו שלא שכחתם דברים בארונות או במקרר\n🧹 נסו להשאיר את הצימר מסודר\n\n💳 לתשלום על שהייתכם (₪{{מחיר}}):\n{{לינק_סליקה}}\n\nהיה לכם נעים? נשמח לחוות דעתכם! 😊\n\nמדבר וים — מקום של חופש 🏨`,
      en: `Good morning {{שם_אורח}} ☀️\nThank you for staying with us!\n\nBefore you check out:\n🕐 Check-out by {{שעת_יציאה}}\n🔑 Please turn off lights and air conditioning\n🗄️ Check you haven't left anything in the wardrobes or fridge\n🧹 Please leave the cabin tidy\n\n💳 Payment for your stay (₪{{מחיר}}):\n{{לינק_סליקה}}\n\nHope you enjoyed it! We'd love your feedback 😊\n\nDesert and Sea — A Place of Freedom 🏨`,
      es: `Buenos días {{שם_אורח}} ☀️\n¡Gracias por alojarse con nosotros!\n\nAntes de salir:\n🕐 Check-out antes de las {{שעת_יציאה}}\n🔑 Recordad apagar luces y aire acondicionado\n🗄️ Comprobad que no olvidáis nada en los armarios o en la nevera\n🧹 Intentad dejar la cabaña ordenada\n\n💳 Pago por vuestra estancia (₪{{מחיר}}):\n{{לינק_סליקה}}\n\n¿Lo habéis pasado bien? ¡Nos encantaría vuestra opinión! 😊\n\nDesert and Sea — Un lugar de libertad 🏨`,
      fr: `Bonjour {{שם_אורח}} ☀️\nMerci d'avoir séjourné chez nous !\n\nAvant de partir :\n🕐 Check-out avant {{שעת_יציאה}}\n🔑 Pensez à éteindre les lumières et la climatisation\n🗄️ Vérifiez que vous n'avez rien oublié dans les armoires ou le réfrigérateur\n🧹 Essayez de laisser le chalet en ordre\n\n💳 Paiement pour votre séjour (₪{{מחיר}}) :\n{{לינק_סליקה}}\n\nVous avez passé un bon moment ? Votre avis nous ferait plaisir ! 😊\n\nDesert and Sea — Un endroit de liberté 🏨`,
    },
  },
  {
    id: 5, title: "⭐ בקשת ביקורת", timing: "שעות לאחר שעת הצ'קאאוט", auto: false,
    langs: {
      he: `שלום {{שם_אורח}}! 💙\nתודה רבה על הביקור אצלנו!\n\nנשמח מאוד אם תוכלו:\n⭐ להעניק לנו ציון בגוגל\n📝 לכתוב כמה מילים על החוויה\n📲 להמליץ לחברים\n\nזה עוזר לנו המון!\nמחכים לראותכם שוב בקרוב 🤗\n\n🏨 מדבר וים — מקום של חופש\nhttps://g.page/r/CZ9WMsn3UGPKEAI/review`,
      en: `Hi {{שם_אורח}}! 💙\nThank you so much for staying with us!\n\nWe'd love it if you could:\n⭐ Give us a rating on Google\n📝 Write a few words about your experience\n📲 Recommend us to friends\n\nIt means the world to us!\nHope to see you again soon 🤗\n\n🏨 Desert and Sea — A Place of Freedom\nhttps://g.page/r/CZ9WMsn3UGPKEAI/review`,
      es: `¡Hola {{שם_אורח}}! 💙\n¡Muchas gracias por vuestra visita!\n\nNos encantaría que pudierais:\n⭐ Darnos una valoración en Google\n📝 Escribir unas palabras sobre la experiencia\n📲 Recomendarnos a amigos\n\n¡Nos ayuda muchísimo!\n¡Esperamos veros pronto! 🤗\n\n🏨 Desert and Sea — Un lugar de libertad\nhttps://g.page/r/CZ9WMsn3UGPKEAI/review`,
      fr: `Bonjour {{שם_אורח}} ! 💙\nMerci beaucoup pour votre visite !\n\nNous serions ravis si vous pouviez :\n⭐ Nous donner une note sur Google\n📝 Écrire quelques mots sur votre expérience\n📲 Nous recommander à vos amis\n\nCela nous aide énormément !\nNous espérons vous revoir bientôt ! 🤗\n\n🏨 Desert and Sea — Un endroit de liberté\nhttps://g.page/r/CZ9WMsn3UGPKEAI/review`,
    },
  },
];

const LANG_LABELS = { he: "🇮🇱 עברית", en: "🇬🇧 English", es: "🇪🇸 Español", fr: "🇫🇷 Français" };

function MessageCard({ msg }) {
  const [open,    setOpen]    = useState(false);
  const [lang,    setLang]    = useState("he");
  const [preview, setPreview] = useState(false);
  const [editing, setEditing] = useState(false);
  const [texts,   setTexts]   = useState(msg.langs);
  const [auto,    setAuto]    = useState(msg.auto);

  const currentText = texts[lang];
  const updateText  = (val) => setTexts(prev => ({ ...prev, [lang]: val }));

  return (
    <div style={{ border: "1px solid var(--border-card)", borderRadius: 12, marginBottom: 10, background: "var(--bg-card)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
      {/* Header */}
      <div onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", cursor: "pointer", background: open ? "var(--terra-bg)" : "var(--bg-card)", transition: "background .15s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: ".95rem", fontWeight: 600 }}>{msg.title}</span>
          {auto
            ? <span style={{ fontSize: ".68rem", background: "#E8F5EE", color: "var(--success)", padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>אוטומטי</span>
            : <span style={{ fontSize: ".68rem", background: "#FEF3E5", color: "var(--warning)", padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>ידני</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: ".72rem", color: "var(--text-muted)" }}>{msg.timing}</span>
          <span style={{ color: "var(--text-muted)" }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {open && (
        <div style={{ padding: "14px 16px", borderTop: "1px solid var(--border-card)" }}>
          {/* Controls row */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12, flexWrap: "wrap" }}>
            {Object.keys(LANG_LABELS).map(l => (
              <button key={l} className={`filter-btn ${lang===l?"active":""}`}
                style={{ fontSize: ".73rem", padding: "4px 9px" }}
                onClick={() => { setLang(l); setEditing(false); setPreview(false); }}>
                {LANG_LABELS[l]}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: ".8rem", cursor: "pointer" }}>
              <input type="checkbox" checked={auto} onChange={e => setAuto(e.target.checked)} style={{ accentColor: "var(--terra)" }} />
              אוטומטי
            </label>
            <button className="btn btn-secondary" style={{ fontSize: ".75rem", padding: "5px 10px" }}
              onClick={() => { setPreview(!preview); setEditing(false); }}>
              {preview ? "הסתר" : "👁 תצוגה"}
            </button>
            <button className="btn btn-secondary" style={{ fontSize: ".75rem", padding: "5px 10px" }}
              onClick={() => { setEditing(!editing); setPreview(false); }}>
              {editing ? "ביטול" : "✏️ עריכה"}
            </button>
          </div>

          {/* Preview bubble */}
          {preview && (
            <div style={{ background: "#E8F5EE", border: "1px solid #C8E6C9", borderRadius: 12, padding: 14, marginBottom: 12, fontSize: ".84rem", lineHeight: 1.75, whiteSpace: "pre-wrap", direction: lang==="he"?"rtl":"ltr" }}>
              <div style={{ fontSize: ".7rem", color: "var(--text-muted)", marginBottom: 6 }}>תצוגה מקדימה — {PREVIEW_GUEST}, {PREVIEW_CHECKIN}</div>
              {fillPreview(currentText)}
            </div>
          )}

          {/* Text display/edit */}
          {editing ? (
            <>
              <textarea className="textarea" value={currentText} onChange={e => updateText(e.target.value)}
                rows={10} style={{ fontSize: ".84rem", lineHeight: 1.7, direction: lang==="he"?"rtl":"ltr" }} />
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <button className="btn btn-primary" style={{ fontSize: ".8rem", padding: "6px 14px" }} onClick={() => setEditing(false)}>שמור</button>
                <button className="btn btn-secondary" style={{ fontSize: ".8rem", padding: "6px 14px" }} onClick={() => { updateText(msg.langs[lang]); setEditing(false); }}>איפוס</button>
              </div>
            </>
          ) : (
            <div style={{ background: "var(--sand-bg)", borderRadius: 10, padding: 12, fontSize: ".84rem", lineHeight: 1.75, whiteSpace: "pre-wrap", color: "var(--text-secondary)", direction: lang==="he"?"rtl":"ltr" }}>
              {currentText}
            </div>
          )}

          {/* Variables hint */}
          <div style={{ fontSize: ".7rem", color: "var(--text-muted)", marginTop: 8 }}>
            משתנים: {{שם_אורח}} · {{צימר}} · {{קוד}} · {{תאריך_כניסה}} · {{תאריך_יציאה}} · {{שעת_כניסה}} · {{שעת_יציאה}} · {{מחיר}} · {{לינק_סליקה}}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="detail-section" style={{ marginBottom: 16 }}>
      <div className="detail-section-title">{title}</div>
      {children}
    </div>
  );
}

export default function Settings() {
  const [checkinTime,  setCheckinTime]  = useState("15:00");
  const [checkoutTime, setCheckoutTime] = useState("11:00");
  const [saved,        setSaved]        = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ maxWidth: 700 }}>
      <div className="page-header">
        <div className="page-title">הגדרות</div>
      </div>

      <Section title="זמני כניסה ויציאה">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: ".82rem", color: "var(--text-muted)", marginBottom: 6 }}>שעת כניסה</div>
            <input className="input" type="time" value={checkinTime} onChange={e => setCheckinTime(e.target.value)} />
          </div>
          <div>
            <div style={{ fontSize: ".82rem", color: "var(--text-muted)", marginBottom: 6 }}>שעת יציאה</div>
            <input className="input" type="time" value={checkoutTime} onChange={e => setCheckoutTime(e.target.value)} />
          </div>
        </div>
      </Section>

      <Section title="📱 הודעות WhatsApp">
        <div style={{ fontSize: ".8rem", color: "var(--text-muted)", marginBottom: 14, padding: "8px 12px", background: "var(--sand-bg)", borderRadius: 8 }}>
          לחץ על הודעה לצפייה ועריכה · 4 שפות · תצוגה מקדימה עם נתוני אורח לדוגמה
        </div>
        {DEFAULT_MESSAGES.map(msg => <MessageCard key={msg.id} msg={msg} />)}
      </Section>

      <Section title="MiniHotel">
        <div className="detail-row">
          <span className="detail-label">מלון</span>
          <span className="detail-value">desert89</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">מצב</span>
          <span className="detail-value" style={{ color: "var(--warning)" }}>🟡 Mock Data — ממתין ליובל</span>
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
      </Section>

      <button className="btn btn-primary" onClick={save}>
        {saved ? "✅ נשמר!" : "שמור הגדרות"}
      </button>
    </div>
  );
}
