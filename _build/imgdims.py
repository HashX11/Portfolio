"""Read the pixel size of every bitmap under assets/ and write img-dims.json.

Why this exists
---------------
Every <img> on the page is `loading="lazy"` and none of them carried a width /
height attribute, so an unloaded image was a zero-height box. Jump to an anchor
near the bottom of a 45 000 px page and the browser computed the target from a
layout in which several thousand pixels of imagery had not happened yet: the
scroll landed, the pictures decoded, everything below shifted down, and the
reader ended up staring at a heading two or three projects earlier than the one
they clicked.

build.py stamps the real intrinsic size onto each <img> from this map, which
gives the browser the aspect ratio before the bytes arrive, so the page is the
right height from the first paint. CSS still drives the rendered size
(`width:100%;height:auto`, or an explicit `aspect-ratio` where one is set) —
the attributes only supply the ratio.

  python imgdims.py        # rewrites _build/img-dims.json

Stdlib only: JPEG / PNG / GIF / WebP / AVIF headers, parsed by hand.
"""
import json, os, struct, sys

SRC  = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(SRC)
OUT  = os.path.join(SRC, "img-dims.json")
EXT  = (".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif")


def jpeg(f):
    f.seek(2)
    while True:
        b = f.read(1)
        if not b:
            return None
        if b != b"\xff":
            continue
        while b == b"\xff":
            b = f.read(1)
        marker = b[0]
        if marker in (0xD8, 0x01) or 0xD0 <= marker <= 0xD7:
            continue
        ln = struct.unpack(">H", f.read(2))[0]
        if 0xC0 <= marker <= 0xCF and marker not in (0xC4, 0xC8, 0xCC):
            f.read(1)
            h, w = struct.unpack(">HH", f.read(4))
            return w, h
        f.seek(ln - 2, 1)


def png(f):
    f.seek(16)
    w, h = struct.unpack(">II", f.read(8))
    return w, h


def gif(f):
    f.seek(6)
    w, h = struct.unpack("<HH", f.read(4))
    return w, h


def webp(f):
    f.seek(12)
    tag = f.read(4)
    if tag == b"VP8 ":
        f.seek(26)
        w, h = struct.unpack("<HH", f.read(4))
        return w & 0x3FFF, h & 0x3FFF
    if tag == b"VP8L":
        f.seek(21)
        n = struct.unpack("<I", f.read(4))[0]
        return (n & 0x3FFF) + 1, ((n >> 14) & 0x3FFF) + 1
    if tag == b"VP8X":
        f.seek(24)
        d = f.read(6)
        return (d[0] | d[1] << 8 | d[2] << 16) + 1, (d[3] | d[4] << 8 | d[5] << 16) + 1


def avif(f):
    """ispe box carries the canvas size; good enough to walk the file for it."""
    blob = f.read(4 << 20)
    i = blob.find(b"ispe")
    if i < 0:
        return None
    w, h = struct.unpack(">II", blob[i + 8:i + 16])
    return w, h


def sniff(head):
    """Trust the bytes, not the extension - several .jpg files in assets/img
    are actually PNGs, and a JPEG parser turns PNG data into plausible-looking
    nonsense rather than failing."""
    if head[:8] == b"\x89PNG\r\n\x1a\n":
        return png
    if head[:3] == b"\xff\xd8\xff":
        return jpeg
    if head[:4] in (b"GIF8",):
        return gif
    if head[:4] == b"RIFF" and head[8:12] == b"WEBP":
        return webp
    if head[4:8] == b"ftyp":
        return avif
    return None


def size(path):
    try:
        with open(path, "rb") as f:
            reader = sniff(f.read(32))
            if not reader:
                return None
            f.seek(0)
            return reader(f)
    except Exception:
        return None


def main():
    dims, bad = {}, []
    for root, _dirs, files in os.walk(os.path.join(SITE, "assets")):
        for name in files:
            if not name.lower().endswith(EXT):
                continue
            full = os.path.join(root, name)
            rel = os.path.relpath(full, SITE).replace("\\", "/")
            wh = size(full)
            if wh and wh[0] > 0 and wh[1] > 0:
                dims[rel] = [int(wh[0]), int(wh[1])]
            else:
                bad.append(rel)
    json.dump(dims, open(OUT, "w", encoding="utf-8"), indent=0, sort_keys=True)
    print("wrote", OUT, len(dims), "images")
    if bad:
        print("could not read:", ", ".join(bad), file=sys.stderr)


if __name__ == "__main__":
    main()
