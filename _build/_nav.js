/* =====================================================================
   ANCHOR NAVIGATION — one scroller for every table of contents
   ---------------------------------------------------------------------
   The page is ~50 000 px tall and almost every picture in it is lazy.
   Native anchor jumps resolve the destination ONCE, at click time, from a
   layout in which none of the imagery between here and there has loaded.
   By the time the scroll lands, several thousand pixels have appeared
   above the target and the reader is looking at a heading two or three
   projects too early.

   build.py now stamps a real width/height on every <img>, so the page is
   the right height before the bytes arrive — that alone removes most of
   the drift. This module closes the rest of the gap:

     * it animates the scroll itself and re-resolves the target on EVERY
       frame, so anything that changes height mid-flight is absorbed
       instead of accumulating;
     * it holds the target pinned for a moment after arrival, so a late
       decode or a web font swapping in cannot nudge the reader off it;
     * it subtracts the fixed top bar, which a native jump does not;
     * it warms the images between here and the destination so the
       settling happens while the scroll is still moving.

   Used by all three tables of contents — the top bar, the right-hand
   rail, the index section — and by the mobile contents sheet.
   ===================================================================== */
(()=>{
const R=document.documentElement;
const RM=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;

/* we drive the scroll ourselves; CSS smooth scrolling would fight it */
R.style.scrollBehavior='auto';

const maxY=()=>Math.max(0,R.scrollHeight-innerHeight);

/* the top bar is fixed, so a flush anchor hides the first line under it */
function barH(){
  const b=document.querySelector('.topbar');
  if(!b)return 0;
  const cs=getComputedStyle(b);
  if(cs.position!=='fixed'||cs.display==='none'||cs.visibility==='hidden')return 0;
  return b.getBoundingClientRect().height;
}

function el(hash){
  if(!hash||hash==='#')return null;
  let id;
  try{id=decodeURIComponent(hash.slice(1))}catch(e){id=hash.slice(1)}
  if(!id)return null;
  return document.getElementById(id)||document.getElementsByName(id)[0]||null;
}

/* where the page should sit for this element, resolved fresh every time */
function yFor(t){
  if(!t)return null;
  const r=t.getBoundingClientRect();
  const gap=barH()+Math.round(Math.min(24,innerHeight*0.02));
  return Math.max(0,Math.min(maxY(),Math.round(r.top+scrollY-gap)));
}

/* pull the pictures we are about to fly past into the fetch queue now, so
   whatever settling they cause happens during the scroll, not after it */
function warm(toY){
  const lo=Math.min(scrollY,toY)-innerHeight, hi=Math.max(scrollY,toY)+innerHeight*1.5;
  for(const im of document.images){
    if(im.loading!=='lazy'||im.complete)continue;
    const y=im.getBoundingClientRect().top+scrollY;
    if(y>lo&&y<hi)im.loading='eager';
  }
}

/* ------------------------------------------------------------------ *
 *  the scroll itself
 * ------------------------------------------------------------------ */
let run=0;                       /* id of the flight in progress */
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
/* a hidden tab never fires rAF, so nothing that has to happen may depend on it */
const soon=cb=>document.hidden?setTimeout(()=>cb(performance.now()),16)
                             :requestAnimationFrame(cb);

function abort(){run++}
/* any real input from the reader wins immediately */
['wheel','touchstart','keydown','pointerdown'].forEach(ev=>
  addEventListener(ev,e=>{if(e.isTrusted)abort()},{passive:true,capture:true}));

function goTo(t,{instant=false,focus=true}={}){
  if(!t)return;
  const me=++run;
  const y0=scrollY;
  let y1=yFor(t);
  warm(y1);

  const land=()=>{
    if(focus)park(t);
    hold(t,me);
  };

  if(instant||RM()||document.hidden||Math.abs(y1-y0)<2){
    scrollTo(0,y1);land();return;
  }
  /* distance-scaled, but never a journey — 50 000 px still takes ~1 s */
  const dur=Math.min(1100,Math.max(360,Math.abs(y1-y0)*0.28+320));
  const t0=performance.now();
  (function step(now){
    if(me!==run)return;                    /* the reader took over */
    const k=Math.min(1,(now-t0)/dur);
    y1=yFor(t);                            /* <- the whole point: re-resolve */
    scrollTo(0,Math.round(y0+(y1-y0)*ease(k)));
    if(k<1)soon(step);
    else land();
  })(t0);
}

/* Hold the destination still while the last images and fonts land.
   Correcting instantly is what keeps it invisible: content grows above
   the target, we absorb the growth, and the target never appears to move. */
function hold(t,me){
  const until=performance.now()+1400;
  (function check(now){
    if(me!==run)return;
    const want=yFor(t);
    if(Math.abs(want-scrollY)>1)scrollTo(0,want);
    if(now<until)soon(check);
  })(performance.now());
}

/* keep the keyboard where the eye is, without letting focus re-scroll us */
function park(t){
  if(!t.hasAttribute('tabindex')){
    t.setAttribute('tabindex','-1');
    t.addEventListener('blur',()=>t.removeAttribute('tabindex'),{once:true});
  }
  try{t.focus({preventScroll:true})}catch(e){}
}

/* ------------------------------------------------------------------ *
 *  wiring
 * ------------------------------------------------------------------ */
addEventListener('click',e=>{
  if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const a=e.target.closest&&e.target.closest('a[href]');
  if(!a||a.target==='_blank'||a.hasAttribute('download')||a.dataset.noNav!==undefined)return;
  const href=a.getAttribute('href');
  if(!href||href.charAt(0)!=='#'||href==='#')return;
  const t=el(href);
  if(!t)return;
  e.preventDefault();
  /* the mobile contents sheet closes on this same click and restores
     body overflow; let that finish before we start moving */
  setTimeout(()=>{
    try{history.pushState(null,'',href)}catch(err){location.hash=href}
    goTo(t);
  },0);
},false);

/* back / forward between anchors, and anything that still sets the hash */
addEventListener('popstate',()=>{const t=el(location.hash);if(t)goTo(t)});
addEventListener('hashchange',e=>{
  const t=el(location.hash);
  if(t){e.preventDefault&&e.preventDefault();goTo(t)}
});

/* deep link: the browser's own restore ran against an empty layout too */
if(location.hash&&location.hash!=='#'){
  const settle=()=>{const t=el(location.hash);if(t)goTo(t,{instant:true})};
  addEventListener('DOMContentLoaded',settle,{once:true});
  addEventListener('load',()=>{run=0;settle()},{once:true});
}

/* other modules (the mobile sheet's "load the scan" button, say) can ask
   for the same self-correcting scroll instead of scrollIntoView */
window.__hdGoTo=(idOrEl,opt)=>goTo(typeof idOrEl==='string'?el('#'+idOrEl.replace(/^#/,'')):idOrEl,opt);
})();
