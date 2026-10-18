# -*- coding: utf-8 -*-
"""공개 전 상황판을 대문 안에서 미리 보는 로컬 서버.

  python tools/serve_local.py [포트=8771] [이름=폴더 ...]
  예) python tools/serve_local.py 8771 town_sejong=../sejong_town

- 대문(이 저장소)은 그대로 서빙한다. nav.js 도 로컬 것을 쓰도록 /nav.js 를 이 폴더에서 준다.
- 이름=폴더 로 준 상황판은 그 폴더의 dashboard.html(없으면 index.html)을 /이름/ 으로 준다.
- 나머지 /xxx_sejong/ 은 공개 사이트로 돌려보낸다(iframe 이 빈 화면이 되지 않게).
"""
from __future__ import annotations

import http.server
import os
import sys

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIVE = "https://ysong86.github.io"


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else 8771
    local = {}
    for arg in sys.argv[1:]:
        if "=" in arg:
            name, folder = arg.split("=", 1)
            local[name.strip("/")] = os.path.abspath(os.path.join(HERE, folder))

    class H(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **kw):
            super().__init__(*a, directory=HERE, **kw)

        def do_GET(self):
            path = self.path.split("?")[0].split("#")[0]
            head = path.strip("/").split("/")[0]
            if head in local:
                rest = path.strip("/")[len(head):].strip("/")
                folder = local[head]
                if not rest:
                    rest = "dashboard.html" if os.path.exists(os.path.join(folder, "dashboard.html")) else "index.html"
                fp = os.path.join(folder, rest)
                if os.path.isfile(fp):
                    body = open(fp, "rb").read()
                    if rest.endswith(".html"):   # 상황판이 부르는 공개 nav.js 대신 로컬 nav.js
                        body = body.replace(b"https://ysong86.github.io/nav.js", b"/nav.js")
                    self.send_response(200)
                    self.send_header("Content-Type", self.guess_type(fp))
                    self.send_header("Content-Length", str(len(body)))
                    self.end_headers()
                    self.wfile.write(body)
                    return
                self.send_error(404)
                return
            if head.endswith("_sejong"):
                self.send_response(302)
                self.send_header("Location", LIVE + self.path)
                self.end_headers()
                return
            super().do_GET()

    print("http://127.0.0.1:%d/  (로컬 상황판: %s)" % (port, ", ".join(local) or "없음"))
    http.server.ThreadingHTTPServer(("127.0.0.1", port), H).serve_forever()


if __name__ == "__main__":
    main()
