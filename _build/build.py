"""Splice the gate / nav / scan / mobile sources into index.html, and make the
handful of surgical edits the mobile build needs in the existing scripts.

Idempotent: run it as often as you like. It always starts from index.base.html
(created on first run from index.html) so re-running never double-applies.
"""
import json, os, shutil, sys, re

SRC  = os.path.dirname(os.path.abspath(__file__))   # this _build folder
SITE = os.path.dirname(SRC)                          # the portfolio folder
base = os.path.join(SRC,  "index.base.html")         # untouched original markup
out  = os.path.join(SITE, "index.html")              # what the browser opens

if not os.path.exists(base):
    raise SystemExit("index.base.html is missing from _build/ - cannot rebuild")

s = open(base, encoding="utf-8").read()
gate = open(os.path.join(SRC, "_gate.html"), encoding="utf-8").read()
mcss = open(os.path.join(SRC, "_mobile.css"), encoding="utf-8").read()
mjs  = open(os.path.join(SRC, "_mobile.js"), encoding="utf-8").read()
navcss = open(os.path.join(SRC, "_nav.css"), encoding="utf-8").read()
navjs  = open(os.path.join(SRC, "_nav.js"), encoding="utf-8").read()
pgcss  = open(os.path.join(SRC, "_pgscan.css"), encoding="utf-8").read()
pgjs   = open(os.path.join(SRC, "_pgscan.js"), encoding="utf-8").read()
i18ncss = open(os.path.join(SRC, "_i18n.css"), encoding="utf-8").read()
i18njs  = open(os.path.join(SRC, "_i18n.js"), encoding="utf-8").read()
_arpath = os.path.join(SRC, "i18n-ar.json")
if not os.path.exists(_arpath):
    raise SystemExit("i18n-ar.json is missing from _build/ - cannot rebuild")
ardict = open(_arpath, encoding="utf-8").read()

def sub(old, new, why):
    global s
    if old not in s:
        raise SystemExit("MISSING PATCH TARGET: " + why + "\n" + old[:160])
    s = s.replace(old, new, 1)

def cut(start, end, new, why):
    """Replace a whole region, start..end inclusive, once."""
    global s
    i = s.find(start)
    j = s.find(end, i + 1) if i >= 0 else -1
    if i < 0 or j < 0:
        raise SystemExit("MISSING PATCH TARGET: " + why + "\n" + start[:160])
    s = s[:i] + new + s[j + len(end):]

for _src in ("moi_dash_ad.jpg","fx_gug_model2.jpg","rz_fix.jpg","at_x.jpg"):
    s = s.replace('<img src="assets/img/%s" alt=' % _src,
                  '<img src="assets/img/%s" loading="lazy" alt=' % _src)

# ------------------------------------------- 0a. intrinsic size on every <img>
# Every picture on this page is lazy and none of them declared a size, so an
# unloaded image was a zero-height box. Anchoring to a heading near the bottom
# of a 50 000 px page therefore resolved against a layout several thousand
# pixels too short: the jump landed, the imagery decoded, everything shifted
# down, and the reader arrived two or three projects above the one they asked
# for. Stamping the real pixel size gives the browser the aspect ratio before
# the bytes land, so the page is the right height from the first paint.
# CSS still owns the rendered size - these attributes only supply the ratio.
_dims_path = os.path.join(SRC, "img-dims.json")
if not os.path.exists(_dims_path):
    raise SystemExit("img-dims.json is missing - run:  python imgdims.py")
_dims = json.load(open(_dims_path, encoding="utf-8"))

_missing = []
def _stamp(m):
    tag = m.group(0)
    if " width=" in tag or " height=" in tag:
        return tag
    src = re.search(r'\bsrc="([^"]+)"', tag)
    if not src:
        return tag
    wh = _dims.get(src.group(1))
    if not wh:
        _missing.append(src.group(1))
        return tag
    return '<img width="%d" height="%d"%s' % (wh[0], wh[1], tag[4:])

s = re.sub(r'<img\b[^>]*>', _stamp, s)
if _missing:
    raise SystemExit("no size for: " + ", ".join(sorted(set(_missing)))
                     + "\nre-run:  python imgdims.py")

# The width/height attributes reach CSS as a presentational hint of
# `aspect-ratio: auto W / H`, and an author `aspect-ratio: auto` overrides that
# hint outright - so the 18 `.natural` figures (plans, elevations, posters, the
# tall drawings) stayed zero-height until their bytes arrived, which is most of
# the drift the anchors were fighting. `.natural` only ever means "no crop, keep
# the real proportions"; it is never combined with one of the .r169/.r32/... ratio
# classes, so it has nothing to undo and the declaration can simply go.
sub(".natural img{aspect-ratio:auto;object-fit:unset}",
    ".natural img{object-fit:unset}   /* ratio comes from the width/height attrs */",
    "natural aspect-ratio")

# Same story for the two rebuild sheets. Desktop pins them to a definite box
# (position:absolute;inset:0) so the ratio is dead weight there, but the mobile
# build re-flows them to `height:auto`, where `aspect-ratio:auto` again beat the
# attributes and left the sheet flat until it loaded.
sub(".munigrid > .sheet img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;aspect-ratio:auto}",
    ".munigrid > .sheet img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}",
    "sheet aspect-ratio")

# ------------------------------------- 0c. the three shrink-to-fit poster plates
# `.poster` / `.posterw` carry `margin:0 auto`, which in a grid stops the figure
# stretching, so it is sized by its content instead. Its content is an <img> at
# `width:100%` - a percentage against a shrink-to-fit parent, which the browser
# resolves from the image's *intrinsic* width, and an unloaded image has none.
# (The width attribute supplies the ratio, not the width: author CSS beats the
# presentational hint.) So these three plates were 0 x 0 until their bytes
# arrived, then jumped to full height - about 2 800 px of late shift, all of it
# in the middle of the page. Giving the figure a definite width breaks the
# circularity, and min() reproduces exactly the width it settles at today.
_plate = 0
def _plate_width(m):
    global _plate
    wh = _dims.get(m.group(3))
    if not wh:
        return m.group(0)
    _plate += 1
    return '%s style="width:min(100%%,%dpx)"%s' % (m.group(1), wh[0], m.group(2))

s = re.sub(r'(<figure class="[^"]*\bposterw?\b[^"]*")((?!\sstyle=)><img\b[^>]*\bsrc="([^"]+)"[^>]*>)',
           _plate_width, s)
if _plate != 3:
    raise SystemExit("expected 3 poster plates, stamped %d" % _plate)

# ------------------------------------------------ 0. head: icons + link preview
sub("""<link rel="preconnect" href="https://fonts.googleapis.com">""",
    """<meta name="theme-color" content="#0E1417">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%230E1417'/%3E%3Cpath d='M32 12l20 20-20 20-20-20z' fill='none' stroke='%234FB7C4' stroke-width='4'/%3E%3C/svg%3E">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:title" content="Mohamad Hashem Dankar — Architect · VR &amp; Digital Twin Specialist">
<meta property="og:description" content="An architect who builds cities twice: the UAE national digital twin in Unreal Engine, three Saadiyat museums cast panel by panel, and UNDP regeneration in Tripoli. Twenty-two projects.">
<meta property="og:image" content="assets/img/og-card.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Mohamad Hashem Dankar — Architect">
<meta name="twitter:description" content="An architect who builds cities twice. Twenty-two projects, in the browser and in 3D.">
<meta name="twitter:image" content="assets/img/og-card.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">""",
    "head meta")

# ------------------------------------------------------- 1. language, then gate
# The dictionary and _i18n.js go in first: the gate's own script calls into
# them so the chooser is already in the right language rather than flashing
# English and swapping a moment later.
sub("<body>\n",
    "<body>\n\n<!-- ============ LANGUAGE — ar / en ============ -->\n"
    + '<script id="hd-ar-dict">window.__hdAR=' + ardict.strip() + ';</script>\n'
    + '<script id="hd-i18n-js">\n' + i18njs + '\n</script>\n'
    + "<!-- ============ /LANGUAGE ============ -->\n\n"
    + "<!-- ============ VIEW GATE — desktop or mobile ============ -->\n"
    + gate + "\n<!-- ============ /VIEW GATE ============ -->\n\n", "body open")

# ------------------------------------------------- 2. boot waits for the gate
sub("""<script>
(()=>{
const b=document.getElementById('boot');
let seen=false;try{seen=!!sessionStorage.getItem('hdboot')}catch(e){}""",
    """<script>
(()=>{
const b=document.getElementById('boot');
if(window.__gateOpen){b.remove();return}   /* the gate already held the door */
let seen=false;try{seen=!!sessionStorage.getItem('hdboot')}catch(e){}""",
    "boot gate")

# ------------------------------------- 3. orbit clip: the same one everywhere
sub("""    <video id="orbitVid" muted playsinline preload="auto" aria-hidden="true"
      src="assets/video/hero-orbit.mp4"></video>""",
    """    <video id="orbitVid" muted playsinline preload="auto" aria-hidden="true"
      data-src="assets/video/hero-orbit.mp4"></video>""",
    "orbit src -> data-src")

sub("""  v.addEventListener('error',heroFallback);""",
    """  v.addEventListener('error',heroFallback);
  /* the source is attached once the build is known, so nothing is fetched while
     the reader is still on the gate. Both builds get the same full descent —
     the phone is no longer sent a cropped stand-in */
  if(window.__hdWhenView)window.__hdWhenView(vw=>{
    const src=v.dataset.src;
    if(!src||v.getAttribute('src'))return;
    v.setAttribute('src',src);
    v.style.display='';
    const fb=document.getElementById('orbitFallback');if(fb)fb.style.display='none';
    try{v.load()}catch(e){}
  });""",
    "orbit deferred src")

sub("""  orbit.addEventListener('touchstart',()=>{pushT=1;engage()},{passive:true});""",
    """  orbit.addEventListener('touchstart',()=>{pushT=1;engage()},{passive:true});
  /* no cursor on a phone — start the descent by itself, without the parallax push */
  if(window.__hdWhenView)window.__hdWhenView(vw=>{if(vw==='mobile'){pushT=0;setTimeout(engage,500)}});""",
    "orbit mobile autoplay")

sub("""  if(v.error)heroFallback();
  else if(v.networkState===3)setTimeout(""",
    """  if(v.getAttribute('src')&&v.error)heroFallback();
  else if(v.getAttribute('src')&&v.networkState===3)setTimeout(""",
    "orbit fallback guard")

# --------------------------- 3b. the gate keeps the reader's own mouse pointer
# `.curon *{cursor:none}` hides the real pointer and the site draws its own at
# z-index 800 — but the gate sits at 900, so on the chooser the custom cursor was
# painted behind the overlay and the real one was already gone: no pointer at all
# on the first thing anybody sees. Arm the custom cursor only once a build has
# been picked; until then the chooser behaves like an ordinary page.
sub("""document.documentElement.classList.add('curon');""",
    """const __armCursor=()=>document.documentElement.classList.add('curon');
if(window.__gateOpen)addEventListener('hd:gate',__armCursor,{once:true});
else __armCursor();""",
    "cursor waits for the gate")

# ------------------- 3c. Arabic is cursive: never split a word into letters
# Two effects here wrap every character in its own <span> - the headline's
# staggered entrance and the profile statement's read-along reveal. In Latin
# that is free; in Arabic each span becomes its own text run, the letters stop
# joining, and the word falls apart into isolated forms. Both fall back to
# splitting by word when the page is in Arabic. (The .wsplit effect already
# splits by word, so it needs nothing.)
sub("""  for(const ch of word){
    if(ch==='|'){inB=true;continue}
    wordHTML+=`<span class="ch${inB?' cb':''}" style="transition-delay:${200+idx*32}ms">${ch}</span>`;idx++;
  }""",
    """  if(window.__hdLang==='ar'){
    let w=word;
    if(w.indexOf('|')>=0){inB=true;w=w.split('|').join('')}
    wordHTML+=`<span class="ch${inB?' cb':''}" style="transition-delay:${200+idx*90}ms">${w}</span>`;idx++;
  }else for(const ch of word){
    if(ch==='|'){inB=true;continue}
    wordHTML+=`<span class="ch${inB?' cb':''}" style="transition-delay:${200+idx*32}ms">${ch}</span>`;idx++;
  }""",
    "orbit headline: word units in Arabic")

sub("""      for(const c of ch.textContent){
        if(c===' '){frag.appendChild(document.createTextNode(' '));continue}
        const s=document.createElement('span');s.className='cw';s.textContent=c;frag.appendChild(s);
      }""",
    """      const parts=(window.__hdLang==='ar')
        ? ch.textContent.split(/(\s+)/)      /* by word: the letters must stay joined */
        : [...ch.textContent];
      for(const c of parts){
        if(!c)continue;
        if(/^\s+$/.test(c)){frag.appendChild(document.createTextNode(' '));continue}
        const s=document.createElement('span');s.className='cw';s.textContent=c;frag.appendChild(s);
      }""",
    "profile reveal: word units in Arabic")

# the viewer's ON / OFF pills stay Latin on purpose - they read as instrument
# states, and "the lights are on" does not inflect the same way in Arabic
sub("""function setBtn(btn,on,word){btn.classList.toggle('on',on);btn.setAttribute('aria-pressed',on);btn.querySelector('i').textContent=on?(word||'ON'):'OFF'}""",
    """function setBtn(btn,on,word){btn.classList.toggle('on',on);btn.setAttribute('aria-pressed',on);
  const i=btn.querySelector('i');if(i)i.textContent=on?(word||'ON'):'OFF'}""",
    "setBtn guard")

# --------------------------------- 4. scroll-scrub band: both builds now
# It was held to the desktop build and the phone kept a single still frame,
# which read as a band that had failed rather than one that was never meant
# to move. Sixty 100 KB JPEGs painted to a canvas is not a desktop luxury —
# it is less work than the film that plays two screens further down — and
# the sequence only starts fetching once the band is within 2.5 screens.
# The one thing that still has to wait is the gate: nothing may fetch while
# the reader is still choosing a build.
sub("""(()=>{
const wrap=document.getElementById('twinScrub');if(!wrap)return;""",
    """const __hdScrubInit=()=>{
const wrap=document.getElementById('twinScrub');if(!wrap)return;""",
    "scrub open")
sub("""sizeCv();up();
})();

/* ================= BEFORE/AFTER DRAG SLIDER ================= */""",
    """sizeCv();up();
};
/* the phone sweeps the grid too — same frames, same 300vh of travel */
if(window.__hdWhenView)window.__hdWhenView(()=>__hdScrubInit());
else __hdScrubInit();

/* ================= BEFORE/AFTER DRAG SLIDER ================= */""",
    "scrub close")

# ------------------------------- 4b. the document, offered where the page ends
# The portfolio PDF was only ever offered on the gate — the one screen a reader
# passes through before they have seen any of the work, and the last moment at
# which they want to take a copy away. It now sits under the contact block as
# well, in both builds, beside the CV that was already there.
sub("""      <div><span class="k">Base</span><span class="v">Abu Dhabi · UAE</span></div>
    </div>""",
    """      <div><span class="k">Base</span><span class="v">Abu Dhabi · UAE</span></div>
    </div>
    <div class="cdl reveal">
      <a class="btn dl" href="Hashem-Dankar-Portfolio.pdf" download>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7.5 10.5 12 15l4.5-4.5M4 20h16"/></svg>
        Download the portfolio — PDF</a>
      <a class="btn dl ghost" href="assets/Hashem-Dankar-CV.pdf" download>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7.5 10.5 12 15l4.5-4.5M4 20h16"/></svg>
        Download the CV — PDF</a>
      <span class="cdl-n">47 pages · A4 landscape · twenty-two projects</span>
    </div>""",
    "contact downloads")

# -------------------- 5. film: the phone plays the same clips the desktop does
# (the ambient bands and the .vidfig clips used to sit behind a "tap to play"
#  gate on mobile; they now start on scroll in both builds, exactly as here)
sub("""  const bandTimer=setInterval(scanBands,250);""",
    """  window.__hdStartBand=startBand;
  const bandTimer=setInterval(scanBands,250);""",
    "expose startBand")

# ----------------- 6. photogrammetry scan: the richer, self-booting capture
cut("/* ============ AL TALL — SCROLL-DRIVEN PHOTOGRAMMETRY SCAN ============",
    "io.observe(wrap);\n})();",
    pgjs.rstrip() + "\n",
    "pgscan block")

# ------- 6b. translate the markup before any effect script chews it up
# The headline stagger, the read-along reveal and the word-split headings all
# rewrite their own text into per-word or per-character spans. Once that has
# happened the block no longer has a text node to match on, so the pass has to
# run first - here, where the whole markup is parsed but none of those scripts
# has run yet.
sub("""<script>
/* reveal on scroll */""",
    """<script id="hd-i18n-pass">window.__hdI18n&&window.__hdI18n(document.body)</script>

<script>
/* reveal on scroll */""",
    "i18n pass before the effects")

# ------------------------------------------------------ 7. the bundles
# order matters: nav and scan first, then the mobile sheet, and the Arabic
# sheet last so html.lang-ar has the final word over both
sub("</style>\n</head>",
    "</style>\n<style id=\"hd-nav-css\">\n" + navcss
    + "\n</style>\n<style id=\"hd-pgscan-css\">\n" + pgcss
    + "\n</style>\n<style id=\"hd-mobile-css\">\n" + mcss
    + "\n</style>\n<style id=\"hd-i18n-css\">\n" + i18ncss + "\n</style>\n</head>",
    "css bundles")
sub("</body>\n</html>",
    "<script id=\"hd-nav-js\">\n" + navjs + "\n</script>\n"
    "<script id=\"hd-mobile-js\">\n" + mjs + "\n</script>\n</body>\n</html>",
    "js bundles")

open(out, "w", encoding="utf-8").write(s)
print("built", out, len(s), "bytes")
