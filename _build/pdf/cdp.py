"""Minimal Chrome DevTools Protocol driver (stdlib only)."""
import json, os, socket, base64, struct, time, subprocess, tempfile, urllib.request, hashlib, secrets, sys

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

class WS:
    def __init__(self, url):
        assert url.startswith("ws://")
        rest = url[5:]
        hostport, _, path = rest.partition("/")
        host, _, port = hostport.partition(":")
        port = int(port or 80)
        self.s = socket.create_connection((host, port), timeout=60)
        key = base64.b64encode(secrets.token_bytes(16)).decode()
        req = (f"GET /{path} HTTP/1.1\r\nHost: {hostport}\r\nUpgrade: websocket\r\n"
               f"Connection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n")
        self.s.sendall(req.encode())
        buf = b""
        while b"\r\n\r\n" not in buf:
            buf += self.s.recv(4096)
        self.buf = buf.split(b"\r\n\r\n", 1)[1]

    def _recv(self, n):
        while len(self.buf) < n:
            d = self.s.recv(65536)
            if not d: raise IOError("closed")
            self.buf += d
        out, self.buf = self.buf[:n], self.buf[n:]
        return out

    def send(self, data: str):
        payload = data.encode()
        hdr = bytearray([0x81])
        n = len(payload)
        mask = secrets.token_bytes(4)
        if n < 126: hdr.append(0x80 | n)
        elif n < 65536: hdr.append(0x80 | 126); hdr += struct.pack(">H", n)
        else: hdr.append(0x80 | 127); hdr += struct.pack(">Q", n)
        hdr += mask
        masked = bytes(b ^ mask[i % 4] for i, b in enumerate(payload))
        self.s.sendall(bytes(hdr) + masked)

    def recv(self):
        while True:
            b0, b1 = self._recv(2)
            fin = b0 & 0x80; op = b0 & 0x0F
            ln = b1 & 0x7F
            if ln == 126: ln = struct.unpack(">H", self._recv(2))[0]
            elif ln == 127: ln = struct.unpack(">Q", self._recv(8))[0]
            data = self._recv(ln)
            if op == 0x8: raise IOError("server closed")
            if op in (0x9,):  # ping -> pong
                continue
            if op in (0x1, 0x2, 0x0):
                return data.decode("utf-8", "replace")

class Chrome:
    def __init__(self, width=1512, height=950, scale=1, port=9333, extra=None):
        self.profile = tempfile.mkdtemp()
        self.port = port
        args = [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                f"--remote-debugging-port={port}", f"--user-data-dir={self.profile}",
                f"--window-size={width},{height}", "--no-first-run", "--no-default-browser-check",
                "--autoplay-policy=no-user-gesture-required", "--disable-features=CalculateNativeWinOcclusion",
                "about:blank"]
        if extra: args[-1:-1] = extra
        self.proc = subprocess.Popen(args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        ws_url = None
        for _ in range(120):
            try:
                data = json.load(urllib.request.urlopen(f"http://127.0.0.1:{port}/json/list", timeout=2))
                pages = [t for t in data if t["type"] == "page"]
                if pages: ws_url = pages[0]["webSocketDebuggerUrl"]; break
            except Exception: pass
            time.sleep(0.25)
        if not ws_url: raise RuntimeError("chrome did not start")
        self.ws = WS(ws_url); self.id = 0
        self.cmd("Page.enable"); self.cmd("Runtime.enable"); self.cmd("Network.enable")
        self.cmd("Emulation.setDeviceMetricsOverride", width=width, height=height,
                 deviceScaleFactor=scale, mobile=False)

    def cmd(self, method, **params):
        self.id += 1; mid = self.id
        self.ws.send(json.dumps({"id": mid, "method": method, "params": params}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == mid:
                if "error" in msg: raise RuntimeError(f"{method}: {msg['error']}")
                return msg.get("result", {})

    def js(self, expr, await_promise=False):
        r = self.cmd("Runtime.evaluate", expression=expr, returnByValue=True,
                     awaitPromise=await_promise, userGesture=True)
        if r.get("exceptionDetails"):
            raise RuntimeError(json.dumps(r["exceptionDetails"])[:500])
        return r.get("result", {}).get("value")

    def goto(self, url, wait=3.0):
        self.cmd("Page.navigate", url=url)
        t0 = time.time()
        while time.time() - t0 < 40:
            try:
                if self.js("document.readyState") == "complete": break
            except Exception: pass
            time.sleep(0.2)
        time.sleep(wait)

    def shot(self, path, clip=None, fmt="png", quality=90):
        p = {"format": fmt, "captureBeyondViewport": bool(clip), "fromSurface": True}
        if fmt == "jpeg": p["quality"] = quality
        if clip: p["clip"] = clip
        r = self.cmd("Page.captureScreenshot", **p)
        open(path, "wb").write(base64.b64decode(r["data"]))
        return path

    def pdf(self, path, **kw):
        params = dict(printBackground=True, preferCSSPageSize=True, transferMode="ReturnAsBase64")
        params.update(kw)
        r = self.cmd("Page.printToPDF", **params)
        open(path, "wb").write(base64.b64decode(r["data"]))
        return path

    def metrics(self, width, height, scale=1, mobile=False):
        self.cmd("Emulation.setDeviceMetricsOverride", width=width, height=height,
                 deviceScaleFactor=scale, mobile=mobile)

    def close(self):
        try: self.proc.terminate()
        except Exception: pass
        import shutil; shutil.rmtree(self.profile, ignore_errors=True)
