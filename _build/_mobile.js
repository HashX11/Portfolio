/* =====================================================================
   MOBILE BUILD — behaviour. Runs only when the reader picked "mobile".
   Desktop is untouched apart from the one "switch view" link at the end.
   ===================================================================== */
(()=>{
const R=document.documentElement;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
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
  document.body.classList.remove('curon');

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
          <a href="https://wa.me/971509702901" target="_blank" rel="noopener">WhatsApp <span class="go">→</span></a>
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

  /* ---------- 5. galleries become swipe strips ---------- */
  document.querySelectorAll('.g-2,.g-3,.g-4').forEach(g=>{
    const kids=[...g.children];
    if(kids.length<2)return;
    /* a long set (the credentials wall) reads better as a scannable grid than as 14 swipes */
    if(kids.length>8){g.classList.add('mgrid2');return}
    g.classList.add('mstrip');
    const dots=document.createElement('div');
    dots.className='m-dots';dots.setAttribute('aria-hidden','true');
    dots.innerHTML=kids.map(()=>'<i></i>').join('')+`<span class="lab">Swipe · 1/${kids.length}</span>`;
    g.after(dots);
    const dd=[...dots.querySelectorAll('i')],lab=dots.querySelector('.lab');
    const sync=()=>{
      const i=Math.round(g.scrollLeft/(g.scrollWidth/kids.length));
      const k=Math.max(0,Math.min(kids.length-1,i));
      dd.forEach((d,j)=>d.classList.toggle('on',j===k));
      lab.textContent=`Swipe · ${k+1}/${kids.length}`;
    };
    g.addEventListener('scroll',()=>{clearTimeout(g._t);g._t=setTimeout(sync,60)},{passive:true});
    sync();
  });

  /* ---------- 6. film: nothing downloads until it's tapped ---------- */
  window.__mGate=true;
  document.querySelectorAll('.vidfig').forEach(fig=>{
    const v=fig.querySelector('video');if(!v)return;
    const btn=document.createElement('button');
    btn.type='button';btn.className='m-play';
    btn.setAttribute('aria-label','Play this clip');
    btn.innerHTML='<span class="ring" aria-hidden="true">'+svg('<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>')+'</span>'+
      '<span class="t">Tap to play</span>';
    fig.appendChild(btn);
    btn.addEventListener('click',()=>{
      v.dataset.mok='1';
      btn.classList.add('off');
      setTimeout(()=>btn.remove(),420);
      if(window.__hdStartBand)window.__hdStartBand(v);
      else{v.preload='auto';try{v.load()}catch(e){}v.play().catch(()=>{})}
    });
  });
  /* only one clip runs at a time, and none run off-screen */
  const vids=[...document.querySelectorAll('.vidfig video')];
  if('IntersectionObserver' in window){
    const vio=new IntersectionObserver(es=>es.forEach(e=>{
      const v=e.target;
      if(!v.dataset.mok)return;
      if(e.isIntersecting){vids.forEach(o=>{if(o!==v&&!o.paused)o.pause()});v.play().catch(()=>{})}
      else v.pause();
    }),{threshold:0.25});
    vids.forEach(v=>vio.observe(v));
  }

  /* ---------- 7. photogrammetry scan waits to be asked ---------- */
  const pg=document.getElementById('pgscan');
  if(pg){
    const ph=document.createElement('div');
    ph.className='m-scan';
    ph.innerHTML=
     '<img src="assets/img/at_massplan.jpg" alt="Drone photogrammetry scan of the Al Tall district" loading="lazy">'+
     '<div class="in"><div class="t">Drone photogrammetry · the real district</div>'+
     '<button type="button">Load the 3D scan · 7 MB</button>'+
     '<div class="t" style="opacity:.65">Then scroll to orbit it</div></div>';
    pg.parentNode.insertBefore(ph,pg);
    pg.style.display='none';
    ph.querySelector('button').addEventListener('click',()=>{
      ph.remove();
      pg.style.display='';
      pg.classList.add('m-live');
      if(window.__hdPgInit)window.__hdPgInit();
      pg.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'});
    });
  }

  /* ---------- 7b. the scrub band is a held frame here, so say so ---------- */
  const scap=document.querySelector('.scrub .cap .in');
  if(scap)scap.innerHTML='UPLINK ACQUIRED · <b>A COUNTRY AS LIVING DATA</b>';

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

/* ------------------------------------------------------------------ */
const boot=v=>{addSwitch(v);if(v==='mobile')initMobile()};
if(window.__hdWhenView)window.__hdWhenView(boot);
else boot(R.dataset.view||'desktop');
})();
