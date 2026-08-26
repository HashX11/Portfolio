"""Pull every translatable string out of the built index.html.

The rule, which _i18n.js repeats exactly at run time:

  an element is a TRANSLATION UNIT if it has at least one direct child text
  node containing a letter. Take the outermost such element and do not
  descend into it.

So a paragraph comes out whole, with its <b> and <em> intact, instead of as
the three fragments either side of them - which is what makes the difference
between Arabic that reads and Arabic that is word salad. Containers that hold
no text of their own (the index grid, a .datum row) are walked through, and
their labelled spans come out as their own units.

Anything inside a unit that is not text - an <svg> icon, an <img> - is
replaced by a {{0}} token so the translation never has to carry markup it
does not care about; _i18n.js puts the originals back.

  python i18n_extract.py            # writes i18n-en.json, reports coverage

Keys are the unit's normalised text, so two identical English strings share
one translation and nothing has to be kept in sync by hand.
"""
import html as _html
import json, os, re, sys
from html.parser import HTMLParser

SRC  = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(SRC)
BUILT = os.path.join(SITE, "index.html")
OUT   = os.path.join(SRC, "i18n-en.json")

VOID = {"area","base","br","col","embed","hr","img","input","link","meta",
        "param","source","track","wbr"}
# never look inside these
OPAQUE = {"script","style","svg","canvas","video","audio","noscript","template"}
# these carry no prose worth translating even when they hold text
SKIP_ID = {"orbitH1"}          # built char by char from data-text; handled separately
ATTRS = ("alt", "aria-label", "title", "placeholder", "data-text")

LETTER = re.compile(r"[A-Za-z]")
WS = re.compile(r"\s+")


def norm(s):
    """Whitespace-collapsed. Must agree character for character with the
    normalise() in _i18n.js, or a unit silently never matches its translation."""
    return WS.sub(" ", s.replace(" ", " ")).strip()


def key_of(s):
    """The lookup key: what JS reads back as element.textContent."""
    return norm(_html.unescape(s))


class Node:
    __slots__ = ("tag", "attrs", "kids", "parent")

    def __init__(self, tag, attrs=None, parent=None):
        self.tag, self.attrs, self.kids, self.parent = tag, attrs or {}, [], parent


class Text:
    __slots__ = ("data",)

    def __init__(self, data):
        self.data = data


class Build(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.root = Node("#root")
        self.cur = self.root

    def handle_starttag(self, tag, attrs):
        n = Node(tag, dict(attrs), self.cur)
        self.cur.kids.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_startendtag(self, tag, attrs):
        self.cur.kids.append(Node(tag, dict(attrs), self.cur))

    def handle_endtag(self, tag):
        n = self.cur
        while n is not self.root and n.tag != tag:
            n = n.parent
        if n is not self.root:
            self.cur = n.parent

    def handle_data(self, d):
        self.cur.kids.append(Text(d))

    def handle_entityref(self, name):
        self.cur.kids.append(Text("&%s;" % name))

    def handle_charref(self, name):
        self.cur.kids.append(Text("&#%s;" % name))

    def handle_comment(self, d):
        pass


def render(node, atoms):
    """innerHTML of node, with opaque/void children swapped for {{n}} tokens."""
    out = []
    for k in node.kids:
        if isinstance(k, Text):
            out.append(k.data)
        elif (k.tag in OPAQUE or (k.tag in VOID and k.tag != "br")
              or "id" in k.attrs):
            # opaque markup, void elements and - importantly - anything a
            # script will later look up by id become {{n}} tokens. _i18n.js
            # MOVES the original node into the slot instead of re-serialising
            # it, so a reference someone is holding stays live.
            atoms.append(k)
            out.append("{{%d}}" % (len(atoms) - 1))
        elif k.tag == "br":
            out.append("<br>")
        else:
            a = "".join(' %s="%s"' % (n, v) for n, v in k.attrs.items()
                        if n in ("class", "href", "id"))
            out.append("<%s%s>%s</%s>" % (k.tag, a, render(k, atoms), k.tag))
    return "".join(out)


def text_of(node):
    out = []
    for k in node.kids:
        if isinstance(k, Text):
            out.append(k.data)
        elif k.tag not in OPAQUE:
            out.append(text_of(k))
    return "".join(out)


def direct_text(node):
    return any(isinstance(k, Text) and LETTER.search(k.data) for k in node.kids)


def walk(node, units, attrs_out):
    for k in node.kids:
        if isinstance(k, Text) or k.tag in OPAQUE:
            continue
        for a in ATTRS:
            v = k.attrs.get(a)
            if v and LETTER.search(v):
                attrs_out.setdefault(key_of(v), None)
        if k.attrs.get("id") in SKIP_ID:
            continue
        if direct_text(k):
            atoms = []
            html = norm(render(k, atoms))
            key = key_of(text_of(k))
            if key and LETTER.search(key):
                units.setdefault(key, {"html": html, "n": 0, "tag": k.tag,
                                       "cls": k.attrs.get("class", "")})
                units[key]["n"] += 1
            continue
        walk(k, units, attrs_out)


def main():
    src = open(BUILT, encoding="utf-8").read()
    p = Build()
    p.feed(src)
    body = p.root
    for k in p.root.kids:
        if isinstance(k, Node) and k.tag == "body":
            body = k
    units, attrs = {}, {}
    walk(body, units, attrs)
    data = {"units": units, "attrs": attrs}
    json.dump(data, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    words = sum(len(k.split()) for k in units)
    aw = sum(len(k.split()) for k in attrs)
    print("units:", len(units), "(%d words)" % words)
    print("attrs:", len(attrs), "(%d words)" % aw)
    print("wrote", OUT)


if __name__ == "__main__":
    main()
