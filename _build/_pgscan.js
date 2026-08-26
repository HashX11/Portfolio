/* ============ AL TALL — SCROLL-DRIVEN PHOTOGRAMMETRY SCAN ============
   Deliberately NOT orbitable: the camera path, the reveal and the copy are
   all bound to scroll position, so the scan is only ever seen from the
   angles where the capture is clean.

   The elevation stays high the whole way through — the drone shot the
   district from above, so the mesh is sharp looking down and ragged
   looking along the horizon. The path never drops below ~46°.

   What the scroll now buys you, in order:
     0.00 – 0.16  CAPTURE       the raw point cloud, still dispersed, with
                                the drone's own orbit drawn around it
     0.16 – 0.52  RECONSTRUCT   the clip plane climbs, the solid mesh grows
                                up out of the cloud, points dissolve into
                                the surface as the sweep line passes them
     0.52 – 1.00  SURVEY        a full turn around the finished capture,
                                fog and ground grid holding the horizon,
                                the lens easing from wide to long

   Runs in both builds. On a phone the point budget and the pixel ratio
   drop, but the choreography is identical.
   ==================================================================== */
(()=>{
const wrap=document.getElementById('pgscan');if(!wrap)return;
if(!window.THREE3D){wrap.style.display='none';return}
const {THREE,GLTFLoader,RoomEnvironment}=window.THREE3D;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const cv=document.getElementById('pgCanvas');
const capEl=document.getElementById('pgCap'),progEl=document.getElementById('pgProg'),
      hintEl=document.getElementById('pgHint'),loadEl=document.getElementById('pgLoad'),
      barEl=document.getElementById('pgBar'),trisEl=document.getElementById('pgTris');
const IS_FILE=location.protocol==='file:';
const SMALL=innerWidth<820||matchMedia('(pointer:coarse)').matches;
const PTS=SMALL?26000:78000;           /* point budget for the capture cloud */

let renderer,scene,camera,root,plane,sweep,sweepEdge,cloud,drone,droneDot,grid,glow,
    box,center,radius,ready=false,started=false,raf=null;
let p=0,pt=0,fit=1;   /* fit: how much further back a tall screen has to sit */
const _v=new THREE.Vector3(),_look=new THREE.Vector3();

/* ------------------------------------------------------------------ *
 *  HUD — corner brackets and a live flight readout, built here so the
 *  markup stays a plain canvas + caption
 * ------------------------------------------------------------------ */
const ui=wrap.querySelector('.pgui');
let altEl=null,aziEl=null,phaseEl=null;
if(ui){
  const fr=document.createElement('div');
  fr.className='pgframe';fr.setAttribute('aria-hidden','true');
  fr.innerHTML='<i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i>';
  wrap.querySelector('.pgsticky').appendChild(fr);
  const scan=document.createElement('div');
  scan.className='pgscanline';scan.setAttribute('aria-hidden','true');
  wrap.querySelector('.pgsticky').appendChild(scan);
  const top=ui.querySelector('.pgtop');
  if(top){
    const tel=document.createElement('span');
    tel.className='pgtel';tel.setAttribute('aria-hidden','true');
    tel.innerHTML='<span class="ph" id="pgPhase">CAPTURE</span>'+
                  '<span>ALT <b id="pgAlt">—</b></span>'+
                  '<span>AZ <b id="pgAzi">—</b></span>';
    top.appendChild(tel);
    altEl=tel.querySelector('#pgAlt');aziEl=tel.querySelector('#pgAzi');
    phaseEl=tel.querySelector('#pgPhase');
  }
}

/* ------------------------------------------------------------------ */
function loadScan(){
  return new Promise((res,rej)=>{
    if(IS_FILE){
      const s=document.createElement('script');
      s.src='assets/3d/models-js/SCAN_Al_Tall.glb.js';
      s.onload=()=>{
        const b64=window.__GLB&&window.__GLB['SCAN_Al_Tall'];
        if(!b64)return rej(new Error('empty wrapper'));
        const bin=atob(b64),u=new Uint8Array(bin.length);
        for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
        if(barEl)barEl.style.transform='scaleX(.8)';
        new GLTFLoader().parse(u.buffer,'assets/3d/models/',res,rej);
      };
      s.onerror=()=>rej(new Error('wrapper load failed'));
      document.head.appendChild(s);
    }else{
      new GLTFLoader().load('assets/3d/models/SCAN_Al_Tall.glb',res,
        ev=>{if(ev.total&&barEl)barEl.style.transform=`scaleX(${(ev.loaded/ev.total).toFixed(3)})`},rej);
    }
  });
}

/* every vertex of the decimated mesh, in world space, thinned to the
   point budget — this is the cloud the solid surface grows out of */
function buildCloud(){
  const meshes=[];
  root.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.attributes.position)meshes.push(o)});
  let total=0;
  meshes.forEach(m=>total+=m.geometry.attributes.position.count);
  if(!total)return;
  const step=Math.max(1,Math.floor(total/PTS));
  const n=Math.floor(total/step);
  const pos=new Float32Array(n*3), off=new Float32Array(n), seed=new Float32Array(n);
  let w=0,seen=0;
  const span=Math.max(1e-6,box.max.y-box.min.y);
  for(const m of meshes){
    const a=m.geometry.attributes.position;
    m.updateWorldMatrix(true,false);
    for(let i=0;i<a.count;i++,seen++){
      if(seen%step||w>=n)continue;
      _v.fromBufferAttribute(a,i).applyMatrix4(m.matrixWorld);
      pos[w*3]=_v.x;pos[w*3+1]=_v.y;pos[w*3+2]=_v.z;
      off[w]=(_v.y-box.min.y)/span;          /* where the sweep will reach it */
      seed[w]=Math.random();
      w++;
    }
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(pos.subarray(0,w*3),3));
  g.setAttribute('aOff',new THREE.BufferAttribute(off.subarray(0,w),1));
  g.setAttribute('aSeed',new THREE.BufferAttribute(seed.subarray(0,w),1));

  /* dispersed → resolved, driven by uRev. A point drifts loose while the
     reconstruction line is still below it, flares as the line arrives,
     and hands itself over to the solid surface once the line is past. */
  const mat=new THREE.ShaderMaterial({
    transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    uniforms:{uRev:{value:-0.06},uT:{value:0},uSize:{value:SMALL?1.7:2.4},
              uScale:{value:radius},uCol:{value:new THREE.Color(0x7FE0EC)}},
    vertexShader:`
      attribute float aOff; attribute float aSeed;
      uniform float uRev,uT,uSize,uScale; varying float vA;
      void main(){
        float alive=smoothstep(uRev-0.02,uRev+0.06,aOff);   /* 0 = solid now */
        float edge =exp(-pow((aOff-uRev)/0.055,2.0));       /* the scan line */
        float wob=sin(uT*0.9+aSeed*40.0);
        vec3 pp=position;
        pp.y+=alive*uScale*(0.085*(aSeed-0.5)*2.0+0.012*wob);
        pp.x+=alive*uScale*0.045*(sin(aSeed*77.0)+0.35*wob);
        pp.z+=alive*uScale*0.045*cos(aSeed*53.0);
        vec4 mv=modelViewMatrix*vec4(pp,1.0);
        gl_Position=projectionMatrix*mv;
        gl_PointSize=clamp(uSize*(uScale*3.0/max(0.001,-mv.z)),0.7,6.0);
        vA=alive*(0.26+0.80*edge);
      }`,
    fragmentShader:`
      uniform vec3 uCol; varying float vA;
      void main(){
        vec2 c=gl_PointCoord-0.5;
        float m=1.0-smoothstep(0.18,0.5,length(c));
        if(m<=0.01||vA<=0.01)discard;
        gl_FragColor=vec4(uCol,m*vA);
      }`
  });
  cloud=new THREE.Points(g,mat);
  cloud.frustumCulled=false;
  scene.add(cloud);
}

/* the drone's own orbit, drawn once as evidence of how this was made */
function buildDrone(){
  const r=radius*1.30, seg=SMALL?96:180, pts=[];
  for(let i=0;i<=seg;i++){
    const a=i/seg*Math.PI*2;
    pts.push(new THREE.Vector3(center.x+Math.cos(a)*r, center.y+radius*0.58+Math.sin(a*3)*radius*0.035, center.z+Math.sin(a)*r));
  }
  drone=new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineDashedMaterial({color:0x4FB7C4,transparent:true,opacity:0,
      dashSize:radius*0.05,gapSize:radius*0.04,depthWrite:false}));
  drone.computeLineDistances();
  scene.add(drone);
  droneDot=new THREE.Mesh(
    new THREE.SphereGeometry(radius*0.008,10,10),
    new THREE.MeshBasicMaterial({color:0xBFF3FA,transparent:true,opacity:0,depthWrite:false}));
  scene.add(droneDot);
}

async function init(){
  if(started)return;started=true;
  try{
    renderer=new THREE.WebGLRenderer({canvas:cv,antialias:!SMALL,alpha:false,powerPreference:'high-performance'});
  }catch(e){wrap.style.display='none';return}
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,SMALL?1.6:1.8));
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=0.65;
  renderer.localClippingEnabled=true;
  scene=new THREE.Scene();
  scene.background=new THREE.Color(0x0E1417);
  camera=new THREE.PerspectiveCamera(44,1,0.1,100000);
  const pm=new THREE.PMREMGenerator(renderer);
  scene.environment=pm.fromScene(new RoomEnvironment(),.04).texture;pm.dispose();
  let gltf;
  try{gltf=await loadScan()}catch(e){console.warn('Al Tall scan failed to load',e);wrap.style.display='none';return}
  root=gltf.scene;
  box=new THREE.Box3().setFromObject(root);
  center=box.getCenter(new THREE.Vector3());
  radius=Math.max(box.getSize(new THREE.Vector3()).length()/2,.001);
  plane=new THREE.Plane(new THREE.Vector3(0,-1,0),box.min.y);
  let tris=0;
  root.traverse(o=>{
    if(!o.isMesh)return;
    o.material.clippingPlanes=[plane];
    o.material.side=THREE.DoubleSide;
    const g=o.geometry;
    tris+=(g.index?g.index.count:g.attributes.position.count)/3;
  });
  scene.add(root);

  scene.add(new THREE.HemisphereLight(0xDFEEF2,0x2A3840,.95));
  const key=new THREE.DirectionalLight(0xFFF6E8,2.1);
  key.position.set(center.x+radius,center.y+radius*2,center.z+radius);
  scene.add(key);
  const rim=new THREE.DirectionalLight(0x8FD8E4,.9);
  rim.position.set(center.x-radius*1.4,center.y+radius*.6,center.z-radius*1.2);
  scene.add(rim);
  /* fog tight enough that the ragged edge of the capture dissolves into
     the dark instead of ending on a hard rectangle */
  scene.fog=new THREE.Fog(0x0E1417,radius*2.9,radius*9.5);

  /* survey grid on the ground plane — a floor for the district to sit on */
  grid=new THREE.GridHelper(radius*7,SMALL?28:48,0x2C6A72,0x1B3A40);
  grid.position.set(center.x,box.min.y-radius*0.004,center.z);
  grid.material.transparent=true;grid.material.opacity=0;grid.material.depthWrite=false;
  scene.add(grid);

  /* a soft pool of light under the mesh so it is grounded, not floating */
  glow=new THREE.Mesh(
    new THREE.CircleGeometry(radius*1.9,64),
    new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
      uniforms:{uO:{value:0}},
      vertexShader:'varying vec2 vU; void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader:'uniform float uO; varying vec2 vU; void main(){float d=length(vU-0.5)*2.0;float a=(1.0-smoothstep(0.0,1.0,d));gl_FragColor=vec4(0.31,0.72,0.77,a*a*uO);}'}));
  glow.rotation.x=-Math.PI/2;
  glow.position.set(center.x,box.min.y-radius*0.002,center.z);
  scene.add(glow);

  /* the reconstruction line: a wide soft plate plus a tight bright edge */
  const sz=radius*2.9;
  sweep=new THREE.Mesh(
    new THREE.PlaneGeometry(sz,sz),
    new THREE.MeshBasicMaterial({color:0x4FB7C4,transparent:true,opacity:0,
      blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));
  sweep.rotation.x=-Math.PI/2;
  sweep.position.set(center.x,box.min.y,center.z);
  scene.add(sweep);
  sweepEdge=new THREE.Mesh(
    new THREE.RingGeometry(radius*1.02,radius*1.10,96),
    new THREE.MeshBasicMaterial({color:0xCFF6FB,transparent:true,opacity:0,
      blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));
  sweepEdge.rotation.x=-Math.PI/2;
  sweepEdge.position.set(center.x,box.min.y,center.z);
  scene.add(sweepEdge);

  buildCloud();
  buildDrone();

  if(trisEl)trisEl.textContent=Math.round(tris).toLocaleString('en-US')+' TRIS';
  ready=true;
  if(loadEl)loadEl.classList.add('off');
  resize();
  pt=RM?0.62:scrollP();p=pt;
  frame(true);
  if(!raf)loop();
}

function resize(){
  if(!renderer||!camera)return;
  const r=cv.getBoundingClientRect();
  if(r.width<2||r.height<2)return;
  renderer.setSize(r.width,r.height,false);
  camera.aspect=r.width/r.height;camera.updateProjectionMatrix();
  /* a phone in portrait sees a much narrower slice at the same distance, so
     the whole path steps back until the district reads as a district again */
  fit=Math.min(2.0,Math.max(1,Math.sqrt(1.55/Math.max(0.35,camera.aspect))));
}
addEventListener('resize',resize);
addEventListener('orientationchange',()=>setTimeout(resize,250));

function scrollP(){
  const r=wrap.getBoundingClientRect();
  const total=Math.max(1,r.height-innerHeight);
  return Math.min(1,Math.max(0,-r.top/total));
}

const CAPS=[
 [0.00,'Drone photogrammetry of the real district'],
 [0.14,'Four hundred overlapping frames, flown in a single morning'],
 [0.30,'12.9 million triangles, reconstructed from photographs'],
 [0.50,'Decimated to a real-time mesh, textures baked on'],
 [0.68,'Every roof, every setback, every slope — as it really is'],
 [0.86,'The base the entire regeneration was designed onto']
];
const PHASES=[[0,'CAPTURE'],[0.16,'RECONSTRUCT'],[0.52,'SURVEY']];

/* Camera choreography. Elevation is deliberately kept high all the way
   through — the capture is clean from above and ragged from the side, so
   the path never drops to a low horizon. It now makes most of a full turn
   and the lens eases from wide to long, which reads as a real descent
   rather than a slider. p → {azimuth, elevation, distance, fov} */
const KF=[
 {p:0.00, az:-0.70, el:1.50, d:3.60, fov:52},  /* high, straight down, wide */
 {p:0.14, az:-0.38, el:1.41, d:3.05, fov:49},  /* the cloud fills the frame */
 {p:0.30, az: 0.12, el:1.21, d:2.42, fov:45},  /* descend, city plan reads  */
 {p:0.46, az: 0.86, el:0.99, d:1.86, fov:41},  /* push in to a 3/4 top view */
 {p:0.62, az: 1.80, el:0.86, d:1.62, fov:38},  /* orbit through the far side*/
 {p:0.78, az: 2.76, el:0.95, d:1.80, fov:38},  /* keep turning              */
 {p:0.90, az: 3.56, el:1.13, d:2.30, fov:42},  /* start rising              */
 {p:1.00, az: 4.26, el:1.38, d:3.25, fov:47}   /* pull back up to hero shot */
];
const smooth=t=>t*t*(3-2*t);
function sample(pp){
  let a=KF[0],b=KF[KF.length-1];
  for(let i=0;i<KF.length-1;i++){if(pp>=KF[i].p&&pp<=KF[i+1].p){a=KF[i];b=KF[i+1];break}}
  const span=Math.max(1e-6,b.p-a.p);
  const t=smooth(Math.min(1,Math.max(0,(pp-a.p)/span)));
  return{az:a.az+(b.az-a.az)*t, el:a.el+(b.el-a.el)*t,
         d:a.d+(b.d-a.d)*t,     fov:a.fov+(b.fov-a.fov)*t};
}

function frame(snap){
  if(!ready)return;
  p+=(pt-p)*(snap?1:0.075);
  const k=sample(p);
  const now=performance.now();
  /* a slow idle drift so the scan is never completely static, plus a hair
     of hand-held roll — enough to feel flown, not enough to notice */
  const drift=now*0.00004;
  const az=k.az+Math.sin(drift)*0.035, el=k.el+Math.cos(drift*1.3)*0.012;
  const d=radius*k.d*fit;
  camera.position.set(
    center.x+d*Math.cos(el)*Math.sin(az),
    center.y+d*Math.sin(el),
    center.z+d*Math.cos(el)*Math.cos(az));
  /* aim a little ahead of centre while turning, so the district sweeps
     through frame instead of spinning on a pin */
  _look.set(center.x+Math.sin(az+1.2)*radius*0.10*(1-Math.abs(el-0.9)),
            center.y-radius*0.05,
            center.z+Math.cos(az+1.2)*radius*0.10*(1-Math.abs(el-0.9)));
  camera.up.set(Math.sin(drift*0.7)*0.035,1,0);
  camera.lookAt(_look);
  if(Math.abs(camera.fov-k.fov)>0.01){camera.fov=k.fov;camera.updateProjectionMatrix()}

  /* reveal: the mesh builds upward out of the cloud */
  const rev=Math.min(1,Math.max(0,(p-0.16)/0.36));
  const h=box.min.y+(box.max.y-box.min.y+radius*0.06)*rev;
  plane.constant=h;
  renderer.toneMappingExposure=0.65+0.35*rev;

  const edge=rev>0&&rev<1?Math.sin(rev*Math.PI):0;
  if(sweep){sweep.position.y=h;sweep.material.opacity=0.045*edge}
  if(sweepEdge){
    sweepEdge.position.y=h;
    sweepEdge.material.opacity=0.34*edge;
    sweepEdge.scale.setScalar(0.55+0.62*rev);
  }
  if(cloud){
    /* run the line a little past both ends so the ground is loose at the
       start and nothing is left hanging at the finish */
    cloud.material.uniforms.uRev.value=-0.06+rev*1.14;
    cloud.material.uniforms.uT.value=now*0.001;
    cloud.visible=p<0.62;
  }
  if(grid)grid.material.opacity=0.34*Math.min(1,Math.max(0,(p-0.10)/0.22))*(1-Math.max(0,(p-0.92)/0.08)*0.6);
  if(glow)glow.material.uniforms.uO.value=0.30*Math.min(1,Math.max(0,(p-0.20)/0.25));
  if(drone){
    const dv=1-Math.min(1,Math.max(0,(p-0.10)/0.16));
    drone.material.opacity=0.55*dv;drone.visible=dv>0.01;
    if(droneDot){
      droneDot.material.opacity=0.9*dv;droneDot.visible=dv>0.01;
      const a=now*0.00042, rr=radius*1.30;
      droneDot.position.set(center.x+Math.cos(a)*rr,
                            center.y+radius*0.58+Math.sin(a*3)*radius*0.035,
                            center.z+Math.sin(a)*rr);
    }
  }

  if(progEl)progEl.style.transform=`scaleX(${p.toFixed(4)})`;
  let cap=CAPS[0][1];for(const c of CAPS)if(pt>=c[0])cap=c[1];
  if(capEl&&capEl.textContent!==cap)capEl.textContent=cap;
  let ph=PHASES[0][1];for(const c of PHASES)if(pt>=c[0])ph=c[1];
  if(phaseEl&&phaseEl.textContent!==ph)phaseEl.textContent=ph;
  if(altEl){
    const alt=Math.round(k.el/Math.PI*180*10)/10;
    altEl.textContent=alt.toFixed(1)+'°';
    if(aziEl)aziEl.textContent=Math.round(((az*180/Math.PI)%360+360)%360).toString().padStart(3,'0')+'°';
  }
  if(hintEl)hintEl.style.opacity=(pt>0.06||RM)?'0':'1';
  wrap.classList.toggle('pg-built',p>0.55);
}

function loop(){
  raf=requestAnimationFrame(loop);
  const r=wrap.getBoundingClientRect();
  if(r.bottom<-200||r.top>innerHeight+200)return;   /* idle when off-screen */
  if(!RM)pt=scrollP();
  frame(false);
  renderer.render(scene,camera);
}

/* the mobile build used to hold this behind a "load the 3D scan" button;
   it now boots the same way the desktop build does */
window.__hdPgInit=init;
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)init()}),{rootMargin:'600px'});
io.observe(wrap);
})();
