/**
 * Netlify Function (POST), прокси с netlify.toml: /api/booking -> 200
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

export const handler = async function (event) {
  var headers = { "Content-Type": "application/json; charset=utf-8" };
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: headers, body: JSON.stringify({ ok: false, error: "method_not_allowed" }) };
  }
  var payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, headers: headers, body: JSON.stringify({ ok: false, error: "invalid_json" }) };
  }
  if (!payload || typeof payload !== "object") {
    return { statusCode: 400, headers: headers, body: JSON.stringify({ ok: false, error: "invalid_json" }) };
  }
  var name = String(payload.name || "").trim().slice(0, 200);
  var phone = String(payload.phone || "").trim().slice(0, 80);
  var datetime = String(payload.datetime || "").trim().slice(0, 120);
  var note = String(payload.note || "").trim().slice(0, 2000);
  if (!name || !phone || !datetime) {
    return { statusCode: 400, headers: headers, body: JSON.stringify({ ok: false, error: "validation" }) };
  }
  var token = String(process.env.TELEGRAM_BOT_TOKEN || "").trim();
  var chatId = process.env.TELEGRAM_CHAT_ID;
  if (chatId != null && chatId !== "") chatId = String(chatId).trim();
  if (!token || !chatId) {
    return {
      statusCode: 503,
      headers: headers,
      body: JSON.stringify({ ok: false, error: "telegram_not_configured" }),
    };
  }
  var text = buildTelegramText({ name: name, phone: phone, datetime: datetime, note: note });
  try {
    await sendTelegramMessage(token, chatId, text);
  } catch (e) {
    return {
      statusCode: 502,
      headers: headers,
      body: JSON.stringify({ ok: false, error: "telegram_send_failed" }),
    };
  }
  return { statusCode: 200, headers: headers, body: JSON.stringify({ ok: true }) };
};
