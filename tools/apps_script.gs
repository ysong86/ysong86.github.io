/**
 * 세종 이슈 대시보드 — '다음 이슈 제안' 받는 곳 (Google Apps Script 웹 앱)
 *
 * 설치(구글 계정에서 5분):
 *  1. 구글 드라이브에서 새 스프레드시트를 만든다(이름 예: 세종 이슈 대시보드 제안함).
 *  2. 메뉴 [확장 프로그램] → [Apps Script] → 기본 코드를 지우고 이 파일 내용을 통째로 붙여 넣고 저장.
 *  3. 오른쪽 위 [배포] → [새 배포] → 유형 톱니바퀴에서 [웹 앱] 선택
 *       - 실행 계정: 나
 *       - 액세스 권한: 모든 사용자
 *     → [배포] → 권한 승인(“확인되지 않은 앱” 경고가 나오면 [고급] → [이동]) → 나오는 '웹 앱 URL'(…/exec)을 복사.
 *  4. 그 URL 을 Claude 에게 알려 주면 대문 폼에 연결한다.
 *
 * 받은 제안은 이 시트의 '제안' 탭에 한 줄씩 쌓이고, NOTIFY 주소로 알림 메일이 간다.
 * 코드를 고친 뒤에는 [배포] → [배포 관리] → 연필 → 버전 '새 버전' 으로 다시 배포해야 반영된다(URL 은 그대로).
 */
const NOTIFY = 'ysong@sri.re.kr';
const SHEET_NAME = '제안';
const MAX_PER_HOUR = 30;          // 장난 제출 막기: 한 시간에 이 이상은 받지 않는다

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'plane') return planePost(p);                // 종이비행기 순위표(아래)
  if (p.website) return out({ ok: true });                      // 사람 눈에 안 보이는 칸 — 채워져 있으면 자동 제출(스팸)
  const topic = clip(p.topic, 80);
  if (!topic) return out({ ok: false, error: '보고 싶은 이슈가 비어 있습니다.' });

  const cache = CacheService.getScriptCache();
  const n = Number(cache.get('n') || 0);
  if (n >= MAX_PER_HOUR) return out({ ok: false, error: '잠시 뒤에 다시 보내 주세요.' });
  cache.put('n', String(n + 1), 3600);

  const row = { topic, body: clip(p.body, 1500), who: clip(p.who, 60), mail: clip(p.mail, 80), page: clip(p.page, 200) };
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(['받은 시각', '보고 싶은 이슈', '데이터·지표 / 궁금한 점', '소속·이름', '회신 메일', '보낸 페이지', '처리']);
    sh.setFrozenRows(1);
  }
  sh.appendRow([new Date(), safe(row.topic), safe(row.body), safe(row.who), safe(row.mail), safe(row.page), '']);

  const mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.mail);
  MailApp.sendEmail({
    to: NOTIFY,
    subject: '[세종 이슈 대시보드] 새 제안: ' + row.topic,
    body: '보고 싶은 이슈: ' + row.topic + '\n\n데이터·지표 / 궁금한 점:\n' + (row.body || '(없음)') +
          '\n\n소속·이름: ' + (row.who || '(없음)') + '\n회신 메일: ' + (row.mail || '(없음)') +
          '\n\n목록: ' + ss.getUrl(),
    replyTo: mailOk ? row.mail : NOTIFY,
  });
  return out({ ok: true });
}

function clip(v, n) { return String(v || '').trim().slice(0, n); }
// 시트 수식 주입 막기: =, +, -, @ 로 시작하면 글자로 저장
function safe(v) { return /^[=+\-@]/.test(v) ? "'" + v : v; }
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

/* ───────── 종이비행기 순위표 (sejong_plane) ─────────
 * 시트 '종이비행기' 탭에 닉네임당 최고 기록 한 줄씩. 지우고 싶은 기록은 그 줄을 지우면 된다(30초 안에 화면에 반영).
 * GET ?action=plane → 상위 목록 / POST action=plane, nick, dist, time, start → 등록.
 */
const PLANE_SHEET = '종이비행기';
const PLANE_MAX_PER_HOUR = 300;   // 전체 등록 횟수 제한
const PLANE_TOP = 50;
// 닉네임 금칙어 — sejong_plane/site/index.html 의 BAD 와 같은 목록
const PLANE_BAD = ['씨발','시발','씨빨','시빨','씨팔','시팔','쉬발','쉬팔','씨바','시바','씹','좆','좃','존나','졸라','병신','븅신','빙신','지랄','염병','옘병',
  '개새','개색','개세','개같','새끼','색기','쌔끼','썅','쌍년','쌍놈','미친놈','미친년','미친새','또라이','등신','창녀','걸레','보지','자지','섹스','강간',
  '느금','니미','니애미','니엄마','엠창','애미','애비','한남','한녀','김치녀','맘충','일베','메갈','노무','틀딱','짱깨','쪽바리','깜둥','꺼져','닥쳐','뒤져','뒈져','자살','살인','히틀러',
  '관리자','운영자','fuck','fuk','shit','bitch','asshole','dick','pussy','porn','sex','nigger','nigga','cunt','whore','slut'];

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'plane') return out({ ok: true, rows: planeTop() });
  return out({ ok: false, error: 'unknown' });
}

function planeNickError(s) {
  if (!/^[가-힣a-zA-Z0-9]{2,10}$/.test(s)) return '한글·영문·숫자로 2~10자만 쓸 수 있습니다.';
  const t = s.toLowerCase().replace(/[0-9]/g, '');
  return PLANE_BAD.some(function (w) { return t.indexOf(w) >= 0; }) ? '쓸 수 없는 말이 들어 있습니다. 순하게 다시 지어 주세요.' : '';
}

function planeSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(PLANE_SHEET);
  if (!sh) {
    sh = ss.insertSheet(PLANE_SHEET);
    sh.appendRow(['닉네임', '거리(m)', '출발지', '비행(초)', '기록 시각']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function planeRows(sh) {
  const n = sh.getLastRow();
  if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, 3).getValues()
    .map(function (r, i) { return { n: String(r[0]), d: Number(r[1]) || 0, s: String(r[2]), row: i + 2 }; })
    .filter(function (r) { return r.n; })
    .sort(function (a, b) { return b.d - a.d; });
}

function planePublic(list) {
  return list.slice(0, PLANE_TOP).map(function (r) { return { n: r.n, d: r.d, s: r.s }; });
}

function planeTop() {
  const cache = CacheService.getScriptCache();
  const hit = cache.get('plane_top');
  if (hit) return JSON.parse(hit);
  const rows = planePublic(planeRows(planeSheet()));
  cache.put('plane_top', JSON.stringify(rows), 30);
  return rows;
}

function planePost(p) {
  if (p.website) return out({ ok: true, rows: [], rank: 0 });     // 자동 제출
  const nick = clip(p.nick, 10), dist = Math.round(Number(p.dist)), time = Number(p.time);
  const bad = planeNickError(nick);
  if (bad) return out({ ok: false, error: bad });
  // 지도 끝에서 끝이 약 18km, 비행기 최고 속력은 초속 70m 안쪽
  if (!(dist >= 1 && dist <= 20000) || !(time > 0 && time <= 3600) || dist / time > 70) return out({ ok: false, error: '기록을 확인할 수 없습니다.' });

  const cache = CacheService.getScriptCache();
  const n = Number(cache.get('plane_n') || 0);
  if (n >= PLANE_MAX_PER_HOUR) return out({ ok: false, error: '잠시 뒤에 다시 올려 주세요.' });
  cache.put('plane_n', String(n + 1), 3600);

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = planeSheet();
    const list = planeRows(sh);
    const key = nick.toLowerCase();
    const mine = list.filter(function (r) { return r.n.toLowerCase() === key; })[0];
    let updated = true;
    const row = [safe(nick), dist, safe(clip(p.start, 30)), time, new Date()];
    if (!mine) {
      sh.appendRow(row);
      list.push({ n: nick, d: dist, s: clip(p.start, 30) });
    } else if (dist > mine.d) {
      sh.getRange(mine.row, 1, 1, 5).setValues([row]);
      mine.d = dist; mine.s = clip(p.start, 30); mine.n = nick;
    } else {
      updated = false;
    }
    list.sort(function (a, b) { return b.d - a.d; });
    const rank = list.findIndex(function (r) { return r.n.toLowerCase() === key; }) + 1;
    const rows = planePublic(list);
    cache.put('plane_top', JSON.stringify(rows), 30);
    return out({ ok: true, updated: updated, rank: rank, rows: rows });
  } finally {
    lock.releaseLock();
  }
}
