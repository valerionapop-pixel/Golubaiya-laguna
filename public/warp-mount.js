/**
 * Paper Design Warp — фон хиро. Файл .js (не .mjs): многие серверы отдают .mjs как application/octet-stream.
 * Нужен HTTP(S), не file://
 */
function waitLayout() {
  return new Promise(function (resolve) {
    function done() {
      requestAnimationFrame(function () {
        requestAnimationFrame(resolve);
      });
    }
    if (document.readyState === "complete") done();
    else window.addEventListener("load", done, { once: true });
  });
}

async function loadShim() {
  var a = await import("https://esm.sh/react@18.3.1");
  var b = await import("https://esm.sh/react-dom@18.3.1/client?deps=react@18.3.1");
  var c = await import("https://esm.sh/@paper-design/shaders-react@0.0.57?deps=react@18.3.1,react-dom@18.3.1");
  return { React: a.default, createRoot: b.createRoot, Warp: c.Warp };
}

/* jsDelivr-сборка шейдера тянет react 19.x — те же версии, иначе «Invalid hook call». */
async function loadJsdelivr() {
  var a = await import("https://cdn.jsdelivr.net/npm/react@19.2.0/+esm");
  var b = await import("https://cdn.jsdelivr.net/npm/react-dom@19.2.0/client/+esm");
  var c = await import("https://cdn.jsdelivr.net/npm/@paper-design/shaders-react@0.0.57/+esm");
  return { React: a.default, createRoot: b.createRoot, Warp: c.Warp };
}

async function main() {
  var el = document.getElementById("warp-root");
  if (!el) return;

  var reduce = false;
  try {
    reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e0) {
    /* ignore */
  }
  if (reduce) {
    el.classList.add("hero__warp--reduced");
    return;
  }

  await waitLayout();

  var React;
  var createRoot;
  var Warp;
  try {
    var d = await loadShim();
    React = d.React;
    createRoot = d.createRoot;
    Warp = d.Warp;
  } catch (e1) {
    try {
      var d2 = await loadJsdelivr();
      React = d2.React;
      createRoot = d2.createRoot;
      Warp = d2.Warp;
    } catch (e2) {
      el.classList.add("hero__warp--fallback");
      try {
        console.warn("[Голубая лагуна] Warp не загрузился (сеть/CDN). Показан запасной фон.", e2);
      } catch (e3) {
        /* ignore */
      }
      return;
    }
  }

  if (!Warp) {
    el.classList.add("hero__warp--fallback");
    return;
  }

  var root = createRoot(el);
  root.render(
    React.createElement(Warp, {
      style: { width: "100%", height: "100%", display: "block" },
      proportion: 0.45,
      softness: 1,
      distortion: 0.25,
      swirl: 0.8,
      swirlIterations: 10,
      shape: "checks",
      shapeScale: 0.1,
      scale: 1,
      rotation: 0,
      speed: 1,
      colors: [
        "hsl(203, 100%, 62%)",
        "hsl(255, 100%, 72%)",
        "hsl(158, 99%, 59%)",
        "hsl(264, 100%, 61%)",
      ],
    })
  );
}

main().catch(function (err) {
  var el = document.getElementById("warp-root");
  if (el) el.classList.add("hero__warp--fallback");
  try {
    console.warn("[Голубая лагуна] Ошибка фона:", err);
  } catch (e) {
    /* ignore */
  }
});
