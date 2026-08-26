/* =====================================================================
   MOBILE BUILD — behaviour. Runs only when the reader picked "mobile".
   Desktop is untouched apart from the one "switch view" link at the end.
   ===================================================================== */
(()=>{
const R=document.documentElement;
const svg=(d,w)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w||1.5}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

/* ------------------------------------------------------------------ *
 *  both builds: one quiet way back to the other one
 * ------------------------------------------------------------------ */
function addSwitch(view){
  const host=document.querySelector('#contact .wrap');if(!host)return;
  const other=view==='mobile'?'desktop':'mobile';
  const b=document.createElement('button');
  b.type='button';b.className='m-switch';
  b.innerHTML=svg('<path d="M3 8h13l-3-3M21 16H8l3 3"/>')+
    `Switch to the ${other} build`;
  b.addEventListener('click',()=>window.__hdSetView(other));
  host.appendChild(b);
}

/* ------------------------------------------------------------------ *
 *  MOBILE
 * ------------------------------------------------------------------ */
function initMobile(){
  document.documentElement.classList.remove('curon');   /* it is set on <html> */

  /* ---------- 1. contents: read the page's own structure ---------- */
  const CH=[
    {id:'profile', code:'◆',    name:'Profile & credentials'},
    {id:'index',   code:'◆',    name:'The index'},
    {id:'moi',     code:'P·01', name:'UAE Digital Twin'},
    {id:'fibrex',  code:'P·02', name:'Museums, Fabricated'},
    {id:'freelance',code:'P·03',name:'Freelance Practice'},
    {id:'practice',code:'P·04', name:'Practice Years'},
    {id:'contact', code:'✉',    name:'Contact'}
  ].filter(c=>document.getElementById(c.id));

  /* every numbered sub-project, straight off the .mv headings */
  const subsOf=id=>{
    const sec=document.getElementById(id);if(!sec)return[];
    return [...sec.querySelectorAll('.mv[id]')].map(mv=>({
      id:mv.id,
      n:(mv.querySelector('.n')||{}).textContent||'',
      t:(mv.querySelector('h3')||{}).textContent||''
    })).filter(s=>s.t&&s.n&&s.n!=='·');
  };

  /* ---------- 2. top bar button ---------- */
  const bar=document.querySelector('.topbar .in');
  const burger=document.createElement('button');
  burger.type='button';burger.className='m-burger';
  burger.setAttribute('aria-label','Open contents');
  burger.setAttribute('aria-expanded','false');
  burger.innerHTML='<span class="bars" aria-hidden="true"><i></i><i></i><i></i></span>Index';
  if(bar)bar.appendChild(burger);

  /* ---------- 3. the contents sheet ---------- */
  const sheet=document.createElement('div');
  sheet.className='m-sheet';sheet.setAttribute('role','dialog');
  sheet.setAttribute('aria-modal','true');sheet.setAttribute('aria-label','Contents');
  let rows='';
  CH.forEach(c=>{
    rows+=`<a class="row chrow" href="#${c.id}" data-go="${c.id}"><span class="n">${c.code}</span><span class="t">${c.name}</span></a>`;
    subsOf(c.id).forEach(s=>{
      rows+=`<a class="row" href="#${s.id}" data-go="${s.id}"><span class="n">${s.n}</span><span class="t">${s.t}</span></a>`;
    });
  });
  sheet.innerHTML=
   `<div class="scrim" data-close></div>
    <div class="panel">
      <div class="grab" aria-hidden="true"></div>
      <div class="head"><h2>Contents</h2>
        <button class="x" type="button" data-close aria-label="Close contents">✕</button></div>
      <div class="body">
        ${rows}
        <div class="tools">
          <a href="Hashem-Dankar-Portfolio.pdf" download>Download the PDF portfolio <span class="go">↓</span></a>
          <a href="assets/Hashem-Dankar-CV.pdf" download>Download the CV <span class="go">↓</span></a>
          <a href="mailto:hashemx98@gmail.com">Email Hashem <span class="go">→</span></a>
          <a href="https://wa.me/971509702011" target="_blank" rel="noopener">WhatsApp <span class="go">→</span></a>
          <button type="button" data-desktop>Switch to the desktop build <span class="go">⤢</span></button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(sheet);

  let lastFocus=null;
  const openSheet=()=>{
    lastFocus=document.activeElement;
    markHere();
    sheet.classList.add('on');burger.setAttribute('aria-expanded','true');
    document.body.style.overflow='hidden';
    const here=sheet.querySelector('.row.here')||sheet.querySelector('.row');
    if(here)here.scrollIntoView({block:'center'});
    setTimeout(()=>{const x=sheet.querySelector('.x');if(x)x.focus()},60);
  };
  const closeSheet=()=>{
    sheet.classList.remove('on');burger.setAttribute('aria-expanded','false');
    document.body.style.overflow='';
    if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true});
  };
  burger.addEventListener('click',openSheet);
  sheet.addEventListener('click',e=>{
    if(e.target.closest('[data-close]'))return closeSheet();
    if(e.target.closest('[data-desktop]'))return window.__hdSetView('desktop');
    const a=e.target.closest('a[data-go]');
    if(a){closeSheet();}
  });
  addEventListener('keydown',e=>{if(e.key==='Escape'&&sheet.classList.contains('on'))closeSheet()});
  /* swipe the panel down to dismiss */
  (()=>{const p=sheet.querySelector('.panel');let y0=null,dy=0;
    p.addEventListener('touchstart',e=>{const b=p.querySelector('.body');
      if(b.scrollTop>2&&e.target.closest('.body'))return;y0=e.touches[0].clientY;dy=0},{passive:true});
    p.addEventListener('touchmove',e=>{if(y0===null)return;dy=e.touches[0].clientY-y0;
      if(dy>0)p.style.transform=`translateY(${dy}px)`},{passive:true});
    p.addEventListener('touchend',()=>{if(y0===null)return;p.style.transform='';
      if(dy>90)closeSheet();y0=null},{passive:true});
  })();

  /* ---------- 4. the bottom chapter chip ---------- */
  const chip=document.createElement('button');
  chip.type='button';chip.className='m-chip';
  chip.setAttribute('aria-label','Where you are — open contents');
  chip.innerHTML='<span class="cd">◆</span><span class="nm">Profile</span>'+
    '<span class="ic" aria-hidden="true">'+svg('<path d="M6 15l6-6 6 6"/>',1.8)+'</span>';
  document.body.appendChild(chip);
  chip.addEventListener('click',openSheet);
  const chipCd=chip.querySelector('.cd'),chipNm=chip.querySelector('.nm');

  /* which chapter/sub-project is on screen */
  const marks=[];
  CH.forEach(c=>{
    const el=document.getElementById(c.id);
    if(el)marks.push({el,code:c.code,name:c.name,id:c.id});
    subsOf(c.id).forEach(s=>{
      const e=document.getElementById(s.id);
      if(e)marks.push({el:e,code:s.n,name:s.t,id:s.id});
    });
  });
  let curId=null;
  function currentMark(){
    const y=scrollY+innerHeight*0.34;let best=null;
    for(const m of marks){
      const top=m.el.getBoundingClientRect().top+scrollY;
      if(top<=y&&(!best||top>best.top))best={...m,top};
    }
    return best;
  }
  function markHere(){
    const m=currentMark();if(!m)return;
    sheet.querySelectorAll('.row.here').forEach(r=>r.classList.remove('here'));
    const r=sheet.querySelector(`.row[data-go="${m.id}"]`);
    if(r)r.classList.add('here');
  }
  let cTick=false;
  function onScroll(){
    if(cTick)return;cTick=true;
    requestAnimationFrame(()=>{
      cTick=false;
      chip.classList.toggle('on',scrollY>innerHeight*0.75);
      const m=currentMark();
      if(m&&m.id!==curId){curId=m.id;chipCd.textContent=m.code;chipNm.textContent=m.name}
    });
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* ---------- 5. galleries become story reels ----------------------------
     Every gallery used to be a row of 87 %-wide cards you dragged through
     one at a time, with the next card always half in frame, so no single
     plate was ever seen whole. Each plate now takes the full width of the
     screen and the reel walks itself, a segmented bar across the top
     counting the plate down — the grammar a phone reader already has.

     It is still a real scroll container: a flick works, the snap points
     are the browser's own, and the timer never does anything more exotic
     than call scrollTo. Hold it to freeze it, tap ⏸ to stop it for good,
     tap the plate to open it full-screen. ------------------------------- */
  const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DWELL=2500, DWELL_MIN=1250, DWELL_MAX=9000;
  const INTRO=0.58, INTRO_MIN=850;      /* the opening plate, deliberately brief */

  /* ------------------------------------------------------------------ *
   *  THE READER SETS THE PACE
   *  A fixed dwell is a guess about a stranger, and four seconds was the
   *  wrong guess: readers were finishing with a plate and flicking past
   *  it well before the timer came round, which turns the timer into an
   *  obstacle rather than a convenience.
   *
   *  So the reel watches instead of guessing. Every plate advanced BY
   *  HAND before its own timer fired is a measurement of how long that
   *  reader actually wanted it, and the dwell eases halfway toward it.
   *  Going back teaches it nothing — that is someone returning to look
   *  again, not someone in a hurry.
   *
   *  One pace for the whole page, so a reader who has flicked through
   *  the first gallery is not made to sit through the next thirty-two at
   *  the old speed, and it is remembered for the rest of the visit.
   * ------------------------------------------------------------------ */
  let PACE = DWELL;
  try{const v=+sessionStorage.getItem('hdpace');
      if(v>=DWELL_MIN&&v<=DWELL)PACE=v}catch(e){}
  function learn(ms){
    if(!(ms>200))return;                    /* a stray scroll event, not a read */
    PACE=Math.round(Math.min(DWELL,Math.max(DWELL_MIN,PACE*0.5+ms*0.5)));
    try{sessionStorage.setItem('hdpace',PACE)}catch(e){}
  }

  function storyReel(g,kids){
    const K=kids.length;
    g.classList.add('mstrip');

    const reel=document.createElement('div');
    reel.className='m-reel';
    g.parentNode.insertBefore(reel,g);
    reel.appendChild(g);

    const segs=document.createElement('div');
    segs.className='m-segs';segs.setAttribute('aria-hidden','true');
    segs.innerHTML=kids.map(()=>'<i><b></b></i>').join('');
    reel.appendChild(segs);
    const ss=[...segs.children];

    const rail=document.createElement('div');
    rail.className='m-rail';
    rail.innerHTML=
      `<button type="button" class="pv" aria-label="Previous">${svg('<path d="M15 5l-7 7 7 7"/>',1.7)}</button>`+
      `<button type="button" class="pp" aria-label="Pause the reel">${svg('<path d="M9 5v14M15 5v14"/>',1.7)}</button>`+
      `<span class="ct"><b>1</b> / ${K}</span>`+
      `<button type="button" class="ex" aria-label="Open full screen">${svg('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',1.7)}</button>`+
      `<button type="button" class="nx" aria-label="Next">${svg('<path d="M9 5l7 7-7 7"/>',1.7)}</button>`;
    reel.appendChild(rail);
    const ct=rail.querySelector('.ct b'),pp=rail.querySelector('.pp');

    const PAUSE=svg('<path d="M9 5v14M15 5v14"/>',1.7);
    const PLAY='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6L19 12z"/></svg>';

    let i=0,timer=null,stopped=false,holding=false,onScreen=false,shownAt=0;

    const width=()=>g.clientWidth||1;
    const at=()=>Math.max(0,Math.min(K-1,Math.round(g.scrollLeft/width())));

    /* a plate holding a film is given the film's own length to run in */
    function dwellOf(n){
      if(RM)return PACE;
      const v=kids[n].querySelector('video');
      if(v&&isFinite(v.duration)&&v.duration>1)
        return Math.min(DWELL_MAX,Math.max(PACE,v.duration*1000+400));
      /* The opening plate goes sooner than the rest. It is the only one a
         reader arrives at without having been shown that the strip moves at
         all, so it has to make that first move early — a plate that sits
         still on arrival reads as a picture, not as a reel. */
      return n===0 ? Math.max(INTRO_MIN,Math.round(PACE*INTRO)) : PACE;
    }

    function paint(){
      ct.textContent=String(i+1);
      const ms=dwellOf(i)+'ms';
      ss.forEach((s,j)=>{
        s.classList.remove('done','live');
        if(j<i)s.classList.add('done');
      });
      kids.forEach((k,j)=>{
        k.classList.remove('m-live');
        if(j===i)k.style.setProperty('--dwell',ms);
      });
      const s=ss[i];
      s.style.setProperty('--dwell',ms);
      void s.offsetWidth;            /* restart the fill and the drift from zero */
      s.classList.add('live');
      kids[i].classList.add('m-live');
      shownAt=Date.now();
    }

    function clear(){if(timer){clearTimeout(timer);timer=null}}
    function arm(){
      clear();
      if(stopped||holding||!onScreen||RM)return;
      timer=setTimeout(()=>go(i+1),dwellOf(i));
    }
    function go(n,instant){
      n=(n%K+K)%K;
      const wrap=instant===undefined?(n===0&&i===K-1):instant;
      i=n;paint();
      g.scrollTo({left:n*width(),behavior:wrap?'auto':'smooth'});
      arm();
    }

    /* A flick of the thumb is the reader taking over: re-sync, re-arm — and,
       if they went FORWARD before the timer did, take the length of time they
       actually spent on that plate as the pace they want. */
    g.addEventListener('scroll',()=>{
      clearTimeout(g._t);
      g._t=setTimeout(()=>{
        const k=at();
        if(k===i)return;               /* the timer's own move: already counted */
        const fwd=(k===i+1)||(k===0&&i===K-1);
        const ms=Date.now()-shownAt;
        /* only a plate the reader BEAT the timer to is a measurement of how
           long they wanted it. Slower than the dwell means the timer had
           already fired and something else moved the strip. */
        if(fwd&&!stopped&&ms<dwellOf(i))learn(ms);
        i=k;paint();arm();
      },90);
    },{passive:true});

    /* hold the plate to freeze it, the way a story does */
    let holdT=null;
    const hold=()=>{holding=true;reel.classList.add('hold');clear()};
    const release=()=>{clearTimeout(holdT);
      if(holding){holding=false;reel.classList.remove('hold');arm()}};
    g.addEventListener('touchstart',()=>{clearTimeout(holdT);holdT=setTimeout(hold,240)},{passive:true});
    ['touchend','touchcancel'].forEach(e=>g.addEventListener(e,release,{passive:true}));

    rail.querySelector('.pv').addEventListener('click',()=>{stop();go(i-1,true)});
    rail.querySelector('.nx').addEventListener('click',()=>{stop();go(i+1,true)});
    rail.querySelector('.ex').addEventListener('click',()=>enlarge(kids[i]));
    pp.addEventListener('click',()=>{stopped?start():stop()});

    function stop(){stopped=true;reel.classList.add('stopped');clear();
      pp.innerHTML=PLAY;pp.setAttribute('aria-label','Play the reel')}
    function start(){stopped=false;reel.classList.remove('stopped');
      pp.innerHTML=PAUSE;pp.setAttribute('aria-label','Pause the reel');paint();arm()}
    if(RM)stop();

    /* Repaint on arrival, not only at construction. Every reel is built while
       it is still thousands of pixels down the page, so its opening progress
       bar ran its animation out and finished long before anybody scrolled to
       it: you reached the reel, found a bar already full, and waited a whole
       dwell in front of a plate that looked finished. The bar and the timer
       now start together, at the moment the reel is actually looked at. */
    if('IntersectionObserver' in window){
      new IntersectionObserver(es=>es.forEach(e=>{
        const was=onScreen;
        onScreen=e.isIntersecting;
        if(!onScreen)return clear();
        if(!was)paint();
        arm();
      }),{threshold:.4}).observe(g);
    }else{onScreen=true;arm()}

    document.addEventListener('visibilitychange',()=>{document.hidden?clear():arm()});
    addEventListener('resize',()=>{g.scrollTo({left:i*width(),behavior:'auto'})},{passive:true});

    paint();
  }

  /* open whatever this plate holds, full screen */
  function enlarge(cell){
    const v=cell.querySelector('video');
    if(v&&window.__hdOpenVideo)return window.__hdOpenVideo(v);
    const im=cell.querySelector('img');
    if(im&&window.openLB){
      const fc=cell.querySelector('figcaption');
      window.openLB(im.currentSrc||im.src,im.alt,fc?fc.textContent:'');
    }
  }

  document.querySelectorAll('.g-2,.g-3,.g-4').forEach(g=>{
    const kids=[...g.children];
    if(kids.length<2)return;
    /* a long set (the credentials wall) reads better as a scannable grid than as 14 plates */
    if(kids.length>8){g.classList.add('mgrid2');return}
    storyReel(g,kids);
  });

  /* ---------- 5b. the enlarged view: chrome that clears its own captions ----
     The viewer put its instructions at the top left and its four zoom
     buttons at the top right. On a 390 px screen those two claims overlap,
     so the buttons were printed across the end of the sentence. Both lines
     move to one scrim along the foot, which nothing else occupies. */
  const lb=document.getElementById('lb');
  if(lb){
    const hint=lb.querySelector('.hint'),cap=lb.querySelector('.cap');
    if(hint&&cap){
      const foot=document.createElement('div');
      foot.className='foot';
      lb.appendChild(foot);foot.appendChild(cap);foot.appendChild(hint);
      hint.textContent='Pinch to zoom · drag to pan · double-tap to reset';
    }
  }

  /* ---------- 6. film: every clip plays, on arrival, as on desktop ----------
     The page's own band loader (startBand) fetches and loops each clip when it
     comes near the viewport; that runs here unchanged. The only thing added on
     a phone is that a clip stops while it is off-screen, which nobody can see
     and which saves decoding seven films at once.

     What is NOT done any more: pausing the *other* clips. An earlier version
     allowed only one at a time, and it was wrong twice over. Two clips are
     often on screen together — the two Al Tall walkthroughs sit in a pair —
     and IntersectionObserver hands both to the same callback, so the second
     one stopped the first the instant it arrived. Worse, a clip stopped at
     t=0 is not merely still: the shared fade loop ramps opacity from zero over
     the first 0.8 s, so a clip frozen at the start renders at 6 % and reads as
     a black box. That is why the films looked absent on a phone rather than
     merely paused. */
  const vids=[...document.querySelectorAll(
    '.vidfig video, .moi-band video, .contact .cbg video')];
  if('IntersectionObserver' in window){
    const vio=new IntersectionObserver(es=>es.forEach(e=>{
      const v=e.target;
      if(e.isIntersecting){
        if(window.__hdStartBand)window.__hdStartBand(v);
        v.play().catch(()=>{});
      }else v.pause();
    }),{threshold:0});          /* any sliver on screen counts as arrived */
    vids.forEach(v=>vio.observe(v));
  }

  /* ---------- 7. the scrub band sweeps here too ----------------------------
     It used to collapse to one held frame on a phone and the caption was
     rewritten to admit it. The sequence is sixty small JPEGs painted to a
     canvas — well within a phone — so the band now scrubs on scroll exactly
     as it does on a wide screen, and the caption says what it always said. */

  /* ---------- 8. hero: a scroll cue where the cursor hint used to be ---------- */
  const orbit=document.getElementById('orbit');
  if(orbit){
    const cue=document.createElement('div');
    cue.className='m-cue';cue.setAttribute('aria-hidden','true');
    cue.innerHTML='<span>Scroll ▾</span>';
    orbit.appendChild(cue);
  }

  /* ---------- 9. safety: never let the page scroll sideways ---------- */
  addEventListener('resize',()=>{document.body.style.overflowX='hidden'},{passive:true});
}

/* ------------------------------------------------------------------ *
 *  BOTH BUILDS: the film opens full-screen too
 *  ------------------------------------------------------------------
 *  Every still on the page enlarges when you tap it. The clips did not,
 *  which made the film the one thing on the page you could not actually
 *  look at — a 16:9 band 200 px tall on a phone, with no transport bar
 *  because the inline loops are deliberately chromeless.
 *
 *  Each clip now carries an expand control, and opens into a viewer that
 *  does have a transport bar. The viewer picks the clip up where the
 *  inline loop had reached and hands the time back on the way out, so
 *  closing it does not visibly rewind the band underneath.
 * ------------------------------------------------------------------ */
function initVideoViewer(){
  const clips=[...document.querySelectorAll('.vidfig video, .moi-band video, .scrub video')]
    .filter(v=>!v.closest('.cbg'));       /* the contact wash is scenery, not a film */
  if(!clips.length)return;

  const box=document.createElement('div');
  box.id='vlb';box.setAttribute('role','dialog');
  box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Video viewer');
  box.innerHTML=
    '<div class="vui"><button type="button" id="vlbx" aria-label="Close">✕</button></div>'+
    '<video id="vlbv" playsinline controls controlslist="nodownload"></video>'+
    '<span class="vcap" id="vlbc"></span>';
  document.body.appendChild(box);
  const vv=box.querySelector('#vlbv'),vc=box.querySelector('#vlbc');
  let from=null,lastFocus=null;

  const srcOf=v=>v.currentSrc||v.getAttribute('src')||v.dataset.src||'';

  function open(v){
    const src=srcOf(v);if(!src)return;
    from=v;lastFocus=document.activeElement;
    const fig=v.closest('figure')||v.closest('.moi-band')||v.closest('.scrub');
    const c=fig&&(fig.querySelector('figcaption')||fig.querySelector('.cap .in'));
    vc.textContent=c?c.textContent.trim():(v.getAttribute('aria-label')||'');
    vv.src=src;
    vv.currentTime=(isFinite(v.currentTime)?v.currentTime:0);
    vv.muted=false;vv.loop=true;
    box.classList.add('on');document.body.style.overflow='hidden';
    vv.play().catch(()=>{vv.muted=true;vv.play().catch(()=>{})});
    setTimeout(()=>box.querySelector('#vlbx').focus({preventScroll:true}),60);
  }
  function close(){
    box.classList.remove('on');document.body.style.overflow='';
    /* hand the position back so the band behind does not jump to zero */
    if(from&&isFinite(vv.currentTime)){
      try{from.currentTime=vv.currentTime%(isFinite(from.duration)?from.duration:vv.duration||1)}catch(e){}
      from.play().catch(()=>{});
    }
    vv.pause();vv.removeAttribute('src');vv.load();from=null;
    if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true});
  }
  window.__hdOpenVideo=open;

  box.querySelector('#vlbx').addEventListener('click',close);
  box.addEventListener('click',e=>{if(e.target===box)close()});
  addEventListener('keydown',e=>{if(e.key==='Escape'&&box.classList.contains('on'))close()});

  const expand=svg('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',1.7);
  clips.forEach(v=>{
    const host=v.closest('figure')||v.closest('.moi-band')||v.closest('.scrub');
    if(!host||host.querySelector(':scope > .vx'))return;
    if(getComputedStyle(host).position==='static')host.style.position='relative';
    const b=document.createElement('button');
    b.type='button';b.className='vx';
    b.setAttribute('aria-label','Open the film full screen');
    b.innerHTML=expand;
    b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();open(v)});
    host.appendChild(b);
    v.style.cursor='pointer';
    v.addEventListener('click',()=>open(v));
  });
}

/* ------------------------------------------------------------------ */
const boot=v=>{addSwitch(v);if(v==='mobile')initMobile();initVideoViewer()};
if(window.__hdWhenView)window.__hdWhenView(boot);
else boot(R.dataset.view||'desktop');
})();
