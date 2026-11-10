/* 세종 읽기 대문 — 한국어 / English 전환.
   대문 코드는 그대로 두고, 화면에 보이는 글자만 바꾼다(다시 그려지는 카드·탭도 따라 바꾼다).
   각 읽기 안쪽 화면은 한국어 그대로다. 선택은 이 브라우저에 기억하고, ?lang=en 으로 바로 열 수도 있다. */
(function () {
  "use strict";
  var EN = {
    // 머리·소개
    "세종 읽기": "Reading Sejong",
    "세종연구원 연구자들의 작은 연구모임에서 던진 질문들을, 공공데이터와 쌓아 온 연구 자료로 하나씩 풀어 가는 세종 읽기입니다. 함께 던진 질문에서 출발해 조금씩 답을 찾아가는 중입니다. 목록을 누르면 이 화면 안에서 바로 열리고, 위쪽 탭으로 다른 읽기를 오갈 수 있습니다.":
      "Reading Sejong takes questions raised in a small study group of Sejong Research Institute researchers and works through them one by one with public data and our own research. We start from shared questions and are still finding the answers. Click a card to open it right here, and use the tabs at the top to move between readings.",
    "연구원의 공식 업무가 아닌, 참여 연구자들의 호기심과 재미에서 시작한 작업입니다. 결과물은 참고용으로 봐 주세요.":
      "This is not official work of the Institute. It grew out of the curiosity and enjoyment of the researchers involved, so please treat the results as reference only.",
    "읽기": "Readings", "공개": "Open", "비밀번호": "Password",
    // 조례 찾기
    "세종 조례 찾기": "Sejong Ordinance Finder",
    "세종 조례 847건을 다른 15개 광역시도의 같은 조례와 나란히 비교합니다.": "Compares Sejong's 847 ordinances side by side with the matching ordinances of the other 15 metropolitan cities and provinces.",
    "찾기 →": "Search →", "교통": "Transport", "주민자치": "Self-governance", "건축": "Building", "주차": "Parking", "하천": "Rivers",
    "다른 시도엔 있고 세종엔 없는 조례": "Ordinances other regions have but Sejong does not",
    "키워드 (예: 교통, 주민자치, 건축)": "Keyword in Korean (e.g. 교통, 주민자치, 건축)", "조례 키워드": "Ordinance keyword",
    // 목록
    "읽기 목록": "Readings", "분야": "Field", "쪽 넘기기": "Pages", "앞 쪽": "Previous page", "다음 쪽": "Next page",
    "전체": "All", "도시·공간": "City & Space", "경제·생활": "Economy & Daily Life", "안전": "Safety", "문화·환경": "Culture & Environment", "기타": "Other",
    "관계기관 요청 · 공동작업 진행 중": "Joint work with partner agencies",
    // 종이비행기
    "고민은 잠시 접어 두고, 종이비행기 날리시죠!": "Set your worries aside for a moment and fly a paper plane!",
    "✈ 날리러 가기 →": "✈ Let's fly →",
    // 다음 이슈 제안
    "다음 이슈를 준비하고 있습니다": "Preparing the next issue",
    "데이터로 들여다보고 싶은 세종의 현안이 있나요? 주제와 함께 쓸 만한 자료를 알려 주시면 다음 읽기를 고르는 데 반영합니다. 읽기 제작 협업 문의도 환영합니다.":
      "Is there a Sejong issue you would like to see through data? Tell us the topic and any useful data, and we will consider it when choosing the next reading. Inquiries about working together are welcome too.",
    "주제 예시(누르면 채워집니다)": "Example topics (click to fill in)",
    "인구 이동·정주": "Migration & settlement", "대기질·폭염": "Air quality & heat waves", "BRT·대중교통": "BRT & public transit",
    "공공기관 이전": "Public agency relocation", "빈집·노후주택": "Vacant & aging housing", "관광·방문객": "Tourism & visitors",
    "보고 싶은 이슈": "Issue you'd like to see", "어떤 데이터·지표로 보면 좋을까요": "Which data or indicators would help?", "(선택)": "(optional)",
    "소속·이름": "Affiliation / name", "회신 받을 메일": "Email for a reply",
    "예: 신도심·원도심 인구 이동": "e.g. population movement between the new city and older towns", "알고 있는 자료, 궁금한 점, 쓰임새 등": "Data you know of, questions, how you'd use it…",
    "메일로 제안 보내기": "Send by email", "제출": "Submit", "내용 복사": "Copy text",
    "보내기를 누르면 메일 프로그램이 열리고 내용이 채워집니다(받는 사람 ysong@sri.re.kr). 이 페이지는 입력 내용을 저장하거나 다른 곳으로 보내지 않습니다.":
      "Sending opens your email program with the text filled in (to ysong@sri.re.kr). This page does not store or send what you type anywhere else.",
    "제출한 내용은 다음 읽기를 고르고 회신하는 데에만 쓰며, 제작자(송양호)의 구글 시트에 보관합니다. 이름·메일은 적지 않아도 됩니다.":
      "Submissions are used only to choose the next reading and to reply, and are kept in the maker's (송양호) Google Sheet. Name and email are optional.",
    "보고 싶은 이슈를 적어 주세요.": "Please enter the issue you'd like to see.", "보내는 중…": "Sending…", "제안을 받았습니다. 고맙습니다!": "Thank you — we've received your suggestion!",
    "보내지 못했습니다. '내용 복사' 후 메일로 보내 주세요.": "Could not send. Please use 'Copy text' and send it by email.",
    "메일 쓰기 창을 열었습니다. 열리지 않으면 '내용 복사' 후 메일로 보내 주세요.": "Your email program should now be open. If not, use 'Copy text' and send it by email.",
    // 아래·보기 줄
    "제작: 세종연구원 연구모임": "By the Sejong Research Institute study group", "오늘 / 전체": "Today / Total", "조회수 오늘/전체": "Visits today / total",
    "← 모아보기": "← All readings", "새 창으로": "New window", "읽기 전환": "Switch reading", "미리보기": "Preview", "닫기": "Close",
    "세종연구원": "Sejong Research Institute",
    // 카드: 분야, 질문, 설명, 제작
    "도시 · 3D 실험실": "City · 3D lab", "도시계획 · 생활권": "Urban planning · Living zones", "균형성장 · 읍면": "Balanced growth · Rural towns",
    "상권 · 경제": "Commerce · Economy", "재난 · 지역안전": "Disaster · Local safety", "문화 · 국가유산": "Culture · Heritage", "물 · 환경": "Water · Environment", "교통 · 안전": "Transport · Safety",
    "도시를 움직여 보면 무엇이 달라지나": "What changes when you move the city?",
    "생활권은 계획대로 작동하고 있나": "Are the living zones working as planned?",
    "읍면과 신도심의 격차는 좁혀지고 있나": "Is the gap between the rural towns and the new city closing?",
    "행복도시 상가는 왜 비어 있나": "Why are the new city's shops empty?",
    "세종의 빈집은 어디에 있고, 왜 생기나": "Where are Sejong's empty houses, and why do they appear?",
    "주거 · 빈집": "Housing · Empty houses", "작업 중": "Work in progress", "연구 자료": "Research data",
    "소방차와 구급차는 제때 닿는가, 겨울 골목은 안전한가": "Do fire engines and ambulances arrive in time? Are winter alleys safe?",
    "세종의 시간은 어디에 남아 있나": "Where does Sejong's past remain?",
    "강과 물은 지금 어떤가": "How are the rivers and water right now?",
    "도로는 지금 안전한가": "Are the roads safe right now?",
    "행복도시 9,284동과 실제 지형을 3D 모형에 올려, 날짜·시각별 그림자와 일조시간, 금강 수위 시나리오, 눈높이 조망, 출퇴근 정체(ITS 구간 속도), 밤 풍경을 직접 시험해 봅니다.":
      "Puts the new city's 9,284 buildings and the real terrain into a 3D model so you can try shadows and sunlight hours by date and time, Geum River water-level scenarios, eye-level views, rush-hour congestion (ITS segment speeds) and the city at night.",
    "행복도시 6개 생활권이 맡은 기능을 실제로 하고 있는지, 생활권 사이·광역권과 어떻게 이어지는지 공공데이터 25개 지표와 행정동 지도로 점검합니다.":
      "Checks whether the new city's six living zones actually perform the functions planned for them, and how they connect with each other and the wider region, using 25 public-data indicators and neighborhood maps.",
    "1읍 9면과 신도심의 인구·일자리·생활·건물을 나란히 놓고, 조치원·북부권과 햇빛소득 가능성을 살피며, 시정의 약속과 관련해 함께 고민할 거리를 찾아봅니다.":
      "Sets the one town and nine townships beside the new city on population, jobs, daily life and buildings, looks at Jochiwon, the northern area and solar-income potential, and gathers questions to consider alongside the city's policy commitments.",
    "세종연구원 이자은 책임연구위원이 연구해 온 빈집 자료 등으로, 빈집이 어느 읍면동에 얼마나 모여 있는지, 오래된 집·인구 변화와는 어떻게 이어지는지, 정비·활용은 어디까지 왔는지를 살펴봅니다. 지금은 자료를 정리하는 중입니다.":
      "Draws on empty-house research by 이자은, senior research fellow at the Sejong Research Institute, among other sources, to see how many empty houses sit in each town and neighborhood, how they relate to aging buildings and population change, and how far clean-up and reuse have come. The data is still being prepared.",
    "집합상가 287동 전수조사로 본 생활권·동·건물별 상가 공실. 2D·3D 지도와 회귀·머신러닝·멀티레벨로 공실의 원인을 나눠 봅니다.":
      "Shop vacancy by living zone, neighborhood and building from a full survey of 287 commercial buildings, with 2D/3D maps and regression, machine-learning and multilevel models to separate the causes.",
    "지역안전지수 분야별로 읽습니다. 화재안전 탭은 소방차 도달시간과 건물 화재위험을, 겨울 결빙 탭은 골목 낙상 위험과 제설함 후보를(연구진 추정), 구급·응급 탭은 2025년 실제 출동 기록으로 도착·이송 시간과 구급차 부하를 봅니다.":
      "Reads safety area by area, following the regional safety index: the fire tab covers fire-engine travel times and building fire risk, the winter-ice tab covers alley fall risk and candidate de-icing box sites (researchers' estimates), and the EMS tab uses 2025 dispatch records for arrival and transport times and ambulance load.",
    "시가 지정·등록한 국가유산 137건을 이모지 지도로 찾고, 시대의 지층·이야기 코스·세시 달력·개발과 유산·누구나 누리는 유산(향유권·물리적 접근)으로 읽습니다.":
      "Find the city's 137 designated and registered heritage sites on an emoji map, and read them through layers of history, story routes, a seasonal calendar, development and heritage, and heritage for everyone (the right to enjoy it and physical access).",
    "금강·미호강 수위와 강수, 하천 수질, 지하수, 기상을 실시간으로 모으고 관측 지점을 지도로 보여 줍니다.":
      "Gathers Geum and Miho river levels, rainfall, river water quality, groundwater and weather in real time, and maps the observation points.",
    "실시간 소통·노면 위험, 연 단위 교통사고, 시설 현황을 세 층으로 나눠 읍면동·도로 지도에서 봅니다.":
      "Shows real-time traffic and road-surface risk, yearly traffic crashes and road facilities as three layers on neighborhood and road maps.",
    "세종연구원 송양호": "Sejong Research Institute · 송양호", "세종연구원 연구모임": "Sejong Research Institute study group",
    "세종연구원 도시안전연구센터": "Sejong Research Institute · Urban Safety Research Center", "세종연구원 세종지역학센터": "Sejong Research Institute · Sejong Regional Studies Center"
  };
  // 읽기 이름은 대문·탭에서 머리말을 떼고 쓰므로 여러 꼴을 함께 넣는다
  var TITLES = {lab: "Digital Twin Lab", zone: "Living Zones", balance: "Balanced Growth", vacant: "Vacant Shops", emptyhouse: "Empty Houses", fire: "Local Safety",
                heritage: "Heritage", water: "Water", traffic: "Road Safety"};
  var KO_TITLES = {lab: "세종 디지털트윈 실험실", zone: "세종 생활권 읽기", balance: "세종 읍면 균형성장 읽기", vacant: "세종 행복도시 상가공실 읽기", emptyhouse: "세종 빈집 읽기",
                   fire: "세종 지역안전 읽기", heritage: "세종 국가유산 읽기", water: "세종시 물환경 읽기", traffic: "세종시 교통안전 읽기"};
  Object.keys(KO_TITLES).forEach(function (k) {
    var t = KO_TITLES[k], e = k === "lab" ? TITLES[k] : "Reading " + TITLES[k];
    [t, t.replace(/^세종(시)? (행복도시 )?/, ""), t.replace("세종시 ", "").replace("세종 행복도시 ", "").replace("세종 ", "")].forEach(function (v) { EN[v] = e; });
    EN[t] = (k === "lab" ? "Sejong " : "Reading Sejong: ") + TITLES[k];
  });
  var RULES = [
    [/^(\d\d) · (.+)$/, function (m) { return m[1] + " · " + (EN[m[2]] || m[2]); }],          // 카드 머리 '02 · 분야'
    [/^제작: (.+)$/, function (m) { return "By " + (EN[m[1]] || m[1]); }],
    [/^▶ (\d+)초$/, function (m) { return "▶ " + m[1] + "s"; }],
    [/^(.+) · 미리보기\(수치는 흐리게 처리\)$/, function (m) { return (EN[m[1]] || m[1]) + " · Preview (figures blurred)"; }],
    [/^(.+) · 세종 읽기$/, function (m) { return (EN[m[1]] || m[1]) + " · Reading Sejong"; }],
    [/^대표 문의: (.+)$/, function (m) { return "Contact: " + m[1]; }],
    [/^복사했습니다\. (\S+) 로 붙여 넣어 보내 주세요\.$/, function (m) { return "Copied. Paste it into an email to " + m[1] + "."; }],
    [/^복사가 막혔습니다\. (\S+) 로 직접 보내 주세요\.$/, function (m) { return "Copying was blocked. Please write to " + m[1] + " directly."; }],
    [/^보내지 못했습니다\. '내용 복사' 후 (\S+) 로 보내 주세요\.$/, function (m) { return "Could not send. Use 'Copy text' and send it to " + m[1] + "."; }]
  ];
  var ATTRS = ["placeholder", "aria-label", "title", "alt"];
  var KEY = "sejong_lang", lang = "ko";
  var origText = new Map(), origAttr = new Map(), origHTML = new Map();

  function tr(s) {
    var k = s.trim();
    if (!k || !/[가-힣]/.test(k)) return null;
    if (EN[k]) return s.replace(k, EN[k]);
    for (var i = 0; i < RULES.length; i++) { var m = k.match(RULES[i][0]); if (m) return s.replace(k, RULES[i][1](m)); }
    return null;
  }
  function skip(el) { return !el || el.closest("script,style,iframe,#langbtn,.names"); }
  function walk(root) {
    if (root.nodeType === 3) { text(root); return; }
    if (root.nodeType !== 1 || skip(root)) return;
    ATTRS.forEach(function (a) {
      var v = root.getAttribute(a); if (v == null) return;
      var t = tr(v); if (t == null) return;
      if (!origAttr.has(root)) origAttr.set(root, {});
      if (!(a in origAttr.get(root))) origAttr.get(root)[a] = v;
      root.setAttribute(a, t);
    });
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT), n;
    while ((n = w.nextNode())) { if (n.nodeType === 3) text(n); else if (n !== root) attrs(n); }
  }
  function attrs(el) { if (skip(el)) return; ATTRS.forEach(function (a) { var v = el.getAttribute(a); if (v == null) return; var t = tr(v); if (t == null) return;
    if (!origAttr.has(el)) origAttr.set(el, {}); if (!(a in origAttr.get(el))) origAttr.get(el)[a] = v; el.setAttribute(a, t); }); }
  function text(n) { if (skip(n.parentElement)) return; var t = tr(n.nodeValue); if (t == null) return; if (!origText.has(n)) origText.set(n, n.nodeValue); n.nodeValue = t; }

  // 큰 제목은 낱말 순서가 달라 통째로 바꾼다
  var SPECIAL = {".hero h1": 'Reading <em>Sejong</em> through questions.'};
  var note;
  function apply() {
    Object.keys(SPECIAL).forEach(function (s) { var el = document.querySelector(s); if (el && !origHTML.has(el)) { origHTML.set(el, el.innerHTML); el.innerHTML = SPECIAL[s]; } });
    walk(document.body);
    var t = tr(document.title); if (t != null) { origText.set("title", origText.get("title") || document.title); document.title = t; }
    var bar = document.querySelector(".ibar");
    if (bar && !note) {
      note = document.createElement("p"); note.className = "ennote";
      note.textContent = "Each reading opens in Korean. Your browser's translate feature can help with the details.";
      bar.insertAdjacentElement("afterend", note);
    }
  }
  function restore() {
    origText.forEach(function (v, n) { if (n === "title") document.title = v; else if (n.isConnected) n.nodeValue = v; });
    origAttr.forEach(function (o, el) { Object.keys(o).forEach(function (a) { el.setAttribute(a, o[a]); }); });
    origHTML.forEach(function (v, el) { el.innerHTML = v; });
    origText.clear(); origAttr.clear(); origHTML.clear();
    if (note) { note.remove(); note = null; }
  }
  // 대문이 카드·탭·문구를 다시 그리면 영어로 따라 바꾼다
  var busy = false;
  new MutationObserver(function (ms) {
    if (lang !== "en" || busy) return;
    busy = true;
    ms.forEach(function (m) {
      if (m.type === "characterData") text(m.target);
      else m.addedNodes.forEach(walk);
    });
    var t = tr(document.title); if (t != null) document.title = t;
    busy = false;
  }).observe(document.documentElement, {childList: true, subtree: true, characterData: true});

  function set(l, save) {
    lang = l;
    document.documentElement.lang = l === "en" ? "en" : "ko";
    if (l === "en") apply(); else restore();
    btn.textContent = l === "en" ? "한국어" : "EN";
    btn.setAttribute("aria-label", l === "en" ? "한국어로 보기" : "View in English");
    if (save) { try { localStorage.setItem(KEY, l); } catch (e) {} }
  }
  var css = document.createElement("style");
  css.textContent = ".langbtn{border:1px solid var(--ink);background:none;color:var(--ink);font:500 12px/1 'IBM Plex Mono','IBM Plex Sans KR',monospace;letter-spacing:.08em;padding:7px 11px;cursor:pointer}" +
    ".langbtn:hover{background:var(--ink);color:var(--paper)}.mast .langwrap{display:flex;align-items:center;gap:14px}" +
    ".ennote{margin:10px 0 0;font-size:12.5px;color:var(--ink3)}html[lang=en] .hero h1{letter-spacing:-.035em;font-size:clamp(30px,4vw,60px)}html[lang=en] .mast .brand span{display:none}";
  document.head.appendChild(css);
  var btn = document.createElement("button");
  btn.type = "button"; btn.className = "langbtn"; btn.id = "langbtn";
  btn.addEventListener("click", function () { set(lang === "en" ? "ko" : "en", true); });
  var logo = document.querySelector(".mast .logo");
  if (logo) { var w = document.createElement("div"); w.className = "langwrap"; logo.parentNode.insertBefore(w, logo); w.appendChild(btn); w.appendChild(logo); }
  else document.body.insertBefore(btn, document.body.firstChild);
  var want = "ko";
  try { want = new URLSearchParams(location.search).get("lang") || localStorage.getItem(KEY) || "ko"; } catch (e) {}
  set(want === "en" ? "en" : "ko", false);
})();
