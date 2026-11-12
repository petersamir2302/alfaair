#!/usr/bin/env python3
"""Download candidate product photos for review.

Reads images/sources.json ({"key": ["page url", ...]}), collects image URLs from
each page (Shopify product JSON when available, otherwise og:image, JSON-LD and
<img> tags), downloads them and writes images/candidates/<key>/NN.<ext> plus
images/candidates/manifest.json. Run by .github/workflows/fetch-images.yml.
"""
import io, json, os, re, sys, urllib.parse, urllib.request
from html import unescape
from PIL import Image

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9,ar;q=0.8"}
OUT = "images/candidates"
MIN_SIDE = 500
PER_PAGE = 12


def get(url, timeout=40):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read(), r.headers.get("Content-Type", "")


def shopify_images(url):
    p = urllib.parse.urlsplit(url)
    if "/products/" not in p.path:
        return []
    js = urllib.parse.urlunsplit((p.scheme, p.netloc, p.path.rstrip("/") + ".json", "", ""))
    try:
        data, _ = get(js)
        imgs = json.loads(data)["product"]["images"]
        return [i["src"] for i in imgs]
    except Exception:
        return []


def html_images(url):
    data, _ = get(url)
    html = data.decode("utf-8", "replace")
    found = []
    for m in re.finditer(r'<meta[^>]+(?:property|name)=["\'](?:og:image|twitter:image)(?::secure_url)?["\'][^>]*>', html, re.I):
        c = re.search(r'content=["\']([^"\']+)', m.group(0))
        if c:
            found.append(c.group(1))
    for m in re.finditer(r'"image"\s*:\s*(\[[^\]]*\]|"[^"]+")', html):
        found += re.findall(r'"(https?:[^"]+)"', m.group(1))
    for m in re.finditer(r'(?:src|data-src|data-zoom-image|data-large_image|href)=["\']([^"\']+\.(?:jpe?g|png|webp)(?:\?[^"\']*)?)["\']', html, re.I):
        found.append(m.group(1))
    for m in re.finditer(r'srcset=["\']([^"\']+)["\']', html, re.I):
        parts = [s.strip().split(" ")[0] for s in m.group(1).split(",") if s.strip()]
        if parts:
            found.append(parts[-1])
    out = []
    for f in found:
        f = unescape(f).replace("\\/", "/")
        out.append(urllib.parse.urljoin(url, f))
    return out


def norm_shopify(u):
    # ask Shopify CDN for the original size
    return re.sub(r'_(?:\d+x\d*|\d*x\d+|small|medium|large|grande|compact)(?=\.(?:jpe?g|png|webp))', "", u)


def main():
    sources = json.load(open("images/sources.json"))
    manifest = {}
    for key, pages in sources.items():
        d = os.path.join(OUT, key)
        os.makedirs(d, exist_ok=True)
        n = 0
        seen = set()
        entries = []
        for page in pages:
            try:
                if re.search(r'\.(?:jpe?g|png|webp|avif)(?:\?|$)', page, re.I):
                    urls = [page]
                else:
                    urls = shopify_images(page) or html_images(page)
            except Exception as e:
                entries.append({"page": page, "error": str(e)[:200]})
                print(f"[{key}] page failed {page}: {e}", file=sys.stderr)
                continue
            kept = 0
            for u in urls:
                if u.startswith("//"):
                    u = "https:" + u
                u = norm_shopify(u) if "cdn.shop" in u or "/cdn/shop/" in u else u
                if u in seen or not u.startswith("http"):
                    continue
                seen.add(u)
                try:
                    data, ctype = get(u)
                    im = Image.open(io.BytesIO(data))
                    w, h = im.size
                except Exception:
                    continue
                if min(w, h) < MIN_SIDE and not key.startswith("cur-"):
                    continue
                n += 1
                ext = (im.format or "jpg").lower().replace("jpeg", "jpg")
                name = f"{n:02d}.{ext}"
                open(os.path.join(d, name), "wb").write(data)
                entries.append({"file": name, "w": w, "h": h, "bytes": len(data), "src": u, "page": page})
                kept += 1
                if kept >= PER_PAGE:
                    break
            print(f"[{key}] {page} -> {kept} images", file=sys.stderr)
        manifest[key] = entries
    json.dump(manifest, open(os.path.join(OUT, "manifest.json"), "w"), indent=1, ensure_ascii=False)


if __name__ == "__main__":
    main()
