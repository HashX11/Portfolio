import sys,os,time
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import cdp
SP=os.path.dirname(os.path.abspath(__file__)); OUT=os.path.join(SP,"shots")
SITE=r"C:\Users\X11\Documents\Claude\work\Hashem-Dankar-Portfolio-v8.6"
c=cdp.Chrome(width=1400,height=990)
try:
    c.goto("http://localhost:8777/_pdf/print.html", wait=6.0)
    n=c.js("document.querySelectorAll('.pg').length")
    print("pages:",n)
    print("missing imgs:", c.js("[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src.split('/').pop())"))
    # let fonts + images settle
    c.js("document.fonts.ready", await_promise=False)
    time.sleep(4.0)
    p=os.path.join(SITE, sys.argv[1] if len(sys.argv)>1 else "Hashem-Dankar-Portfolio.pdf")
    c.pdf(p, printBackground=True, preferCSSPageSize=True, marginTop=0, marginBottom=0, marginLeft=0, marginRight=0,
          landscape=False, scale=1)
    print("pdf:", os.path.getsize(p)//1024, "KB ->", p)
finally: c.close()
