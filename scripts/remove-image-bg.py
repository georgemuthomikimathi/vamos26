#!/usr/bin/env python3
"""Remove solid dark backgrounds from trophy/ball PNGs."""

from __future__ import annotations

import shutil
from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "images"
ASSETS = Path("/Users/georgekimathi/.cursor/projects/empty-window/assets")


def remove_background(
    input_path: Path,
    output_path: Path,
    *,
    tolerance: int = 42,
    feather: int = 2,
    fringe_max: int = 52,
    fringe_iterations: int = 12,
) -> None:
    img = Image.open(input_path).convert("RGBA")
    w, h = img.size
    pixels = img.load()

    def color_dist(a: tuple[int, int, int, int], b: tuple[int, int, int, int]) -> int:
        return max(abs(a[0] - b[0]), abs(a[1] - b[1]), abs(a[2] - b[2]))

    seeds: list[tuple[int, int]] = []
    for x in range(w):
        seeds.append((x, 0))
        seeds.append((x, h - 1))
    for y in range(h):
        seeds.append((0, y))
        seeds.append((w - 1, y))

    bg_samples = [pixels[s[0], s[1]][:3] for s in seeds[: min(len(seeds), 40)]]
    bg = (
        sum(c[0] for c in bg_samples) // len(bg_samples),
        sum(c[1] for c in bg_samples) // len(bg_samples),
        sum(c[2] for c in bg_samples) // len(bg_samples),
        255,
    )

    visited = bytearray(w * h)
    queue: deque[tuple[int, int]] = deque()

    for sx, sy in seeds:
        idx = sy * w + sx
        if visited[idx]:
            continue
        if color_dist(pixels[sx, sy], bg) <= tolerance:
            visited[idx] = 1
            queue.append((sx, sy))

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if nx < 0 or ny < 0 or nx >= w or ny >= h:
                continue
            idx = ny * w + nx
            if visited[idx]:
                continue
            if color_dist(pixels[nx, ny], bg) <= tolerance:
                visited[idx] = 1
                queue.append((nx, ny))

    for y in range(h):
        for x in range(w):
            if not visited[y * w + x]:
                continue
            r, g, b, a = pixels[x, y]
            dist = color_dist((r, g, b, 255), bg)
            if dist <= tolerance:
                alpha = 0
            elif dist <= tolerance + feather * 8:
                alpha = int(255 * (dist - tolerance) / (feather * 8))
            else:
                alpha = 255
            pixels[x, y] = (r, g, b, min(a, alpha))

    neighbors = (
        (-1, -1), (0, -1), (1, -1),
        (-1, 0),           (1, 0),
        (-1, 1),  (0, 1),  (1, 1),
    )

    for _ in range(fringe_iterations):
        to_clear: list[tuple[int, int]] = []
        for y in range(h):
            for x in range(w):
                r, g, b, a = pixels[x, y]
                if a == 0 or max(r, g, b) > fringe_max:
                    continue
                for dx, dy in neighbors:
                    nx, ny = x + dx, y + dy
                    if nx < 0 or ny < 0 or nx >= w or ny >= h or pixels[nx, ny][3] == 0:
                        to_clear.append((x, y))
                        break
        for x, y in to_clear:
            r, g, b, _ = pixels[x, y]
            pixels[x, y] = (r, g, b, 0)

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a and max(r, g, b) < 28:
                pixels[x, y] = (r, g, b, 0)

    bbox = img.getbbox()
    if bbox:
        pad = 8
        bbox = (
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(w, bbox[2] + pad),
            min(h, bbox[3] + pad),
        )
        img = img.crop(bbox)

    img.save(output_path, optimize=True)
    print(f"Saved {output_path} ({img.size[0]}x{img.size[1]})")


def main() -> None:
    for name in ("world-cup-trophy", "trionda-ball"):
        source = ASSETS / f"{name.replace('world-cup-', '')}.png" if "trophy" in name else ASSETS / "trionda-ball.png"
        if name == "world-cup-trophy":
            source = ASSETS / "world-cup-trophy.png"
        local_source = ROOT / f"{name}.source.png"
        if source.exists() and not local_source.exists():
            shutil.copy(source, local_source)

    remove_background(
        local_source if (local_source := ROOT / "world-cup-trophy.source.png").exists() else ROOT / "world-cup-trophy.png",
        ROOT / "world-cup-trophy.png",
        tolerance=45,
        fringe_max=58,
    )
    remove_background(
        local_source if (local_source := ROOT / "trionda-ball.source.png").exists() else ROOT / "trionda-ball.png",
        ROOT / "trionda-ball.png",
        tolerance=58,
        fringe_max=65,
    )


if __name__ == "__main__":
    main()
