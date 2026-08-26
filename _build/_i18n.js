/* =====================================================================
   ARABIC / ENGLISH
   ---------------------------------------------------------------------
   One page, two languages. The English markup stays the source of truth;
   Arabic is a dictionary laid over it at run time, keyed by the English
   text itself. Nothing in index.base.html has to carry an id, and a new
   paragraph written in English simply shows in English until it is given
   a line in the dictionary.

   The unit of translation is a BLOCK, not a text node: any element with
   a direct text child is taken whole, inline <b>/<em> and all. That
   matters more in Arabic than in most languages - word order moves, so a
   sentence translated in three pieces around its <b> tags comes out as
   nonsense. i18n_extract.py applies exactly the same rule when it pulls
   the strings out, so the two halves cannot drift apart.

   Anything a script writes later - the mobile contents sheet, the 3D
   viewer's loading line, the scan's captions - is caught by a
   MutationObserver running the same pass over whatever appeared.

   Switching language RELOADS the page. This site runs three WebGL
   scenes, a canvas frame-scrubber, autoplaying film and a char-split
   headline; re-flowing all of that in place is a large surface for a
   half-translated state, and a reload costs a second and is always
   right. Where you were reading is kept.
   ===================================================================== */
(()=>{
const R=document.documentElement;
const DICT=window.__hdAR||{units:{},attrs:{}};
const LANGS={en:'English',ar:'العربية'};

/* ------------------------------------------------------------------ *
 *  which language
 * ------------------------------------------------------------------ */
const qp=new URLSearchParams(location.search);
let lang=qp.get('lang');
if(lang!=='ar'&&lang!=='en'){
  try{lang=localStorage.getItem('hdlang')}catch(e){lang=null}
}
if(lang!=='ar'&&lang!=='en'){
  /* no choice yet: offer the reader's own language, ask on the gate */
  lang=(navigator.languages||[navigator.language||'en'])
        .some(l=>/^ar\b/i.test(l))?'ar':'en';
  window.__hdLangGuess=true;
}
window.__hdLang=lang;

const T=k=>{
  const v=DICT.units[k];
  return (lang==='ar'&&v)?v:k;
};
window.__hdT=T;
window.__hdLangName=l=>LANGS[l]||l;

/* ------------------------------------------------------------------ *
 *  apply the language to the document shell
 * ------------------------------------------------------------------ */
function shell(){
  R.lang=lang;
  R.dir=(lang==='ar')?'rtl':'ltr';
  R.classList.toggle('lang-ar',lang==='ar');
  R.classList.toggle('lang-en',lang!=='ar');
  if(lang==='ar'&&!document.getElementById('hd-ar-font')){
    /* the Latin faces have no Arabic coverage; without these the page
       falls back to whatever the OS has and the type stops being design */
    const l=document.createElement('link');
    l.id='hd-ar-font';l.rel='stylesheet';
    l.href='https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800'+
           '&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700'+
           '&family=Noto+Naskh+Arabic:wght@400..700&display=swap';
    document.head.appendChild(l);
  }
}
shell();

/* ------------------------------------------------------------------ *
 *  the pass
 * ------------------------------------------------------------------ */
const OPAQUE=new Set(['SCRIPT','STYLE','SVG','CANVAS','VIDEO','AUDIO','NOSCRIPT',
                      'TEMPLATE','IFRAME','OBJECT']);
const ATTRS=['alt','aria-label','title','placeholder','data-text'];
const NBSP=/ /g;
const norm=s=>s.replace(NBSP,' ').replace(/\s+/g,' ').trim();
const done=new WeakSet();

function hasDirectText(el){
  for(const n of el.childNodes)
    if(n.nodeType===3&&/[A-Za-z]/.test(n.data))return true;
  return false;
}

const VOIDISH=new Set(['IMG','INPUT','BR','HR','SOURCE','TRACK','EMBED']);
/* Which children survive a translation verbatim: icons, images, and anything
   carrying an id - because somewhere a script is holding that node and will
   go on writing to it (the scan's ALT readout, the viewer's TRIS counter).
   They are MOVED into the new content, not re-serialised, so the reference
   the script kept stays the node that is on screen. */
const isAtom=n=>n.nodeType===1&&(OPAQUE.has(n.tagName)||VOIDISH.has(n.tagName)||!!n.id);

function unit(el){
  if(done.has(el))return;
  const key=norm(el.textContent||'');
  if(!key)return;
  const ar=DICT.units[key];
  done.add(el);
  if(!ar)return;
  const atoms=[];
  el.childNodes.forEach(n=>{if(isAtom(n))atoms.push(n)});
  const tpl=document.createElement('template');
  try{tpl.innerHTML=ar}catch(e){return}
  if(ar.indexOf('{{')>=0){
    /* walk the fresh content and swap each {{n}} placeholder for its node */
    const it=document.createTreeWalker(tpl.content,NodeFilter.SHOW_TEXT);
    const hits=[];
    for(let t=it.nextNode();t;t=it.nextNode())
      if(t.data.indexOf('{{')>=0)hits.push(t);
    hits.forEach(t=>{
      const parts=t.data.split(/(\{\{\d+\}\})/);
      const frag=document.createDocumentFragment();
      parts.forEach(p=>{
        const m=/^\{\{(\d+)\}\}$/.exec(p);
        if(m){if(atoms[+m[1]])frag.appendChild(atoms[+m[1]])}
        else if(p)frag.appendChild(document.createTextNode(p));
      });
      t.parentNode.replaceChild(frag,t);
    });
  }
  el.textContent='';
  el.appendChild(tpl.content);
}

function attrs(el){
  for(const a of ATTRS){
    if(!el.hasAttribute(a))continue;
    const v=norm(el.getAttribute(a));
    const ar=DICT.attrs[v]||DICT.units[v];
    if(ar&&ar!==v)el.setAttribute(a,ar);
  }
}

function walk(el){
  if(!el||el.nodeType!==1||OPAQUE.has(el.tagName))return;
  attrs(el);
  if(el.id==='orbitH1')return;           /* rebuilt from data-text */
  if(hasDirectText(el)){unit(el);return} /* outermost wins; do not descend */
  for(let c=el.firstElementChild;c;c=c.nextElementSibling)walk(c);
}

function pass(root){
  if(lang!=='ar')return;
  if(root&&root.nodeType===1)walk(root);
}
/* the gate's script calls this the moment its markup is parsed */
window.__hdI18n=pass;

/* the gate exists already; the rest of the page does not yet */
pass(document.body);
if(document.readyState==='loading')
  addEventListener('DOMContentLoaded',()=>pass(document.body),{once:true});
addEventListener('load',()=>pass(document.body),{once:true});

if(lang==='ar'&&'MutationObserver' in window){
  const mo=new MutationObserver(ms=>{
    for(const m of ms){
      if(m.type==='childList'){
        m.addedNodes.forEach(n=>{
          if(n.nodeType===1)walk(n);
          else if(n.nodeType===3&&m.target&&m.target.nodeType===1){
            done.delete(m.target);walk(m.target);
          }
        });
      }else if(m.type==='characterData'&&m.target.parentElement){
        const p=m.target.parentElement;done.delete(p);walk(p);
      }
    }
  });
  addEventListener('DOMContentLoaded',()=>mo.observe(document.body,
      {childList:true,subtree:true,characterData:true}),{once:true});
  if(document.readyState!=='loading')
    mo.observe(document.body,{childList:true,subtree:true,characterData:true});
}

/* the <title> is outside body */
if(lang==='ar'){
  const t=DICT.units[norm(document.title)];
  if(t)document.title=t.replace(/<[^>]+>/g,'');
}

/* ------------------------------------------------------------------ *
 *  switching
 * ------------------------------------------------------------------ */
window.__hdSetLang=l=>{
  if(l!==lang){
    try{localStorage.setItem('hdlang',l)}catch(e){}
    const u=new URL(location.href);
    u.searchParams.set('lang',l);
    /* Carry the build across. Picking desktop or mobile on the gate does not
       write anything into the URL — it just applies the choice and removes the
       chooser — so reloading for a language change used to arrive with no
       ?view= and be met by the gate all over again. */
    if(!u.searchParams.get('view')){
      const v=window.__hdView&&window.__hdView();
      if(v)u.searchParams.set('view',v);
    }
    /* come back to the chapter the reader was in, not to the top */
    const here=window.__hdHere&&window.__hdHere();
    u.hash=here?('#'+here):location.hash;
    location.href=u.toString();
  }
};
/* the gate calls this before the page is committed: no reload needed */
window.__hdPickLang=l=>{
  if(l===lang){try{localStorage.setItem('hdlang',l)}catch(e){}return}
  try{localStorage.setItem('hdlang',l)}catch(e){}
  const u=new URL(location.href);u.searchParams.set('lang',l);
  location.href=u.toString();
};

/* which section is on screen, so a reload lands where you were */
window.__hdHere=()=>{
  const ids=['profile','index','moi','pipeline','auh','ajman','rak','fjr','fibrex',
    'zayed','gugg','nhm','amaala','freelance','rize','fcinema','flibrary','interiors',
    'practice','skyfall','erbil','altallproj','mawlawiya','marsemaan','thesisproj',
    'skyscraper','mosque','rome','papertrail','contact'];
  const y=scrollY+innerHeight*0.34;let best=null;
  for(const id of ids){
    const e=document.getElementById(id);if(!e)continue;
    const top=e.getBoundingClientRect().top+scrollY;
    if(top<=y&&(!best||top>best.top))best={id,top};
  }
  return best&&best.id;
};

/* ------------------------------------------------------------------ *
 *  the floating switch
 * ------------------------------------------------------------------ */
function mountSwitch(){
  if(document.getElementById('hd-lang'))return;
  const other=(lang==='ar')?'en':'ar';
  const b=document.createElement('button');
  b.id='hd-lang';b.type='button';
  b.setAttribute('aria-label',lang==='ar'?'Read in English':'اقرأ بالعربية');
  b.setAttribute('lang',other);
  b.innerHTML='<span class="glyph" aria-hidden="true">'+
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" '+
      'stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/>'+
      '<path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"/></svg>'+
      '</span><span class="lbl">'+LANGS[other]+'</span>';
  b.addEventListener('click',()=>window.__hdSetLang(other));
  document.body.appendChild(b);
}
addEventListener('DOMContentLoaded',mountSwitch,{once:true});
if(document.readyState!=='loading')mountSwitch();
})();
