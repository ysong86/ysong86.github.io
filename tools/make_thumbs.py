# -*- coding: utf-8 -*-
"""대문 카드용 미리보기 그림 → assets/thumbs/*.jpg

  python tools/make_thumbs.py

- 공개 상황판(물환경·교통안전): 실제 화면을 캡처한다. 조회수 집계(hits.sh) 요청은 막는다.
- 비밀번호 상황판(생활권·상가공실): 로그인 문 뒤라 캡처하지 않고, 수치를 흐리게 처리한 30초 미리보기 영상에서 한 장면을 뽑는다.
"""
from __future__ import annotations

import os
import subprocess
import urllib.request

import imageio_ffmpeg
from PIL import Image
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HERE, "assets", "thumbs")
TMP = os.path.join(HERE, "tmp")
BASE = "https://ysong86.github.io/"
SHOTS = {"water": "water_sejong/", "traffic": "traffic_sejong/"}
FRAMES = {"zone": ("zone_sejong/preview.mp4", 9.0), "vacant": ("vacant_sejong/preview.mp4", 18.8),
          "fire": ("fire_sejong/preview.mp4", 22.5)}
W = 960


def save(img, name):
    img = img.convert("RGB")
    img = img.resize((W, round(img.height * W / img.width)), Image.LANCZOS)
    img = img.crop((0, 0, W, round(W * 9 / 16)))
    img.save(os.path.join(OUT, name + ".jpg"), quality=82, optimize=True, progressive=True)


def main():
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(TMP, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome", headless=True)
        ctx = b.new_context(viewport={"width": 1440, "height": 810}, device_scale_factor=1, color_scheme="light")
        ctx.route("**/hits.sh/**", lambda r: r.abort())
        for name, path in SHOTS.items():
            pg = ctx.new_page()
            pg.goto(BASE + path, wait_until="networkidle", timeout=60000)
            pg.wait_for_timeout(3500)
            f = os.path.join(TMP, name + ".png")
            pg.screenshot(path=f)
            save(Image.open(f), name)
            pg.close()
        b.close()
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    for name, (path, t) in FRAMES.items():
        mp4 = os.path.join(TMP, name + ".mp4")
        urllib.request.urlretrieve(BASE + path, mp4)
        png = os.path.join(TMP, name + ".png")
        subprocess.run([ff, "-y", "-loglevel", "error", "-ss", str(t), "-i", mp4, "-frames:v", "1", png], check=True)
        im = Image.open(png)
        h = int(im.height * 0.86)                      # 아래 자막 띠를 잘라내고 16:9 로 가운데 자르기
        w = int(h * 16 / 9)
        x0 = (im.width - w) // 2 + (60 if name == "vacant" else 0)
        save(im.crop((x0, 0, x0 + w, h)), name)
    print("저장:", sorted(os.listdir(OUT)))


if __name__ == "__main__":
    main()
