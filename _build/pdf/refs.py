"""Rebuild assets/3d/ref/ — the "In the real world" strip in the 3D viewer.

One folder per model, named for the building; the images inside it are the
real photographs of it. This writes them out as <slug>_1.jpg, <slug>_2.jpg …
which is the only naming the viewer knows, and prints the count each model
ends up with so the `r:` field in index.base.html's DATA table can be set
to match. A model whose folder is missing is left exactly as it was — the
two Rize models have no real-world counterpart and never will.

  python refs.py "C:\\Users\\X11\\Desktop\\New folder"
  python refs.py <src> --dry        # list what it would do, touch nothing
"""
import os, sys, io
from PIL import Image, ImageOps

SITE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(SITE, "assets", "3d", "ref")

MAX = 1600          # long edge — big enough for the lightbox to zoom into
Q = 86

# folder name on disk -> the slug the viewer asks for
SLUG = {
    "ADNOC Gas Station":           "adnoc",
    "Al Reem Bay":                 "al_reem_bay",
    "Al Wifaq Tower":              "al_wifaq",
    "Amaya Towers":                "amaya",
    "DAMAC Marina Bay":            "damac",
    "Hydra Towers":                "hydra",
    "Mangrove Place":              "mangrove",
    "Marina Rise Tower":           "marina_rise",
    "Masjid Al Reem":              "masjid",
    "Paragon Bay Mall":            "paragon",
    "Reem Hospital":               "reem_hospital",
    "Reem Mall":                   "reem_mall",
    "Repton School - Rose Campus": "repton_rose",
    "Shams Meera Towers":          "shams_meera",
    "Sigma & Omega Towers":        "sigma_omega",
    "Sorbonne University":         "sorbonne",
    "The Kite Residences":         "kite",
    "Y Tower":                     "y_tower",
}
EXT = (".jpg", ".jpeg", ".png", ".webp")


def dhash(im, s=10):
    g = im.convert("L").resize((s + 1, s), Image.LANCZOS)
    grab = getattr(g, "get_flattened_data", None) or g.getdata
    px = list(grab())
    return [px[y * (s + 1) + x] > px[y * (s + 1) + x + 1]
            for y in range(s) for x in range(s)]


def main():
    src = sys.argv[1]
    dry = "--dry" in sys.argv
    os.makedirs(OUT, exist_ok=True)

    found = {d for d in os.listdir(src) if os.path.isdir(os.path.join(src, d))}
    unknown = found - set(SLUG)
    missing = set(SLUG) - found
    if unknown:
        print("!! folders with no model:", ", ".join(sorted(unknown)))
    if missing:
        print("!! models with no folder:", ", ".join(sorted(missing)))

    # clear only the slugs we are about to rewrite; leave teapot/barrel alone
    if not dry:
        for f in os.listdir(OUT):
            stem = os.path.splitext(f)[0].rsplit("_", 1)[0]
            if stem in SLUG.values():
                os.remove(os.path.join(OUT, f))

    counts, total = {}, 0
    for folder in sorted(SLUG):
        if folder not in found:
            continue
        slug = SLUG[folder]
        files = sorted(f for f in os.listdir(os.path.join(src, folder))
                       if f.lower().endswith(EXT))
        n = 0
        seen = []                 # the same photo saved twice as .jpg and .png
        for f in files:
            p = os.path.join(src, folder, f)
            im = Image.open(p)
            im = ImageOps.exif_transpose(im)        # iPhone frames carry rotation
            im = im.convert("RGB")
            h = dhash(im)
            twin = next((s for s, hh in seen if sum(1 for a, b in zip(h, hh) if a != b) <= 6), None)
            if twin:
                print("   %-14s skip %-34s same picture as %s" % (slug, f[:34], twin))
                continue
            seen.append((f, h))
            n += 1
            if dry:
                print("   %-14s %d  <- %s" % (slug, n, f))
                continue
            if max(im.size) > MAX:
                k = MAX / max(im.size)
                im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
            buf = io.BytesIO()
            im.save(buf, "JPEG", quality=Q, subsampling=1, optimize=True, progressive=True)
            raw = buf.getvalue()
            open(os.path.join(OUT, "%s_%d.jpg" % (slug, n)), "wb").write(raw)
            total += len(raw)
        counts[slug] = n
        print("  %-14s %d image%s" % (slug, n, "" if n == 1 else "s"))

    print("\nwrote %d files, %.1f MB" % (sum(counts.values()), total / 1048576.0))
    print("\nDATA counts to set in _build/index.base.html:")
    for slug in sorted(counts):
        print("  %-14s r:%d" % (slug, counts[slug]))


if __name__ == "__main__":
    main()
