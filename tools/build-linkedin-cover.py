"""GezegenselCore LinkedIn kapak — 1584x396, gerçek logo + site içeriği."""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "gezegenselcore-linkedin-cover-v2-1584x396.png"

W, H = 1584, 396
GOLD = (201, 162, 39)
GOLD_LIGHT = (240, 216, 117)
INK = (232, 238, 245)
INK_MUTED = (168, 184, 200)
BG_TOP = (6, 10, 16)
BG_MID = (12, 21, 32)
BG_BOTTOM = (8, 13, 20)
GLASS = (18, 28, 42, 170)


def lerp(a: int, b: int, t: float) -> int:
    return int(a + (b - a) * t)


def vertical_gradient(size: tuple[int, int]) -> Image.Image:
    w, h = size
    img = Image.new("RGB", size)
    px = img.load()
    for y in range(h):
        t = y / max(h - 1, 1)
        if t < 0.42:
            u = t / 0.42
            c = tuple(lerp(BG_TOP[i], BG_MID[i], u) for i in range(3))
        else:
            u = (t - 0.42) / 0.58
            c = tuple(lerp(BG_MID[i], BG_BOTTOM[i], u) for i in range(3))
        for x in range(w):
            px[x, y] = c
    return img


def add_gold_glow(base: Image.Image) -> None:
    glow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    g = ImageDraw.Draw(glow)
    g.ellipse((W * 0.18, -H * 0.55, W * 0.82, H * 0.75), fill=(201, 162, 39, 38))
    glow = glow.filter(ImageFilter.GaussianBlur(48))
    base.paste(glow, (0, 0), glow)


def add_grid(base: Image.Image) -> None:
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    step = 34
    col = (40, 55, 75, 28)
    for x in range(0, W, step):
        d.line([(x, 0), (x, H)], fill=col, width=1)
    for y in range(0, H, step):
        d.line([(0, y), (W, y)], fill=col, width=1)
    base.paste(layer, (0, 0), layer)


def rounded_rect(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    radius: int,
    fill: tuple[int, ...],
    outline: tuple[int, ...] | None = None,
    width: int = 1,
) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size=size)
    return ImageFont.load_default()


def paste_logo(base: Image.Image, path: Path, center: tuple[int, int], diameter: int) -> None:
    logo = Image.open(path).convert("RGBA")
    logo = logo.resize((diameter, diameter), Image.Resampling.LANCZOS)

    ring = Image.new("RGBA", (diameter + 16, diameter + 16), (0, 0, 0, 0))
    rd = ImageDraw.Draw(ring)
    rd.ellipse((2, 2, diameter + 13, diameter + 13), outline=(*GOLD, 220), width=5)
    rd.ellipse((7, 7, diameter + 8, diameter + 8), outline=(*GOLD_LIGHT, 90), width=2)

    mask = Image.new("L", (diameter, diameter), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, diameter, diameter), fill=255)
    logo.putalpha(mask)

    cx, cy = center
    ring.paste(logo, (8, 8), logo)
    shadow = ring.copy().filter(ImageFilter.GaussianBlur(8))
    base.paste(shadow, (cx - ring.width // 2 + 4, cy - ring.height // 2 + 6), shadow)
    base.paste(ring, (cx - ring.width // 2, cy - ring.height // 2), ring)


def paste_app_icon(base: Image.Image, path: Path, xy: tuple[int, int], size: int) -> None:
    icon = Image.open(path).convert("RGBA").resize((size, size), Image.Resampling.LANCZOS)
    rounded = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size, size), radius=18, fill=255)
    rounded.paste(icon, (0, 0), icon)
    rounded.putalpha(mask)
    base.paste(rounded, xy, rounded)


def draw_gold_divider(draw: ImageDraw.ImageDraw, y: int, x0: int, x1: int) -> None:
    mid = (x0 + x1) // 2
    for i, alpha in enumerate((0, 40, 100, 180, 255, 180, 100, 40, 0)):
        t = (i - 4) / 4
        x = int(mid + t * (x1 - x0) * 0.22)
        draw.line([(x0, y), (x, y)], fill=(*GOLD, alpha), width=2)
        draw.line([(x, y), (x1, y)], fill=(*GOLD, alpha), width=2)
    draw.line([(mid - 28, y), (mid + 28, y)], fill=(*GOLD_LIGHT, 255), width=3)


def main() -> None:
    base = vertical_gradient((W, H)).convert("RGBA")
    add_gold_glow(base)
    add_grid(base)
    draw = ImageDraw.Draw(base)

    font_brand = load_font(46, bold=True)
    font_tag = load_font(20)
    font_sub = load_font(16)
    font_chip = load_font(13, bold=True)
    font_chip_sub = load_font(11)
    font_product = load_font(15, bold=True)
    font_product_sub = load_font(12)
    font_url = load_font(14)

    # Sol: gerçek GezegenselCore amblemi (profil fotoğrafı bölgesinden kaçınmak için x=200+)
    paste_logo(base, ROOT / "assets/icons/GezegenselCore_icon.png", center=(210, H // 2 - 8), diameter=148)

    # Orta metin bloğu
    tx = 330
    draw.text((tx, 58), "GezegenselCore", font=font_brand, fill=INK)
    draw.text(
        (tx, 118),
        "Günlük yaşamı sadeleştiren yapay zekâ destekli akıllı çözümler",
        font=font_tag,
        fill=INK_MUTED,
    )
    draw.text((tx, 148), "Bağımsız stüdyo · Anima · ReFollow", font=font_sub, fill=GOLD_LIGHT)
    draw_gold_divider(draw, 182, tx, tx + 520)

    # Üç öne çıkan kart (site içeriği)
    chips = [
        ("Yapay zekâ odaklı", "Özet, rehberlik ve okunur veri akışları"),
        ("Gizlilik öncelikli", "Şeffaf sunum · kontrol sende"),
        ("Küresel destek", "Resmi kanallar ve dokümantasyon"),
    ]
    chip_w, chip_h, gap = 228, 72, 12
    chip_y = 198
    for i, (title, sub) in enumerate(chips):
        x = tx + i * (chip_w + gap)
        layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
        ld = ImageDraw.Draw(layer)
        rounded_rect(ld, (x, chip_y, x + chip_w, chip_y + chip_h), 12, GLASS, (*GOLD, 60), 1)
        base.paste(layer, (0, 0), layer)
        draw.text((x + 14, chip_y + 12), title, font=font_chip, fill=GOLD_LIGHT)
        draw.text((x + 14, chip_y + 34), sub, font=font_chip_sub, fill=INK_MUTED)

    # Sağ: ürün kartları (yan yana)
    card_w, card_h = 200, 118
    card_x = W - card_w * 2 - 36
    card_y = H // 2 - card_h // 2 + 8

    products = [
        ("Anima", "Wellness & sağlık rehberi", "Günlük özet · rehberlik", ROOT / "assets/icons/Anima.png"),
        ("ReFollow", "Instagram içgörüleri", "Cihazında analiz · gizlilik", ROOT / "assets/icons/ReFollow_icon.png"),
    ]
    for i, (name, desc, body, icon_path) in enumerate(products):
        x = card_x + i * (card_w + 16)
        y = card_y
        layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
        ld = ImageDraw.Draw(layer)
        rounded_rect(
            ld,
            (x, y, x + card_w, y + card_h),
            14,
            (18, 28, 42, 200),
            (232, 238, 245, 35),
            1,
        )
        base.paste(layer, (0, 0), layer)
        paste_app_icon(base, icon_path, (x + 12, y + 12), 44)
        draw.text((x + 64, y + 14), name, font=font_product, fill=INK)
        draw.text((x + 64, y + 36), desc, font=font_product_sub, fill=INK_MUTED)
        draw.text((x + 12, y + 68), body, font=font_product_sub, fill=INK_MUTED)

    draw.text((tx, H - 34), "gezegenselcore.com", font=font_url, fill=GOLD)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    base.convert("RGB").save(OUT, "PNG", optimize=True)
    print(f"Saved {OUT} ({W}x{H})")


if __name__ == "__main__":
    main()
