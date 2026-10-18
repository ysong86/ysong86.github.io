/* 세종 이슈 대시보드 — 상황판 공통 위쪽 탭 줄.
   각 상황판(로그인 문 포함)이 <script src="https://ysong86.github.io/nav.js" data-site="water"></script> 로 불러온다.
   - 대문(ysong86.github.io) 안 iframe 으로 열렸으면 대문에 이미 탭 줄이 있으므로 아무것도 하지 않는다.
   - 상황판 목록을 바꿀 때는 이 파일과 대문 index.html 만 고치면 된다(NAS·상황판 재배포 불필요). */
/* 제작 표기의 사람 이름 → 프로필 링크(대문 iframe 안에서도). 하단(footer·.foot·.credit·.contact)의 글자만 바꾼다. */
(function () {
  "use strict";
  // 이름: [주소, 링크에 뜨는 설명]
  var PEOPLE = {
    "송양호": ["https://www.researchgate.net/profile/Yangho-Song", "ResearchGate"],
    "안용준": ["https://www.facebook.com/ayj826", "Facebook"]
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

(function () {
  "use strict";
  var me = document.currentScript;
  try { if (window.top !== window.self) return; } catch (e) { return; }
  var SITE = (me && me.getAttribute("data-site")) || "";
  var HOME = "https://ysong86.github.io/";
  var D = [
    {id: "zone", title: "생활권 재구조화 상황판", lock: true},
    {id: "vacant", title: "상가공실 상황판", lock: true},
    {id: "fire", title: "화재안전 상황판", lock: true},
    {id: "water", title: "물환경 상황판"},
    {id: "traffic", title: "교통안전 상황판"}
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
    ":root{--sjnav-bg:#ffffffef;--sjnav-line:#D6DDD9;--sjnav-ink:#15232A;--sjnav-ink2:#4B5B62;--sjnav-hover:#EEF1EF;--sjnav-on:#fff}" +
    "@media (prefers-color-scheme: dark){:root:not([data-theme=light]){--sjnav-bg:#152125ef;--sjnav-line:#2B3B40;--sjnav-ink:#E3ECEA;--sjnav-ink2:#A4B4B4;--sjnav-hover:#1F2D31;--sjnav-on:#0E1619}}" +
    ":root[data-theme=dark]{--sjnav-bg:#152125ef;--sjnav-line:#2B3B40;--sjnav-ink:#E3ECEA;--sjnav-ink2:#A4B4B4;--sjnav-hover:#1F2D31;--sjnav-on:#0E1619}" +
    "@media (max-width:640px){.sjnav{padding:6px 8px}.sjnav a{padding:5px 8px;font-size:12.5px}}";
  function mount() {
    if (document.querySelector(".sjnav")) return;
    var st = document.createElement("style");
    st.textContent = css;
    document.head.appendChild(st);
    var nav = document.createElement("nav");
    nav.className = "sjnav";
    nav.setAttribute("aria-label", "세종 이슈 대시보드 상황판 전환");
    var h = '<a class="sjh" href="' + HOME + '">← 세종 이슈 대시보드</a><div class="sjt">';
    D.forEach(function (d) {
      // 다른 상황판은 대문의 한 화면 보기(#/id)로 연다 — 탭을 오가도 로그인이 유지된다
      h += '<a href="' + HOME + '#/' + d.id + '"' + (d.id === SITE ? ' class="on" aria-current="page"' : "") + ">" +
           d.title + (d.lock ? '<span class="lk" title="비밀번호">🔒</span>' : "") + "</a>";
    });
    nav.innerHTML = h + "</div>";
    document.body.insertBefore(nav, document.body.firstChild);
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
