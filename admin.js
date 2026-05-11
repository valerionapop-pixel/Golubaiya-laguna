(function () {
  var L = window.LagunaSiteOverrides;
  if (!L) {
    document.body.innerHTML = "<p style=\"padding:2rem;color:#fff\">Не загружен laguna-site-overrides.js</p>";
    return;
  }

  var AUTH_KEY = "laguna_admin_ui_v1";

  try {
    if (localStorage.getItem("admin_theme_v1") === "light") document.body.classList.add("admin-body--light");
  } catch (eTheme0) {}

  var TEXT_LABELS = {
    "content-site-logo": "Шапка: название",
    "content-gate-kicker": "Ворота: кикер",
    "intro-pitch": "Ворота: основной текст",
    "content-start-label": "Кнопка START",
    "intro-cinematic-title": "Заставка: заголовок",
    "content-cine-skip": "Заставка: подсказка пропуска",
    "content-quiz-eyebrow": "Викторина: подзаголовок",
    "content-quiz-hint": "Викторина: подсказка",
    "content-quiz-fail-title": "Викторина: текст при провале",
    "content-quiz-fail-retry": "Викторина: кнопка «Повторить»",
    "content-success-eyebrow": "Успех: eyebrow",
    "content-success-line-a": "Успех: строка 1",
    "content-success-line-b": "Успех: строка 2",
    "content-success-line-c": "Успех: строка 3",
    "content-success-subhint": "Успех: низ",
    "content-hero-kicker": "Hero: кикер",
    "content-hero-title": "Hero: заголовок",
    "content-hero-lead": "Hero: лид",
    "content-hero-quote": "Hero: цитата",
    "content-hero-cta-primary": "Hero: кнопка 1",
    "content-hero-cta-ghost": "Hero: кнопка 2",
    "content-about-title": "О баре: заголовок",
    "content-about-text": "О баре: текст",
    "content-about-quote": "О баре: цитата",
    "content-pill-0": "Чип 1",
    "content-pill-1": "Чип 2",
    "content-pill-2": "Чип 3",
    "content-menu-title": "Меню: заголовок",
    "content-menu-deck": "Меню: вводный текст",
    "content-menu-fine": "Меню: примечание о ценах",
    "content-card-0-name": "Коктейль 1 — название",
    "content-card-0-price": "Коктейль 1 — цена",
    "content-card-0-meta": "Коктейль 1 — состав",
    "content-card-0-note": "Коктейль 1 — заметка",
    "content-card-1-name": "Коктейль 2 — название",
    "content-card-1-price": "Коктейль 2 — цена",
    "content-card-1-meta": "Коктейль 2 — состав",
    "content-card-1-note": "Коктейль 2 — заметка",
    "content-card-2-name": "Коктейль 3 — название",
    "content-card-2-price": "Коктейль 3 — цена",
    "content-card-2-meta": "Коктейль 3 — состав",
    "content-card-2-note": "Коктейль 3 — заметка",
    "content-gallery-title": "Галерея: заголовок",
    "content-gallery-deck": "Галерея: текст",
    "content-vibe-title": "Атмосфера: заголовок",
    "content-vibe-text": "Атмосфера: текст",
    "content-visit-title": "Визит: заголовок",
    "content-visit-text": "Визит: текст",
    "content-social-label": "Соцсети: подпись",
    "content-social-tg": "Telegram: текст ссылки",
    "content-social-vk": "VK: текст ссылки",
    "content-contact-addr": "Адрес (без «Адрес:»)",
    "content-contact-phone": "Телефон (отображение)",
    "content-contact-hours": "Часы работы",
    "content-booking-form-title": "Форма: заголовок",
    "content-booking-deck": "Форма: подзаголовок под заголовком",
    "content-booking-hint": "Форма: подсказка",
    "content-booking-success": "Форма: текст после успешной отправки (сервер)",
    "content-booking-followup-lead": "Форма: после успеха — призыв (мессенджеры, без SMS)",
    "content-booking-followup-wa": "Форма: кнопка WhatsApp",
    "content-booking-followup-tg": "Форма: кнопка Telegram",
    "content-booking-followup-tel": "Форма: ссылка на телефон / контакты",
    "content-visit-card-label": "Карточка события: подпись",
    "content-visit-card-value": "Карточка события: значение",
    "content-visit-card-hint": "Карточка события: подсказка",
    "content-map-note": "Карта: примечание",
    "content-footer-brand": "Подвал: бренд",
    "content-footer-suffix": "Подвал: суффикс после года",
  };

  var SECTIONS = [
    {
      title: "Ворота, заставка, викторина, успех",
      keys: [
        "content-gate-kicker",
        "intro-pitch",
        "content-start-label",
        "intro-cinematic-title",
        "content-cine-skip",
        "content-quiz-eyebrow",
        "content-quiz-hint",
        "content-quiz-fail-title",
        "content-quiz-fail-retry",
        "content-success-eyebrow",
        "content-success-line-a",
        "content-success-line-b",
        "content-success-line-c",
        "content-success-subhint",
      ],
    },
    {
      title: "Hero и шапка",
      keys: [
        "content-site-logo",
        "content-hero-kicker",
        "content-hero-title",
        "content-hero-lead",
        "content-hero-quote",
        "content-hero-cta-primary",
        "content-hero-cta-ghost",
      ],
    },
    {
      title: "О баре",
      keys: [
        "content-about-title",
        "content-about-text",
        "content-about-quote",
        "content-pill-0",
        "content-pill-1",
        "content-pill-2",
      ],
    },
    {
      title: "Меню",
      keys: [
        "content-menu-title",
        "content-menu-deck",
        "content-menu-fine",
        "content-card-0-name",
        "content-card-0-price",
        "content-card-0-meta",
        "content-card-0-note",
        "content-card-1-name",
        "content-card-1-price",
        "content-card-1-meta",
        "content-card-1-note",
        "content-card-2-name",
        "content-card-2-price",
        "content-card-2-meta",
        "content-card-2-note",
      ],
    },
    {
      title: "Галерея, атмосфера, визит, подвал",
      keys: [
        "content-gallery-title",
        "content-gallery-deck",
        "content-vibe-title",
        "content-vibe-text",
        "content-visit-title",
        "content-visit-text",
        "content-social-label",
        "content-social-tg",
        "content-social-vk",
        "content-contact-addr",
        "content-contact-phone",
        "content-contact-hours",
        "content-booking-form-title",
        "content-booking-deck",
        "content-booking-hint",
        "content-booking-success",
        "content-booking-followup-lead",
        "content-booking-followup-wa",
        "content-booking-followup-tg",
        "content-booking-followup-tel",
        "content-visit-card-label",
        "content-visit-card-value",
        "content-visit-card-hint",
        "content-map-note",
        "content-footer-brand",
        "content-footer-suffix",
      ],
    },
  ];

  function labelForKey(k) {
    return TEXT_LABELS[k] || k;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function galleryRowHtml(c) {
    c = c || {};
    return (
      "<tr>" +
      '<td class="admin-gallery-actions">' +
      '<button type="button" class="admin-btn admin-btn--ghost js-gal-up" title="Вверх">↑</button>' +
      '<button type="button" class="admin-btn admin-btn--ghost js-gal-down" title="Вниз">↓</button>' +
      '<button type="button" class="admin-btn admin-btn--danger js-gal-del" title="Удалить">×</button>' +
      "</td>" +
      '<td><input type="text" class="js-gal-id" value="' +
      esc(c.id || "") +
      '" /></td>' +
      '<td><input type="text" class="js-gal-url" value="' +
      esc(c.imageUrl || "") +
      '" /></td>' +
      '<td><input type="text" class="js-gal-alt" value="' +
      esc(c.alt || "") +
      '" /></td>' +
      '<td><input type="text" class="js-gal-title" value="' +
      esc(c.title || "") +
      '" /></td></tr>'
    );
  }

  function currentIntroModeFromData(data) {
    var im = data.intro || {};
    if (im.mode && /^(full|none|gate_then_site|cinematic_to_site)$/.test(String(im.mode))) return String(im.mode);
    if (im.disabled) return "none";
    return "full";
  }

  function toast(msg) {
    var el = document.getElementById("admin-toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("is-visible");
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(function () {
      el.classList.remove("is-visible");
    }, 2600);
  }

  function syncThemeToggleLabel() {
    var btn = document.getElementById("admin-theme-toggle");
    if (!btn) return;
    btn.textContent = document.body.classList.contains("admin-body--light") ? "Тёмная тема" : "Светлая тема";
  }

  function truncateDiffStr(s, maxLen) {
    var m = maxLen != null ? maxLen : 420;
    if (s.length <= m) return s;
    return s.slice(0, m) + "…";
  }

  function collectDiffPaths(left, right, path, lines, maxLines) {
    if (lines.length >= maxLines) return;
    if (left === right) return;
    var bothPlainObj =
      left &&
      right &&
      typeof left === "object" &&
      typeof right === "object" &&
      !Array.isArray(left) &&
      !Array.isArray(right);
    if (!bothPlainObj) {
      var sl = JSON.stringify(left);
      var sr = JSON.stringify(right);
      if (sl !== sr) {
        lines.push(
          (path || "(корень)") +
            "\n  форма ← " +
            truncateDiffStr(sl) +
            "\n  опубл. → " +
            truncateDiffStr(sr)
        );
      }
      return;
    }
    var keys = {};
    var ka;
    for (ka in left) {
      if (Object.prototype.hasOwnProperty.call(left, ka)) keys[ka] = true;
    }
    for (var kb in right) {
      if (Object.prototype.hasOwnProperty.call(right, kb)) keys[kb] = true;
    }
    for (var k in keys) {
      if (!Object.prototype.hasOwnProperty.call(keys, k)) continue;
      if (lines.length >= maxLines) return;
      var p = path ? path + "." + k : k;
      if (!Object.prototype.hasOwnProperty.call(left, k)) {
        lines.push(p + " (только в опубликованном)\n  → " + truncateDiffStr(JSON.stringify(right[k])));
      } else if (!Object.prototype.hasOwnProperty.call(right, k)) {
        lines.push(p + " (только в форме / черновике)\n  ← " + truncateDiffStr(JSON.stringify(left[k])));
      } else {
        collectDiffPaths(left[k], right[k], p, lines, maxLines);
      }
    }
  }

  function computeFormDiff() {
    var left = L.mergeDefaults(collectForm());
    var pub = L.loadPublished();
    var right = L.mergeDefaults(pub || {});
    var lines = [];
    var maxLines = 140;
    collectDiffPaths(left, right, "", lines, maxLines);
    if (!lines.length) return "(данные совпадают по всему дереву)";
    var tail = lines.length >= maxLines ? "\n\n… показано не более " + maxLines + " отличий" : "";
    return lines.join("\n\n") + tail;
  }

  function onDiffClick() {
    var panel = document.getElementById("admin-diff-panel");
    var pre = document.getElementById("admin-diff-out");
    if (pre) pre.textContent = computeFormDiff();
    if (panel) {
      panel.classList.remove("is-hidden");
      try {
        panel.open = true;
      } catch (eOp) {
        panel.setAttribute("open", "open");
      }
    }
  }

  function onAdminSearchInput() {
    var inp = document.getElementById("admin-search");
    var q = inp && inp.value ? inp.value.trim().toLowerCase() : "";
    var fields = document.querySelectorAll("#admin-form-root .admin-field");
    for (var fi = 0; fi < fields.length; fi++) {
      var field = fields[fi];
      var lab = field.querySelector("label");
      var labText = ((lab && lab.textContent) || "").toLowerCase();
      var inpEl = field.querySelector("textarea, select, input:not([type=hidden])");
      var valText = inpEl ? String(inpEl.value || "").toLowerCase() : "";
      var hit = !q || labText.indexOf(q) !== -1 || valText.indexOf(q) !== -1;
      field.classList.toggle("admin-field--search-hide", !hit);
    }
    var dets = document.querySelectorAll("#admin-form-root > .admin-details");
    for (var dj = 0; dj < dets.length; dj++) {
      var det = dets[dj];
      var any = det.querySelector(".admin-field:not(.admin-field--search-hide)");
      det.classList.toggle("admin-details--search-empty", !!q && !any);
    }
  }

  function onQuizExportClick() {
    var payload = collectForm();
    var out = { v: 1, quiz: payload.quiz };
    var blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "laguna-quiz.json";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Викторина скачана");
  }

  function onQuizImportFile(ev) {
    var f = ev.target.files && ev.target.files[0];
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var obj = JSON.parse(String(reader.result || "{}"));
        if (!obj.quiz || !Array.isArray(obj.quiz.pools)) throw new Error("bad");
        var payload = L.mergeDefaults(collectForm());
        payload.quiz = L.mergeDefaults({ v: 1, quiz: obj.quiz }).quiz;
        L.saveDraft(payload);
        renderForm();
        toast("Викторина импортирована в черновик");
      } catch (e) {
        toast("Нужен JSON с полем quiz.pools (как в экспорте)");
      }
      ev.target.value = "";
    };
    reader.readAsText(f, "utf-8");
  }

  function bindAdminShellUx() {
    var shell = document.querySelector(".admin-app__shell");
    if (!shell || shell.dataset.boundUx) return;
    shell.dataset.boundUx = "1";
    shell.addEventListener("click", function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      if (t.closest(".js-gal-up")) {
        var tr = t.closest("tr");
        var tb = tr && tr.parentElement;
        if (!tb || !tr) return;
        var idx = Array.prototype.indexOf.call(tb.children, tr);
        if (idx > 0) tb.insertBefore(tr, tb.children[idx - 1]);
        return;
      }
      if (t.closest(".js-gal-down")) {
        var tr2 = t.closest("tr");
        var tb2 = tr2 && tr2.parentElement;
        if (!tb2 || !tr2) return;
        var idx2 = Array.prototype.indexOf.call(tb2.children, tr2);
        if (idx2 < tb2.children.length - 1) tb2.insertBefore(tb2.children[idx2 + 1], tr2);
        return;
      }
      if (t.closest(".js-gal-del")) {
        var tr3 = t.closest("tr");
        if (tr3) tr3.remove();
        return;
      }
      if (t.id === "gallery_add_row") {
        var tbody = document.getElementById("gallery_table_body");
        if (tbody) tbody.insertAdjacentHTML("beforeend", galleryRowHtml({}));
        return;
      }
      if (t.id === "admin-quiz-export") {
        onQuizExportClick();
      }
    });
    shell.addEventListener("change", function (ev) {
      if (ev.target && ev.target.id === "admin-quiz-import") onQuizImportFile(ev);
    });
  }

  function isAuthed() {
    try {
      return sessionStorage.getItem(AUTH_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function setAuthed(on) {
    try {
      if (on) sessionStorage.setItem(AUTH_KEY, "1");
      else sessionStorage.removeItem(AUTH_KEY);
    } catch (e) {}
  }

  function showLogin() {
    document.getElementById("login-screen").classList.remove("is-hidden");
    document.getElementById("app-screen").classList.add("is-hidden");
  }

  function showApp() {
    document.getElementById("login-screen").classList.add("is-hidden");
    document.getElementById("app-screen").classList.remove("is-hidden");
  }

  function renderTextField(key, val) {
    var id = "t_" + key.replace(/[^a-zA-Z0-9_-]/g, "_");
    var rows = String(val).length > 120 ? 4 : 2;
    var nameAttr = "t_" + key.replace(/"/g, "");
    return (
      '<div class="admin-field">' +
      '<label for="' +
      id +
      '">' +
      esc(labelForKey(key)) +
      "</label>" +
      '<textarea id="' +
      id +
      '" name="' +
      nameAttr +
      '" rows="' +
      rows +
      '">' +
      esc(val) +
      "</textarea></div>"
    );
  }

  function renderAttrField(key, val, lab) {
    var fid = "a_" + key.replace(/[^a-zA-Z0-9_-]/g, "_");
    var safeName = key.replace(/"/g, "");
    return (
      '<div class="admin-field">' +
      '<label for="' +
      fid +
      '">' +
      esc(lab) +
      "</label>" +
      '<input id="' +
      fid +
      '" type="text" name="' +
      safeName +
      '" value="' +
      esc(val) +
      '" />' +
      "</div>"
    );
  }

  function renderQuizBlock(prefix, qs) {
    var html = "";
    for (var i = 0; i < 3; i++) {
      var q = qs[i] || {};
      html += '<div class="admin-quiz-q"><h3>Вопрос ' + (i + 1) + "</h3>";
      html +=
        '<div class="admin-field"><label>Текст</label><textarea name="' +
        prefix +
        i +
        '_text" rows="2">' +
        esc(q.text || "") +
        "</textarea></div>";
      html +=
        '<div class="admin-field admin-field--half"><label>Картинка</label><input type="text" name="' +
        prefix +
        i +
        '_figure" value="' +
        esc(q.figure || "") +
        '" /></div>';
      html +=
        '<div class="admin-field admin-field--half"><label>Alt</label><input type="text" name="' +
        prefix +
        i +
        '_alt" value="' +
        esc(q.figureAlt || "") +
        '" /></div>';
      var opts = q.options || [{}, {}, {}];
      for (var j = 0; j < 3; j++) {
        var o = opts[j] || {};
        var correct = o.correct ? " checked" : "";
        html += '<div class="admin-option-row">';
        html +=
          '<input type="text" name="' +
          prefix +
          i +
          "_o" +
          j +
          '" value="' +
          esc(o.text || "") +
          '" placeholder="Вариант ' +
          (j + 1) +
          '" />';
        html +=
          '<label><input type="radio" name="' +
          prefix +
          i +
          '_correct" value="' +
          j +
          '"' +
          correct +
          " /> верный</label>";
        html += "</div>";
      }
      html += "</div>";
    }
    return html;
  }

  function renderQuizPoolsEditor(data) {
    var pools = (data.quiz && data.quiz.pools) || [];
    var qa = (pools[0] && pools[0].questions) || L.defaultQuizQuestions();
    var qb = (pools[1] && pools[1].questions) || L.defaultQuizQuestions();
    var active = (data.quiz && data.quiz.activePoolId) || "a";
    var html =
      '<details class="admin-details" open><summary>Викторина — два набора по 3 вопроса</summary><div class="admin-details__body">';
    html +=
      '<div class="admin-row admin-row--wrap" style="margin-bottom:1rem">' +
      '<button type="button" class="admin-btn admin-btn--ghost" id="admin-quiz-export">Скачать JSON только викторины</button>' +
      '<label class="admin-btn admin-btn--ghost" style="cursor:pointer">Импорт в черновик<input id="admin-quiz-import" type="file" accept="application/json,.json" class="is-hidden" /></label>' +
      "</div>";
    html +=
      '<div class="admin-field"><label>Активный набор на сайте</label><label class="admin-inline"><input type="radio" name="quiz_active_pool" value="a"' +
      (active === "a" ? " checked" : "") +
      ' /> Набор A</label> <label class="admin-inline"><input type="radio" name="quiz_active_pool" value="b"' +
      (active === "b" ? " checked" : "") +
      ' /> Набор B</label></div>';
    html += '<div class="admin-field"><label>Название набора A</label><input type="text" name="quiz_pool_a_name" value="' + esc((pools[0] && pools[0].name) || "Набор A") + '" /></div>';
    html += "<h4 class=\"admin-subh\">Набор A</h4>";
    html += renderQuizBlock("qa_", qa);
    html += '<div class="admin-field"><label>Название набора B</label><input type="text" name="quiz_pool_b_name" value="' + esc((pools[1] && pools[1].name) || "Набор B") + '" /></div>';
    html += "<h4 class=\"admin-subh\">Набор B</h4>";
    html += renderQuizBlock("qb_", qb);
    html += "</div></details>";
    return html;
  }

  function renderForm() {
    L.ensureDraftFromPublished();
    var data = L.getDraftMerged();
    var root = document.getElementById("admin-form-root");
    var used = {};
    var html = "";

    html += '<details class="admin-details" open><summary>SEO и служебное</summary><div class="admin-details__body">';
    html +=
      '<div class="admin-field"><label for="m_pageTitle">Заголовок вкладки (title)</label><input id="m_pageTitle" type="text" name="meta_pageTitle" value="' +
      esc(data.meta.pageTitle || "") +
      '" /></div>';
    html +=
      '<div class="admin-field"><label for="m_metaDescription">meta description</label><textarea id="m_metaDescription" name="meta_metaDescription" rows="2">' +
      esc(data.meta.metaDescription || "") +
      "</textarea></div>";
    html +=
      '<div class="admin-field"><label for="m_ogTitle">og:title</label><input id="m_ogTitle" type="text" name="meta_ogTitle" value="' +
      esc(data.meta.ogTitle || "") +
      '" /></div>';
    html +=
      '<div class="admin-field"><label for="m_ogDescription">og:description</label><textarea id="m_ogDescription" name="meta_ogDescription" rows="2">' +
      esc(data.meta.ogDescription || "") +
      "</textarea></div>";
    html +=
      '<div class="admin-field"><label for="m_ogImage">og:image / twitter:image (URL или путь)</label><input id="m_ogImage" type="text" name="meta_ogImage" value="' +
      esc(data.meta.ogImage != null ? String(data.meta.ogImage) : "") +
      '" /></div>';
    html +=
      '<div class="admin-field"><label for="bookingEmail">Email для брони (mailto)</label><input id="bookingEmail" type="email" name="bookingEmail" value="' +
      esc(data.bookingEmail || "") +
      '" /></div>';
    html +=
      '<div class="admin-field"><label for="intro_gate_sub">Подзаголовок у ворот (пусто = автодата месяц/год)</label><textarea id="intro_gate_sub" name="intro_gate_sub" rows="2">' +
      esc(data.intro_gate_sub || "") +
      "</textarea></div>";
    html +=
      '<div class="admin-field"><label for="failMessages">Сообщения при провале (каждое с новой строки)</label><textarea id="failMessages" name="failMessages" rows="5">' +
      esc((data.failMessages || []).join("\n")) +
      "</textarea></div>";
    html += "</div></details>";

    var introModeSel = currentIntroModeFromData(data);
    html +=
      '<details class="admin-details"><summary>Интро и тайминги</summary><div class="admin-details__body">' +
      '<div class="admin-field"><label for="intro_mode">Режим полноэкранного интро</label>' +
      '<select id="intro_mode" name="intro_mode">' +
      '<option value="full"' +
      (introModeSel === "full" ? " selected" : "") +
      ">Полный путь: ворота → заставка → викторина</option>" +
      '<option value="none"' +
      (introModeSel === "none" ? " selected" : "") +
      ">Сразу сайт (без интро)</option>" +
      '<option value="gate_then_site"' +
      (introModeSel === "gate_then_site" ? " selected" : "") +
      ">После START — сразу сайт</option>" +
      '<option value="cinematic_to_site"' +
      (introModeSel === "cinematic_to_site" ? " selected" : "") +
      ">Заставка, затем сайт (без викторины)</option>" +
      "</select></div>" +
      '<div class="admin-field"><label for="intro_auto_exit">Заставка → дальше, мс (2000–60000)</label><input id="intro_auto_exit" type="number" min="2000" max="60000" name="intro_auto_exit" value="' +
      esc(String((data.intro && data.intro.autoExitCinematicMs) || 6200)) +
      '" /></div>' +
      '<div class="admin-field"><label for="intro_success_ms">Экран успеха, мс (1500–120000)</label><input id="intro_success_ms" type="number" min="1500" max="120000" name="intro_success_ms" value="' +
      esc(String((data.intro && data.intro.successScreenMs) || 4800)) +
      '" /></div></details>';

    html += '<details class="admin-details"><summary>Навигация (5 пунктов)</summary><div class="admin-details__body">';
    for (var ni = 0; ni < 5; ni++) {
      var nv = (data.nav && data.nav[ni]) || {};
      html +=
        '<div class="admin-field admin-field--half"><label>href</label><input type="text" name="nav_' +
        ni +
        '_href" value="' +
        esc(nv.href || "") +
        '" /></div><div class="admin-field admin-field--half"><label>Подпись</label><input type="text" name="nav_' +
        ni +
        '_label" value="' +
        esc(nv.label || "") +
        '" /></div>';
    }
    html += "</div></details>";

    var bf = data.bookingForm || {};
    html += '<details class="admin-details"><summary>Форма брони</summary><div class="admin-details__body">';
    [
      ["bf_labelName", "labelName", "Подпись: имя"],
      ["bf_labelPhone", "labelPhone", "Подпись: телефон"],
      ["bf_labelDatetime", "labelDatetime", "Подпись: дата и время"],
      ["bf_labelNote", "labelNote", "Подпись: комментарий"],
      ["bf_placeholderDatetime", "placeholderDatetime", "Placeholder даты"],
      ["bf_placeholderNote", "placeholderNote", "Placeholder комментария"],
      ["bf_submitText", "submitText", "Текст кнопки отправки"],
      ["bf_mailSubject", "mailSubject", "Тема письма (mailto)"],
      ["bf_mailPrefixName", "mailPrefixName", "Префикс в письме: имя"],
      ["bf_mailPrefixPhone", "mailPrefixPhone", "Префикс: телефон"],
      ["bf_mailPrefixDatetime", "mailPrefixDatetime", "Префикс: дата"],
      ["bf_mailPrefixNote", "mailPrefixNote", "Префикс: комментарий"],
    ].forEach(function (row) {
      html +=
        '<div class="admin-field"><label for="' +
        row[0] +
        '">' +
        esc(row[2]) +
        '</label><input id="' +
        row[0] +
        '" type="text" name="' +
        row[0] +
        '" value="' +
        esc(bf[row[1]] != null ? String(bf[row[1]]) : "") +
        '" /></div>';
    });
    html += "</div></details>";

    var gCards = (data.gallery && data.gallery.cards) || L.defaultGalleryCards();
    html +=
      '<details class="admin-details"><summary>3D-галерея</summary><div class="admin-details__body">' +
      '<p class="admin-muted">Строки таблицы: id, imageUrl, alt, title. Кнопки ↑↓ меняют порядок карточек.</p>' +
      '<div class="admin-gallery-scroll"><table class="admin-gallery-table"><thead><tr><th class="admin-gallery-th-actions"></th><th>id</th><th>imageUrl</th><th>alt</th><th>title</th></tr></thead><tbody id="gallery_table_body">';
    for (var gix = 0; gix < gCards.length; gix++) {
      html += galleryRowHtml(gCards[gix]);
    }
    html +=
      '</tbody></table></div><div class="admin-row" style="margin-top:0.75rem">' +
      '<button type="button" class="admin-btn admin-btn--ghost" id="gallery_add_row">Добавить кадр</button></div></div></details>';

    SECTIONS.forEach(function (sec) {
      html += '<details class="admin-details"><summary>' + esc(sec.title) + "</summary><div class=\"admin-details__body\">";
      sec.keys.forEach(function (k) {
        used[k] = true;
        html += renderTextField(k, data.texts[k] != null ? data.texts[k] : "");
      });
      html += "</div></details>";
    });

    var rest = [];
    for (var tk in data.texts) {
      if (Object.prototype.hasOwnProperty.call(data.texts, tk) && !used[tk]) {
        rest.push(tk);
      }
    }
    if (rest.length) {
      html += '<details class="admin-details"><summary>Прочие поля</summary><div class="admin-details__body">';
      rest.forEach(function (k) {
        html += renderTextField(k, data.texts[k] != null ? data.texts[k] : "");
      });
      html += "</div></details>";
    }

    html += '<details class="admin-details"><summary>Ссылки, телефон, карта, hero-картинка</summary><div class="admin-details__body">';
    var attrs = data.attrs || {};
    html += renderAttrField(
      "content-social-tg-link",
      attrs["content-social-tg-link"] || "",
      "Telegram URL"
    );
    html += renderAttrField(
      "content-social-vk-link",
      attrs["content-social-vk-link"] || "",
      "VK URL"
    );
    html += renderAttrField(
      "content-contact-phone-link",
      attrs["content-contact-phone-link"] || "",
      "Телефон href (tel:…)"
    );
    html += renderAttrField("content-hero-img", attrs["content-hero-img"] || "", "Hero: src картинки");
    html += renderAttrField("content-hero-img-alt", attrs["content-hero-img-alt"] || "", "Hero: alt");
    html += renderAttrField(
      "content-hero-img-srcset",
      attrs["content-hero-img-srcset"] != null ? String(attrs["content-hero-img-srcset"]) : "",
      "Hero: srcset (опционально)"
    );
    html += renderAttrField("content-map-lat", attrs["content-map-lat"] != null ? String(attrs["content-map-lat"]) : "", "Карта: широта (с долготой — свой embed)");
    html += renderAttrField("content-map-lng", attrs["content-map-lng"] != null ? String(attrs["content-map-lng"]) : "", "Карта: долгота");
    html += renderAttrField("content-map-zoom", attrs["content-map-zoom"] != null ? String(attrs["content-map-zoom"]) : "", "Карта: zoom (2–19)");
    html += renderAttrField("content-map-iframe", attrs["content-map-iframe"] || "", "Карта: URL iframe (если нет координат)");
    html += "</div></details>";

    html += renderQuizPoolsEditor(data);

    root.innerHTML = html;
    refreshHistoryDropdown();
    setPreviewSrc(true);
    syncApiTokenField();
    syncThemeToggleLabel();
  }

  function syncApiTokenField() {
    var el = document.getElementById("api-token");
    if (el && L.getServerApiToken()) el.value = L.getServerApiToken();
  }

  function resolvedApiToken() {
    var el = document.getElementById("api-token");
    var fromInput = el && el.value ? el.value.trim() : "";
    if (fromInput) return fromInput;
    return L.getServerApiToken() || "";
  }

  function onApiTokenSave() {
    var el = document.getElementById("api-token");
    if (!el || !el.value.trim()) {
      toast("Введите токен");
      return;
    }
    L.setServerApiToken(el.value.trim());
    toast("Токен сохранён в сессии");
  }

  function onServerPush() {
    var payload = L.mergeDefaults(collectForm());
    var v = L.validateSiteData(payload);
    if (!v.ok) {
      toast(v.errors.join(" · "));
      return;
    }
    var tok = resolvedApiToken();
    if (!tok) {
      toast("Нужен токен API");
      return;
    }
    fetch("/api/site-content", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Laguna-Token": tok },
      body: JSON.stringify(payload),
    })
      .then(function (r) {
        return r.json().then(function (j) {
          return { ok: r.ok, j: j };
        });
      })
      .then(function (x) {
        if (!x.ok || !x.j.ok) {
          toast(x.j.error ? String(x.j.error) : "Ошибка записи (401 — неверный токен)");
          return;
        }
        L.setServerApiToken(resolvedApiToken());
        toast("Файл data/site-content.json обновлён; снимок в data/history/");
      })
      .catch(function () {
        toast("Сеть или сервер не запущен");
      });
  }

  function onServerPull() {
    fetch("/api/site-content", { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) {
          toast("На сервере нет контента (сначала «Черновик → сервер»)");
          return null;
        }
        return r.json();
      })
      .then(function (j) {
        if (!j) return;
        if (!j.v || j.v !== 1) {
          toast("Некорректный JSON на сервере");
          return;
        }
        L.saveDraft(L.mergeDefaults(j));
        renderForm();
        toast("Черновик загружен с сервера");
      })
      .catch(function () {
        toast("Сеть или сервер не запущен");
      });
  }

  function onHeroUpload() {
    var inp = document.getElementById("hero-upload-file");
    var tok = resolvedApiToken();
    if (!tok) {
      toast("Нужен токен API");
      return;
    }
    if (!inp || !inp.files || !inp.files[0]) {
      toast("Выберите файл");
      return;
    }
    var f = inp.files[0];
    if (f.size > 480 * 1024) {
      toast("Файл больше 480 КБ");
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      var base64 = reader.result;
      fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Laguna-Token": tok },
        body: JSON.stringify({ filename: f.name, data: base64 }),
      })
        .then(function (r) {
          return r.json().then(function (j) {
            return { ok: r.ok, j: j };
          });
        })
        .then(function (x) {
          if (!x.ok || !x.j.ok) {
            toast(x.j.error ? String(x.j.error) : "Ошибка загрузки");
            return;
          }
          var urlInp = document.querySelector('input[name="content-hero-img"]');
          if (urlInp) urlInp.value = x.j.url;
          L.setServerApiToken(resolvedApiToken());
          toast("URL: " + x.j.url);
        })
        .catch(function () {
          toast("Сеть или сервер не запущен");
        });
    };
    reader.readAsDataURL(f);
  }

  function refreshHistoryDropdown() {
    var sel = document.getElementById("admin-history-select");
    if (!sel) return;
    sel.innerHTML = '<option value="">— выберите снимок —</option>';
    L.loadHistory().forEach(function (h, idx) {
      var opt = document.createElement("option");
      opt.value = String(idx);
      try {
        opt.textContent = new Date(h.t).toLocaleString() + " — " + (h.label || "");
      } catch (e) {
        opt.textContent = "Снимок " + (idx + 1);
      }
      sel.appendChild(opt);
    });
  }

  function setPreviewSrc(noCache) {
    var fr = document.getElementById("admin-preview-frame");
    if (!fr) return;
    var u = "index.html?skip=1&adminPreview=1";
    if (noCache) u += "&t=" + String(Date.now());
    fr.setAttribute("src", u);
  }

  function collectPoolQuestions(prefix) {
    var questions = [];
    for (var i = 0; i < 3; i++) {
      var qtext = valOf('textarea[name="' + prefix + i + '_text"]');
      var figure = valOf('input[name="' + prefix + i + '_figure"]');
      var alt = valOf('input[name="' + prefix + i + '_alt"]');
      var correctIdx = 0;
      var cr = document.querySelector('input[name="' + prefix + i + '_correct"]:checked');
      if (cr) correctIdx = parseInt(cr.value, 10) || 0;
      var options = [];
      for (var j = 0; j < 3; j++) {
        options.push({
          text: valOf('input[name="' + prefix + i + "_o" + j + '"]') || "—",
          correct: j === correctIdx,
        });
      }
      questions.push({ text: qtext || "?", figure: figure, figureAlt: alt, options: options });
    }
    return L.normalizeQuizQuestions(questions);
  }

  function collectForm() {
    var base = L.getDraftMerged();
    var texts = {};
    for (var tk in base.texts) {
      if (!Object.prototype.hasOwnProperty.call(base.texts, tk)) continue;
      var ta = document.querySelector('textarea[name="t_' + tk + '"]');
      if (ta) texts[tk] = ta.value;
      else texts[tk] = base.texts[tk];
    }
    var attrs = {};
    for (var ak in base.attrs) {
      if (!Object.prototype.hasOwnProperty.call(base.attrs, ak)) continue;
      var inp = document.querySelector('input[name="' + ak + '"]');
      if (inp) attrs[ak] = inp.value;
      else attrs[ak] = base.attrs[ak];
    }
    var meta = {
      pageTitle: valOf('input[name="meta_pageTitle"]') || base.meta.pageTitle,
      metaDescription: valOf('textarea[name="meta_metaDescription"]') || base.meta.metaDescription,
      ogTitle: valOf('input[name="meta_ogTitle"]') || base.meta.ogTitle,
      ogDescription: valOf('textarea[name="meta_ogDescription"]') || base.meta.ogDescription,
      ogImage: valOf('input[name="meta_ogImage"]') != null ? valOf('input[name="meta_ogImage"]') : base.meta.ogImage,
    };
    var bookingEmail = valOf('input[name="bookingEmail"]') || base.bookingEmail;
    var intro_gate_sub = valOf('textarea[name="intro_gate_sub"]') != null ? valOf('textarea[name="intro_gate_sub"]') : base.intro_gate_sub;
    var failRaw = valOf('textarea[name="failMessages"]') || "";
    var failMessages = failRaw
      .split(/\r?\n/)
      .map(function (l) {
        return l.trim();
      })
      .filter(Boolean);
    if (!failMessages.length) failMessages = L.defaultFailMessages();

    var introMode = valOf('select[name="intro_mode"]') || "full";
    if (["full", "none", "gate_then_site", "cinematic_to_site"].indexOf(introMode) < 0) introMode = "full";
    var intro = {
      mode: introMode,
      disabled: introMode === "none",
      autoExitCinematicMs: parseInt(valOf('input[name="intro_auto_exit"]'), 10) || 6200,
      successScreenMs: parseInt(valOf('input[name="intro_success_ms"]'), 10) || 4800,
    };

    var nav = [];
    for (var ni = 0; ni < 5; ni++) {
      nav.push({
        href: valOf('input[name="nav_' + ni + '_href"]'),
        label: valOf('input[name="nav_' + ni + '_label"]'),
      });
    }

    var bookingForm = Object.assign({}, base.bookingForm || {});
    [
      ["bf_labelName", "labelName"],
      ["bf_labelPhone", "labelPhone"],
      ["bf_labelDatetime", "labelDatetime"],
      ["bf_labelNote", "labelNote"],
      ["bf_placeholderDatetime", "placeholderDatetime"],
      ["bf_placeholderNote", "placeholderNote"],
      ["bf_submitText", "submitText"],
      ["bf_mailSubject", "mailSubject"],
      ["bf_mailPrefixName", "mailPrefixName"],
      ["bf_mailPrefixPhone", "mailPrefixPhone"],
      ["bf_mailPrefixDatetime", "mailPrefixDatetime"],
      ["bf_mailPrefixNote", "mailPrefixNote"],
    ].forEach(function (row) {
      bookingForm[row[1]] = valOf('input[name="' + row[0] + '"]');
    });

    var gallery = { cards: (base.gallery && base.gallery.cards) || L.defaultGalleryCards() };
    var gtb = document.getElementById("gallery_table_body");
    if (gtb) {
      var gcards = [];
      var trs = gtb.querySelectorAll("tr");
      for (var ri = 0; ri < trs.length; ri++) {
        var tr = trs[ri];
        var idEl = tr.querySelector(".js-gal-id");
        var urlEl = tr.querySelector(".js-gal-url");
        var altEl = tr.querySelector(".js-gal-alt");
        var titleEl = tr.querySelector(".js-gal-title");
        gcards.push({
          id: idEl ? String(idEl.value || "").trim() : "",
          imageUrl: urlEl ? String(urlEl.value || "").trim() : "",
          alt: altEl ? String(altEl.value || "").trim() : "",
          title: titleEl ? String(titleEl.value || "").trim() : "",
        });
      }
      if (gcards.length) gallery.cards = L.normalizeGalleryCards(gcards);
    }

    var arEl = document.querySelector('input[name="quiz_active_pool"]:checked');
    var activePool = arEl && arEl.value ? arEl.value : "a";
    if (activePool !== "a" && activePool !== "b") activePool = "a";
    var poolAName = valOf('input[name="quiz_pool_a_name"]') || "Набор A";
    var poolBName = valOf('input[name="quiz_pool_b_name"]') || "Набор B";
    var qA = collectPoolQuestions("qa_");
    var qB = collectPoolQuestions("qb_");
    var pools = [
      { id: "a", name: poolAName, questions: qA },
      { id: "b", name: poolBName, questions: qB },
    ];
    var activeQuestions = activePool === "b" ? qB : qA;

    return {
      v: 1,
      bookingEmail: bookingEmail,
      meta: meta,
      texts: texts,
      attrs: attrs,
      intro_gate_sub: intro_gate_sub,
      failMessages: failMessages,
      intro: intro,
      nav: nav,
      bookingForm: bookingForm,
      gallery: gallery,
      quiz: {
        activePoolId: activePool,
        pools: pools,
        questions: activeQuestions,
      },
    };
  }

  function valOf(sel) {
    var el = document.querySelector(sel);
    return el ? String(el.value || "") : "";
  }

  function onSaveDraft() {
    var payload = collectForm();
    var v = L.validateSiteData(payload);
    if (!v.ok) {
      toast(v.errors.join(" · "));
      return;
    }
    L.saveDraft(payload);
    toast("Черновик сохранён");
    setPreviewSrc(true);
  }

  function onPublish() {
    var payload = collectForm();
    var v = L.validateSiteData(payload);
    if (!v.ok) {
      toast(v.errors.join(" · "));
      return;
    }
    var r = L.publishSiteData(L.mergeDefaults(payload));
    if (!r.ok) {
      toast((r.errors || ["Ошибка"]).join(" · "));
      return;
    }
    L.saveDraft(L.mergeDefaults(payload));
    toast("Опубликовано. Обновите главную страницу.");
    refreshHistoryDropdown();
    setPreviewSrc(true);
  }

  function onExport() {
    var payload = collectForm();
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "laguna-site-content.json";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("JSON скачан");
  }

  function onImportFile(ev) {
    var f = ev.target.files && ev.target.files[0];
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var obj = JSON.parse(String(reader.result || "{}"));
        if (obj.v !== 1) throw new Error("version");
        L.saveDraft(L.mergeDefaults(obj));
        renderForm();
        toast("Импорт в черновик выполнен");
      } catch (e) {
        toast("Ошибка импорта JSON");
      }
      ev.target.value = "";
    };
    reader.readAsText(f, "utf-8");
  }

  function onReset() {
    if (!window.confirm("Удалить опубликованное, черновик и историю?")) return;
    try {
      localStorage.removeItem(L.STORAGE_KEY);
      localStorage.removeItem(L.STORAGE_DRAFT_KEY);
      localStorage.removeItem(L.STORAGE_HISTORY_KEY);
    } catch (e) {}
    renderForm();
    toast("Сброшено");
  }

  function onHistoryRestore() {
    var sel = document.getElementById("admin-history-select");
    if (!sel || sel.value === "") {
      toast("Выберите снимок");
      return;
    }
    var idx = parseInt(sel.value, 10);
    var hist = L.loadHistory();
    if (!hist[idx] || !hist[idx].snapshot) {
      toast("Нет данных");
      return;
    }
    L.saveDraft(L.mergeDefaults(hist[idx].snapshot));
    renderForm();
    toast("Черновик восстановлен из истории");
  }

  function onLogin() {
    var pass = document.getElementById("admin-pass");
    var v = pass ? pass.value : "";
    if (v === L.getAdminPassword()) {
      setAuthed(true);
      showApp();
      renderForm();
      if (pass) pass.value = "";
    } else {
      toast("Неверный пароль");
    }
  }

  function onLogout() {
    setAuthed(false);
    showLogin();
  }

  function onSetPass() {
    var np = document.getElementById("admin-new-pass");
    if (!np || !np.value) {
      toast("Введите новый пароль");
      return;
    }
    L.setAdminPassword(np.value);
    np.value = "";
    toast("Пароль обновлён");
  }

  bindAdminShellUx();
  var searchEl = document.getElementById("admin-search");
  if (searchEl) searchEl.addEventListener("input", onAdminSearchInput);
  var diffBtn = document.getElementById("admin-diff-btn");
  if (diffBtn) diffBtn.addEventListener("click", onDiffClick);
  var themeBtn = document.getElementById("admin-theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      document.body.classList.toggle("admin-body--light");
      try {
        localStorage.setItem(
          "admin_theme_v1",
          document.body.classList.contains("admin-body--light") ? "light" : "dark"
        );
      } catch (eTh) {}
      syncThemeToggleLabel();
    });
  }

  document.getElementById("admin-login-btn").addEventListener("click", onLogin);
  document.getElementById("admin-pass").addEventListener("keydown", function (e) {
    if (e.key === "Enter") onLogin();
  });
  document.getElementById("admin-save-draft").addEventListener("click", onSaveDraft);
  document.getElementById("admin-publish").addEventListener("click", onPublish);
  var prevBtn = document.getElementById("admin-preview-reload");
  if (prevBtn) prevBtn.addEventListener("click", function () { setPreviewSrc(true); });
  var histBtn = document.getElementById("admin-history-restore");
  if (histBtn) histBtn.addEventListener("click", onHistoryRestore);
  var tokSave = document.getElementById("api-token-save");
  if (tokSave) tokSave.addEventListener("click", onApiTokenSave);
  var srvPush = document.getElementById("admin-server-push");
  if (srvPush) srvPush.addEventListener("click", onServerPush);
  var srvPull = document.getElementById("admin-server-pull");
  if (srvPull) srvPull.addEventListener("click", onServerPull);
  var heroUp = document.getElementById("hero-upload-btn");
  if (heroUp) heroUp.addEventListener("click", onHeroUpload);
  document.getElementById("admin-logout").addEventListener("click", onLogout);
  document.getElementById("admin-export").addEventListener("click", onExport);
  document.getElementById("admin-reset").addEventListener("click", onReset);
  document.getElementById("admin-set-pass").addEventListener("click", onSetPass);
  document.getElementById("admin-import").addEventListener("change", onImportFile);

  if (isAuthed()) {
    showApp();
    renderForm();
  } else {
    showLogin();
  }
})();
