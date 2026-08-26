"""Render _pdf/print.html to PDF, but only if the document passes its own audit.

  python mkpdf.py Hashem-Dankar-Portfolio.pdf
  python mkpdf.py Hashem-Dankar-Portfolio.pdf --raw      # against assets/img
  python mkpdf.py ... --force                            # ship it anyway

The audit is pages.js's window.__audit(): it walks every finished page and
reports any box whose content has grown past it, anything that has left the
page, and anything printed across the folio. Those three faults are exactly
what made the previous document look careless, so the build refuses to
produce a PDF while any of them is still true.
"""
import sys, os, time, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import cdp

SITE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
args  = [a for a in sys.argv[1:] if not a.startswith("--")]
flags = {a for a in sys.argv[1:] if a.startswith("--")}
name  = args[0] if args else "Hashem-Dankar-Portfolio.pdf"
url   = "http://localhost:8777/_pdf/print.html" + ("?src=raw" if "--raw" in flags else "")

c = cdp.Chrome(width=1400, height=990, port=9342)
try:
    c.goto(url, wait=6.0)
    n = c.js("document.querySelectorAll('.pg').length")
    print("pages:", n)

    missing = c.js("[...document.images].filter(i=>!i.complete||!i.naturalWidth)"
                   ".map(i=>i.src.split('/').pop())")
    if missing:
        print("!! missing images:", ", ".join(sorted(set(missing))))

    c.js("document.fonts.ready", await_promise=False)
    time.sleep(4.0)

    bad = c.js("window.__audit()") or []
    if bad:
        print("\n!! AUDIT — %d fault(s):" % len(bad))
        for b in bad[:60]:
            print("   ", b)
        if len(bad) > 60:
            print("    … and %d more" % (len(bad) - 60))
        if "--force" not in flags:
            raise SystemExit("\nrefusing to render. Fix the layout, or pass --force.")
        print("\n--force given: rendering anyway.\n")
    else:
        print("audit: clean")

    out = os.path.join(SITE, name)
    c.pdf(out, printBackground=True, preferCSSPageSize=True,
          marginTop=0, marginBottom=0, marginLeft=0, marginRight=0,
          landscape=False, scale=1)
    print("pdf: %d KB -> %s" % (os.path.getsize(out) // 1024, out))
finally:
    c.close()
