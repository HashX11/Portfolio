"""Splice the gate / mobile CSS / mobile JS into index.html, and make the
handful of surgical edits the mobile build needs in the existing scripts.

Idempotent: run it as often as you like. It always starts from index.base.html
(created on first run from index.html) so re-running never double-applies.
"""
import os, shutil, sys, re

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

def sub(old, new, why):
    global s
    if old not in s:
        raise SystemExit("MISSING PATCH TARGET: " + why + "\n" + old[:160])
    s = s.replace(old, new, 1)

for _src in ("moi_dash_ad.jpg","fx_gug_model2.jpg","rz_fix.jpg","at_x.jpg"):
    s = s.replace('<img src="assets/img/%s" alt=' % _src,
                  '<img src="assets/img/%s" loading="lazy" alt=' % _src)

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

# ---------------------------------------------------------------- 1. gate
sub("<body>\n", "<body>\n\n<!-- ============ VIEW GATE — desktop or mobile ============ -->\n"
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

# --------------------------------------- 3. orbit clip: desktop build only
sub("""    <video id="orbitVid" muted playsinline preload="auto" aria-hidden="true"
      src="assets/video/hero-orbit.mp4"></video>""",
    """    <video id="orbitVid" muted playsinline preload="auto" aria-hidden="true"
      poster="assets/video/hero-orbit-mobile.jpg"
      data-src="assets/video/hero-orbit.mp4"
      data-src-mobile="assets/video/hero-orbit-mobile.mp4"></video>""",
    "orbit src -> data-src")

sub("""  v.addEventListener('error',heroFallback);""",
    """  v.addEventListener('error',heroFallback);
  /* the source is attached only once the build is known: the full 8 MB descent on
     desktop, a 1.1 MB 9:16 crop of the same shot on a phone — same skyline, same
     dusk, framed for the screen it is actually on */
  if(window.__hdWhenView)window.__hdWhenView(vw=>{
    const src=(vw==='mobile'&&v.dataset.srcMobile)?v.dataset.srcMobile:v.dataset.src;
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

# -------------------------------- 4. scroll-scrub band: desktop build only
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
/* 60 pre-baked frames + a 16 ms timer is a desktop luxury; the phone keeps the still */
if(window.__hdWhenView)window.__hdWhenView(v=>{if(v!=='mobile')__hdScrubInit()});
else __hdScrubInit();

/* ================= BEFORE/AFTER DRAG SLIDER ================= */""",
    "scrub close")

# ------------------------- 5. .vidfig clips wait for a tap in the mobile build
sub("""  function startBand(b){
    if(started.has(b))return;started.add(b);""",
    """  function startBand(b){
    if(started.has(b))return;
    if(window.__mGate&&!b.dataset.mok&&!b.closest('.moi-band.m-ok'))return;  /* mobile: poster until tapped */
    started.add(b);""",
    "startBand gate")
sub("""  const bandTimer=setInterval(scanBands,250);""",
    """  window.__hdStartBand=startBand;
  const bandTimer=setInterval(scanBands,250);""",
    "expose startBand")
sub("""    bandVids.forEach(b=>{
      if(started.has(b))return;remaining++;""",
    """    bandVids.forEach(b=>{
      if(started.has(b))return;
      if(window.__mGate&&!b.dataset.mok&&!b.closest('.moi-band.m-ok'))return;
      remaining++;""",
    "scanBands gate")

# ---------------------- 6. photogrammetry scan: on request in the mobile build
sub("""const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)init()}),{rootMargin:'400px'});
io.observe(wrap);
})();""",
    """window.__hdPgInit=init;
const startIO=()=>{
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)init()}),{rootMargin:'400px'});
  io.observe(wrap);
};
if(window.__hdWhenView)window.__hdWhenView(v=>{if(v!=='mobile')startIO()});
else startIO();
})();""",
    "pgscan gate")

# ------------------------------------------------------ 7. the mobile bundle
sub("</style>\n</head>",
    "</style>\n<style id=\"hd-mobile-css\">\n" + mcss + "\n</style>\n</head>",
    "mobile css")
sub("</body>\n</html>",
    "<script id=\"hd-mobile-js\">\n" + mjs + "\n</script>\n</body>\n</html>",
    "mobile js")

open(out, "w", encoding="utf-8").write(s)
print("built", out, len(s), "bytes")
