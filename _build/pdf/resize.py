import sys,os,re,base64,time,json,io
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import cdp
SITE=r"C:\Users\X11\Documents\Claude\work\Hashem-Dankar-Portfolio-v8.6"
PDFDIR=os.path.join(SITE,"_pdf"); IMGDIR=os.path.join(PDFDIR,"img")
os.makedirs(IMGDIR,exist_ok=True)

src="".join(io.open(os.path.join(PDFDIR,f),encoding="utf-8").read()
              for f in ("print.html","pages.js") if os.path.exists(os.path.join(PDFDIR,f)))
names=sorted(set(re.findall(r"'([A-Za-z0-9_\-]+\.(?:jpg|png|jpeg))'",src)))
print(len(names),"images")

MAX=int(sys.argv[1]) if len(sys.argv)>1 else 1650
Q=float(sys.argv[2]) if len(sys.argv)>2 else 0.82
c=cdp.Chrome(width=800,height=600)
try:
    c.goto("http://localhost:8777/_pdf/print.html", wait=2.0)
    total=0
    for i,n in enumerate(names):
        js = """(()=>new Promise(res=>{
          const im=new Image();
          im.onload=()=>{
            const s=Math.min(1,%d/Math.max(im.naturalWidth,im.naturalHeight));
            const w=Math.round(im.naturalWidth*s),h=Math.round(im.naturalHeight*s);
            const cv=document.createElement('canvas');cv.width=w;cv.height=h;
            const x=cv.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,w,h);
            x.imageSmoothingQuality='high';x.drawImage(im,0,0,w,h);
            res({d:cv.toDataURL('image/jpeg',%s),w,h});
          };
          let tried=0;
          im.onerror=()=>{if(tried++){res({e:1});return}im.src='../assets/video/%s'};
          im.src='../assets/img/%s';
        }))()""" % (MAX, Q, n, n)
        r=c.js(js, await_promise=True)
        if not r or r.get('e'):
            print("FAIL",n); continue
        raw=base64.b64decode(r['d'].split(',',1)[1])
        out=os.path.join(IMGDIR, os.path.splitext(n)[0]+'.jpg')
        open(out,'wb').write(raw); total+=len(raw)
        if i%10==0: print(f"  {i}/{len(names)}  {n} {r['w']}x{r['h']} {len(raw)//1024}KB")
    print("total resized:", total//1024//1024, "MB")
finally: c.close()
