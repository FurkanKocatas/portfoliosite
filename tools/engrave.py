"""Turn a scanned/AI engraving on paper into a transparent single-ink PNG.

The site's engravings are line art: tone comes from line density, not colour. So we
map each pixel's darkness to alpha (dark line -> opaque, light paper -> transparent)
and paint every remaining pixel one ink colour. That kills the rectangular paper
ground *and* the paper showing through inside the drawing, and it lets the page-level
night-mode inversion recolour the art for free.

usage: python tools/engrave.py public/img/Portrait.jpeg public/img/portrait.png
"""
import sys
from PIL import Image
import numpy as np

INK = (29, 27, 22)      # --color-ink #1d1b16
WHITE_AT = 232          # >= this luminance is treated as bare paper (fully clear)
BLACK_AT = 60           # <= this luminance is a solid ink line (fully opaque)
GAMMA = 0.85            # <1 keeps mid-tone hatching a little stronger
FLOOR = 0.06            # alpha below this is scanner haze -> snap to fully clear


def main(src: str, dst: str) -> None:
    im = Image.open(src).convert("RGB")
    a = np.asarray(im).astype(np.float32)

    # perceptual luminance
    lum = 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]

    # darkness -> alpha, with a soft ramp between paper and full ink
    alpha = (WHITE_AT - lum) / float(WHITE_AT - BLACK_AT)
    alpha = np.clip(alpha, 0.0, 1.0) ** GAMMA
    alpha[alpha < FLOOR] = 0.0   # drop paper haze so the ground is truly empty

    out = np.zeros((*alpha.shape, 4), dtype=np.uint8)
    out[..., 0], out[..., 1], out[..., 2] = INK
    out[..., 3] = (alpha * 255).round().astype(np.uint8)

    img = Image.fromarray(out, "RGBA")

    # crop to the drawing (ignoring near-invisible specks) so there is no dead margin
    solid = Image.fromarray(((alpha > 0.12) * 255).astype(np.uint8), "L")
    bbox = solid.getbbox()
    if bbox:
        pad = 8
        x0, y0, x1, y1 = bbox
        img = img.crop((max(0, x0 - pad), max(0, y0 - pad),
                        min(img.width, x1 + pad), min(img.height, y1 + pad)))

    img.save(dst)
    cleared = float((out[..., 3] == 0).mean() * 100)
    print(f"{dst}  size={img.size}  fully-transparent={cleared:.1f}%")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
