/**
 * Vercel: GET/POST /api/booking (маршрут через api/booking/index.js)
 * Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 */
function escHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildTelegramText(payload) {
  var name = String((payload && payload.name) || "").trim();
  var phone = String((payload && payload.phone) || "").trim();
  var datetime = String((payload && payload.datetime) || "").trim();
  var note = String((payload && payload.note) || "").trim();
  var lines = [
    "<b>Новая заявка на бронь</b> (сайт)",
    "",
    "<b>Имя:</b> " + escHtml(name),
    "<b>Телефон:</b> " + escHtml(phone),
    "<b>Дата и время:</b> " + escHtml(datetime),
  ];
  if (note) lines.push("", "<b>Комментарий:</b> " + escHtml(note));
  return lines.join("\n");
}

async function readJsonBody(req) {
  var chunks = [];
  for await (var chunk of req) {
    chunks.push(chunk);
  }
  var raw = Buffer.concat(chunks).toString("utf8");
  if (!raw || raw.length > 48000) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

async function sendTelegramMessage(token, chatId, text) {
  var url =
    "https://api.telegram.org/bot" + encodeURIComponent(token) + "/sendMessage";
  var r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
  var j = await r.json().catch(function () {
    return {};
  });
  if (!r.ok || !j.ok) {
    var err = new Error((j && j.description) || "telegram_http_" + r.status);
    err.telegram = j;
    throw err;
  }
  return j;
}

function corsHeaders(req) {
  var origin = String((req.headers && req.headers.origin) || "").trim();
  if (!origin) return;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

module.exports = async function handler(req, res) {
  var ch = corsHeaders(req);
  if (ch) {
    for (var k in ch) {
      if (Object.prototype.hasOwnProperty.call(ch, k)) res.setHeader(k, ch[k]);
    }
  }
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method === "GET") {
    var token = String(process.env.TELEGRAM_BOT_TOKEN || "").trim();
    var chatId = process.env.TELEGRAM_CHAT_ID;
    if (chatId != null && chatId !== "") chatId = String(chatId).trim();
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        ok: true,
        api: "booking",
        telegram_ready: !!(token && chatId),
      })
    );
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ ok: false, error: "method_not_allowed" }));
    return;
  }

  var payload = await readJsonBody(req);
  if (!payload || typeof payload !== "object") {
    res.statusCode = 400;
    res.end(JSON.stringify({ ok: false, error: "invalid_json" }));
    return;
  }
  var name = String(payload.name || "").trim().slice(0, 200);
  var phone = String(payload.phone || "").trim().slice(0, 80);
  var datetime = String(payload.datetime || "").trim().slice(0, 120);
  var note = String(payload.note || "").trim().slice(0, 2000);
  if (!name || !phone || !datetime) {
    res.statusCode = 400;
    res.end(JSON.stringify({ ok: false, error: "validation" }));
    return;
  }
  var token = String(process.env.TELEGRAM_BOT_TOKEN || "").trim();
  var chatId = process.env.TELEGRAM_CHAT_ID;
  if (chatId != null && chatId !== "") chatId = String(chatId).trim();
  if (!token || !chatId) {
    res.statusCode = 503;
    res.end(JSON.stringify({ ok: false, error: "telegram_not_configured" }));
    return;
  }
  var text = buildTelegramText({ name: name, phone: phone, datetime: datetime, note: note });
  try {
    await sendTelegramMessage(token, chatId, text);
  } catch (e) {
    res.statusCode = 502;
    res.end(JSON.stringify({ ok: false, error: "telegram_send_failed" }));
    return;
  }
  res.statusCode = 200;
  res.end(JSON.stringify({ ok: true }));
};
