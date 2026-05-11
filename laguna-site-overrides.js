/* Общие настройки контента: localStorage + применение на index. Админка: admin.html */
(function (global) {
  /** Опубликованный контент (читает главная страница) */
  var STORAGE_KEY = "laguna_admin_site_v1";
  var STORAGE_DRAFT_KEY = "laguna_admin_site_draft_v1";
  var STORAGE_HISTORY_KEY = "laguna_admin_site_history_v1";
  var PASS_KEY = "laguna_admin_pass_v1";
  var HISTORY_MAX = 15;

  function defaultQuizQuestions() {
    return [
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
    ];
  }

  function defaultFailMessages() {
    return [
      "Увы, ты не прошёл опрос. Не позорься и повтори попытку.",
      "Лагуна чуть разочарована, но верит в второй шанс. Ещё разок?",
      "Так близко к истине… и всё же мимо. Соберись и попробуй снова.",
      "Никто не идеален. Кроме тех, кто проходит с первого раза. Ты пока не из них — жми «Повторить».",
    ];
  }

  function defaultGalleryCards() {
    return [
      { id: "1", imageUrl: "https://i.ibb.co/4ZWcP129/1.png", alt: "Elegant Invitation", title: "Elegant Invitation" },
      { id: "2", imageUrl: "https://i.ibb.co/TMbhBRcL/2.png", alt: "Modern Design", title: "Modern Design" },
      { id: "3", imageUrl: "https://i.ibb.co/spXBFdSm/3.png", alt: "Vintage Style", title: "Vintage Style" },
      { id: "4", imageUrl: "https://i.ibb.co/N2TCN0bC/4.png", alt: "Minimalist", title: "Minimalist" },
      { id: "5", imageUrl: "https://i.ibb.co/jZkh6q1M/5.png", alt: "Floral Design", title: "Floral Design" },
      { id: "6", imageUrl: "https://i.ibb.co/6cc7mksr/6.png", alt: "Geometric", title: "Geometric" },
      { id: "7", imageUrl: "https://i.ibb.co/bjV35jNQ/7.png", alt: "Luxury Gold", title: "Luxury Gold" },
      { id: "8", imageUrl: "https://i.ibb.co/PZ7WLs7g/8.png", alt: "Rustic Style", title: "Rustic Style" },
      { id: "9", imageUrl: "https://i.ibb.co/qLR5bQRM/9.png", alt: "Dark Modern", title: "Dark Modern" },
      { id: "10", imageUrl: "https://i.ibb.co/PdNhw3K/10.png", alt: "Colorful Party", title: "Colorful Party" },
      { id: "11", imageUrl: "https://i.ibb.co/zWpN1nqJ/11.png", alt: "Geometric", title: "Geometric" },
      { id: "12", imageUrl: "https://i.ibb.co/fVYnCXgR/12.png", alt: "Luxury Gold", title: "Luxury Gold" },
      { id: "13", imageUrl: "https://i.ibb.co/1G6jZWcZ/13.png", alt: "Rustic Style", title: "Rustic Style" },
      { id: "14", imageUrl: "https://i.ibb.co/xKG7m905/14.png", alt: "Dark Modern", title: "Dark Modern" },
      { id: "15", imageUrl: "https://i.ibb.co/7dJzR3xK/15.png", alt: "Colorful Party", title: "Colorful Party" },
      { id: "16", imageUrl: "https://i.ibb.co/NdJ1csXB/16.png", alt: "Elegant Script", title: "Elegant Script" },
      { id: "17", imageUrl: "https://i.ibb.co/8L2Sdt5Q/17.png", alt: "Watercolor Art", title: "Watercolor Art" },
      { id: "18", imageUrl: "https://i.ibb.co/mC1zxJYq/18.png", alt: "Botanical", title: "Botanical" },
      { id: "19", imageUrl: "https://i.ibb.co/wryzsKs4/20.png", alt: "Art Deco", title: "Art Deco" },
      { id: "20", imageUrl: "https://i.ibb.co/1fvnxL3L/19.png", alt: "Marble Luxury", title: "Marble Luxury" },
    ];
  }

  function defaultNav() {
    return [
      { href: "#about", label: "О баре" },
      { href: "#menu", label: "Меню" },
      { href: "#gallery", label: "Галерея" },
      { href: "#vibe", label: "Атмосфера" },
      { href: "#visit", label: "Визит" },
    ];
  }

  function defaultBookingForm() {
    return {
      labelName: "Имя",
      labelPhone: "Телефон",
      labelDatetime: "Дата и время",
      labelNote: "Комментарий",
      placeholderDatetime: "Например: суббота, 20:00",
      placeholderNote: "Количество гостей, повод…",
      submitText: "Отправить заявку",
      mailSubject: "Бронь — Голубая лагуна",
      mailPrefixName: "Имя:",
      mailPrefixPhone: "Телефон:",
      mailPrefixDatetime: "Дата и время:",
      mailPrefixNote: "Комментарий:",
    };
  }

  function defaultIntro() {
    return {
      disabled: false,
      mode: "full",
      autoExitCinematicMs: 6200,
      successScreenMs: 4800,
    };
  }

  /** Режим полноэкранного интро для главной: full | none | gate_then_site | cinematic_to_site */
  function getIntroSiteMode(data) {
    var im = data && data.intro ? data.intro : null;
    if (!im) return "full";
    var m = typeof im.mode === "string" ? im.mode : "";
    if (m === "none" || m === "skip_all") return "none";
    if (m === "gate_then_site" || m === "gate") return "gate_then_site";
    if (m === "cinematic_to_site" || m === "cinematic_only") return "cinematic_to_site";
    if (im.disabled) return "none";
    return "full";
  }

  function buildYandexMapEmbedFromCoords(latStr, lngStr, zoomStr) {
    var la = Number(String(latStr || "").replace(",", "."));
    var ln = Number(String(lngStr || "").replace(",", "."));
    var z = Math.round(Number(String(zoomStr || "").replace(",", ".")));
    if (!isFinite(la) || !isFinite(ln)) return null;
    if (!isFinite(z) || z < 2) z = 14;
    if (z > 19) z = 19;
    return (
      "https://yandex.ru/map-widget/v1/?ll=" +
      encodeURIComponent(ln + "," + la) +
      "&z=" +
      z +
      "&pt=" +
      encodeURIComponent(ln + "," + la + ",pm2rdm") +
      "&source=constructor"
    );
  }

  function defaultQuizPools() {
    var q = defaultQuizQuestions();
    var copy = JSON.parse(JSON.stringify(q));
    return {
      activePoolId: "a",
      pools: [
        { id: "a", name: "Набор A", questions: JSON.parse(JSON.stringify(q)) },
        { id: "b", name: "Набор B", questions: copy },
      ],
      questions: JSON.parse(JSON.stringify(q)),
    };
  }

  function buildDefaults() {
    return {
      v: 1,
      bookingEmail: "valerionapop@gmail.com",
      meta: {
        pageTitle: "Голубая лагуна — бар",
        metaDescription:
          "Голубая лагуна — бар с авторскими коктейлями и уютной атмосферой у воды.",
        ogTitle: "Голубая лагуна — бар",
        ogDescription: "Авторские коктейли, мягкий свет и атмосфера ночной лагуны. 18+.",
        ogImage: "og-cover.svg",
      },
      texts: {
        "content-site-logo": "Голубая лагуна",
        "content-gate-kicker": "Приватное приглашение",
        "intro-pitch":
          "Пройди опрос, чтобы погрузиться в мир искренней мужской любви в стенах «Голубой лагуны».",
        "content-start-label": "START",
        "intro-cinematic-title": "Начнём?",
        "content-cine-skip": "Нажми в любое место, чтобы перейти к опросу",
        "content-quiz-eyebrow": "Викторина «Голубой лагуны»",
        "content-quiz-hint": "Один ответ — и сразу дальше. Без подсказок с барной стойки.",
        "content-quiz-fail-title":
          "Увы, ты не прошёл опрос. Не позорься и повтори попытку.",
        "content-quiz-fail-retry": "Повторить попытку",
        "content-success-eyebrow": "Вердикт лагуны",
        "content-success-line-a": "Поздравляю, ты настоящий",
        "content-success-line-b": "мужчина.",
        "content-success-line-c": "Добро пожаловать в рай.",
        "content-success-subhint": "Сейчас откроется сайт…",
        "content-hero-kicker": "бар · коктейли · вечер у воды",
        "content-hero-title": "Голубая лагуна",
        "content-hero-lead":
          "Там, где глубокий закат встречает холодную волну — вкус, свет и музыка в одном бокале.",
        "content-hero-quote":
          "«В лагуне важен не только бокал — важно, с кем его поднимаешь.»",
        "content-hero-cta-primary": "Забронировать стол",
        "content-hero-cta-ghost": "Смотреть меню",
        "content-about-title": "О баре",
        "content-about-text":
          "Название — про тот самый цвет воды после заката: не море и не бассейн, а место, где хочется задержаться. «Голубая лагуна» — бар в духе ночного побережья: мягкий свет, бархатные оттенки и прохладные акценты. Мы собираем классику и авторские миксы на основе трав, цитрусов и редких настоек — без лишней суеты, только настроение.",
        "content-about-quote":
          "«Здесь не стесняются заказать что-то яркое — и не спешат уходить после первого бокала.»",
        "content-pill-0": "Авторская карта коктейлей",
        "content-pill-1": "Вино и игристое",
        "content-pill-2": "Закуски к бокалу",
        "content-menu-title": "Меню",
        "content-menu-deck": "Несколько акцентов — полная карта у барной стойки.",
        "content-menu-fine": "Цены ориентировочные — актуальная карта у бармена.",
        "content-card-0-name": "Розовый прибой",
        "content-card-0-price": "520 ₽",
        "content-card-0-meta": "джин · грейпфрут · гиацинтовый сироп · игристое",
        "content-card-0-note": "Солёный финиш, как морской бриз после заката.",
        "content-card-1-name": "Лагуна №7",
        "content-card-1-price": "480 ₽",
        "content-card-1-meta": "ром · блю курасао · лайм · мята · содовая",
        "content-card-1-note": "Ярко-голубой, освежающий, с лёгкой сладостью.",
        "content-card-2-name": "Гиацинт & смородина",
        "content-card-2-price": "450 ₽",
        "content-card-2-meta": "водка · чёрная смородина · фиалка · лимон",
        "content-card-2-note": "Цветочно-ягодный баланс без перегруза.",
        "content-gallery-title": "Галерея",
        "content-gallery-deck":
          "Звёздная 3D-галерея карточек — вращайте сцену, приближайте и открывайте кадр. Вживую в баре всё ещё красивее.",
        "content-vibe-title": "Атмосфера",
        "content-vibe-text":
          "Приглушённые неоновые акценты, отражения в стекле и плейлисты от джаза до электроники в полгромкости — чтобы можно было говорить и слышать друг друга.",
        "content-visit-title": "Визит",
        "content-visit-text":
          "Рады гостям с 18 лет. Бронь по телефону, в мессенджере или через форму ниже — особенно на пятницу и субботу.",
        "content-social-label": "Мы на связи",
        "content-social-tg": "Telegram",
        "content-social-vk": "VK",
        "content-contact-addr": "ул. Примерная, 1",
        "content-contact-phone": "+7 (000) 000-00-00",
        "content-contact-hours": "вт–чт 17:00–00:00 · пт–сб 17:00–02:00 · вс 15:00–23:00 · пн — выходной",
        "content-booking-form-title": "Заявка на бронь",
        "content-booking-deck":
          "Ответим в Telegram или на почту — укажите удобное время.",
        "content-booking-hint":
          "Заявка уходит на сервер и в Telegram; при сбое откроется почта — нажмите «Отправить».",
        "content-booking-success":
          "Заявка отправлена. Мы свяжемся с вами в ближайшее время — спасибо!",
        "content-booking-followup-lead":
          "Сохраните контакт бара и напишите в мессенджер — так мы быстрее подтвердим бронь (SMS не отправляем).",
        "content-booking-followup-wa": "WhatsApp",
        "content-booking-followup-tg": "Telegram",
        "content-booking-followup-tel": "Позвонить / в контакты",
        "content-visit-card-label": "Сегодня в баре",
        "content-visit-card-value": "DJ-сет · полночь",
        "content-visit-card-hint": "Актуальные события уточняйте у администратора.",
        "content-map-note":
          "Замените embed на свою точку в конструкторе карт Яндекса или Google.",
        "content-footer-brand": "Голубая лагуна",
        "content-footer-suffix": " · Бар. Для гостей 18+.",
      },
      attrs: {
        "content-social-tg-link": "https://t.me/username",
        "content-social-vk-link": "https://vk.com/username",
        "content-contact-phone-link": "tel:+70000000000",
        "content-hero-img": "assets/hero-beach-bar.png?v=6",
        "content-hero-img-alt":
          "Закат у океана: в фокусе барная стойка с гирляндами и двое гостей с коктейлями; вдали на берегу размыто большой экран с футболом и двое на бин-бэгах с геймпадами",
        "content-hero-img-srcset": "",
        "content-map-lat": "",
        "content-map-lng": "",
        "content-map-zoom": "14",
        "content-map-iframe":
          "https://yandex.ru/map-widget/v1/?um=constructor%3Aplaceholder&source=constructor&ll=37.617635%2C55.755814&z=14",
      },
      intro_gate_sub: "",
      failMessages: defaultFailMessages(),
      nav: defaultNav(),
      bookingForm: defaultBookingForm(),
      intro: defaultIntro(),
      gallery: { cards: defaultGalleryCards() },
      quiz: defaultQuizPools(),
    };
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function loadPublished() {
    try {
      var raw = global.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function savePublished(data) {
    global.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function loadDraft() {
    try {
      var raw = global.localStorage.getItem(STORAGE_DRAFT_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function saveDraft(data) {
    global.localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(data));
  }

  function loadHistory() {
    try {
      var raw = global.localStorage.getItem(STORAGE_HISTORY_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(arr) {
    global.localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(arr.slice(0, HISTORY_MAX)));
  }

  /** Совместимость: старый API = опубликованное */
  function load() {
    return loadPublished();
  }

  function save(data) {
    savePublished(data);
  }

  function isAdminPreviewUrl() {
    try {
      return new URLSearchParams(global.location.search || "").get("adminPreview") === "1";
    } catch (e) {
      return false;
    }
  }

  function getMergedForSite() {
    var raw = isAdminPreviewUrl() ? loadDraft() : loadPublished();
    return mergeDefaults(raw);
  }

  function getDraftMerged() {
    var d = loadDraft();
    if (d) return mergeDefaults(d);
    return mergeDefaults(loadPublished());
  }

  function ensureDraftFromPublished() {
    if (loadDraft()) return;
    saveDraft(mergeDefaults(loadPublished()));
  }

  function normalizeGalleryCard(c) {
    return {
      id: String((c && c.id) || ""),
      imageUrl: String((c && c.imageUrl) || ""),
      alt: String((c && c.alt) || ""),
      title: String((c && c.title) || ""),
    };
  }

  function normalizeGalleryCards(arr) {
    if (!Array.isArray(arr) || !arr.length) return defaultGalleryCards();
    return arr.map(normalizeGalleryCard).filter(function (c) {
      return c.imageUrl.length > 0;
    });
  }

  function clampMs(n, def, lo, hi) {
    var x = parseInt(n, 10);
    if (!isFinite(x)) return def;
    return Math.min(hi, Math.max(lo, x));
  }

  function getQuizQuestionsFromData(data) {
    if (!data || !data.quiz) return null;
    var pools = data.quiz.pools;
    if (Array.isArray(pools) && pools.length) {
      var want = data.quiz.activePoolId || (pools[0] && pools[0].id);
      for (var i = 0; i < pools.length; i++) {
        if (pools[i].id === want && pools[i].questions && pools[i].questions.length >= 3) {
          return normalizeQuizQuestions(pools[i].questions);
        }
      }
      if (pools[0].questions && pools[0].questions.length >= 3) {
        return normalizeQuizQuestions(pools[0].questions);
      }
    }
    if (data.quiz.questions && data.quiz.questions.length >= 3) {
      return normalizeQuizQuestions(data.quiz.questions);
    }
    return null;
  }

  function validateSiteData(data) {
    var errors = [];
    if (!data || data.v !== 1) errors.push("Некорректная версия данных");
    if (!data.meta || !String(data.meta.pageTitle || "").trim()) errors.push("Укажите заголовок страницы (title)");
    var em = String(data.bookingEmail || "").trim();
    if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) errors.push("Некорректный email для брони");
    var pools = data.quiz && data.quiz.pools;
    if (Array.isArray(pools)) {
      for (var p = 0; p < pools.length; p++) {
        var qs = pools[p].questions;
        if (!Array.isArray(qs) || qs.length < 3) {
          errors.push("В наборе «" + (pools[p].name || pools[p].id) + "» нужно 3 вопроса");
        }
      }
    } else if (!data.quiz || !Array.isArray(data.quiz.questions) || data.quiz.questions.length < 3) {
      errors.push("Нужно 3 вопроса викторины");
    }
    if (data.gallery && data.gallery.cards) {
      try {
        var gc = normalizeGalleryCards(data.gallery.cards);
        if (gc.length < 1) errors.push("В галерее нужна хотя бы одна карточка с URL картинки");
      } catch (eG) {
        errors.push("Ошибка в данных галереи");
      }
    }
    if (data.nav && Array.isArray(data.nav)) {
      for (var n = 0; n < data.nav.length; n++) {
        if (data.nav[n] && data.nav[n].href && !/^#|https?:\/\//i.test(String(data.nav[n].href))) {
          errors.push("Навигация: некорректный href в пункте " + (n + 1));
        }
      }
    }
    if (data.intro && data.intro.mode != null && String(data.intro.mode).length) {
      if (!/^(full|none|skip_all|gate_then_site|gate|cinematic_to_site|cinematic_only)$/.test(String(data.intro.mode))) {
        errors.push("Некорректный режим интро");
      }
    }
    return { ok: errors.length === 0, errors: errors };
  }

  function pushHistoryEntry(label, snapshot) {
    var hist = loadHistory();
    hist.unshift({
      t: Date.now(),
      label: label || "Публикация",
      snapshot: snapshot,
    });
    saveHistory(hist);
  }

  function mergeDefaults(stored) {
    var base = buildDefaults();
    if (!stored || stored.v !== 1) return base;
    if (stored.bookingEmail) base.bookingEmail = String(stored.bookingEmail);
    if (stored.meta && typeof stored.meta === "object") {
      for (var mk in stored.meta) {
        if (Object.prototype.hasOwnProperty.call(stored.meta, mk)) {
          base.meta[mk] = stored.meta[mk];
        }
      }
    }
    if (stored.texts && typeof stored.texts === "object") {
      for (var tk in stored.texts) {
        if (Object.prototype.hasOwnProperty.call(stored.texts, tk)) {
          base.texts[tk] = stored.texts[tk];
        }
      }
    }
    if (stored.attrs && typeof stored.attrs === "object") {
      for (var ak in stored.attrs) {
        if (Object.prototype.hasOwnProperty.call(stored.attrs, ak)) {
          base.attrs[ak] = stored.attrs[ak];
        }
      }
    }
    if (typeof stored.intro_gate_sub === "string") base.intro_gate_sub = stored.intro_gate_sub;
    if (Array.isArray(stored.failMessages) && stored.failMessages.length) {
      base.failMessages = stored.failMessages.map(String);
    }
    if (stored.nav && Array.isArray(stored.nav)) {
      for (var ni = 0; ni < Math.min(5, stored.nav.length); ni++) {
        if (!base.nav[ni]) base.nav[ni] = defaultNav()[ni];
        if (stored.nav[ni].href != null) base.nav[ni].href = String(stored.nav[ni].href);
        if (stored.nav[ni].label != null) base.nav[ni].label = String(stored.nav[ni].label);
      }
    }
    if (stored.bookingForm && typeof stored.bookingForm === "object") {
      for (var bk in stored.bookingForm) {
        if (Object.prototype.hasOwnProperty.call(stored.bookingForm, bk)) {
          base.bookingForm[bk] = stored.bookingForm[bk];
        }
      }
    }
    if (stored.intro && typeof stored.intro === "object") {
      if (stored.intro.autoExitCinematicMs != null) {
        base.intro.autoExitCinematicMs = clampMs(stored.intro.autoExitCinematicMs, 6200, 2000, 60000);
      }
      if (stored.intro.successScreenMs != null) {
        base.intro.successScreenMs = clampMs(stored.intro.successScreenMs, 4800, 1500, 120000);
      }
      var modeRaw = typeof stored.intro.mode === "string" ? stored.intro.mode : "";
      if (modeRaw === "skip_all") modeRaw = "none";
      if (modeRaw === "gate") modeRaw = "gate_then_site";
      if (modeRaw === "cinematic_only") modeRaw = "cinematic_to_site";
      if (/^(full|none|gate_then_site|cinematic_to_site)$/.test(modeRaw)) {
        base.intro.mode = modeRaw;
      } else if (stored.intro.disabled === true) {
        base.intro.mode = "none";
      } else {
        base.intro.mode = "full";
      }
      base.intro.disabled = base.intro.mode === "none";
    }
    if (stored.gallery && stored.gallery.cards && Array.isArray(stored.gallery.cards)) {
      base.gallery.cards = normalizeGalleryCards(stored.gallery.cards);
    }
    if (stored.quiz && Array.isArray(stored.quiz.pools) && stored.quiz.pools.length) {
      base.quiz.activePoolId = String(stored.quiz.activePoolId || base.quiz.activePoolId || "a");
      base.quiz.pools = stored.quiz.pools.map(function (pl) {
        return {
          id: String(pl.id || "x"),
          name: String(pl.name || pl.id || "Набор"),
          questions: normalizeQuizQuestions(pl.questions || []),
        };
      });
      var activeQ = getQuizQuestionsFromData({ quiz: base.quiz });
      if (activeQ) base.quiz.questions = activeQ;
    } else if (stored.quiz && Array.isArray(stored.quiz.questions) && stored.quiz.questions.length >= 3) {
      var nq = normalizeQuizQuestions(stored.quiz.questions);
      base.quiz.pools[0].questions = nq;
      base.quiz.questions = nq;
    } else {
      var aq = getQuizQuestionsFromData({ quiz: base.quiz });
      if (aq) base.quiz.questions = aq;
    }
    while (!base.quiz.pools || base.quiz.pools.length < 2) {
      if (!base.quiz.pools) base.quiz.pools = [];
      var pid = base.quiz.pools.length === 0 ? "a" : "b";
      base.quiz.pools.push({
        id: pid,
        name: pid === "a" ? "Набор A" : "Набор B",
        questions: normalizeQuizQuestions(defaultQuizQuestions()),
      });
    }
    var syncQ = getQuizQuestionsFromData({ quiz: base.quiz });
    if (syncQ) base.quiz.questions = syncQ;
    return base;
  }

  function normalizeQuizQuestions(list) {
    var out = [];
    for (var i = 0; i < 3; i++) {
      var q = list[i];
      if (!q || typeof q.text !== "string") continue;
      var opts = Array.isArray(q.options) ? q.options : [];
      var row = {
        text: q.text,
        figure: typeof q.figure === "string" && q.figure ? q.figure : "quiz/q1.svg",
        figureAlt: typeof q.figureAlt === "string" ? q.figureAlt : "",
        options: [],
      };
      for (var j = 0; j < 3; j++) {
        var o = opts[j];
        row.options.push({
          text: o && typeof o.text === "string" ? o.text : "—",
          correct: !!(o && o.correct),
        });
      }
      var correctCount = 0;
      for (var c = 0; c < 3; c++) {
        if (row.options[c].correct) correctCount++;
      }
      if (correctCount !== 1) {
        for (var z = 0; z < 3; z++) row.options[z].correct = z === 0;
      }
      out.push(row);
    }
    while (out.length < 3) {
      out.push(deepClone(defaultQuizQuestions()[out.length]));
    }
    return out.slice(0, 3);
  }

  function applyMeta(doc, meta) {
    if (!meta) return;
    if (meta.pageTitle) doc.title = meta.pageTitle;
    var md = doc.querySelector('meta[name="description"]');
    if (md && meta.metaDescription) md.setAttribute("content", meta.metaDescription);
    var ogT = doc.querySelector('meta[property="og:title"]');
    if (ogT && meta.ogTitle) ogT.setAttribute("content", meta.ogTitle);
    var ogD = doc.querySelector('meta[property="og:description"]');
    if (ogD && meta.ogDescription) ogD.setAttribute("content", meta.ogDescription);
    var twT = doc.querySelector('meta[name="twitter:title"]');
    if (twT && meta.ogTitle) twT.setAttribute("content", meta.ogTitle);
    var twD = doc.querySelector('meta[name="twitter:description"]');
    if (twD && meta.ogDescription) twD.setAttribute("content", meta.ogDescription);
    if (meta.ogImage) {
      var absOg = meta.ogImage;
      try {
        if (!/^https?:\/\//i.test(absOg) && global.location && global.location.href) {
          absOg = new URL(String(meta.ogImage), global.location.href).href;
        }
      } catch (eOg) {
        absOg = String(meta.ogImage);
      }
      var ogI = doc.querySelector('meta[property="og:image"]');
      if (ogI) ogI.setAttribute("content", absOg);
      var twI = doc.querySelector('meta[name="twitter:image"]');
      if (twI) twI.setAttribute("content", absOg);
      else {
        var head = doc.head || doc.getElementsByTagName("head")[0];
        if (head) {
          var m = doc.createElement("meta");
          m.setAttribute("name", "twitter:image");
          m.setAttribute("content", absOg);
          head.appendChild(m);
        }
      }
    }
  }

  function applyNavBooking(doc, data) {
    if (!data) return;
    if (data.nav && Array.isArray(data.nav)) {
      for (var ni = 0; ni < 5; ni++) {
        var a = doc.getElementById("content-nav-" + ni);
        if (a && data.nav[ni]) {
          if (data.nav[ni].href) a.setAttribute("href", String(data.nav[ni].href));
          if (data.nav[ni].label != null) a.textContent = String(data.nav[ni].label);
        }
      }
    }
    var bf = data.bookingForm;
    if (!bf) return;
    function setTxt(id, val) {
      var el = doc.getElementById(id);
      if (el && val != null) el.textContent = String(val);
    }
    setTxt("content-booking-lbl-name", bf.labelName);
    setTxt("content-booking-lbl-phone", bf.labelPhone);
    setTxt("content-booking-lbl-datetime", bf.labelDatetime);
    setTxt("content-booking-lbl-note", bf.labelNote);
    var sid = doc.getElementById("content-booking-submit");
    if (sid && bf.submitText != null) sid.textContent = String(bf.submitText);
    var inpD = doc.getElementById("booking-inp-datetime");
    if (inpD && bf.placeholderDatetime != null) inpD.setAttribute("placeholder", String(bf.placeholderDatetime));
    var inpN = doc.getElementById("booking-inp-note");
    if (inpN && bf.placeholderNote != null) inpN.setAttribute("placeholder", String(bf.placeholderNote));
  }

  function applyDocument(doc, dataOpt) {
    var data = dataOpt != null ? dataOpt : getMergedForSite();
    if (data.meta) applyMeta(doc, data.meta);
    var texts = data.texts || {};
    for (var id in texts) {
      if (!Object.prototype.hasOwnProperty.call(texts, id)) continue;
      var el = doc.getElementById(id);
      if (!el) continue;
      el.textContent = texts[id] == null ? "" : String(texts[id]);
    }
    var attrs = data.attrs || {};
    var tg = doc.getElementById("content-social-tg-link");
    if (tg && attrs["content-social-tg-link"]) tg.setAttribute("href", String(attrs["content-social-tg-link"]));
    var vk = doc.getElementById("content-social-vk-link");
    if (vk && attrs["content-social-vk-link"]) vk.setAttribute("href", String(attrs["content-social-vk-link"]));
    var ph = doc.getElementById("content-contact-phone-link");
    if (ph && attrs["content-contact-phone-link"]) ph.setAttribute("href", String(attrs["content-contact-phone-link"]));
    var img = doc.getElementById("content-hero-img");
    if (img) {
      if (attrs["content-hero-img"]) img.setAttribute("src", String(attrs["content-hero-img"]));
      if (attrs["content-hero-img-alt"] != null) img.setAttribute("alt", String(attrs["content-hero-img-alt"]));
      if (attrs["content-hero-img-srcset"] != null && String(attrs["content-hero-img-srcset"]).trim()) {
        img.setAttribute("srcset", String(attrs["content-hero-img-srcset"]));
      } else {
        img.removeAttribute("srcset");
      }
    }
    var mapFrame = doc.getElementById("content-map-iframe");
    if (mapFrame) {
      var mapBuilt = buildYandexMapEmbedFromCoords(
        attrs["content-map-lat"],
        attrs["content-map-lng"],
        attrs["content-map-zoom"]
      );
      if (mapBuilt) mapFrame.setAttribute("src", mapBuilt);
      else if (attrs["content-map-iframe"]) mapFrame.setAttribute("src", String(attrs["content-map-iframe"]));
    }
    applyNavBooking(doc, data);
    return data;
  }

  function publishSiteData(mergedPayload) {
    var v = validateSiteData(mergedPayload);
    if (!v.ok) return v;
    savePublished(mergedPayload);
    try {
      pushHistoryEntry("Публикация", deepClone(mergedPayload));
    } catch (eH) {
      /* ignore */
    }
    return { ok: true, errors: [] };
  }

  function getAdminPassword() {
    try {
      return global.localStorage.getItem(PASS_KEY) || "laguna";
    } catch (e) {
      return "laguna";
    }
  }

  function setAdminPassword(pass) {
    global.localStorage.setItem(PASS_KEY, pass);
  }

  var SERVER_API_TOKEN_KEY = "laguna_server_api_token";

  function getServerApiToken() {
    try {
      return global.sessionStorage.getItem(SERVER_API_TOKEN_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function setServerApiToken(token) {
    try {
      if (token) global.sessionStorage.setItem(SERVER_API_TOKEN_KEY, String(token));
      else global.sessionStorage.removeItem(SERVER_API_TOKEN_KEY);
    } catch (e) {
      /* ignore */
    }
  }

  /** Синхронно подтянуть data/site-content.json → опубликованный localStorage (не на admin.html) */
  function pullServerContentSync() {
    try {
      if (typeof global.XMLHttpRequest === "undefined") return;
      var loc = global.location;
      if (!loc || loc.protocol === "file:") return;
      var pathn = (loc.pathname || "").toLowerCase();
      if (pathn.indexOf("admin.html") !== -1) return;
      var xhr = new global.XMLHttpRequest();
      xhr.open("GET", "data/site-content.json", false);
      xhr.send(null);
      if (xhr.status !== 200) return;
      var parsed = JSON.parse(xhr.responseText);
      if (!parsed || parsed.v !== 1) return;
      savePublished(mergeDefaults(parsed));
    } catch (ePull) {
      /* ignore */
    }
  }

  pullServerContentSync();

  global.LagunaSiteOverrides = {
    STORAGE_KEY: STORAGE_KEY,
    STORAGE_DRAFT_KEY: STORAGE_DRAFT_KEY,
    STORAGE_HISTORY_KEY: STORAGE_HISTORY_KEY,
    PASS_KEY: PASS_KEY,
    buildDefaults: buildDefaults,
    deepClone: deepClone,
    load: load,
    save: save,
    loadPublished: loadPublished,
    savePublished: savePublished,
    loadDraft: loadDraft,
    saveDraft: saveDraft,
    loadHistory: loadHistory,
    saveHistory: saveHistory,
    mergeDefaults: mergeDefaults,
    applyDocument: applyDocument,
    getMergedForSite: getMergedForSite,
    getDraftMerged: getDraftMerged,
    ensureDraftFromPublished: ensureDraftFromPublished,
    isAdminPreviewUrl: isAdminPreviewUrl,
    normalizeQuizQuestions: normalizeQuizQuestions,
    getQuizQuestionsFromData: getQuizQuestionsFromData,
    normalizeGalleryCards: normalizeGalleryCards,
    defaultGalleryCards: defaultGalleryCards,
    defaultQuizQuestions: defaultQuizQuestions,
    defaultFailMessages: defaultFailMessages,
    validateSiteData: validateSiteData,
    publishSiteData: publishSiteData,
    getAdminPassword: getAdminPassword,
    setAdminPassword: setAdminPassword,
    getServerApiToken: getServerApiToken,
    setServerApiToken: setServerApiToken,
    pullServerContentSync: pullServerContentSync,
    SERVER_API_TOKEN_KEY: SERVER_API_TOKEN_KEY,
    getIntroSiteMode: getIntroSiteMode,
    buildYandexMapEmbedFromCoords: buildYandexMapEmbedFromCoords,
  };
})(typeof window !== "undefined" ? window : globalThis);
