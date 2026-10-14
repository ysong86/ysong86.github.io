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
