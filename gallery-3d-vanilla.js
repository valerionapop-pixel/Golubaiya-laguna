/**
 * 3D «stellar» галерея карточек на чистом Three.js (без npm-сборки).
 * Те же URL картинок и поведение, что в примере с React/R3F.
 */
import * as THREE from "three";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js";

var CARDS_FALLBACK = [
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

function resolveGalleryCards() {
  try {
    var L = typeof window !== "undefined" ? window.LagunaSiteOverrides : null;
    if (!L || !L.getMergedForSite) return null;
    var d = L.getMergedForSite();
    if (d.gallery && Array.isArray(d.gallery.cards) && d.gallery.cards.length && L.normalizeGalleryCards) {
      return L.normalizeGalleryCards(d.gallery.cards);
    }
  } catch (e) {
    /* ignore */
  }
  return null;
}

var CARDS = resolveGalleryCards() || CARDS_FALLBACK;

function fibonacciPositions(n) {
  var out = [];
  var goldenRatio = (1 + Math.sqrt(5)) / 2;
  for (var i = 0; i < n; i++) {
    var denom = n > 1 ? n - 1 : 1;
    var y = 1 - (i / denom) * 2;
    var radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    var theta = (2 * Math.PI * i) / goldenRatio;
    var x = Math.cos(theta) * radiusAtY;
    var z = Math.sin(theta) * radiusAtY;
    var layerRadius = 12 + (i % 3) * 4;
    out.push(new THREE.Vector3(x * layerRadius, y * layerRadius, z * layerRadius));
  }
  return out;
}

function buildStarfield(scene) {
  var geo = new THREE.BufferGeometry();
  var count = 8000;
  var pos = new Float32Array(count * 3);
  for (var i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 2000;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 2000;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 2000;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  var mat = new THREE.PointsMaterial({
    color: 0xfff0f8,
    size: 0.55,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.72,
  });
  var pts = new THREE.Points(geo, mat);
  scene.add(pts);
  return pts;
}

function wireSphere(parent, r, opacity, hexColor) {
  var g = new THREE.SphereGeometry(r, 32, 32);
  var m = new THREE.MeshStandardMaterial({
    color: hexColor != null ? hexColor : 0x5ee0ff,
    wireframe: true,
    transparent: true,
    opacity: opacity,
  });
  var mesh = new THREE.Mesh(g, m);
  parent.add(mesh);
}

function openModal(card) {
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  var existing = document.querySelector(".gallery-3d-modal-backdrop");
  if (existing) existing.remove();

  var backdrop = document.createElement("div");
  backdrop.className = "gallery-3d-modal-backdrop";
  backdrop.setAttribute("role", "dialog");
  backdrop.setAttribute("aria-modal", "true");
  backdrop.innerHTML =
    '<div class="gallery-3d-modal-inner">' +
    '<button type="button" class="gallery-3d-modal-close" aria-label="Закрыть">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
    "</button>" +
    '<div style="perspective:1000px;width:100%">' +
    '<div class="gallery-3d-modal-card">' +
    '<div class="gallery-3d-modal-img-wrap"><img loading="lazy" alt="' +
    escapeAttr(card.alt) +
    '" src="' +
    escapeAttr(card.imageUrl) +
    '"/></div>' +
    "<h3>" +
    escapeHtml(card.title) +
    "</h3>" +
    '<div class="gallery-3d-modal-actions">' +
    '<button type="button" class="gallery-3d-btn-primary" aria-label="Скачать">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>' +
    "<span>Скачать</span></button>" +
    '<button type="button" class="gallery-3d-btn-icon gallery-3d-fav" aria-label="В избранное">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
    "</button></div></div></div></div>";

  document.body.appendChild(backdrop);

  var cardEl = backdrop.querySelector(".gallery-3d-modal-card");
  var fav = backdrop.querySelector(".gallery-3d-fav");
  var favOn = false;
  var dlBtn = backdrop.querySelector(".gallery-3d-btn-primary");

  if (dlBtn) {
    dlBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      try {
        var a = document.createElement("a");
        a.href = card.imageUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.setAttribute("download", "");
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (err) {
        window.open(card.imageUrl, "_blank", "noopener,noreferrer");
      }
    });
  }

  backdrop.querySelector(".gallery-3d-modal-close").addEventListener("click", close);
  backdrop.addEventListener("click", function (e) {
    if (e.target === backdrop) close();
  });

  function close() {
    backdrop.remove();
    document.removeEventListener("keydown", onKey);
  }
  function onKey(e) {
    if (e.key === "Escape") close();
  }
  document.addEventListener("keydown", onKey);

  if (cardEl) {
    cardEl.addEventListener("mousemove", function (e) {
      var rect = cardEl.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var cx = rect.width / 2;
      var cy = rect.height / 2;
      var rx = (y - cy) / 15;
      var ry = (cx - x) / 15;
      cardEl.style.transition = "transform 0.05s linear";
      cardEl.style.transform = "perspective(1000px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
    });
    cardEl.addEventListener("mouseleave", function () {
      cardEl.style.transition = "transform 0.5s ease-out";
      cardEl.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    });
  }

  if (fav) {
    fav.addEventListener("click", function (e) {
      e.stopPropagation();
      favOn = !favOn;
      var svg = fav.querySelector("svg path");
      if (svg) fav.setAttribute("aria-label", favOn ? "Убрать из избранного" : "В избранное");
      fav.style.opacity = favOn ? "1" : "";
      if (svg) svg.setAttribute("fill", favOn ? "currentColor" : "none");
    });
  }
}

function init(root) {
  if (!root) return;

  var reduce = false;
  try {
    reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}

  root.innerHTML = "";
  var shell = document.createElement("div");
  shell.className = "gallery-3d-shell";

  var canvas = document.createElement("canvas");
  canvas.className = "gallery-3d__webgl";

  shell.appendChild(canvas);
  root.appendChild(shell);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 2000);
  camera.position.set(0, 0, 15);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  /* Согласовано с --ink / --rose-deep: тёмный фон с лёгким винным тоном */
  renderer.setClearColor(0x120a14, 1);

  var controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 5;
  controls.maxDistance = 40;
  controls.rotateSpeed = 0.5;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.target.set(0, 0, 0);

  var ambient = new THREE.AmbientLight(0xe8d4e8, 0.36);
  scene.add(ambient);
  var pl1 = new THREE.PointLight(0xfff4f8, 0.55, 200, 2);
  pl1.position.set(10, 10, 10);
  scene.add(pl1);
  var pl2 = new THREE.PointLight(0x5ee0ff, 0.28, 200, 2);
  pl2.position.set(-12, -8, -10);
  scene.add(pl2);
  var pl3 = new THREE.PointLight(0xc94b8f, 0.16, 180, 2);
  pl3.position.set(0, -14, 12);
  scene.add(pl3);

  var accent = 0x5ee0ff;
  var stars = buildStarfield(scene);
  /** Медленный общий поворот карточек и проволочных сфер (по часовой стрелке сверху) */
  var orbitGroup = new THREE.Group();
  scene.add(orbitGroup);
  wireSphere(orbitGroup, 2, 0.14, 0x3d1528);
  wireSphere(orbitGroup, 12, 0.05, accent);
  wireSphere(orbitGroup, 16, 0.03, accent);
  wireSphere(orbitGroup, 20, 0.02, accent);
  var orbitClock = new THREE.Clock();
  /** рад/с: отрицательное rotation.y — по часовой стрелке при виде сверху */
  var orbitSpeed = 0.055;

  function applyGalleryLighting(isParty) {
    if (isParty) {
      renderer.setClearColor(0x1a0818, 1);
      ambient.intensity = 0.22;
      pl1.intensity = 0.9;
      pl1.color.set(0xffb8e8);
      pl2.intensity = 0.5;
      pl3.intensity = 0.42;
      if (stars.material) {
        stars.material.opacity = 0.94;
        stars.material.size = 0.68;
      }
      orbitSpeed = 0.098;
    } else {
      renderer.setClearColor(0x120a14, 1);
      ambient.intensity = 0.36;
      pl1.intensity = 0.55;
      pl1.color.set(0xfff4f8);
      pl2.intensity = 0.28;
      pl3.intensity = 0.16;
      if (stars.material) {
        stars.material.opacity = 0.72;
        stars.material.size = 0.55;
      }
      orbitSpeed = 0.055;
    }
  }

  if (!reduce) {
    var toolbar = document.createElement("div");
    toolbar.className = "gallery-3d-toolbar";
    toolbar.setAttribute("role", "toolbar");
    toolbar.setAttribute("aria-label", "Режим подсветки галереи");
    toolbar.innerHTML =
      '<span class="gallery-3d-toolbar__lab">Свет</span>' +
      '<button type="button" class="gallery-3d-toolbar__btn is-active" data-gallery-mode="calm">Спокойно</button>' +
      '<button type="button" class="gallery-3d-toolbar__btn" data-gallery-mode="party">Вечеринка</button>';
    shell.appendChild(toolbar);
    toolbar.addEventListener("click", function (ev) {
      var b = ev.target && ev.target.closest ? ev.target.closest("button[data-gallery-mode]") : null;
      if (!b) return;
      var mode = b.getAttribute("data-gallery-mode");
      var btns = toolbar.querySelectorAll(".gallery-3d-toolbar__btn");
      for (var bi = 0; bi < btns.length; bi++) {
        btns[bi].classList.toggle("is-active", btns[bi] === b);
      }
      applyGalleryLighting(mode === "party");
    });
  }

  var positions = fibonacciPositions(CARDS.length);
  var cardGroups = [];
  var pickMeshes = [];
  var loader = new THREE.TextureLoader();
  loader.setCrossOrigin("anonymous");

  var raycaster = new THREE.Raycaster();
  var pointer = new THREE.Vector2();
  var hovered = null;

  function setSize() {
    var w = Math.max(shell.clientWidth, 2);
    var h = Math.max(shell.clientHeight, 2);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  var ro = new ResizeObserver(setSize);
  ro.observe(shell);
  setSize();

  var loadPromises = CARDS.map(function (card, i) {
    return new Promise(function (resolve) {
      loader.load(
        card.imageUrl,
        function (tex) {
          if (THREE.SRGBColorSpace !== undefined) tex.colorSpace = THREE.SRGBColorSpace;
          var gw = 4.5;
          var gh = 6;
          var geo = new THREE.PlaneGeometry(gw, gh);
          var mat = new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            side: THREE.DoubleSide,
          });
          var mesh = new THREE.Mesh(geo, mat);
          mesh.userData.card = card;

          var hitGeo = new THREE.PlaneGeometry(gw * 1.02, gh * 1.02);
          var hitMat = new THREE.MeshBasicMaterial({ visible: false });
          var hit = new THREE.Mesh(hitGeo, hitMat);
          hit.userData.card = card;

          var group = new THREE.Group();
          group.position.copy(positions[i]);
          group.add(hit);
          group.add(mesh);
          mesh.position.z = 0.02;

          orbitGroup.add(group);
          cardGroups.push({ group: group, mesh: mesh, hit: hit, card: card });
          pickMeshes.push(hit);
          resolve();
        },
        undefined,
        function () {
          var gw = 4.5;
          var gh = 6;
          var geo = new THREE.PlaneGeometry(gw, gh);
          var mat = new THREE.MeshBasicMaterial({
            color: 0x261428,
            transparent: true,
            opacity: 0.94,
            side: THREE.DoubleSide,
          });
          var mesh = new THREE.Mesh(geo, mat);
          mesh.userData.card = card;
          var hitGeo = new THREE.PlaneGeometry(gw * 1.02, gh * 1.02);
          var hitMat = new THREE.MeshBasicMaterial({ visible: false });
          var hit = new THREE.Mesh(hitGeo, hitMat);
          hit.userData.card = card;
          var group = new THREE.Group();
          group.position.copy(positions[i]);
          group.add(hit);
          group.add(mesh);
          mesh.position.z = 0.02;
          orbitGroup.add(group);
          cardGroups.push({ group: group, mesh: mesh, hit: hit, card: card });
          pickMeshes.push(hit);
          resolve();
        }
      );
    });
  });

  Promise.all(loadPromises).then(function () {
    /* готово */
  });

  function onPointerMove(ev) {
    var rect = canvas.getBoundingClientRect();
    pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    var hits = raycaster.intersectObjects(pickMeshes, false);
    if (hovered) {
      hovered.scale.setScalar(1);
      hovered = null;
      document.body.style.cursor = "";
    }
    if (hits.length) {
      var m = hits[0].object;
      m.parent.scale.setScalar(1.14);
      hovered = m.parent;
      document.body.style.cursor = "pointer";
    }
  }

  function onPointerDown(ev) {
    var rect = canvas.getBoundingClientRect();
    pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    var hits = raycaster.intersectObjects(pickMeshes, false);
    if (hits.length && hits[0].object.userData.card) {
      openModal(hits[0].object.userData.card);
    }
  }

  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointerleave", function () {
    if (hovered) {
      hovered.scale.setScalar(1);
      hovered = null;
    }
    document.body.style.cursor = "";
  });

  function tick() {
    var dt = orbitClock.getDelta();
    if (!reduce) {
      stars.rotation.y += 0.00012;
      stars.rotation.x += 0.00006;
      orbitGroup.rotation.y -= dt * orbitSpeed;
    }
    for (var i = 0; i < cardGroups.length; i++) {
      cardGroups[i].group.lookAt(camera.position);
    }
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

var mount = document.getElementById("gallery-3d-root");
if (mount) {
  try {
    init(mount);
  } catch (err) {
    console.error("[gallery-3d]", err);
    mount.innerHTML =
      '<p class="gallery-3d-fallback-msg" role="alert">3D-галерея не запустилась. Откройте сайт по адресу http://localhost (не file://) и обновите страницу.</p>';
  }
}
