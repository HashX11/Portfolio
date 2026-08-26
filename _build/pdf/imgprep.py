"""Build _pdf/img — one file per picture, sized to the box it is drawn into.

The old pipeline shrank every picture in the document to the same 1250 px
and the same quality, whatever it was for. A 42 mm thumbnail carried four
times the pixels it could show, and a 297 mm full-bleed plate carried a
third of the pixels it needed: the document was heavy AND soft, which is
the worst of both.

So the layout is asked first. print.html?src=raw draws the whole document
against the original assets and reports the millimetre box every <img>
actually occupies; each file is then cut and scaled for that box and
nothing else.

  * a `cover` picture is pre-cropped to its box's proportion, so no pixel
    is stored that CSS would only throw away
  * a `contain` picture (a drawing, a sheet, a board) is fitted whole
  * upscaling is allowed to MAXUP and is followed by an unsharp mask,
    because a clean render upscales far better than a photograph and
    these are nearly all renders
  * a handful of frames still carry the Unreal viewport's axis gizmo in
    the corner. They are trimmed here rather than left in a portfolio.

  python imgprep.py            # share build   — 200 dpi
  python imgprep.py 300 0.92   # print build   — 300 dpi

Needs print.html served over http (python -m http.server 8777) and Pillow.
"""
import sys, os, json, io
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import cdp
from PIL import Image, ImageFilter

SITE   = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PDFDIR = os.path.join(SITE, "_pdf")
OUT    = os.path.join(PDFDIR, "img")
SRCDIRS = [os.path.join(SITE, "assets", "img"), os.path.join(SITE, "assets", "video")]

DPI   = int(sys.argv[1])   if len(sys.argv) > 1 else 200
QBASE = float(sys.argv[2]) if len(sys.argv) > 2 else 0.89
MAXUP = 2.0                      # never invent more than twice the pixels
MM    = 25.4

# Frames captured inside the Unreal editor keep its axis gizmo in the
# bottom-left corner, and one keeps the toolbar along the top. Fractions of
# the frame to remove: (left, top, right, bottom).
GIZMO = 0.055
CROP = {}
for pre in ("auh_", "ajm_", "rak_", "fjr_", "moi_post_", "moi_city", "reem_ue"):
    CROP[pre] = (GIZMO, 0, 0, 0)
CROP_EXACT = {
    "moi_city2.jpg": (GIZMO, 0.042, 0, 0),      # editor toolbar along the top
}

# Plates whose margin is part of the document and must not be trimmed off:
# a certificate is a piece of paper, and its paper is the point.
NOTRIM = {
    "cert_riba.jpg", "cert_bau.jpg", "cert_fibrex.jpg", "cert_ldrs.jpg",
    "cert_rome.jpg", "cert_max.jpg", "cert_acad.jpg", "cert_ic3.jpg",
    "cert_rhino.jpg", "cert_ourcity.jpg",
    "y5_poster.jpg", "y5_bposter.jpg", "y4_mosqueposter.jpg",
}

# Where the interesting half of a frame is, when a crop has to choose.
# 0 = left/top edge, 1 = right/bottom edge, 0.5 = centre.
ANCHOR = {
    "auh_tw1.jpg":       (0.5, 0.62),   # the cover: keep the city, lose sky
    "at_4.jpg":          (0.5, 0.58),
    "fx_gug_model2.jpg": (0.5, 0.58),
    "tk_main.jpg":       (0.5, 0.52),
    "fx_zayed_done.jpg": (0.5, 0.62),
    "y5_th1.jpg":        (0.5, 0.58),
    "rz_bung_night.jpg": (0.62, 0.55),
    "sky_court.jpg":     (0.5, 0.55),
    "at_1.jpg":          (0.5, 0.60),
    "fx_nhm_render.jpg": (0.5, 0.56),
    "moi_realtwin.jpg":  (0.5, 0.46),
    "at_x.jpg":          (0.5, 0.52),
    "auh_gate.jpg":      (0.5, 0.42),
    "auh_tw7.jpg":       (0.5, 0.58),
}


def find(name):
    for d in SRCDIRS:
        p = os.path.join(d, name)
        if os.path.exists(p):
            return p
    return None


def cropbox(name, w, h):
    c = CROP_EXACT.get(name)
    if not c:
        for pre, v in CROP.items():
            if name.startswith(pre):
                c = v
                break
    if not c:
        return (0, 0, w, h)
    l, t, r, b = c
    return (int(w * l), int(h * t), int(w * (1 - r)), int(h * (1 - b)))


def ground(im):
    """The colour the picture's own border is, sampled at all four corners."""
    w, h = im.size
    k = max(2, int(min(w, h) * 0.02))
    px = []
    for x0, y0 in ((0, 0), (w - k, 0), (0, h - k), (w - k, h - k)):
        patch = im.crop((x0, y0, x0 + k, y0 + k)).resize((1, 1), Image.BOX)
        px.append(patch.getpixel((0, 0)))
    px.sort(key=lambda c: sum(c))
    return px[len(px) // 2]


def autotrim(im, col, tol=13):
    """Take off a uniform border the export baked in.

    Several of the mounted plates arrive inside their own frame: a viewport
    grab letterboxed in black, a diagram floating in a field of studio grey, a
    drawing with 15 % of white margin on every side. Mounted on a plate, that
    border reads as a second frame drawn inside the first, and the picture
    itself ends up half the size it should be. Only ever applied to plates
    that are shown whole, only when the border really is uniform, and never
    more than a third of a side — a render with a plain sky must survive.
    """
    from PIL import ImageChops
    bg = Image.new("RGB", im.size, col)
    diff = ImageChops.difference(im, bg).convert("L").point(lambda v: 255 if v > tol else 0)
    box = diff.getbbox()
    if not box:
        return im
    w, h = im.size
    l, t, r, b = box
    if (l / w > .34 or t / h > .34 or (w - r) / w > .34 or (h - b) / h > .34):
        return im
    if l < w * .012 and t < h * .012 and (w - r) < w * .012 and (h - b) < h * .012:
        return im                                   # nothing worth taking off
    pad = int(round(min(w, h) * 0.008))
    return im.crop((max(0, l - pad), max(0, t - pad),
                    min(w, r + pad), min(h, b + pad)))


def matte(im, ar, col):
    """Extend the canvas to the box's proportion in the picture's own ground
    colour, so `contain` has nothing left to letterbox. A render made on a
    near-black studio ground sat inside a plate of a slightly different black
    and drew a rectangle round itself; matted, the seam has nowhere to be."""
    w, h = im.size
    cur = w / h
    if abs(cur - ar) < 0.004:
        return im
    if cur > ar:
        nh = int(round(w / ar)); nw = w
    else:
        nw = int(round(h * ar)); nh = h
    out = Image.new("RGB", (nw, nh), col)
    out.paste(im, ((nw - w) // 2, (nh - h) // 2))
    return out


def to_aspect(im, ar, anchor):
    """Centre-cut to the given proportion, biased by the anchor."""
    w, h = im.size
    cur = w / h
    ax, ay = anchor
    if abs(cur - ar) < 0.004:
        return im
    if cur > ar:                                  # too wide: take a slice
        nw = int(round(h * ar))
        x = int(round((w - nw) * ax))
        return im.crop((x, 0, x + nw, h))
    nh = int(round(w / ar))                       # too tall: take a band
    y = int(round((h - nh) * ay))
    return im.crop((0, y, w, y + nh))


def main():
    os.makedirs(OUT, exist_ok=True)
    c = cdp.Chrome(width=1400, height=990, port=9341)
    try:
        c.goto("http://localhost:8777/_pdf/print.html?src=raw", wait=5.0)
        n = c.js("document.querySelectorAll('.pg').length")
        boxes = c.js("window.__boxes()")
        missing = c.js("[...document.images].filter(i=>i.complete&&!i.naturalWidth)"
                       ".map(i=>i.src.split('/').pop())")
    finally:
        c.close()

    print("pages: %s   pictures: %d" % (n, len(boxes)))
    if missing:
        print("!! MISSING SOURCE:", ", ".join(sorted(set(missing))))

    total = 0
    up = []
    for i, (name, box) in enumerate(sorted(boxes.items())):
        p = find(name)
        if not p:
            print("  !! no source for", name)
            continue
        im = Image.open(p).convert("RGB")
        im = im.crop(cropbox(name, *im.size))
        sw, sh = im.size

        bw = max(1.0, box["w"]) / MM * DPI       # the box, in pixels
        bh = max(1.0, box["h"]) / MM * DPI
        anchor = ANCHOR.get(name, (0.5, 0.5))

        if box["fit"]:
            if name not in NOTRIM:
                im = autotrim(im, ground(im))
                sw, sh = im.size
            # Only a plate that is itself dark may be matted. A drawing mounted
            # on white whose own corners happen to be dark would otherwise be
            # extended into a black rectangle sitting on a white sheet.
            if "pltd" in (box.get("cls") or ""):
                g = ground(im)
                if sum(g) / 3 < 46:
                    im = matte(im, bw / bh, g)
                    sw, sh = im.size
            # mounted whole: fit inside the box, keep the real proportion
            k = min(bw / sw, bh / sh)
        else:
            # cropped: cut to the box's proportion first, then one clean scale
            im = to_aspect(im, bw / bh, anchor)
            sw, sh = im.size
            k = bw / sw

        k = min(k, MAXUP)
        tw, th = max(2, int(round(sw * k))), max(2, int(round(sh * k)))
        if k > 1.001:
            up.append((name, round(k, 2)))
        if (tw, th) != (sw, sh):
            im = im.resize((tw, th), Image.LANCZOS)

        # A resample always costs acutance. Give it back — more of it when
        # pixels were invented, less when they were merely discarded.
        if k > 1.02:
            im = im.filter(ImageFilter.UnsharpMask(radius=1.15, percent=78, threshold=3))
        elif k < 0.98:
            im = im.filter(ImageFilter.UnsharpMask(radius=0.6, percent=46, threshold=3))

        q = int(round(QBASE * 100))
        if box["fit"]:
            q = min(96, q + 3)              # line work is unforgiving
        if tw * th < 260000:
            q = min(96, q + 2)              # small files, spend the bytes

        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=q, subsampling=0, optimize=True, progressive=True)
        raw = buf.getvalue()
        open(os.path.join(OUT, os.path.splitext(name)[0] + ".jpg"), "wb").write(raw)
        total += len(raw)
        if i % 20 == 0:
            print("  %3d/%d  %-28s %4dx%-4d %5dKB" % (i, len(boxes), name, tw, th, len(raw) // 1024))

    print("written: %.1f MB at %d dpi" % (total / 1048576.0, DPI))
    if up:
        up.sort(key=lambda x: -x[1])
        print("upscaled (%d): %s" % (len(up), ", ".join("%s x%.2f" % u for u in up[:12])))

    # any file in img/ the document no longer asks for
    want = {os.path.splitext(k)[0] + ".jpg" for k in boxes}
    stale = [f for f in os.listdir(OUT) if f not in want]
    for f in stale:
        os.remove(os.path.join(OUT, f))
    if stale:
        print("removed %d file(s) the document no longer uses" % len(stale))


if __name__ == "__main__":
    main()
