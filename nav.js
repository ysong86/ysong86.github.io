/* 세종 읽기 — 읽기 공통 위쪽 탭 줄.
   각 읽기(로그인 문 포함)이 <script src="https://ysong86.github.io/nav.js" data-site="water"></script> 로 불러온다.
   - 대문(ysong86.github.io) 안 iframe 으로 열렸으면 대문에 이미 탭 줄이 있으므로 아무것도 하지 않는다.
   - 읽기 목록을 바꿀 때는 이 파일과 대문 index.html 만 고치면 된다(NAS·읽기 재배포 불필요). */
/* 제작 표기의 사람 이름 → 프로필 링크(대문 iframe 안에서도). 하단(footer·.foot·.credit·.contact)의 글자만 바꾼다. */
(function () {
  "use strict";
  // 이름: [주소, 링크에 뜨는 설명]
  var PEOPLE = {
    "송양호": ["https://www.researchgate.net/profile/Yangho-Song", "ResearchGate"],
    "안용준": ["https://www.facebook.com/ayj826", "Facebook"],
    "이재민": ["https://www.facebook.com/profile.php?id=100001785791011", "Facebook"]
  };
  var RE = new RegExp("(" + Object.keys(PEOPLE).join("|") + ")", "g");
  function link() {
    var boxes = document.querySelectorAll("footer, .foot, .credit, .contact");
    Array.prototype.forEach.call(boxes, function (box) {
      var w = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, null), nodes = [], n;
      while ((n = w.nextNode())) nodes.push(n);
      nodes.forEach(function (t) {
        if (!t.parentNode || t.parentNode.closest("a, script, style")) return;
        RE.lastIndex = 0;
        if (!RE.test(t.nodeValue)) return;
        // 한 줄에 이름이 여럿이어도(예: 안용준 센터장 · 송양호 …) 한 번에 나눠 감싼다
        var frag = document.createDocumentFragment();
        t.nodeValue.split(RE).forEach(function (p) {
          if (!p) return;
          if (PEOPLE[p]) {
            var a = document.createElement("a");
            a.href = PEOPLE[p][0]; a.target = "_blank"; a.rel = "noopener"; a.textContent = p;
            a.title = p + " — " + PEOPLE[p][1]; a.style.color = "inherit";
            frag.appendChild(a);
          } else frag.appendChild(document.createTextNode(p));
        });
        t.parentNode.replaceChild(frag, t);
      });
    });
  }
  if (document.readyState !== "loading") link();
  document.addEventListener("DOMContentLoaded", link);
})();

/* 읽기마다 다른 탭 줄(.tabs·.ptabs·.sf-tabs·.sw-tabs·.sh-tabs)을 같은 모양으로 강조한다 — 음영 띠 + 고른 탭 채움.
   iframe 안(대문 한 화면 보기)에서도 적용해야 해서 맨 앞 블록과 같이 창 위치를 가리지 않는다. */
(function () {
  "use strict";
  if (document.getElementById("sjtab-css")) return;
  var st = document.createElement("style");
  st.id = "sjtab-css";
  st.textContent = ":root{--sjtab-band:#E9EDF1;--sjtab-chip:#ffffffcc;--sjtab-line:#CDD5DC;--sjtab-ink:#2A3640;--sjtab-on:#1B3F7A;--sjtab-onink:#fff}@media (prefers-color-scheme: dark){:root:not([data-theme=light]){--sjtab-band:#1A2328;--sjtab-chip:#ffffff10;--sjtab-line:#33424A;--sjtab-ink:#C9D4D8;--sjtab-on:#8EA9F0;--sjtab-onink:#0E1619}}:root[data-theme=dark]{--sjtab-band:#1A2328;--sjtab-chip:#ffffff10;--sjtab-line:#33424A;--sjtab-ink:#C9D4D8;--sjtab-on:#8EA9F0;--sjtab-onink:#0E1619}:is(nav.tabs,.ptabs,.sf-tabs,.sw-tabs,.sh-tabs,div.tabs[role=tablist]){background:var(--sjtab-band)!important;border:1px solid var(--sjtab-line)!important;border-radius:12px!important;padding:6px!important;gap:6px!important;box-shadow:inset 0 1px 2px #0000000d!important}:is(nav.tabs>.tab,.ptabs>.ptab,.sf-tabs>*,.sw-tabs>*,.sh-tabs>*,div.tabs[role=tablist]>*){background:var(--sjtab-chip)!important;border:1px solid var(--sjtab-line)!important;border-radius:9px!important;color:var(--sjtab-ink)!important;margin:0!important;transition:background .15s,box-shadow .15s!important}:is(nav.tabs>.tab,.ptabs>.ptab,.sf-tabs>*,.sw-tabs>*,.sh-tabs>*,div.tabs[role=tablist]>*):hover{box-shadow:0 1px 4px #0000001f!important}:is(nav.tabs>.tab,.ptabs>.ptab,.sf-tabs>*,.sw-tabs>*,.sh-tabs>*,div.tabs[role=tablist]>*):is(.on,.active,[aria-selected=true]){background:var(--sjtab-on)!important;border-color:var(--sjtab-on)!important;color:var(--sjtab-onink)!important;box-shadow:0 2px 6px #1b3f7a40!important}:is(nav.tabs>.tab,.ptabs>.ptab,.sf-tabs>*,.sw-tabs>*,.sh-tabs>*,div.tabs[role=tablist]>*):is(.on,.active,[aria-selected=true]) *{color:inherit!important;opacity:.92}";
  (document.head || document.documentElement).appendChild(st);
})();

/* 화면 밝기 — 모든 읽기 공통. 고른 값은 localStorage 'sejong_theme'(light|dark, 없으면 기기 설정)에 두고
   대문·읽기·iframe 이 같은 출처라 함께 따라간다(storage 이벤트).
   읽기마다 CSS 가 달라서(@media prefers-color-scheme 만 쓰는 곳, data-theme 를 쓰는 곳) 둘 다 맞춘다:
   html 에 data-theme 를 달고, 문서의 '(prefers-color-scheme: dark|light)' 미디어 규칙을 고른 쪽으로 켜고 끈다.
   다크 규칙이 하나도 없는 페이지(디지털트윈 실험실)는 버튼을 숨긴다. */
(function () {
  "use strict";
  var KEY = "sejong_theme", mq = window.matchMedia ? matchMedia("(prefers-color-scheme: dark)") : null;
  var DARK = "(prefers-color-scheme: dark)", LIGHT = "(prefers-color-scheme: light)", ON = "(min-width: 0px)", OFF = "(max-width: 0px)";
  var found = false, hadAttr = document.documentElement.getAttribute("data-theme");
  // 잠금이 풀리며 문서를 새로 쓰면 다시 불린다 — 그때마다 지금 문서를 기준으로 한다
  function pref() { try { var v = localStorage.getItem(KEY); return v === "light" || v === "dark" ? v : null; } catch (e) { return null; } }
  function isDark() { var p = pref(); if (p) return p === "dark"; var a = document.documentElement.getAttribute("data-theme"); if (a === "dark" || a === "light") return a === "dark"; return !!(mq && mq.matches); }
  function walk(rules, p, own) {
    for (var i = 0; rules && i < rules.length; i++) {
      var r = rules[i];
      if (r.media && r.cssRules) {
        if (r.__sjo == null) {
          var t = r.media.mediaText.replace(/\s+/g, " ");
          if (t.indexOf("prefers-color-scheme") < 0) { walk(r.cssRules, p, own); continue; }
          r.__sjo = r.media.mediaText;
        }
        if (!own) found = true;
        var o = r.__sjo.replace(/\(\s*prefers-color-scheme\s*:\s*(dark|light)\s*\)/g, function (_, k) { return "(prefers-color-scheme: " + k + ")"; });
        var n = !p ? o : o.split(DARK).join(p === "dark" ? ON : OFF).split(LIGHT).join(p === "light" ? ON : OFF);
        if (r.media.mediaText !== n) r.media.mediaText = n;
        walk(r.cssRules, p, own);
      }
    }
  }
  function apply() {
    var p = pref();
    if (p) document.documentElement.setAttribute("data-theme", p);
    else if (hadAttr) document.documentElement.setAttribute("data-theme", hadAttr); else document.documentElement.removeAttribute("data-theme");
    for (var i = 0; i < document.styleSheets.length; i++) {
      var s = document.styleSheets[i], own = !!(s.ownerNode && /^sj(tab|nav)-css$/.test(s.ownerNode.id || ""));
      try { walk(s.cssRules, p, own); } catch (e) { /* 다른 출처(글꼴) 시트는 건너뛴다 */ }
    }
    if (/\[data-theme/.test(Array.prototype.map.call(document.querySelectorAll("style"), function (x) { return x.id === "sjtab-css" || x.id === "sjnav-css" ? "" : x.textContent; }).join(""))) found = true;
    var b = document.querySelectorAll(".sjtheme");
    for (var j = 0; j < b.length; j++) {
      b[j].style.display = found ? "" : "none";
      b[j].textContent = isDark() ? "☀ 밝게" : "☾ 어둡게";
      b[j].title = isDark() ? "밝은 화면으로 보기" : "어두운 화면으로 보기";
    }
  }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} apply(); }
  var tmr = null;
  function later() { clearTimeout(tmr); tmr = setTimeout(apply, 30); }
  window.__sjTheme = { refresh: apply, toggle: function () { set(isDark() ? "light" : "dark"); }, isDark: isDark };
  apply();
  document.addEventListener("DOMContentLoaded", apply);
  addEventListener("load", apply);
  addEventListener("storage", function (e) { if (e.key === KEY) apply(); });
  if (mq && mq.addEventListener) mq.addEventListener("change", apply);
  // 잠금이 풀리거나 화면이 새 <style> 을 붙이면 다시 맞춘다
  try { new MutationObserver(function (ms) { for (var i = 0; i < ms.length; i++) for (var k = 0; k < ms[i].addedNodes.length; k++) { var n = ms[i].addedNodes[k]; if (n.nodeName === "STYLE" || n.nodeName === "LINK" || (n.querySelector && n.querySelector("style,link"))) { later(); return; } } }).observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}
})();

(function () {
  "use strict";
  var me = document.currentScript;
  if (me && me.hasAttribute("data-theme-only")) return;   // 대문: 밝기만 쓰고 탭 줄은 달지 않는다
  try { if (window.top !== window.self) return; } catch (e) { return; }
  var SITE = (me && me.getAttribute("data-site")) || "";
  var HOME = "https://ysong86.github.io/";
  var D = [
    {id: "lab", title: "디지털트윈 실험실"},
    {id: "zone", title: "생활권 읽기", lock: true},
    {id: "balance", title: "읍면 균형성장 읽기", lock: true},
    {id: "vacant", title: "상가공실 읽기", lock: true},
    {id: "industry", title: "산업과 일자리 읽기", lock: true},
    {id: "emptyhouse", title: "빈집 읽기", lock: true},
    {id: "lifelong", title: "평생학습 읽기"},
    {id: "fire", title: "지역안전 읽기", lock: true},
    {id: "heritage", title: "국가유산 읽기"},
    {id: "water", title: "물환경 읽기"},
    {id: "eia", title: "개발과 환경 읽기"},
    {id: "energy", title: "에너지 읽기", lock: true},
    {id: "traffic", title: "교통안전 읽기"}
  ];
  var css =
    ".sjnav{all:initial;display:flex;align-items:center;gap:6px;padding:7px 12px;box-sizing:border-box;width:100%;" +
    "font-family:'IBM Plex Sans KR','Malgun Gothic',system-ui,sans-serif;font-size:13px;line-height:1.3;" +
    "background:var(--sjnav-bg);border-bottom:1px solid var(--sjnav-line);color:var(--sjnav-ink);position:relative;z-index:50}" +
    ".sjnav *{box-sizing:border-box;font-family:inherit}" +
    ".sjnav a{color:inherit;text-decoration:none;white-space:nowrap;border-radius:7px;padding:6px 11px;font-weight:600;border:1px solid transparent}" +
    ".sjnav a:hover{background:var(--sjnav-hover)}" +
    ".sjnav .sjh{color:var(--sjnav-ink2);font-weight:600}" +
    ".sjnav .sjt{display:flex;gap:4px;overflow-x:auto;flex:1;scrollbar-width:none}" +
    ".sjnav .sjt::-webkit-scrollbar{display:none}" +
    ".sjnav .sjt a{color:var(--sjnav-ink2)}" +
    ".sjnav .sjt a.on{background:var(--sjnav-on);border-color:var(--sjnav-line);color:var(--sjnav-ink)}" +
    ".sjnav .lk{font-size:11px;margin-left:3px;opacity:.75}" +
    ".sjnav .sjtheme{all:unset;flex:none;cursor:pointer;white-space:nowrap;font-size:12.5px;font-weight:600;padding:5px 11px;border-radius:999px;" +
    "border:1px solid var(--sjnav-line);color:var(--sjnav-ink);background:var(--sjnav-on)}" +
    ".sjnav .sjtheme:hover{background:var(--sjnav-hover)}.sjnav .sjtheme:focus-visible{outline:2px solid #1B3F7A;outline-offset:2px}" +
    ":root{--sjnav-bg:#ffffffef;--sjnav-line:#D6DDD9;--sjnav-ink:#15232A;--sjnav-ink2:#4B5B62;--sjnav-hover:#EEF1EF;--sjnav-on:#fff}" +
    "@media (prefers-color-scheme: dark){:root:not([data-theme=light]){--sjnav-bg:#152125ef;--sjnav-line:#2B3B40;--sjnav-ink:#E3ECEA;--sjnav-ink2:#A4B4B4;--sjnav-hover:#1F2D31;--sjnav-on:#0E1619}}" +
    ":root[data-theme=dark]{--sjnav-bg:#152125ef;--sjnav-line:#2B3B40;--sjnav-ink:#E3ECEA;--sjnav-ink2:#A4B4B4;--sjnav-hover:#1F2D31;--sjnav-on:#0E1619}" +
    "@media (max-width:640px){.sjnav{padding:6px 8px}.sjnav a{padding:5px 8px;font-size:12.5px}}";
  function mount() {
    if (document.querySelector(".sjnav")) return;
    var st = document.createElement("style");
    st.id = "sjnav-css";
    st.textContent = css;
    document.head.appendChild(st);
    var nav = document.createElement("nav");
    nav.className = "sjnav";
    nav.setAttribute("aria-label", "세종 읽기 전환");
    var h = '<a class="sjh" href="' + HOME + '">← 세종 읽기</a><div class="sjt">';
    D.forEach(function (d) {
      // 다른 읽기는 대문의 한 화면 보기(#/id)로 연다 — 탭을 오가도 로그인이 유지된다
      h += '<a href="' + HOME + '#/' + d.id + '"' + (d.id === SITE ? ' class="on" aria-current="page"' : "") + ">" +
           d.title + (d.lock ? '<span class="lk" title="비밀번호">🔒</span>' : "") + "</a>";
    });
    nav.innerHTML = h + '</div><button type="button" class="sjtheme"></button>';
    document.body.insertBefore(nav, document.body.firstChild);
    nav.querySelector(".sjtheme").addEventListener("click", function () { window.__sjTheme && window.__sjTheme.toggle(); });
    if (window.__sjTheme) window.__sjTheme.refresh();
    // 로그인 문처럼 body 가 flex(가운데 정렬)인 페이지에서는 탭 줄이 가로 배치의 한 칸이 되어
    // 가운데에 뜨고 상자를 옆으로 민다 → 맨 위에 고정하고 그 높이만큼 본문을 내린다.
    var bd = getComputedStyle(document.body).display;
    if (bd.indexOf("flex") >= 0 || bd.indexOf("grid") >= 0) {
      nav.style.position = "fixed";
      nav.style.top = "0";
      nav.style.left = "0";
      nav.style.right = "0";
      var pad = function () { document.body.style.paddingTop = nav.offsetHeight + "px"; document.body.style.boxSizing = "border-box"; };
      pad();
      addEventListener("resize", pad);
    }
  }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
  // 로그인 문이 풀리면서 문서를 통째로 다시 쓰면 탭 줄이 사라진다 → 다시 단다
  document.addEventListener("DOMContentLoaded", mount);
})();
