#!/usr/bin/env python3
"""Download real player portraits from Wikipedia (Wikimedia Commons) and save as square JPGs."""

from __future__ import annotations

import json
import subprocess
import sys
import time
import urllib.parse
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "images" / "players"
SIZE = 512
UA = "VAMOS26/1.0 (fan site; portrait fetch)"

# slug -> Wikipedia page title
PLAYERS: dict[str, str] = {
    "kylian-mbappe": "Kylian_Mbappé",
    "erling-haaland": "Erling_Haaland",
    "vinicius-junior": "Vinícius_Júnior",
    "harry-kane": "Harry_Kane",
    "lamine-yamal": "Lamine_Yamal",
    "christian-pulisic": "Christian_Pulisic",
    "florian-wirtz": "Florian_Wirtz",
    "kevin-de-bruyne": "Kevin_De_Bruyne",
    "pedri": "Pedri",
    "jude-bellingham": "Jude_Bellingham",
    "alexis-mac-allister": "Alexis_Mac_Allister",
    "emiliano-martinez": "Emiliano_Martínez",
    "gianluigi-donnarumma": "Gianluigi_Donnarumma",
    "alisson-becker": "Alisson_Becker",
    "mike-maignan": "Mike_Maignan",
    "matt-turner": "Matt_Turner_(soccer)",
    # Pin to Commons file — unmistakable African-Canadian portrait
    "alphonso-davies": "commons:File:Alphonso Davies in 2022.jpg",
    "antonio-rudiger": "Antonio_Rüdiger",
    "cristian-romero": "Cristian_Romero",
    "marquinhos": "Marquinhos",
    "mohamed-salah": "Mohamed_Salah",
    "virgil-van-dijk": "Virgil_van_Dijk",
    "william-saliba": "William_Saliba",
}


def curl_get(url: str, retries: int = 4) -> bytes:
    last_err: subprocess.CalledProcessError | None = None
    for attempt in range(retries):
        try:
            result = subprocess.run(
                ["curl", "-fsSL", "-A", UA, url],
                capture_output=True,
                check=True,
            )
            return result.stdout
        except subprocess.CalledProcessError as exc:
            last_err = exc
            time.sleep(2 + attempt * 2)
    assert last_err is not None
    raise last_err


def wiki_thumb(title: str) -> str | None:
    if title.startswith("commons:"):
        file_title = title.removeprefix("commons:")
        params = urllib.parse.urlencode(
            {
                "action": "query",
                "titles": file_title,
                "prop": "imageinfo",
                "iiprop": "url",
                "iiurlwidth": 900,
                "format": "json",
            }
        )
        data = json.loads(curl_get(f"https://commons.wikimedia.org/w/api.php?{params}"))
        for page in data.get("query", {}).get("pages", {}).values():
            info = page.get("imageinfo", [{}])[0]
            return info.get("thumburl") or info.get("url")
        return None

    params = urllib.parse.urlencode(
        {
            "action": "query",
            "titles": title,
            "prop": "pageimages",
            "piprop": "thumbnail",
            "pithumbsize": 800,
            "format": "json",
        }
    )
    data = json.loads(curl_get(f"https://en.wikipedia.org/w/api.php?{params}"))
    for page in data.get("query", {}).get("pages", {}).values():
        if "missing" in page:
            return None
        thumb = page.get("thumbnail", {}).get("source")
        if thumb:
            return thumb
    return None


def to_portrait(img: Image.Image, size: int = SIZE) -> Image.Image:
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = max(0, int((h - side) * 0.15))
    img = img.crop((left, top, left + side, top + side))
    return img.resize((size, size), Image.Resampling.LANCZOS)


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    ok, fail = 0, 0

    for slug, title in PLAYERS.items():
        dest = OUT / f"{slug}.jpg"
        try:
            thumb_url = wiki_thumb(title)
            if not thumb_url:
                print(f"SKIP {slug}: no image on Wikipedia ({title})")
                fail += 1
                continue
            raw = curl_get(thumb_url)
            img = Image.open(BytesIO(raw)).convert("RGB")
            to_portrait(img).save(dest, "JPEG", quality=88, optimize=True)
            print(f"OK   {slug} <- {title} ({dest.stat().st_size // 1024} KB)")
            ok += 1
            time.sleep(1.5)
        except subprocess.CalledProcessError as exc:
            print(f"FAIL {slug}: curl error {exc.returncode}")
            fail += 1
        except Exception as exc:
            print(f"FAIL {slug}: {exc}")
            fail += 1

    print(f"\nDone: {ok} saved, {fail} failed")
    return 0 if fail == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
