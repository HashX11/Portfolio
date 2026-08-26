"""What is still in English, and what is in the dictionary but no longer on the page.

  python i18n_extract.py      # refresh i18n-en.json from the built index.html
  python i18n_status.py       # summary
  python i18n_status.py -m    # list every untranslated string

Adding Arabic to something new: put the English text as the key and the Arabic
as the value in i18n-ar.json, then re-run build.py. Keys are the element's plain
text with runs of whitespace collapsed - which is what the page reads back at run
time, so it has to match exactly, <br> included (a <br> contributes nothing, so
"Three museums,<br>panel by panel" keys as "Three museums,panel by panel").

Values may carry inline markup - <b>, <em>, <i>, <br> - and {{0}}, {{1}} … which
stand for the element's non-text children in order: icons, images, and anything
with an id. Those are moved into place rather than rebuilt, so a script holding
one of them keeps writing to the node that is really on screen.

Keys that match nothing on the page are not necessarily wrong: strings written by
a script (the contents sheet, the scan's captions, the viewer's status line)
never appear in the HTML, and are reported separately as "runtime-only".
"""
import json, os, sys

SRC = os.path.dirname(os.path.abspath(__file__))
EN = json.load(open(os.path.join(SRC, "i18n-en.json"), encoding="utf-8"))
AR = json.load(open(os.path.join(SRC, "i18n-ar.json"), encoding="utf-8"))

missU = [k for k in EN["units"] if k not in AR["units"]]
missA = [k for k in EN["attrs"] if k not in AR["attrs"]]
runtime = [k for k in AR["units"] if k not in EN["units"]]

nU, nA = len(EN["units"]), len(EN["attrs"])
print("text    %d/%d translated  (%d still English)" % (nU - len(missU), nU, len(missU)))
print("alt/aria %d/%d translated  (%d still English)" % (nA - len(missA), nA, len(missA)))
print("runtime-only strings in the dictionary: %d" % len(runtime))

if "-m" in sys.argv:
    if missU:
        print("\n--- text still in English ---")
        for k in missU:
            print("  " + k)
    if missA:
        print("\n--- alt / aria still in English ---")
        for k in missA:
            print("  " + k)
else:
    left = missU[:8]
    if left:
        print("\nstill English, first few:")
        for k in left:
            print("  " + k)
        print("  (run with -m for the full list)")
