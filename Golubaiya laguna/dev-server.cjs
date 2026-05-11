/* Локальный просмотр + API контента и загрузки файлов. Запуск: node dev-server.cjs
 * Админ: LAGUNA_ADMIN_TOKEN (по умолчанию laguna-dev-secret)
 * Бронь в Telegram: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID в окружении или в .env (см. .env.example)
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const port = Number(process.env.PORT) || 8080;

/** Подхват .env без зависимости dotenv (только незанятые ключи). */
function loadDotEnvFile() {
  try {
    var p = path.join(root, ".env");
    if (!fs.existsSync(p)) return;
    var txt = fs.readFileSync(p, "utf8");
    var lines = txt.split(/\r?\n/);
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (!line || /^\s*#/.test(line)) continue;
      var eq = line.indexOf("=");
      if (eq < 1) continue;
      var key = line.slice(0, eq).trim();
      var val = line.slice(eq + 1).trim();
      if ((val.charAt(0) === '"' && val.slice(-1) === '"') || (val.charAt(0) === "'" && val.slice(-1) === "'")) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  } catch (e) {
    console.error(e);
  }
}
loadDotEnvFile();
const adminToken = String(process.env.LAGUNA_ADMIN_TOKEN || "laguna-dev-secret");
const dataDir = path.join(root, "data");
const historyDir = path.join(dataDir, "history");
const uploadsDir = path.join(root, "assets", "uploads");
const siteContentPath = path.join(dataDir, "site-content.json");
const actionsLogPath = path.join(dataDir, "server-actions.jsonl");
const bookingsLogPath = path.join(dataDir, "bookings.jsonl");

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".woff2": "font/woff2",
};

function ensureDirs() {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.mkdirSync(historyDir, { recursive: true });
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch (e) {
    console.error(e);
  }
}

function copySiteContentToHistorySync() {
  try {
    if (!fs.existsSync(siteContentPath)) return;
    var prev = fs.readFileSync(siteContentPath, "utf8");
    var name = "site-content-" + Date.now() + ".json";
    fs.writeFileSync(path.join(historyDir, name), prev, "utf8");
  } catch (e) {
    console.error(e);
  }
}

function appendJsonLineSync(filePath, row) {
  try {
    fs.appendFileSync(filePath, JSON.stringify(row) + "\n", "utf8");
  } catch (e) {
    console.error(e);
  }
}

function bookingEscHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function bookingTelegramHtml(row) {
  var name = String(row.name || "").trim();
  var phone = String(row.phone || "").trim();
  var datetime = String(row.datetime || "").trim();
  var note = String(row.note || "").trim();
  var lines = [
    "<b>Новая заявка на бронь</b> (сайт · dev-server)",
    "",
    "<b>Имя:</b> " + bookingEscHtml(name),
    "<b>Телефон:</b> " + bookingEscHtml(phone),
    "<b>Дата и время:</b> " + bookingEscHtml(datetime),
  ];
  if (note) lines.push("", "<b>Комментарий:</b> " + bookingEscHtml(note));
  return lines.join("\n");
}

function sendTelegramBookingMessage(row, cb) {
  var token = String(process.env.TELEGRAM_BOT_TOKEN || "").trim();
  var chatId = process.env.TELEGRAM_CHAT_ID;
  if (chatId != null && chatId !== "") chatId = String(chatId).trim();
  if (!token || !chatId) {
    cb(null, { skipped: true });
    return;
  }
  var text = bookingTelegramHtml(row);
  var url =
    "https://api.telegram.org/bot" + encodeURIComponent(token) + "/sendMessage";
  var payload = JSON.stringify({
    chat_id: chatId,
    text: text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
  try {
    var u = new URL(url);
  } catch (eU) {
    cb(eU);
    return;
  }
  var opts = {
    method: "POST",
    hostname: u.hostname,
    path: u.pathname + u.search,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Length": Buffer.byteLength(payload, "utf8"),
    },
  };
  var req = require("https").request(opts, function (res) {
    var chunks = [];
    res.on("data", function (c) {
      chunks.push(c);
    });
    res.on("end", function () {
      var raw = Buffer.concat(chunks).toString("utf8");
      var j = {};
      try {
        j = JSON.parse(raw);
      } catch (eJ) {
        j = {};
      }
      if (res.statusCode !== 200 || !j.ok) {
        var err = new Error((j && j.description) || "telegram " + res.statusCode);
        err.telegram = j;
        cb(err);
        return;
      }
      cb(null, { ok: true });
    });
  });
  req.on("error", function (e) {
    cb(e);
  });
  req.write(payload);
  req.end();
}

function sendJson(res, code, obj) {
  var body = JSON.stringify(obj);
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Content-Length", Buffer.byteLength(body));
  res.end(body);
}

function readBodyBuffer(req, maxBytes) {
  return new Promise(function (resolve, reject) {
    var chunks = [];
    var len = 0;
    req.on("data", function (ch) {
      len += ch.length;
      if (len > maxBytes) {
        reject(new Error("payload too large"));
        req.destroy();
        return;
      }
      chunks.push(ch);
    });
    req.on("end", function () {
      resolve(Buffer.concat(chunks));
    });
    req.on("error", reject);
  });
}

function checkToken(req) {
  var h = (req.headers["x-laguna-token"] || req.headers["X-Laguna-Token"] || "").trim();
  return h === adminToken;
}

function safeUploadName(name) {
  var base = String(name || "file").split(/[/\\]/).pop();
  if (!/^[a-zA-Z0-9._-]+$/.test(base)) base = "upload.bin";
  if (base.length > 120) base = base.slice(-120);
  return base;
}

function serveStatic(rel, res) {
  if (rel.indexOf("..") !== -1) {
    res.statusCode = 403;
    res.end();
    return;
  }
  if (!rel || rel === "/") rel = "index.html";
  var p = path.join(root, rel);
  fs.stat(p, function (e, st) {
    if (e || !st.isFile()) {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }
    var ext = path.extname(p).toLowerCase();
    res.setHeader("Content-Type", mime[ext] || "application/octet-stream");
    fs.createReadStream(p).pipe(res);
  });
}

ensureDirs();

http
  .createServer(function (req, res) {
    var rawUrl = req.url || "/";
    var u;
    try {
      u = new URL(rawUrl, "http://" + (req.headers.host || "localhost"));
    } catch (e) {
      res.statusCode = 400;
      res.end("Bad URL");
      return;
    }
    var pathname = decodeURIComponent(u.pathname).replace(/\\/g, "/");

    if (pathname === "/api/site-content" && req.method === "GET") {
      fs.readFile(siteContentPath, "utf8", function (err, txt) {
        if (err) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end("{}");
          return;
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(txt);
      });
      return;
    }

    if (pathname === "/api/site-content" && req.method === "POST") {
      if (!checkToken(req)) {
        sendJson(res, 401, { ok: false, error: "unauthorized" });
        return;
      }
      readBodyBuffer(req, 2 * 1024 * 1024)
        .then(function (buf) {
          var obj = JSON.parse(buf.toString("utf8"));
          if (!obj || obj.v !== 1) {
            sendJson(res, 400, { ok: false, error: "invalid payload" });
            return;
          }
          ensureDirs();
          copySiteContentToHistorySync();
          var outTxt = JSON.stringify(obj, null, 2);
          fs.writeFile(siteContentPath, outTxt, "utf8", function (werr) {
            if (werr) {
              sendJson(res, 500, { ok: false, error: "write failed" });
              return;
            }
            appendJsonLineSync(actionsLogPath, {
              t: Date.now(),
              action: "site-content-save",
              bytes: Buffer.byteLength(outTxt, "utf8"),
            });
            sendJson(res, 200, { ok: true });
          });
        })
        .catch(function () {
          sendJson(res, 400, { ok: false, error: "bad body" });
        });
      return;
    }

    if (pathname === "/api/upload" && req.method === "POST") {
      if (!checkToken(req)) {
        sendJson(res, 401, { ok: false, error: "unauthorized" });
        return;
      }
      readBodyBuffer(req, 900 * 1024)
        .then(function (buf) {
          var obj = JSON.parse(buf.toString("utf8"));
          if (!obj || !obj.filename || !obj.data) {
            sendJson(res, 400, { ok: false, error: "need filename + data (base64)" });
            return;
          }
          var b64 = String(obj.data).replace(/^data:[^;]+;base64,/, "");
          var bin = Buffer.from(b64, "base64");
          if (bin.length < 16 || bin.length > 512 * 1024) {
            sendJson(res, 400, { ok: false, error: "file size 16B–512KB" });
            return;
          }
          var ext = path.extname(safeUploadName(obj.filename)).toLowerCase();
          if (![".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"].includes(ext)) {
            sendJson(res, 400, { ok: false, error: "allowed: png jpg webp gif svg" });
            return;
          }
          var stamp = Date.now().toString(36);
          var rand = crypto.randomBytes(6).toString("hex");
          var outName = stamp + "-" + rand + ext;
          var outPath = path.join(uploadsDir, outName);
          ensureDirs();
          fs.writeFile(outPath, bin, function (werr) {
            if (werr) {
              sendJson(res, 500, { ok: false, error: "write failed" });
              return;
            }
            var urlPath = "assets/uploads/" + outName;
            sendJson(res, 200, { ok: true, url: urlPath });
          });
        })
        .catch(function () {
          sendJson(res, 400, { ok: false, error: "bad body" });
        });
      return;
    }

    if (pathname === "/api/booking" && req.method === "POST") {
      readBodyBuffer(req, 48 * 1024)
        .then(function (buf) {
          var obj;
          try {
            obj = JSON.parse(buf.toString("utf8"));
          } catch (eJ) {
            sendJson(res, 400, { ok: false, error: "invalid json" });
            return;
          }
          var row = {
            t: Date.now(),
            name: String((obj && obj.name) || "").slice(0, 200),
            phone: String((obj && obj.phone) || "").slice(0, 80),
            datetime: String((obj && obj.datetime) || "").slice(0, 120),
            note: String((obj && obj.note) || "").slice(0, 2000),
            ua: String(req.headers["user-agent"] || "").slice(0, 400),
          };
          if (!row.name && !row.phone) {
            sendJson(res, 400, { ok: false, error: "empty" });
            return;
          }
          ensureDirs();
          fs.appendFile(bookingsLogPath, JSON.stringify(row) + "\n", "utf8", function (aerr) {
            if (aerr) {
              sendJson(res, 500, { ok: false, error: "log failed" });
              return;
            }
            sendTelegramBookingMessage(row, function (terr) {
              if (terr) {
                console.error("[booking] telegram:", terr.message || terr);
              }
              sendJson(res, 200, { ok: true });
            });
          });
        })
        .catch(function () {
          sendJson(res, 400, { ok: false, error: "bad body" });
        });
      return;
    }

    var rel = pathname.replace(/^\/+/, "");
    serveStatic(rel, res);
  })
  .listen(port, function () {
    console.log("Сайт: http://127.0.0.1:" + port + "/");
    console.log(
      "API: POST /api/site-content, POST /api/upload (X-Laguna-Token); POST /api/booking (публично → data/bookings.jsonl + опционально Telegram)"
    );
    console.log(
      "Telegram: задайте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в окружении или в .env в корне проекта"
    );
    console.log("Токен по умолчанию: laguna-dev-secret (переопределите LAGUNA_ADMIN_TOKEN)");
  });
