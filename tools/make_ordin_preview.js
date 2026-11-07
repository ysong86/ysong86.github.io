// 조례 비교(ordin) 대문 카드용 30초 미리보기 영상 → ordin/preview.mp4
//
//   python tools/serve_local.py  (또는 python -m http.server 8790)
//   node tools/make_ordin_preview.js [http://127.0.0.1:8790/ordin/]
//
// 다른 상황판 미리보기와 같은 꼴: 1440×810, 30fps, 마우스 커서, 아래 가운데 자막 띠.
// 화면은 Chrome 화면 중계(CDP screencast)로 받아 ffmpeg 로 묶는다. ffmpeg 가 PATH 에 있어야 한다.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const URL = process.argv[2] || "http://127.0.0.1:8790/ordin/";
const ROOT = path.dirname(__dirname);
const TMP = path.join(ROOT, "tmp", "ordin_frames");
const OUT = path.join(ROOT, "ordin", "preview.mp4");
const W = 1440, H = 810;

const OVERLAY = `
#pv-cap{position:fixed;left:50%;bottom:34px;transform:translate(-50%,8px);z-index:99999;opacity:0;
  background:rgba(28,32,38,.92);color:#fff;border-radius:999px;padding:11px 26px 12px;white-space:nowrap;
  font:400 15px/1.3 "IBM Plex Sans KR",sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.25);
  transition:opacity .35s ease,transform .35s ease;pointer-events:none}
#pv-cap.on{opacity:1;transform:translate(-50%,0)}
#pv-cap b{font-weight:700;font-size:20px;margin-right:12px;letter-spacing:-.01em}
#pv-cap span{color:#d9dce2}
#pv-cur{position:fixed;left:0;top:0;z-index:100000;width:26px;height:30px;pointer-events:none;
  filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.35))}
.pv-ring{position:fixed;z-index:99998;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;
  border:2px solid #152484;pointer-events:none;animation:pvr .5s ease-out forwards}
@keyframes pvr{from{transform:scale(.3);opacity:.9}to{transform:scale(1.4);opacity:0}}
.visitors{display:none!important}
`;
const CURSOR = `<svg viewBox="0 0 26 30" xmlns="http://www.w3.org/2000/svg"><path d="M2 2 L2 24 L8 18.5 L12.2 27.5 L16 25.8 L11.8 17 L20 17 Z" fill="#fff" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/></svg>`;

(async () => {
  fs.rmSync(TMP, { recursive: true, force: true });
  fs.mkdirSync(TMP, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, colorScheme: "light" });
  await ctx.route("**/hits.sh/**", r => r.abort());
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: "networkidle" });
  await p.evaluate(([css, svg]) => {
    const s = document.createElement("style"); s.textContent = css; document.head.appendChild(s);
    const c = document.createElement("div"); c.id = "pv-cap"; document.body.appendChild(c);
    const k = document.createElement("div"); k.id = "pv-cur"; k.innerHTML = svg; document.body.appendChild(k);
    k.style.transform = "translate(720px,420px)";
    addEventListener("mousemove", e => { k.style.transform = `translate(${e.clientX - 2}px,${e.clientY - 2}px)`; }, true);
    addEventListener("mousedown", e => { const r = document.createElement("div"); r.className = "pv-ring";
      r.style.left = e.clientX + "px"; r.style.top = e.clientY + "px"; document.body.appendChild(r); setTimeout(() => r.remove(), 600); }, true);
  }, [OVERLAY, CURSOR]);
  await document_fonts(p);

  // ── 화면 중계 시작
  const cdp = await ctx.newCDPSession(p);
  const frames = [];
  let n = 0;
  cdp.on("Page.screencastFrame", async f => {
    const file = path.join(TMP, `f${String(n++).padStart(5, "0")}.jpg`);
    fs.writeFileSync(file, Buffer.from(f.data, "base64"));
    frames.push({ file, t: f.metadata.timestamp });
    try { await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }); } catch (e) {}
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 95, maxWidth: W, maxHeight: H, everyNthFrame: 1 });
  // 화면이 멈춰 있어도 프레임이 나오도록 아주 작은 깜빡임을 둔다(보이지 않음)
  await p.evaluate(() => { const d = document.createElement("div");
    d.style.cssText = "position:fixed;right:0;bottom:0;width:1px;height:1px;z-index:99999;pointer-events:none";
    document.body.appendChild(d); let i = 0; setInterval(() => { d.style.background = (i++ % 2) ? "rgba(0,0,0,.004)" : "rgba(0,0,0,.006)"; }, 33); });

  const wait = ms => p.waitForTimeout(ms);
  let mx = 720, my = 420;
  const move = async (x, y, ms = 700) => {
    // 시계 기준으로 움직여 단계마다 생기는 지연이 쌓이지 않게 한다
    const x0 = mx, y0 = my, t0 = Date.now();
    for (;;) {
      const t = Math.min(1, (Date.now() - t0) / ms), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      await p.mouse.move(x0 + (x - x0) * e, y0 + (y - y0) * e);
      if (t >= 1) break;
      await wait(16);
    }
    mx = x; my = y;
  };
  const center = async sel => { const r = await p.locator(sel).first().boundingBox(); return [r.x + r.width / 2, r.y + r.height / 2]; };
  const clickOn = async (sel, ms) => { const [x, y] = await center(sel); await move(x, y, ms); await wait(150); await p.mouse.down(); await p.mouse.up(); };
  const cap = (t, s) => p.evaluate(([t, s]) => { const c = document.getElementById("pv-cap");
    if (!t) { c.classList.remove("on"); return; }
    c.classList.remove("on"); setTimeout(() => { c.innerHTML = `<b>${t}</b><span>${s}</span>`; c.classList.add("on"); }, c.innerHTML ? 250 : 0); }, [t, s]);
  const scrollTo = (sel, top, ms) => p.evaluate(([sel, top, ms]) => new Promise(res => {
    const el = document.querySelector(sel), y0 = el.scrollTop, y1 = typeof top === "number" ? top
      : el.querySelector(top).offsetTop - 12, t0 = performance.now();
    const f = now => { const t = Math.min(1, (now - t0) / ms), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      el.scrollTop = y0 + (y1 - y0) * e; t < 1 ? requestAnimationFrame(f) : res(); };
    requestAnimationFrame(f); }), [sel, top, ms]);
  const scrollToText = (sel, text, ms) => p.evaluate(([sel, text, ms]) => new Promise(res => {
    const el = document.querySelector(sel);
    const h = [...el.querySelectorAll("h3")].find(x => x.textContent.includes(text));
    const y0 = el.scrollTop, y1 = h.offsetTop - el.offsetTop - 16, t0 = performance.now();
    const f = now => { const t = Math.min(1, (now - t0) / ms), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      el.scrollTop = y0 + (y1 - y0) * e; t < 1 ? requestAnimationFrame(f) : res(); };
    requestAnimationFrame(f); }), [sel, text, ms]);

  // 오른쪽 칸 안에서 글(제목·문단)이 위에 오도록 부드럽게 내린다
  const scrollToEl = (box, sel, text, ms, off = 16) => p.evaluate(([box, sel, text, ms, off]) => new Promise(res => {
    const el = document.querySelector(box), h = [...el.querySelectorAll(sel)].find(x => x.textContent.includes(text));
    if (!h) return res(false);
    const y0 = el.scrollTop, y1 = h.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop - off, t0 = performance.now();
    const f = now => { const t = Math.min(1, (now - t0) / ms), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      el.scrollTop = y0 + (y1 - y0) * e; t < 1 ? requestAnimationFrame(f) : res(true); };
    requestAnimationFrame(f); }), [box, sel, text, ms, off]);
  const mark = (sel, text) => p.evaluate(([sel, text]) => { const h = [...document.querySelectorAll(sel)].find(x => x.textContent.includes(text));
    if (h) { h.style.transition = "background .5s"; h.style.background = "#fff3b0"; h.style.boxShadow = "-6px 0 0 #fff3b0, 6px 0 0 #fff3b0"; } }, [sel, text]);
  const boxOf = async (sel, text) => p.locator(sel, { hasText: text }).first().boundingBox();

  // ── 0s 첫 화면 — 세 가지 기능 예고
  await p.mouse.move(mx, my);
  await cap("세종 조례, 다른 시도와 나란히", "① 조례 검색 · ② 다른 시도와 비교 · ③ 세종에만 없는 조례");
  await wait(2200);

  // ── 3s ① 중요한 조례 하나 검색
  await cap("① 조례 검색", "세종 조례 847건에서 키워드로 — 예: 재난");
  await clickOn("#q", 800);
  await p.keyboard.type("재난", { delay: 200 });
  await wait(700);
  await move(160, 560, 600);
  await scrollToEl("#list", ".item", "재난관리기금", 900, 140);   // 목록 아래쪽에 있으면 끌어올린다
  await wait(300);
  { const r = await boxOf("#list .item", "재난관리기금"); await move(r.x + 160, r.y + r.height / 2, 900); await wait(200); await p.mouse.down(); await p.mouse.up(); }
  await p.waitForSelector("#right .grid16");
  await wait(300);

  // ── 8s ② 다른 시도 대비 특징
  await cap("② 다른 시도와 비교", "광역 15곳이 같은·비슷한 조례를 두었는지 한눈에");
  await move(1180, 200, 800);
  await move(1140, 285, 700);   // 전남광주 '없음'
  await wait(800);
  await cap("② 특징이 바로 보입니다", "세종만의 조항 · 다른 시도와 다른 점 · 검토해 볼 점");
  await move(1230, 560, 600);
  await scrollToEl("#right", ".ai p", "한 줄 핵심", 1000);
  await wait(1300);
  await scrollToEl("#right", ".ai p.h", "다른 시도와 다른 점", 1300);
  await wait(300);
  await mark("#right .ai li", "이주 실비");
  { const r = await boxOf("#right .ai li", "이주 실비"); if (r) await move(r.x + r.width - 30, r.y + r.height - 6, 700); }
  await wait(2000);
  if (await scrollToEl("#right", "h3", "다른 시도 다수가 두는데", 1100)) {
    await cap("빠진 조항까지", "다른 시도 다수가 두는데 세종 조례엔 없는 조항");
    await move(1300, 260, 600);
    await wait(1700);
  }

  // ── 22s ③ 우리 시에만 없는 조례
  await cap("③ 세종에만 없는 조례", "다른 시도 4곳 이상이 두는데 세종엔 없는 조례 419건");
  await clickOn('.tabs button[data-tab="missing"]', 900);
  await wait(800);
  await clickOn('#missing .chips button[data-f="안전·재난"]', 800);
  await wait(500);
  await move(700, 560, 500);
  await scrollToEl("#missing", ".mrow", "중대재해", 900, 140);   // 펼친 내용이 화면 안에 들어오게 먼저 끌어올린다
  await mark("#missing .mrow", "중대재해");
  { const r = await boxOf("#missing .mrow", "중대재해"); await move(r.x + 320, r.y + r.height / 2, 600); await wait(150); await p.mouse.down(); await p.mouse.up(); }
  await wait(2000);

  // ── 맺음
  await cap("보고서 · 정책 제언의 근거로", "세종연구원 연구모임 · ysong86.github.io/ordin");
  await move(1000, 300, 900);
  await wait(1900);

  await cdp.send("Page.stopScreencast");
  await wait(200);
  await b.close();

  // ── 프레임 묶기: 각 프레임을 다음 프레임까지 유지
  const list = [];
  for (let i = 0; i < frames.length; i++) {
    const d = i + 1 < frames.length ? frames[i + 1].t - frames[i].t : 1 / 30;
    list.push(`file '${frames[i].file}'`, `duration ${Math.max(d, 0.001).toFixed(4)}`);
  }
  list.push(`file '${frames[frames.length - 1].file}'`);
  const lf = path.join(TMP, "list.txt");
  fs.writeFileSync(lf, list.join("\n"));
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lf,
    "-vf", `fps=30,scale=${W}:${H}:flags=lanczos,format=yuv420p`, "-c:v", "libx264", "-preset", "slow", "-crf", "20",
    "-movflags", "+faststart", "-an", OUT], { stdio: "inherit" });
  console.log("저장:", OUT, frames.length, "프레임");
})();

async function document_fonts(p) { await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400); }
