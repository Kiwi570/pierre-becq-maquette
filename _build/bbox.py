"""Find where each object sits in its photo (for cotes and margin trimming).

Usage: python3 -I bbox.py SRC_DIR MANIFEST_JSON
Adds to each objets/* entry:
  bg:    "white" | "transparent" | "scene"
  bbox:  [x, y, w, h] of the object, in source pixels (white/transparent bg only)
  frame: [x, y, w, h] display window = bbox + margin (never cuts the object)
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter, ImageOps

SRC = Path(sys.argv[1])
MANIFEST = Path(sys.argv[2])
m = json.loads(MANIFEST.read_text())

src_names = {p.stem: p for p in (SRC / "objets").iterdir()}

for key, info in m.items():
    if not key.startswith("objets/"):
        continue
    stem = key.split("/", 1)[1]
    img = ImageOps.exif_transpose(Image.open(src_names[stem]))
    rgba = img.convert("RGBA")
    W, H = rgba.size
    scale = 900 / max(W, H)
    small = rgba.resize((max(1, round(W * scale)), max(1, round(H * scale))))
    a = np.asarray(small).astype(np.int16)
    alpha = a[..., 3]
    rgb = a[..., :3]
    mn = rgb.min(axis=2)
    spread = rgb.max(axis=2) - mn

    h, w = mn.shape
    ring = np.zeros_like(mn, dtype=bool)
    b = max(2, int(min(h, w) * 0.02))
    ring[:b, :] = ring[-b:, :] = True
    ring[:, :b] = ring[:, -b:] = True
    transparent_ring = (alpha[ring] < 40).mean()
    white_ring = ((mn[ring] > 228) & (alpha[ring] >= 40)).mean()

    if transparent_ring > 0.9:
        bg = "transparent"
    elif white_ring + transparent_ring > 0.9:
        bg = "white"
    else:
        bg = "scene"
    info["bg"] = bg
    if bg == "scene":
        info["bbox"] = None
        info["frame"] = [0, 0, W, H]
        print(f"{stem:32s} scene")
        continue

    obj = (alpha > 40) & ((mn < 226) | (spread > 22))
    mask = Image.fromarray((obj * 255).astype(np.uint8))
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
    mk = np.asarray(mask) > 0
    rows, cols = mk.sum(axis=1), mk.sum(axis=0)
    ry = np.where(rows > max(2, rows.max() * 0.012))[0]
    cx = np.where(cols > max(2, cols.max() * 0.012))[0]
    box = (cx.min(), ry.min(), cx.max() + 1, ry.max() + 1) if len(ry) and len(cx) else None
    if not box:
        info["bbox"] = None
        info["frame"] = [0, 0, W, H]
        continue
    x0, y0, x1, y1 = [v / scale for v in box]
    bw, bh = x1 - x0, y1 - y0
    info["bbox"] = [round(x0), round(y0), round(bw), round(bh)]
    pad = 0.09 * max(bw, bh)
    fx0, fy0 = max(0, x0 - pad), max(0, y0 - pad)
    fx1, fy1 = min(W, x1 + pad), min(H, y1 + pad)
    info["frame"] = [round(fx0), round(fy0), round(fx1 - fx0), round(fy1 - fy0)]
    cover = (bw * bh) / (W * H)
    print(f"{stem:32s} {bg:12s} bbox={info['bbox']} frame={info['frame']} cover={cover:.2f}")

MANIFEST.write_text(json.dumps(m, indent=1))
