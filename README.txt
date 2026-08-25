MOHAMAD HASHEM DANKAR - ARCHITECTURE PORTFOLIO - v8.6
=====================================================
OPEN index.html. A gate asks every time whether you are on a desktop
or a phone, then loads the matching build.

CONTENTS
  index.html                        the site (both builds live in here)
  mobile-preview.html               the phone build in a device frame,
                                    for wide screens
  Hashem-Dankar-Portfolio.pdf       45-page A4 landscape - share this
                                    one (19 MB: WhatsApp, email)
  Hashem-Dankar-Portfolio-print.pdf same 45 pages at print resolution
                                    (37 MB) - use this one to print
  apple-touch-icon.png              home-screen icon
  assets/                           images, video, 3D models, CV
  _build/                           sources that generate index.html
                                    and the PDF (see _build/README-BUILD)

  ../web/                           the deploy copy: same site, images
                                    and video re-encoded for the web,
                                    file:// fallbacks stripped, git
                                    repository already initialised

v8.6 CHANGES
  THE PDF, REBUILT
  - 45 pages, not 29. Every one of the twenty-two projects now has its
    own hero spread and its own detail page; nothing shares a page.
  - Full-bleed project heroes with an overlaid text panel, chapter
    dividers with the chapter number set large, and grids whose cell
    proportions are computed from the images that go in them - so
    nothing is letterboxed, squeezed or cropped through its subject.
  - Much more of the archive is in it: the Rize teapot and teacup
    concept drawings and unit plans, the teahouse spatial concept, the
    Grasshopper definition behind Amaala, the Guggenheim steel and
    fixing sheets, all eighteen Reem Island assets rather than ten,
    the Arabic readiness dashboard, and the Al Tall analysis set with
    the method written out beside it.
  - Every caption was checked against the site so no building is
    mislabelled.

  MOBILE
  - The hero is now the same descent as the desktop build - the same
    dusk skyline clip, re-cut 9:16 and re-encoded to 1.1 MB, so a phone
    gets the film rather than a still.
  - The scrub band no longer tells a phone to "scroll to sweep the
    grid" - it is a held frame there and now says so.
  - Landscape on a phone no longer gives the hero the whole screen.
  - Footer clears the chapter chip.

  THE GATE
  - The choice is no longer remembered. Every visit asks again.
  - The desktop build is always flagged as the fuller experience and
    best on a wide screen; the phone build is additionally flagged
    when you are actually on a phone.

  SHARING
  - Link-preview card (1200x630), favicon and home-screen icon, so a
    link pasted into WhatsApp or LinkedIn shows a proper card.


v6.4 CHANGES
  TEXTURES — THE REAL FIX (channel 0 for ALL models)
  - Your report cracked it: every "perfect" model was on UV channel 0,
    every broken one on channel 1. TEXCOORD_1 in your exports is the
    auto-packed LIGHTMAP unwrap (uniform density — which fooled the
    earlier geometric analysis); TEXCOORD_0 is the actual texture
    unwrap. All 18 models now use channel 0. Every previously-broken
    model re-verified loading with zero errors.

  LIGHTS ON — MEASURED, NOT GUESSED
  - Night mode retuned to 0.88x of day brightness (measured on real
    renders): almost the same, just a bit dimmer, windows still glow.

  VIDEOS — REPOSITIONED, UPSCALED, REAL FOOTAGE IN
  - Hero is now the static wide Abu Dhabi skyline (as requested);
    the cinematic descent moved to the Contact ambience.
  - Your 90s work recording analyzed second-by-second; the two
    strongest sustained flythroughs cut in: 29.5-41s -> MOI band
    ("LIVE ENGINE FEED - RECORDED INSIDE THE TWIN"), 58-68.5s -> band
    above the ARCHIVE FEED strip. 5-6% edge crop to trim recorder UI.
  - All AI clips upscaled to sharpened 1080p (lanczos + unsharp).

  SMOOTHER, MORE IMMERSIVE INTEGRATION
  - Bands fade up on scroll entry; videos drift with gentle parallax;
    loop crossfades widened to 0.8s (no hard cuts); hero fades in from
    black once its first frame decodes.

v6.3 CHANGES
  TEXTURES — REBUILT FROM YOUR FRESH EXPORTS & PROVEN CORRECT
  - All 18 GLBs regenerated from the new GLTF+BIN files; all 72 textures
    reconverted to 1K webp (incl. fixing the "T_The Kite" filename).
  - Root cause of the bad texturing: the correct UV atlas channel
    differs PER BUILDING. Determined empirically from the geometry
    (texel-density uniformity + atlas coverage): channel 1 for Al Reem
    Bay, Amaya, DAMAC, Hydra, Mangrove, Marina Rise, Masjid, Sigma
    Omega, Kite, Y Tower; channel 0 for the rest (their channel 1 is
    corrupt planar data). The map is hard-coded per model and cross-
    validated: every in-site render statistically matches its chosen
    channel, all 18 verified loading with zero console errors.

  AUTO-ROTATE — PRESENTATION SPIN, THEN YOUR HANDS
  - Every model opens with the gentle spin; the moment you drag to
    orbit, auto-rotate stops and stays off. Next model re-arms it.

  FIVE VIDEOS — INTEGRATED, LOCAL, OVERRIDABLE (assets/video/)
  - hero-orbit.mp4: cinematic aerial descent = the hero.
  - moi-band.mp4: Unreal engine feed band, MOI chapter.
  - saadiyat-band.mp4: shoreline slow-mo band opening the Fibrex chapter.
  - approach-band.mp4: orbit approach band above the ARCHIVE FEED strip.
  - contact-ambient.mp4: dimmed skyline behind the Contact section.
  Overwrite any file to swap its clip. Missing files degrade gracefully.

  STAND-OUT LAYER
  - Cinematic film grain overlay (subtle, animated, reduced-motion safe).
  - Scroll progress hairline in the signal teal.
  - Chapter rail: fixed dots on the right tracking the active chapter,
    with codes on hover (desktop).
  - 3D-card hover tilt on the asset catalog.

v6.2 CHANGES
  "VIEW IN 3D" — NOW WORKS EVERYWHERE (definitive fix)
  - Root cause found by running the site in a real browser: opening
    index.html by double-click (file://) blocks ES modules via CORS, so
    the 3D engine never booted and the viewer hung on "Booting 3D
    engine…". Fixed by pre-bundling three.js + all addons into ONE
    classic script (assets/3d/lib/three-bundle.js) that file:// cannot
    block. No importmap, no modules.
  - GLB models + PBR textures also can't be fetched on file://, so each
    building ships an on-demand base64 wrapper (assets/3d/models-js/ and
    assets/3d/tex-js/) used ONLY on file://. On GitHub Pages the fast
    direct-fetch path is used automatically.
  - Verified in headless Chrome on BOTH file:// and http://: viewer
    opens, models render fully textured (Al Wifaq 3,525 tris · Masjid
    17,363 tris), Materials/Lights/Auto-rotate toggles work, reopening
    uses the cache, zero console errors.

  VIDEOS — LOCAL & OVERRIDABLE
  - The old CloudFront links had expired (HTTP 403), so both videos were
    dead even online. They now point at local files you own:
      assets/video/hero-orbit.mp4   (hero orbit approach)
      assets/video/moi-band.mp4     (MOI engine-feed band)
    Overwrite either file to change the clip — no code edits.
  - Missing hero clip → automatic static aerial fallback (parallax,
    reticle and telemetry keep working). Missing band clip → the band
    hides itself. The site never looks broken.

  "MORE ALIVE" — ADAPTED FROM YOUR REFERENCE SPEC
  - Scroll-linked dual-direction film strip (ARCHIVE FEED) before the
    contact section — two rows of 16 archive images drifting opposite
    ways as you scroll, tripled for a seamless loop.
  - Character-by-character scroll reveal on the profile statement.
  - Magnetic hover on the CV button and contact links (desktop only,
    disabled for touch and reduced-motion users).

v6.1 CHANGES
  UV / TEXTURE FIX (major)
  - Re-applied all textures onto your newly UV-corrected GLBs. Each
    building now uses the proper atlas UV channel (channel 1 where it
    exists as a real 0-1 atlas, else channel 0), verified by rendering
    every model against its real thumbnail. Sorbonne rebuilt from your
    .gltf + .bin. Every facade now maps correctly.

  "VIEW IN 3D" FIX (major)
  - The button did nothing before because the click handlers lived
    inside the 3D module; if that module was slow or the page was opened
    as a local file://, they never attached. Handlers now live in a
    normal script that ALWAYS runs and bridges to the 3D engine when
    ready. If you open index.html directly as a file it now tells you to
    use a web server / GitHub Pages (ES-module 3D can't run on file://).
  - Importmap moved into <head> so module resolution is bulletproof.

  IMMERSIVE HOVER-TO-ENTER HERO
  - The orbit intro now starts STATIC (video paused on frame 1). Moving
    the cursor "engages descent": the scene pushes in toward the pointer
    with 3D parallax + scale, the video starts playing, telemetry counts
    down, and a rotating targeting reticle tracks the cursor. Touch =
    tap to engage. Reduced-motion users get a calm static hero.

  STILL TO COME (v6.2 — needs your video clips, see chat)
  - Abu-Dhabi-specific hero clip + skyline/cloud ambient loops. Drop new
    MP4s into assets/video/ and they slot in with no code change.

DEPLOY: push the whole folder to GitHub Pages. MUST be served over http(s)
— the 3D viewer uses ES modules which browsers block on file://.
3D payload ≈ 36 MB, loaded on demand per building.
