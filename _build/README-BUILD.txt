_build - how index.html and the PDF are regenerated
===================================================

index.html is GENERATED. Do not hand-edit it; edit the sources here
and re-run the build, or your change is lost on the next rebuild.

  index.base.html   the original v8.3 markup, untouched
  _gate.html        the desktop/mobile gate (markup + CSS + script)
  _mobile.css       the mobile build's stylesheet
  _mobile.js        the mobile build's behaviour
  build.py          splices those three into index.base.html and
                    writes ../index.html

  python build.py

build.py is idempotent - it always starts from index.base.html, so
running it twice is the same as running it once. It also makes a few
surgical edits inside the original scripts (deferring the orbit clip,
the scroll-scrub band, the ambient videos and the photogrammetry scan
on mobile); if one of those edits ever fails to find its target it
stops with MISSING PATCH TARGET instead of writing a broken file.

pdf/ - the portfolio PDF
------------------------
  print.html    the 29-page A4-landscape document (data-driven: the
                PAGES array at the bottom is the whole portfolio)
  resize.py     downsamples assets/img into pdf/img via headless
                Chrome:  python resize.py 1250 0.66   (share build)
                         python resize.py 1650 0.82   (print build)
  mkpdf.py      renders print.html to PDF:
                         python mkpdf.py Hashem-Dankar-Portfolio.pdf
  cdp.py        minimal Chrome DevTools Protocol driver (stdlib only)

Both scripts need print.html served over http (they load
http://localhost:8777/_pdf/print.html), so put this pdf folder at
../_pdf and serve the portfolio folder:

  python -m http.server 8777

Requires Python 3 and Google Chrome. Nothing else.
