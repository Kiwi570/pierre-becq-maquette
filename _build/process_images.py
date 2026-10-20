"""Convert the client's photos to resized WebP files and write a manifest.

Usage: python3 -I process_images.py SRC_DIR OUT_IMG_DIR MANIFEST_JSON
Photos are never cropped, recoloured or filtered: only orientation fix,
resize and WebP encoding.
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageOps

SRC = Path(sys.argv[1])
OUT = Path(sys.argv[2])
MANIFEST = Path(sys.argv[3])

WIDTHS = [480, 960, 1600, 2400]

# source relative path -> (output folder, output base name)
MAP = {
    "maison/accueil-photo.jpg": ("maison", "facade-rue-gambetta"),
    "maison/apropos-1.jpg": ("maison", "boutique-portrait"),
    "maison/apropos-3.jpg": ("maison", "logo-cne"),
    "maison/apropos-4.jpg": ("maison", "insigne-expert-judiciaire"),
}
for f in sorted((SRC / "objets").iterdir()):
    if f.name.startswith("chope-ivoire"):
        continue  # retirée de la maquette : ivoire, certificat intra-UE à fournir
    MAP[f"objets/{f.name}"] = ("objets", f.stem)


def dominant(img):
    """Average colour of the object, ignoring near-white and transparent pixels."""
    small = img.convert("RGBA").resize((96, 96))
    r = g = b = n = 0
    for pr, pg, pb, pa in small.getdata():
        if pa < 200:
            continue
        if pr > 232 and pg > 232 and pb > 232:
            continue
        r += pr
        g += pg
        b += pb
        n += 1
    if not n:
        return None
    return "#%02x%02x%02x" % (r // n, g // n, b // n)


manifest = {}
for rel, (folder, base) in MAP.items():
    src = SRC / rel
    img = Image.open(src)
    img = ImageOps.exif_transpose(img)
    has_alpha = img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info)
    img = img.convert("RGBA" if has_alpha else "RGB")
    w, h = img.size
    sizes = [x for x in WIDTHS if x < w] + [min(w, WIDTHS[-1])]
    sizes = sorted(set(sizes))
    (OUT / folder).mkdir(parents=True, exist_ok=True)
    for sw in sizes:
        sh = round(h * sw / w)
        out = img if sw == w else img.resize((sw, sh), Image.LANCZOS)
        out.save(OUT / folder / f"{base}-{sw}.webp", "WEBP", quality=82, method=6)
    manifest[f"{folder}/{base}"] = {
        "w": w,
        "h": h,
        "sizes": sizes,
        "alpha": has_alpha,
        "color": dominant(img),
    }
    print("OK", folder, base, w, h, sizes)

MANIFEST.write_text(json.dumps(manifest, indent=1))
print(len(manifest), "images")
