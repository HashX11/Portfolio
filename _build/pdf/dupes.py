"""Every picture in the document, checked against every other.

The archive holds a dozen renders exported more than once under different
names — auh_gate, auh_marina and auh_tw4 are one picture, ajm_ba and
ajm_muni are one picture — and the previous document printed three copies
of the same Abu Dhabi marina on three different pages as three different
projects. Nothing in the filenames says so, so the pixels have to.

A 12x12 difference hash: resize to 13x12 greyscale and record, for every
pixel, whether it is brighter than the one to its right. Two exports of the
same render agree on all 144 bits; two different views of the same street
do not. Distances up to about 20 are worth a look, 0 means identical.

  python dupes.py

Prints every pair inside the threshold. A few are meant to be there and are
named below; anything else is a duplicate about to be shipped.
"""
import os, re, itertools
from PIL import Image

SITE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DIRS = [os.path.join(SITE, "assets", "img"), os.path.join(SITE, "assets", "video")]
THRESHOLD = 20

# Pairs that are close on purpose, and why.
EXPECTED = {
    ("cert_acad.jpg", "cert_max.jpg"):
        "two Autodesk certificates on one template — different qualifications",
    ("rz_top.jpg", "tk_1.jpg"):
        "the same drone frame, before and after the units are plotted on it",
    ("at_comfort.jpg", "at_shadow.jpg"):
        "two analysis layers drawn over one base plan",
}


def find(n):
    for d in DIRS:
        p = os.path.join(d, n)
        if os.path.exists(p):
            return p
    return None


def dhash(p, s=12):
    im = Image.open(p).convert("L").resize((s + 1, s), Image.LANCZOS)
    grab = getattr(im, "get_flattened_data", None) or im.getdata   # Pillow 14
    px = list(grab())
    return [px[y * (s + 1) + x] > px[y * (s + 1) + x + 1]
            for y in range(s) for x in range(s)]


def main():
    src = open(os.path.join(SITE, "_pdf", "pages.js"), encoding="utf-8").read()
    names = sorted(set(re.findall(r"'([A-Za-z0-9_\-]+\.(?:jpg|png|jpeg))'", src)))
    H = {}
    for n in names:
        p = find(n)
        if p:
            H[n] = dhash(p)
        else:
            print("  !! no source for", n)

    bad = 0
    print("checked %d pictures" % len(H))
    for a, b in itertools.combinations(sorted(H), 2):
        d = sum(1 for x, y in zip(H[a], H[b]) if x != y)
        if d > THRESHOLD:
            continue
        why = EXPECTED.get((a, b)) or EXPECTED.get((b, a))
        if why:
            print("   ok   dist %2d   %-26s %-26s  %s" % (d, a, b, why))
        else:
            bad += 1
            print("   !!   dist %2d   %-26s %-26s  DUPLICATE" % (d, a, b))
    print("clean" if not bad else "%d duplicate pair(s) to resolve" % bad)
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
