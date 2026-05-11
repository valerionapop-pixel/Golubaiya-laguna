(function () {
  try {
    if (new URLSearchParams(window.location.search).get("reset-sw") === "1") {
      var chain = Promise.resolve();
      if ("serviceWorker" in navigator) {
        chain = chain.then(function () {
          return navigator.serviceWorker.getRegistrations().then(function (regs) {
            return Promise.all(
              regs.map(function (r) {
                return r.unregister();
              })
            );
          });
        });
      }
      if ("caches" in window) {
        chain = chain.then(function () {
          return caches.keys().then(function (keys) {
            return Promise.all(
              keys.map(function (k) {
                return caches.delete(k);
              })
            );
          });
        });
      }
      chain
        .catch(function () {})
        .then(function () {
          var u = new URL(window.location.href);
          u.searchParams.delete("reset-sw");
          window.location.replace(u.toString());
        });
      return;
    }
  } catch (e) {}

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var SITE_CONTENT = null;
  try {
    if (typeof window.LagunaSiteOverrides !== "undefined") {
      var Ls = window.LagunaSiteOverrides;
      SITE_CONTENT = Ls.getMergedForSite();
      Ls.applyDocument(document, SITE_CONTENT);
    }
  } catch (errSite) {
    SITE_CONTENT = null;
  }

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      nav.classList.toggle("is-open", open);
    }

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      setOpen(!open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 721px)").matches) setOpen(false);
    });
  }

  var BOOKING_EMAIL =
    SITE_CONTENT && SITE_CONTENT.bookingEmail
      ? String(SITE_CONTENT.bookingEmail)
      : "valerionapop@gmail.com";

  var bookingForm = document.getElementById("booking-form");
  var bookingStatusEl = document.getElementById("content-booking-status");
  var bookingSubmitBtn = document.getElementById("content-booking-submit");
  var bookingSuccessWrap = document.getElementById("booking-form-success");
  var bookingSuccessLineEl = document.getElementById("content-booking-success-line");

  function bookingDigitsFromTelHref(href) {
    if (!href || typeof href !== "string") return "";
    var m = href.match(/^tel:\s*(.+)/i);
    var raw = m ? m[1] : href;
    return String(raw).replace(/\D/g, "");
  }

  function bookingIsPlaceholderTelegram(href) {
    if (!href || typeof href !== "string") return true;
    var u = href.trim().toLowerCase().replace(/\/+$/, "");
    return u === "https://t.me/username" || u === "http://t.me/username";
  }

  function syncBookingFollowupLinks() {
    var wa = document.getElementById("booking-followup-wa");
    var tg = document.getElementById("booking-followup-tg");
    var tel = document.getElementById("booking-followup-tel");
    var telSrc = document.getElementById("content-contact-phone-link");
    var tgSrc = document.getElementById("content-social-tg-link");
    var telHref = telSrc ? String(telSrc.getAttribute("href") || "").trim() : "";
    var digits = bookingDigitsFromTelHref(telHref);
    if (wa) {
      if (digits.length >= 10) {
        wa.setAttribute("href", "https://wa.me/" + digits);
        wa.classList.remove("is-hidden");
      } else {
        wa.setAttribute("href", "#");
        wa.classList.add("is-hidden");
      }
    }
    if (tg && tgSrc) {
      var gh = String(tgSrc.getAttribute("href") || "").trim();
      if (gh && !bookingIsPlaceholderTelegram(gh)) {
        tg.setAttribute("href", gh);
        tg.classList.remove("is-hidden");
      } else {
        tg.setAttribute("href", "#");
        tg.classList.add("is-hidden");
      }
    }
    if (tel) {
      if (/^tel:/i.test(telHref)) {
        tel.setAttribute("href", telHref);
        tel.classList.remove("is-hidden");
      } else {
        tel.setAttribute("href", "#");
        tel.classList.add("is-hidden");
      }
    }
  }

  function setBookingStatus(message, kind) {
    if (!bookingStatusEl) return;
    if (!message) {
      bookingStatusEl.textContent = "";
      bookingStatusEl.classList.add("is-hidden");
      bookingStatusEl.classList.remove("booking-form__status--warn");
      return;
    }
    bookingStatusEl.textContent = message;
    bookingStatusEl.classList.remove("is-hidden");
    if (kind === "warn") bookingStatusEl.classList.add("booking-form__status--warn");
    else bookingStatusEl.classList.remove("booking-form__status--warn");
  }
  function hideBookingSuccessAnim() {
    if (!bookingSuccessWrap) return;
    bookingSuccessWrap.classList.add("is-hidden");
    bookingSuccessWrap.classList.remove("check-anim");
    bookingSuccessWrap.setAttribute("aria-hidden", "true");
    if (bookingSuccessLineEl) bookingSuccessLineEl.textContent = "";
  }

  function showBookingSuccessAnim() {
    if (!bookingSuccessWrap) return;
    syncBookingFollowupLinks();
    bookingSuccessWrap.classList.remove("is-hidden");
    bookingSuccessWrap.setAttribute("aria-hidden", "false");
    bookingSuccessWrap.classList.remove("check-anim");
    try {
      void bookingSuccessWrap.offsetWidth;
    } catch (eOf) {}
    bookingSuccessWrap.classList.add("check-anim");
  }

  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      setBookingStatus("");
      hideBookingSuccessAnim();
      if (bookingSubmitBtn) bookingSubmitBtn.classList.add("is-busy");
      var fd = new FormData(bookingForm);
      var name = String(fd.get("name") || "").trim();
      var phone = String(fd.get("phone") || "").trim();
      var datetime = String(fd.get("datetime") || "").trim();
      var note = String(fd.get("note") || "").trim();
      var bf = SITE_CONTENT && SITE_CONTENT.bookingForm ? SITE_CONTENT.bookingForm : {};
      var pn = bf.mailPrefixName != null ? String(bf.mailPrefixName) : "Имя:";
      var pp = bf.mailPrefixPhone != null ? String(bf.mailPrefixPhone) : "Телефон:";
      var pd = bf.mailPrefixDatetime != null ? String(bf.mailPrefixDatetime) : "Дата и время:";
      var pn2 = bf.mailPrefixNote != null ? String(bf.mailPrefixNote) : "Комментарий:";
      var lines = [
        pn + " " + name,
        pp + " " + phone,
        pd + " " + datetime,
        note ? pn2 + " " + note : "",
      ].filter(Boolean);
      var body = encodeURIComponent(lines.join("\n"));
      var subj = bf.mailSubject != null ? String(bf.mailSubject) : "Бронь — Голубая лагуна";
      var subject = encodeURIComponent(subj);
      function openMailto(statusMessage) {
        setBookingStatus(
          statusMessage ||
            "Не удалось записать заявку на сервер — открываем почту. Отправьте письмо вручную.",
          "warn"
        );
        window.location.href = "mailto:" + BOOKING_EMAIL + "?subject=" + subject + "&body=" + body;
      }
      var okText =
        SITE_CONTENT &&
        SITE_CONTENT.texts &&
        SITE_CONTENT.texts["content-booking-success"] != null &&
        String(SITE_CONTENT.texts["content-booking-success"]).trim()
          ? String(SITE_CONTENT.texts["content-booking-success"]).trim()
          : "Заявка принята. Мы скоро свяжемся с вами — спасибо!";
      var bookingApi = "/api/booking";
      try {
        var bm = document.querySelector('meta[name="laguna-booking-api"]');
        var bc = bm ? String(bm.getAttribute("content") || "").trim() : "";
        if (bc) bookingApi = bc;
      } catch (eBm) {}
      fetch(bookingApi, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          name: name,
          phone: phone,
          datetime: datetime,
          note: note,
        }),
      })
        .then(function (r) {
          return r.text().then(function (txt) {
            var j = null;
            try {
              j = txt ? JSON.parse(txt) : null;
            } catch (eParse) {
              j = null;
            }
            return { ok: r.ok && j && j.ok, status: r.status, j: j };
          });
        })
        .then(function (x) {
          if (x.ok) {
            bookingForm.reset();
            setBookingStatus("");
            if (bookingSuccessLineEl) bookingSuccessLineEl.textContent = okText;
            showBookingSuccessAnim();
            return;
          }
          if (x.status === 404) {
            openMailto(
              "Адрес /api/booking не найден на этом хостинге. Откройте сайт с Vercel или настройте сервер — открываем почту."
            );
            return;
          }
          if (x.j && x.j.error === "telegram_not_configured") {
            openMailto(
              "На сервере не заданы TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID (Vercel → Project → Settings → Environment Variables → Redeploy). Открываем почту."
            );
            return;
          }
          if (x.j && x.j.error === "telegram_send_failed") {
            openMailto(
              "Telegram отклонил сообщение — проверьте токен бота и chat id, затем Redeploy. Открываем почту."
            );
            return;
          }
          if (x.j && x.j.error === "validation") {
            setBookingStatus("Заполните имя, телефон и дату со временем.", "warn");
            return;
          }
          openMailto();
        })
        .catch(function () {
          openMailto(
            "Нет связи с сервером (сеть или блокировка). Открываем почту — отправьте заявку вручную."
          );
        })
        .finally(function () {
          if (bookingSubmitBtn) bookingSubmitBtn.classList.remove("is-busy");
        });
    });
  }

  var skipIntroParam = false;
  try {
    skipIntroParam = new URLSearchParams(window.location.search).get("skip") === "1";
  } catch (err) {
    skipIntroParam = /[?&]skip=1(?:&|$)/.test(window.location.search);
  }
  try {
    if (
      !skipIntroParam &&
      typeof window.LagunaSiteOverrides !== "undefined" &&
      window.LagunaSiteOverrides.getIntroSiteMode(SITE_CONTENT) === "none"
    ) {
      skipIntroParam = true;
    }
  } catch (errIntro) {}
  if (skipIntroParam) {
    document.body.classList.remove("intro-locked");
    var skipIntroRoot = document.getElementById("site-intro");
    if (skipIntroRoot) {
      skipIntroRoot.classList.add("is-done");
      skipIntroRoot.setAttribute("aria-hidden", "true");
      skipIntroRoot.style.display = "none";
    }
    try {
      sessionStorage.removeItem("laguna_intro_session_v1");
    } catch (err2) {}
  }

  if (!skipIntroParam) {
  /* Full-screen intro: gate → cinematic → quiz → site */
  var introRoot = document.getElementById("site-intro");
  var phaseGate = document.getElementById("intro-phase-gate");
  var phaseCine = document.getElementById("intro-phase-cinematic");
  var phaseQuiz = document.getElementById("intro-phase-quiz");
  var phaseSuccess = document.getElementById("intro-phase-success");
  var introStart = document.getElementById("intro-start");
  var introCanvas = document.getElementById("intro-canvas");
  var quizMeta = document.getElementById("quiz-meta");
  var quizQuestionEl = document.getElementById("quiz-question");
  var quizOptionsEl = document.getElementById("quiz-options");
  var quizProgressFill = document.getElementById("quiz-progress-fill");
  var quizDots = document.getElementById("quiz-dots");
  var quizFigure = document.getElementById("quiz-figure");
  var quizFigureImg = document.getElementById("quiz-figure-img");
  var failModal = document.getElementById("quiz-fail-modal");
  var failRetry = document.getElementById("content-quiz-fail-retry");
  var quizFailTitleEl = document.getElementById("content-quiz-fail-title");
  var confettiCanvas = document.getElementById("intro-confetti-canvas");
  var successFxCanvas = document.getElementById("intro-success-fx-canvas");

  if (
    !introRoot ||
    !phaseGate ||
    !phaseCine ||
    !phaseQuiz ||
    !phaseSuccess ||
    !introStart ||
    !introCanvas ||
    !quizMeta ||
    !quizQuestionEl ||
    !quizOptionsEl ||
    !quizProgressFill ||
    !quizDots ||
    !quizFigure ||
    !quizFigureImg ||
    !failModal ||
    !failRetry ||
    !quizFailTitleEl
  ) {
    return;
  }

  phaseQuiz.addEventListener("change", function (e) {
    var t = e.target;
    if (!t || t.nodeName !== "INPUT" || t.type !== "radio") return;
    if (!t.classList.contains("intro-quiz__choice-circle")) return;
    if (t.disabled) return;
    onQuizAnswer(t.getAttribute("data-correct") === "1");
  });

  var FAIL_MESSAGES = [
    "Увы, ты не прошёл опрос. Не позорься и повтори попытку.",
    "Лагуна чуть разочарована, но верит в второй шанс. Ещё разок?",
    "Так близко к истине… и всё же мимо. Соберись и попробуй снова.",
    "Никто не идеален. Кроме тех, кто проходит с первого раза. Ты пока не из них — жми «Повторить».",
  ];
  if (
    SITE_CONTENT &&
    Array.isArray(SITE_CONTENT.failMessages) &&
    SITE_CONTENT.failMessages.length
  ) {
    FAIL_MESSAGES = SITE_CONTENT.failMessages.map(String);
  }

  function pickFailMessage() {
    return FAIL_MESSAGES[(Math.random() * FAIL_MESSAGES.length) | 0];
  }

  var SESSION_KEY = "laguna_intro_session_v1";

  function clearIntroSession() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (err) {}
  }

  function pickRandomSlot(arr) {
    return arr[(Math.random() * arr.length) | 0];
  }

  function pickQuizQuestions() {
    var slots = [
      [
        {
          text: "Какую игру выберет настоящий мужчина?",
          figure: "quiz/q1.svg",
          figureAlt: "Иллюстрация: гарнитура, ПК и соревновательный дух",
          options: [
            { text: "Дота 2", correct: true },
            { text: "Pubg", correct: false },
            { text: "Counter strike 2", correct: false },
          ],
        },
        {
          text: "Что из этого — чистый пятничный идеал?",
          figure: "quiz/q1.svg",
          figureAlt: "Иллюстрация: гарнитура, ПК и соревновательный дух",
          options: [
            { text: "Лечь спать в девять и выспаться", correct: false },
            { text: "Ещё одну катку в Доте — и потом обнимашки", correct: true },
            { text: "Сортировка носков по цвету", correct: false },
          ],
        },
      ],
      [
        {
          text: "Настоящая мужская любовь — это любовь к:",
          figure: "quiz/q2.svg",
          figureAlt: "Иллюстрация: сердце и силуэты дружбы",
          options: [
            { text: "Жене", correct: false },
            { text: "Автомобилю", correct: false },
            { text: "Другу", correct: true },
          ],
        },
        {
          text: "Кому ты скажешь «я облажался» в первую очередь?",
          figure: "quiz/q2.svg",
          figureAlt: "Иллюстрация: сердце и силуэты дружбы",
          options: [
            { text: "Начальнику по работе", correct: false },
            { text: "Маме, чтобы она волновалась", correct: false },
            { text: "Другу, который не осудит", correct: true },
          ],
        },
      ],
      [
        {
          text: "Как выглядит идеальный вечер двух броманов?",
          figure: "quiz/q3.svg",
          figureAlt: "Иллюстрация: диван, два геймпада и пицца",
          options: [
            { text: "Съесть всё, что есть в холодильнике, и вместе страдать", correct: false },
            { text: "Две консоли, два геймпада и пицца", correct: true },
            {
              text: "Придумать совместный бизнес, который никогда не реализуют, но зато весело",
              correct: false,
            },
          ],
        },
        {
          text: "Золотой стандарт «дома у одного из нас»?",
          figure: "quiz/q3.svg",
          figureAlt: "Иллюстрация: диван, два геймпада и пицца",
          options: [
            { text: "Тишина, чай и ранний отбой", correct: false },
            { text: "Два геймпада, заказ еды и никаких дедлайнов", correct: true },
            { text: "Совместный просмотр лекций по саморазвитию", correct: false },
          ],
        },
      ],
    ];
    var out = [];
    for (var s = 0; s < slots.length; s++) {
      var ch = pickRandomSlot(slots[s]);
      out.push({
        text: ch.text,
        figure: ch.figure,
        figureAlt: ch.figureAlt,
        options: ch.options.map(function (o) {
          return { text: o.text, correct: o.correct };
        }),
      });
    }
    return out;
  }

  function getQuizForNewSession() {
    try {
      if (typeof window.LagunaSiteOverrides !== "undefined" && SITE_CONTENT) {
        var fixed = window.LagunaSiteOverrides.getQuizQuestionsFromData(SITE_CONTENT);
        if (fixed) return fixed;
      }
    } catch (eQz) {
      /* ignore */
    }
    return pickQuizQuestions();
  }

  var QUIZ = getQuizForNewSession();

  var PARTICLE_COLORS = ["#3db8e8", "#5ee0ff", "#a59cff", "#c94b8f", "#b85a7a", "#f8f4fc"];
  var AUTO_EXIT_MS =
    SITE_CONTENT && SITE_CONTENT.intro && SITE_CONTENT.intro.autoExitCinematicMs != null
      ? SITE_CONTENT.intro.autoExitCinematicMs
      : 6200;
  var SUCCESS_SCREEN_MS =
    SITE_CONTENT && SITE_CONTENT.intro && SITE_CONTENT.intro.successScreenMs != null
      ? SITE_CONTENT.intro.successScreenMs
      : 4800;
  var rafId = 0;
  var particles = [];
  var stardust = [];
  var gateDecorEl = document.querySelector(".intro__gate-decor");
  var cineFlashEl = document.getElementById("intro-cine-flash");
  var edgeRippleEl = document.getElementById("intro-edge-ripple");
  var parallaxTx = 0;
  var parallaxTy = 0;
  var parallaxPx = 0;
  var parallaxPy = 0;
  var parallaxRaf = 0;
  var autoExitTimer = 0;
  var exitScheduled = false;
  var cineToQuizDone = false;
  var currentQ = 0;
  var quizHadMistake = false;
  var quizSfxCtx = null;
  var resumeQuizMode = false;
  var startHoverLast = 0;

  try {
    var sessRaw = sessionStorage.getItem(SESSION_KEY);
    if (sessRaw) {
      var sessObj = JSON.parse(sessRaw);
      if (sessObj.phase === "quiz" && sessObj.quizJson) {
        QUIZ = JSON.parse(sessObj.quizJson);
        currentQ = sessObj.currentQ | 0;
        if (currentQ >= QUIZ.length) currentQ = 0;
        quizHadMistake = !!sessObj.quizHadMistake;
        resumeQuizMode = true;
      }
    }
  } catch (errS) {
    clearIntroSession();
  }

  function persistQuizSession() {
    if (exitScheduled) return;
    try {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          phase: "quiz",
          currentQ: currentQ,
          quizHadMistake: quizHadMistake,
          quizJson: JSON.stringify(QUIZ),
        })
      );
    } catch (err) {}
  }

  function playStartHoverChime() {
    if (prefersReducedMotion()) return;
    var now = Date.now();
    if (now - startHoverLast < 400) return;
    var ctx = getQuizSfxCtx();
    if (!ctx || ctx.state !== "running") return;
    startHoverLast = now;
    try {
      var t = ctx.currentTime;
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(880, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.035, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.1);
    } catch (err) {}
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function getQuizSfxCtx() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      if (!quizSfxCtx) quizSfxCtx = new AC();
      return quizSfxCtx;
    } catch (err) {
      return null;
    }
  }

  var quizSfxUnlockDone = false;
  function unlockQuizSfxAfterGesture() {
    if (quizSfxUnlockDone) return;
    quizSfxUnlockDone = true;
    try {
      var c = getQuizSfxCtx();
      if (c && c.state === "suspended") c.resume().catch(function () {});
    } catch (eUnlock) {
      /* ignore */
    }
  }
  window.addEventListener("pointerdown", unlockQuizSfxAfterGesture, { capture: true });
  window.addEventListener("keydown", unlockQuizSfxAfterGesture, { capture: true });

  function shuffleOptions(options) {
    var arr = options.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = (Math.random() * (i + 1)) | 0;
      var t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
    return arr;
  }

  function resizeCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = introCanvas.clientWidth;
    var h = introCanvas.clientHeight;
    if (!w || !h) return;
    introCanvas.width = Math.floor(w * dpr);
    introCanvas.height = Math.floor(h * dpr);
    var ctx = introCanvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawnParticle(w, h) {
    var cx = w * 0.5;
    var cy = h * 0.36;
    var color = PARTICLE_COLORS[(Math.random() * PARTICLE_COLORS.length) | 0];
    if (Math.random() < 0.34) {
      var sang = Math.random() * Math.PI * 2;
      var sdist = 50 + Math.random() * Math.min(w, h) * 0.38;
      return {
        x: cx + Math.cos(sang) * sdist,
        y: cy + Math.sin(sang) * sdist,
        vx: -Math.sin(sang) * 0.5,
        vy: Math.cos(sang) * 0.5,
        life: 0,
        maxLife: 48 + Math.random() * 88,
        size: 0.55 + Math.random() * 2.5,
        color: color,
        pulse: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.06,
        spiral: true,
      };
    }
    var angle = Math.random() * Math.PI * 2;
    var dist = 40 + Math.random() * Math.min(w, h) * 0.42;
    return {
      x: cx + Math.cos(angle) * dist * (0.2 + Math.random() * 0.9),
      y: cy + Math.sin(angle) * dist * (0.15 + Math.random() * 0.85),
      vx: (Math.random() - 0.5) * 0.85,
      vy: -0.35 - Math.random() * 1.15,
      life: 0,
      maxLife: 45 + Math.random() * 70,
      size: 0.6 + Math.random() * 2.8,
      color: color,
      pulse: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.08,
      spiral: false,
    };
  }

  function spawnStardust(w, h) {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      tw: Math.random() * Math.PI * 2,
      spd: 0.025 + Math.random() * 0.045,
      s: 0.35 + Math.random() * 1.05,
    };
  }

  function tickParticles() {
    var ctx = introCanvas.getContext("2d");
    if (!ctx) return;
    var w = introCanvas.clientWidth;
    var h = introCanvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    if (prefersReducedMotion()) {
      return;
    }

    var cx = w * 0.5;
    var cy = h * 0.36;

    while (particles.length < 190) {
      particles.push(spawnParticle(w, h));
    }

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.life += 1;
      p.pulse += 0.12 + p.spin;
      if (p.spiral) {
        var dx = cx - p.x;
        var dy = cy - p.y;
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        p.vx += (dx / len) * 0.058;
        p.vy += (dy / len) * 0.042;
        p.vx += (-dy / len) * 0.075;
        p.vy += (dx / len) * 0.075;
      }
      p.x += p.vx + Math.sin(p.pulse) * 0.35;
      p.y += p.vy;
      p.vx *= 0.985;
      p.vy *= 0.992;

      var t = p.life / p.maxLife;
      var alpha = t < 0.12 ? t / 0.12 : t > 0.72 ? (1 - t) / 0.28 : 1;
      alpha = Math.max(0, Math.min(1, alpha)) * (0.45 + Math.sin(p.pulse) * 0.25 + 0.35);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8 + p.size * 4;
      ctx.globalAlpha = alpha * 0.9;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (p.life > p.maxLife || p.y < -20 || p.x < -40 || p.x > w + 40) {
        particles[i] = spawnParticle(w, h);
      }
    }

    while (stardust.length < 56) {
      stardust.push(spawnStardust(w, h));
    }
    for (var si = 0; si < stardust.length; si++) {
      var st = stardust[si];
      st.tw += st.spd;
      var sa = 0.12 + Math.sin(st.tw) * 0.38 + 0.28;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = "#fffefc";
      ctx.shadowColor = "#5ee0ff";
      ctx.shadowBlur = 4;
      ctx.globalAlpha = sa * 0.55;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.s, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      if (Math.random() < 0.004) {
        st.x = Math.random() * w;
        st.y = Math.random() * h;
      }
    }

    rafId = window.requestAnimationFrame(tickParticles);
  }

  function stopParticles() {
    if (rafId) window.cancelAnimationFrame(rafId);
    rafId = 0;
    particles.length = 0;
    stardust.length = 0;
  }

  function parallaxTick() {
    parallaxPx += (parallaxTx - parallaxPx) * 0.07;
    parallaxPy += (parallaxTy - parallaxPy) * 0.07;
    if (gateDecorEl) {
      gateDecorEl.style.setProperty("--gx", parallaxPx.toFixed(4));
      gateDecorEl.style.setProperty("--gy", parallaxPy.toFixed(4));
    }
    if (Math.abs(parallaxTx - parallaxPx) > 0.002 || Math.abs(parallaxTy - parallaxPy) > 0.002) {
      parallaxRaf = window.requestAnimationFrame(parallaxTick);
    } else {
      parallaxRaf = 0;
    }
  }

  function triggerEdgeRipple() {
    if (!edgeRippleEl || prefersReducedMotion()) return;
    edgeRippleEl.classList.remove("is-active");
    void edgeRippleEl.offsetWidth;
    edgeRippleEl.classList.add("is-active");
    window.setTimeout(function () {
      edgeRippleEl.classList.remove("is-active");
    }, 720);
  }

  function triggerCineFlash() {
    if (!cineFlashEl || prefersReducedMotion()) return;
    cineFlashEl.classList.remove("is-on");
    void cineFlashEl.offsetWidth;
    cineFlashEl.classList.add("is-on");
    window.setTimeout(function () {
      cineFlashEl.classList.remove("is-on");
    }, 105);
  }

  function onIntroPointerMove(e) {
    if (introRoot.classList.contains("is-done")) return;
    if (
      introRoot.classList.contains("intro--gate-mode") &&
      !prefersReducedMotion() &&
      !document.documentElement.classList.contains("low-glare")
    ) {
      var rect = introRoot.getBoundingClientRect();
      parallaxTx = (e.clientX - rect.left) / rect.width - 0.5;
      parallaxTy = (e.clientY - rect.top) / rect.height - 0.5;
      if (!parallaxRaf) parallaxRaf = window.requestAnimationFrame(parallaxTick);
    }
  }

  introRoot.addEventListener("mousemove", onIntroPointerMove, { passive: true });

  function finishIntro() {
    if (exitScheduled) return;
    exitScheduled = true;
    clearIntroSession();
    if (autoExitTimer) {
      window.clearTimeout(autoExitTimer);
      autoExitTimer = 0;
    }
    stopParticles();
    stopSuccessAmbientFx();
    if (parallaxRaf) window.cancelAnimationFrame(parallaxRaf);
    parallaxRaf = 0;
    introRoot.classList.add("is-done");
    document.body.classList.remove("intro-locked");
    introRoot.setAttribute("aria-hidden", "true");
    window.setTimeout(function () {
      introRoot.style.display = "none";
    }, 1200);
  }

  function goToQuizFromCinematic() {
    if (cineToQuizDone || exitScheduled) return;
    var LsC = window.LagunaSiteOverrides;
    if (LsC && LsC.getIntroSiteMode(SITE_CONTENT) === "cinematic_to_site") {
      cineToQuizDone = true;
      if (autoExitTimer) {
        window.clearTimeout(autoExitTimer);
        autoExitTimer = 0;
      }
      stopParticles();
      phaseCine.classList.remove("is-active");
      phaseCine.classList.add("is-hidden");
      phaseCine.setAttribute("aria-hidden", "true");
      triggerEdgeRipple();
      finishIntro();
      return;
    }
    cineToQuizDone = true;
    if (autoExitTimer) {
      window.clearTimeout(autoExitTimer);
      autoExitTimer = 0;
    }
    stopParticles();
    phaseCine.classList.remove("is-active");
    phaseCine.classList.add("is-hidden");
    phaseCine.setAttribute("aria-hidden", "true");
    triggerEdgeRipple();

    phaseQuiz.classList.remove("is-hidden");
    phaseQuiz.setAttribute("aria-hidden", "false");
    introRoot.setAttribute("aria-labelledby", "quiz-question");

    currentQ = 0;
    quizHadMistake = false;
    renderQuiz();
  }

  function updateQuizProgressUI() {
    var pct = ((currentQ + 1) / QUIZ.length) * 100;
    quizProgressFill.style.width = pct + "%";
    var dotNodes = quizDots.querySelectorAll(".intro-quiz__dot");
    for (var i = 0; i < dotNodes.length; i++) {
      dotNodes[i].classList.toggle("is-done", i < currentQ);
      dotNodes[i].classList.toggle("is-current", i === currentQ);
    }
  }

  function renderQuiz() {
    var item = QUIZ[currentQ];
    var quizSurface = document.getElementById("quiz-surface");
    quizMeta.textContent = "Вопрос " + String(currentQ + 1) + " из " + String(QUIZ.length);
    quizQuestionEl.textContent = item.text;
    quizOptionsEl.classList.remove("intro-quiz__options--locked");
    quizOptionsEl.innerHTML = "";
    updateQuizProgressUI();

    if (item.figure) {
      quizFigure.hidden = false;
      quizFigureImg.src = item.figure;
      quizFigureImg.alt = item.figureAlt || "";
    } else {
      quizFigure.hidden = true;
      quizFigureImg.removeAttribute("src");
      quizFigureImg.alt = "";
    }

    var opts = shuffleOptions(item.options);
    var radioWrap = document.createElement("div");
    radioWrap.className = "intro-quiz__radio-input";
    radioWrap.setAttribute("role", "presentation");

    var glass = document.createElement("div");
    glass.className = "intro-quiz__glass";
    glass.setAttribute("aria-hidden", "true");
    var glassInner = document.createElement("div");
    glassInner.className = "intro-quiz__glass-inner";
    glass.appendChild(glassInner);
    radioWrap.appendChild(glass);

    var selector = document.createElement("div");
    selector.className = "intro-quiz__selector";
    var nameAttr = "intro-quiz-q" + String(currentQ);

    opts.forEach(function (opt, idx) {
      var choice = document.createElement("div");
      choice.className = "intro-quiz__choice";

      var knobWrap = document.createElement("div");
      var input = document.createElement("input");
      input.type = "radio";
      input.className = "intro-quiz__choice-circle";
      input.name = nameAttr;
      input.id = "intro-quiz-opt-" + String(currentQ) + "-" + String(idx);
      input.value = String(idx);
      input.setAttribute("data-correct", opt.correct ? "1" : "0");

      var ball = document.createElement("div");
      ball.className = "intro-quiz__ball";
      ball.setAttribute("aria-hidden", "true");

      knobWrap.appendChild(input);
      knobWrap.appendChild(ball);

      var lab = document.createElement("label");
      lab.className = "intro-quiz__choice-name";
      lab.htmlFor = input.id;
      lab.textContent = opt.text;

      choice.appendChild(knobWrap);
      choice.appendChild(lab);
      selector.appendChild(choice);
    });

    radioWrap.appendChild(selector);
    quizOptionsEl.appendChild(radioWrap);

    if (quizSurface && !prefersReducedMotion() && currentQ > 0) {
      quizSurface.classList.remove("intro-quiz__surface--tick");
      void quizSurface.offsetWidth;
      quizSurface.classList.add("intro-quiz__surface--tick");
      window.clearTimeout(quizSurface._tickTimer);
      quizSurface._tickTimer = window.setTimeout(function () {
        quizSurface.classList.remove("intro-quiz__surface--tick");
      }, 520);
    }

    quizQuestionEl.focus();
    persistQuizSession();
  }

  /**
   * Звук оплошности / провала: короткий «ошибочный» дубль-тон,
   * нисходящий комедийный свисток (шум), лёгкий глухой акцент в конце.
   */
  function playQuizAdvanceSound() {
    if (prefersReducedMotion()) return;
    var ctx = getQuizSfxCtx();
    if (!ctx) return;
    try {
      var now = ctx.currentTime;
      var dest = ctx.destination;
      function blip(t0, freq, vol) {
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(freq, t0);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(vol, t0 + 0.018);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.11);
        o.connect(g);
        g.connect(dest);
        o.start(t0);
        o.stop(t0 + 0.13);
      }
      blip(now + 0, 523.25, 0.075);
      blip(now + 0.1, 659.25, 0.065);
    } catch (err) {
      /* ignore */
    }
  }

  function playQuizSuccessFanfare() {
    if (prefersReducedMotion()) return;
    var ctx = getQuizSfxCtx();
    if (!ctx) return;
    try {
      var now = ctx.currentTime;
      var dest = ctx.destination;
      var freqs = [523.25, 659.25, 783.99, 1046.5];
      for (var i = 0; i < freqs.length; i++) {
        var f = freqs[i];
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.type = "triangle";
        var t0 = now + i * 0.065;
        o.frequency.setValueAtTime(f, t0);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(0.085 - i * 0.012, t0 + 0.028);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.2);
        o.connect(g);
        g.connect(dest);
        o.start(t0);
        o.stop(t0 + 0.22);
      }
    } catch (err) {
      /* ignore */
    }
  }

  function playQuizFailSound() {
    try {
      var ctx = getQuizSfxCtx();
      if (!ctx) return;

      var now = ctx.currentTime;
      var dest = ctx.destination;

      function blunderTone(t0, freq, dur, peak) {
        var o = ctx.createOscillator();
        var lp = ctx.createBiquadFilter();
        var g = ctx.createGain();
        o.type = "square";
        o.frequency.setValueAtTime(freq, t0);
        lp.type = "lowpass";
        lp.frequency.setValueAtTime(2400, t0);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(peak, t0 + 0.006);
        g.gain.setValueAtTime(peak * 0.88, t0 + dur * 0.55);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        o.connect(lp);
        lp.connect(g);
        g.connect(dest);
        o.start(t0);
        o.stop(t0 + dur + 0.015);
      }

      blunderTone(now + 0, 300, 0.09, 0.11);
      blunderTone(now + 0.1, 215, 0.12, 0.095);

      var sr = ctx.sampleRate;
      var nSamples = Math.floor(0.4 * sr);
      var noiseBuf = ctx.createBuffer(1, nSamples, sr);
      var ch = noiseBuf.getChannelData(0);
      for (var i = 0; i < nSamples; i++) ch[i] = Math.random() * 2 - 1;

      var noise = ctx.createBufferSource();
      noise.buffer = noiseBuf;
      var bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.Q.setValueAtTime(7, now + 0.2);
      bp.frequency.setValueAtTime(2100, now + 0.2);
      bp.frequency.exponentialRampToValueAtTime(320, now + 0.56);
      var ng = ctx.createGain();
      ng.gain.setValueAtTime(0.0001, now + 0.2);
      ng.gain.linearRampToValueAtTime(0.11, now + 0.23);
      ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      noise.connect(bp);
      bp.connect(ng);
      ng.connect(dest);
      noise.start(now + 0.2);

      var thud = ctx.createOscillator();
      thud.type = "sine";
      thud.frequency.setValueAtTime(82, now + 0.5);
      var tg = ctx.createGain();
      tg.gain.setValueAtTime(0.0001, now + 0.5);
      tg.gain.linearRampToValueAtTime(0.18, now + 0.508);
      tg.gain.exponentialRampToValueAtTime(0.0001, now + 0.72);
      thud.connect(tg);
      tg.connect(dest);
      thud.start(now + 0.5);
      thud.stop(now + 0.75);
    } catch (err) {
      /* без звука, если браузер ограничил */
    }
  }

  function pulseFailHaptic() {
    if (prefersReducedMotion()) return;
    try {
      if (navigator.vibrate) navigator.vibrate([26, 42, 28, 42, 32]);
    } catch (err) {
      /* ignore */
    }
  }

  function showFailModal() {
    quizFailTitleEl.textContent = pickFailMessage();
    pulseFailHaptic();
    playQuizFailSound();
    failModal.classList.remove("is-hidden");
    failRetry.focus();
  }

  function hideFailModal() {
    failModal.classList.add("is-hidden");
  }

  function onQuizAnswer(isCorrect) {
    try {
      var pre = getQuizSfxCtx();
      if (pre && pre.state === "suspended") pre.resume().catch(function () {});
    } catch (ePre) {
      /* ignore */
    }
    quizOptionsEl.classList.add("intro-quiz__options--locked");
    quizOptionsEl.querySelectorAll(".intro-quiz__choice-circle").forEach(function (inp) {
      inp.disabled = true;
      if (inp.getAttribute("data-correct") === "1") {
        var row = inp.closest(".intro-quiz__choice");
        if (row) row.classList.add("intro-quiz__choice--reveal-correct");
      }
    });
    var wasCorrect = isCorrect;
    if (!isCorrect) {
      quizHadMistake = true;
    }
    function advance() {
      currentQ += 1;
      if (currentQ >= QUIZ.length) {
        if (quizHadMistake) {
          showFailModal();
        } else {
          showQuizSuccess();
        }
      } else {
        if (wasCorrect) playQuizAdvanceSound();
        renderQuiz();
      }
    }
    var delay = prefersReducedMotion() ? 0 : 340;
    if (delay) window.setTimeout(advance, delay);
    else advance();
  }

  var confettiRaf = 0;

  var successFxRaf = 0;
  var successFxParts = [];
  var successFxRipples = [];
  var successFxLastRipple = 0;

  function stopSuccessAmbientFx() {
    if (successFxRaf) window.cancelAnimationFrame(successFxRaf);
    successFxRaf = 0;
    successFxParts.length = 0;
    successFxRipples.length = 0;
    successFxLastRipple = 0;
    if (successFxCanvas) {
      var xctx = successFxCanvas.getContext("2d");
      if (xctx) xctx.clearRect(0, 0, successFxCanvas.width, successFxCanvas.height);
    }
  }

  function spawnSuccessFxParticle(w, h) {
    return {
      x: Math.random() * w,
      y: h + 24 + Math.random() * 140,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -1.2 - Math.random() * 3.2,
      pulse: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.11,
      size: 0.85 + Math.random() * 5,
      color: PARTICLE_COLORS[(Math.random() * PARTICLE_COLORS.length) | 0],
      life: 0,
      maxLife: 90 + Math.random() * 150,
    };
  }

  function tickSuccessFx() {
    if (!successFxCanvas || prefersReducedMotion()) {
      successFxRaf = 0;
      return;
    }
    var phase = phaseSuccess;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(phase.clientWidth, 320);
    var h = Math.max(phase.clientHeight, 200);
    var ctx = successFxCanvas.getContext("2d");
    if (!ctx) {
      successFxRaf = 0;
      return;
    }
    var needW = Math.floor(w * dpr);
    var needH = Math.floor(h * dpr);
    if (successFxCanvas.width !== needW || successFxCanvas.height !== needH) {
      successFxCanvas.width = needW;
      successFxCanvas.height = needH;
      successFxCanvas.style.width = w + "px";
      successFxCanvas.style.height = h + "px";
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var low = document.documentElement.classList.contains("low-glare");
    var targetN = low ? 88 : 220;
    ctx.clearRect(0, 0, w, h);

    while (successFxParts.length < targetN) {
      successFxParts.push(spawnSuccessFxParticle(w, h));
    }

    ctx.globalCompositeOperation = "lighter";
    var i;
    for (i = 0; i < successFxParts.length; i++) {
      var p = successFxParts[i];
      p.life += 1;
      p.pulse += 0.12 + p.spin;
      p.x += p.vx + Math.sin(p.pulse) * 0.62;
      p.y += p.vy;
      p.vx *= 0.991;
      p.vy *= 0.997;

      var lt = p.life / p.maxLife;
      var alpha = lt < 0.09 ? lt / 0.09 : lt > 0.78 ? (1 - lt) / 0.22 : 1;
      alpha = Math.max(0, Math.min(1, alpha)) * (0.48 + Math.sin(p.pulse * 1.2) * 0.38 + 0.18);
      if (low) alpha *= 0.7;

      ctx.save();
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 5 + p.size * (low ? 2.8 : 6.2);
      ctx.globalAlpha = alpha * 0.94;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (p.life > p.maxLife || p.y < -50 || p.x < -70 || p.x > w + 70) {
        successFxParts[i] = spawnSuccessFxParticle(w, h);
      }
    }

    ctx.globalCompositeOperation = "lighter";
    var now = performance.now();
    if (successFxRipples.length < 5 && now - successFxLastRipple > (low ? 1200 : 520)) {
      successFxLastRipple = now;
      successFxRipples.push({
        cx: w * (0.18 + Math.random() * 0.64),
        cy: h * (0.22 + Math.random() * 0.38),
        r: 0,
        vr: 2.4 + Math.random() * 2.8,
        alpha: low ? 0.22 : 0.48,
        color: ["#5ee0ff", "#a59cff", "#c94b8f", "#e8dcc8"][(Math.random() * 4) | 0],
      });
    }
    for (i = successFxRipples.length - 1; i >= 0; i--) {
      var rip = successFxRipples[i];
      rip.r += rip.vr;
      rip.alpha *= 0.93;
      if (rip.alpha < 0.025 || rip.r > Math.max(w, h) * 0.72) {
        successFxRipples.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.strokeStyle = rip.color;
      ctx.globalAlpha = rip.alpha;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(rip.cx, rip.cy, rip.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    successFxRaf = window.requestAnimationFrame(tickSuccessFx);
  }

  function runSuccessConfetti() {
    if (prefersReducedMotion() || !confettiCanvas) return;
    if (confettiRaf) {
      window.cancelAnimationFrame(confettiRaf);
      confettiRaf = 0;
    }
    var phase = phaseSuccess;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(phase.clientWidth, 320);
    var h = Math.max(phase.clientHeight, 200);
    confettiCanvas.width = Math.floor(w * dpr);
    confettiCanvas.height = Math.floor(h * dpr);
    confettiCanvas.style.width = w + "px";
    confettiCanvas.style.height = h + "px";
    var ctx = confettiCanvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var colors = ["#3db8e8", "#5ee0ff", "#a59cff", "#c94b8f", "#b85a7a", "#f8f4fc", "#ffffff", "#c9a86c"];
    var pieces = [];
    var i;

    function pushRain(count) {
      for (i = 0; i < count; i++) {
        pieces.push({
          x: w * 0.5 + (Math.random() - 0.5) * w * 0.92,
          y: -40 - Math.random() * 160,
          vx: (Math.random() - 0.5) * 5.5,
          vy: 1.2 + Math.random() * 4.5,
          r: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.24,
          sw: 4 + Math.random() * 9,
          sh: 3 + Math.random() * 6,
          c: colors[(Math.random() * colors.length) | 0],
          born: 0,
        });
      }
    }

    function pushBurst(count) {
      var cx = w * 0.5 + (Math.random() - 0.5) * w * 0.12;
      var cy = h * 0.42 + (Math.random() - 0.5) * h * 0.08;
      for (i = 0; i < count; i++) {
        var ang = Math.random() * Math.PI * 2;
        var sp = 3 + Math.random() * 9;
        pieces.push({
          x: cx,
          y: cy,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp - 1.2,
          r: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.35,
          sw: 3 + Math.random() * 8,
          sh: 3 + Math.random() * 7,
          c: colors[(Math.random() * colors.length) | 0],
          born: 280,
        });
      }
    }

    pushRain(145);
    var secondWave = false;
    var thirdWave = false;
    var t0 = performance.now();

    function pushFoil(n, bornT) {
      for (i = 0; i < n; i++) {
        pieces.push({
          x: w * 0.5 + (Math.random() - 0.5) * w * 0.5,
          y: -20 - Math.random() * 100,
          vx: (Math.random() - 0.5) * 4,
          vy: 2 + Math.random() * 4,
          r: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.18,
          sw: 7 + Math.random() * 12,
          sh: 5 + Math.random() * 9,
          c: colors[(Math.random() * colors.length) | 0],
          born: bornT,
          foil: true,
        });
      }
    }

    function frame(t) {
      var elapsed = t - t0;
      if (!secondWave && elapsed > 340) {
        secondWave = true;
        pushBurst(100);
        pushRain(55);
      }
      if (!thirdWave && elapsed > 820) {
        thirdWave = true;
        pushFoil(52, 820);
        pushBurst(36);
      }
      if (elapsed > 4400) {
        confettiRaf = 0;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        return;
      }
      ctx.clearRect(0, 0, w, h);
      for (i = 0; i < pieces.length; i++) {
        var p = pieces[i];
        if (elapsed < p.born) continue;
        var pe = elapsed - p.born;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.vx *= 0.994;
        p.r += p.vr;
        var a = Math.max(0, 1 - pe / 3800);
        ctx.save();
        ctx.globalAlpha = a;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        if (p.foil) {
          var grd = ctx.createLinearGradient(-p.sw, -p.sh, p.sw, p.sh);
          grd.addColorStop(0, "rgba(255,252,248,0.95)");
          grd.addColorStop(0.35, "#f0e6d8");
          grd.addColorStop(0.55, "#c9a86c");
          grd.addColorStop(1, "#5ee0ff");
          ctx.fillStyle = grd;
        } else {
          ctx.fillStyle = p.c;
        }
        ctx.fillRect(-p.sw / 2, -p.sh / 2, p.sw, p.sh);
        ctx.restore();
      }
      confettiRaf = window.requestAnimationFrame(frame);
    }
    confettiRaf = window.requestAnimationFrame(frame);
  }

  function showQuizSuccess() {
    playQuizSuccessFanfare();
    triggerEdgeRipple();
    phaseQuiz.classList.add("is-hidden");
    phaseQuiz.setAttribute("aria-hidden", "true");
    phaseSuccess.classList.remove("is-hidden");
    phaseSuccess.classList.add("is-active");
    phaseSuccess.setAttribute("aria-hidden", "false");
    introRoot.setAttribute("aria-labelledby", "intro-success-text");
    window.requestAnimationFrame(function () {
      stopSuccessAmbientFx();
      runSuccessConfetti();
      if (!prefersReducedMotion() && successFxCanvas) {
        tickSuccessFx();
      }
    });
    window.setTimeout(finishIntro, SUCCESS_SCREEN_MS);
  }

  function beginCinematic() {
    if (gateDecorEl) {
      gateDecorEl.style.setProperty("--gx", "0");
      gateDecorEl.style.setProperty("--gy", "0");
    }
    introRoot.classList.remove("intro--gate-mode");
    phaseGate.classList.add("is-hidden");
    phaseCine.classList.remove("is-hidden");
    phaseCine.setAttribute("aria-hidden", "false");
    introRoot.setAttribute("aria-labelledby", "intro-cinematic-title");
    triggerEdgeRipple();

    resizeCanvas();
    window.requestAnimationFrame(function () {
      phaseCine.classList.add("is-active");
      triggerCineFlash();
      if (!prefersReducedMotion()) {
        tickParticles();
      }
    });

    autoExitTimer = window.setTimeout(goToQuizFromCinematic, AUTO_EXIT_MS);
  }

  introStart.addEventListener("mouseenter", playStartHoverChime);
  introStart.addEventListener("focus", function (ev) {
    if (ev.isTrusted) playStartHoverChime();
  });
  introStart.addEventListener("click", function () {
    try {
      var LsG = window.LagunaSiteOverrides;
      if (LsG && LsG.getIntroSiteMode(SITE_CONTENT) === "gate_then_site") {
        try {
          var acG = getQuizSfxCtx();
          if (acG && acG.state === "suspended") acG.resume().catch(function () {});
        } catch (eG) {}
        clearIntroSession();
        finishIntro();
        return;
      }
    } catch (eGate) {}
    try {
      var ac = getQuizSfxCtx();
      if (ac && ac.state === "suspended") ac.resume().catch(function () {});
    } catch (eSt) {
      /* ignore */
    }
    clearIntroSession();
    QUIZ = getQuizForNewSession();
    beginCinematic();
  });

  phaseCine.addEventListener("click", function () {
    if (phaseCine.classList.contains("is-active")) goToQuizFromCinematic();
  });

  failRetry.addEventListener("click", function () {
    hideFailModal();
    currentQ = 0;
    quizHadMistake = false;
    QUIZ = getQuizForNewSession();
    renderQuiz();
  });

  window.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || introRoot.classList.contains("is-done")) return;
    if (!failModal.classList.contains("is-hidden")) {
      e.preventDefault();
      hideFailModal();
      currentQ = 0;
      quizHadMistake = false;
      QUIZ = getQuizForNewSession();
      renderQuiz();
      return;
    }
    if (phaseCine.classList.contains("is-active")) {
      e.preventDefault();
      goToQuizFromCinematic();
    }
  });

  window.addEventListener("resize", function () {
    if (phaseCine.classList.contains("is-active") && !introRoot.classList.contains("is-done")) {
      resizeCanvas();
    }
  });

  var gateSubEl = document.getElementById("intro-gate-sub");
  if (gateSubEl) {
    var subOverride =
      SITE_CONTENT && typeof SITE_CONTENT.intro_gate_sub === "string"
        ? SITE_CONTENT.intro_gate_sub.trim()
        : "";
    if (subOverride) {
      gateSubEl.textContent = subOverride;
    } else {
      var mo = [
        "январь",
        "февраль",
        "март",
        "апрель",
        "май",
        "июнь",
        "июль",
        "август",
        "сентябрь",
        "октябрь",
        "ноябрь",
        "декабрь",
      ];
      var gd = new Date();
      gateSubEl.textContent = mo[gd.getMonth()] + " " + String(gd.getFullYear()) + " · сезон вечеров у воды";
    }
  }

  if (resumeQuizMode) {
    introRoot.classList.remove("intro--gate-mode");
    phaseGate.classList.add("is-hidden");
    phaseCine.classList.add("is-hidden");
    phaseCine.setAttribute("aria-hidden", "true");
    phaseQuiz.classList.remove("is-hidden");
    phaseQuiz.setAttribute("aria-hidden", "false");
    introRoot.setAttribute("aria-labelledby", "quiz-question");
    renderQuiz();
  } else {
    introStart.focus();
  }
  }

  (function siteScrollAndSections() {
    var reduce = false;
    try {
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (eR) {}
    if (reduce) return;
    document.documentElement.classList.add("js-site-motion");
    var mainEl = document.querySelector("main#top");
    var sections = mainEl ? mainEl.querySelectorAll("section.section") : null;
    if (sections && sections.length && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (ents) {
          for (var i = 0; i < ents.length; i++) {
            if (ents[i].isIntersecting) ents[i].target.classList.add("is-inview");
          }
        },
        { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
      );
      for (var j = 0; j < sections.length; j++) io.observe(sections[j]);
    }
    if (sections && sections.length) {
      var vh = window.innerHeight || 640;
      for (var k = 0; k < sections.length; k++) {
        var br = sections[k].getBoundingClientRect();
        if (br.top < vh * 1.05) sections[k].classList.add("is-inview");
      }
    }
    var scrollBusy = false;
    function parallaxVars() {
      if (scrollBusy) return;
      scrollBusy = true;
      window.requestAnimationFrame(function () {
        var y = window.scrollY || window.pageYOffset || 0;
        document.documentElement.style.setProperty("--parallax-y", Math.round(y * 0.1) + "px");
        document.documentElement.style.setProperty("--parallax-y-slow", Math.round(y * 0.042) + "px");
        scrollBusy = false;
      });
    }
    window.addEventListener("scroll", parallaxVars, { passive: true });
    parallaxVars();
  })();

  (function heroLuxMotion() {
    var hero = document.querySelector(".hero");
    var scene = document.querySelector(".hero__scene");
    var canvas = document.getElementById("hero-fx-canvas");
    var layout = document.querySelector(".hero__layout");
    if (!hero || !scene) return;

    var reduce = false;
    try {
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (eRm) {}

    var mqWide = null;
    try {
      mqWide = window.matchMedia("(min-width: 920px)");
    } catch (eMq) {
      mqWide = { matches: false };
    }

    function setHeroLayoutTilt(e, rect) {
      if (!layout || !mqWide.matches) {
        if (layout) {
          layout.style.setProperty("--hero-tilt-x", "0deg");
          layout.style.setProperty("--hero-tilt-y", "0deg");
        }
        return;
      }
      var rx = ((e.clientY - rect.top) / rect.height - 0.5) * -2.2;
      var ry = ((e.clientX - rect.left) / rect.width - 0.5) * 2.2;
      layout.style.setProperty("--hero-tilt-x", rx.toFixed(2) + "deg");
      layout.style.setProperty("--hero-tilt-y", ry.toFixed(2) + "deg");
    }

    if (!reduce) {
      var hx = 0;
      var hy = 0;
      var tx = 0;
      var ty = 0;
      var rafParallax = 0;
      function parallaxTick() {
        hx += (tx - hx) * 0.065;
        hy += (ty - hy) * 0.065;
        scene.style.setProperty("--hx", hx.toFixed(3) + "px");
        scene.style.setProperty("--hy", hy.toFixed(3) + "px");
        if (Math.abs(tx - hx) > 0.08 || Math.abs(ty - hy) > 0.08) {
          rafParallax = window.requestAnimationFrame(parallaxTick);
        } else {
          rafParallax = 0;
        }
      }
      hero.addEventListener(
        "mousemove",
        function (e) {
          var r = hero.getBoundingClientRect();
          tx = ((e.clientX - r.left) / r.width - 0.5) * 30;
          ty = ((e.clientY - r.top) / r.height - 0.5) * 24;
          setHeroLayoutTilt(e, r);
          if (!rafParallax) rafParallax = window.requestAnimationFrame(parallaxTick);
        },
        { passive: true }
      );
      hero.addEventListener("mouseleave", function () {
        tx = 0;
        ty = 0;
        if (layout) {
          layout.style.setProperty("--hero-tilt-x", "0deg");
          layout.style.setProperty("--hero-tilt-y", "0deg");
        }
        if (!rafParallax) rafParallax = window.requestAnimationFrame(parallaxTick);
      });
    }

    if (!canvas || reduce) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var parts = [];
    var W = 0;
    var H = 0;
    var raf = 0;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(canvas.clientWidth || hero.clientWidth, 120);
      H = Math.max(canvas.clientHeight || hero.clientHeight, 120);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn() {
      return {
        x: Math.random() * W,
        y: H + Math.random() * 80,
        r: 0.5 + Math.random() * 2.4,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -0.2 - Math.random() * 0.55,
        a: 0.1 + Math.random() * 0.5,
        hue: Math.random() > 0.48 ? 195 + Math.random() * 25 : 275 + Math.random() * 45,
      };
    }

    function initParts() {
      parts.length = 0;
      var n = Math.min(80, Math.max(36, Math.floor((W * H) / 10000)));
      for (var i = 0; i < n; i++) parts.push(spawn());
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);
      var i;
      for (i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.993;
        if (p.y < -16 || p.x < -24 || p.x > W + 24) {
          parts[i] = spawn();
        }
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, "hsla(" + p.hue + ",82%,70%," + p.a + ")");
        g.addColorStop(1, "hsla(" + p.hue + ",55%,38%,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = window.requestAnimationFrame(tick);
    }

    resize();
    initParts();
    raf = window.requestAnimationFrame(tick);

    window.addEventListener("resize", function () {
      resize();
      initParts();
    });
  })();

  if ("serviceWorker" in navigator) {
    var nosw = false;
    try {
      nosw = new URLSearchParams(window.location.search).get("nosw") === "1";
    } catch (e2) {
      nosw = /[?&]nosw=1(?:&|$)/.test(window.location.search);
    }
    if (!nosw) {
      navigator.serviceWorker
        .register("sw.js?v=44", { scope: "./" })
        .then(function (reg) {
          try {
            reg.update();
          } catch (e3) {}
        })
        .catch(function () {});
    }
  }
})();
