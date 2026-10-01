"""Gera as imagens do site a partir da logo (marca/) e das fotos de banco (pasta em ACERVO).

Tudo é regravado num arquivo novo, sem EXIF, XMP, ICC ou C2PA. Saídas em
src/assets/img/ e public/; créditos das fotos em docs/creditos-imagens.json.

  python scripts/preparar-imagens.py
"""
import json
import os
import pathlib

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

RAIZ = pathlib.Path(__file__).resolve().parent.parent
IMG = RAIZ / "src" / "assets" / "img"
PUB = RAIZ / "public"
if not os.environ.get("ACERVO"):
    raise SystemExit("Defina ACERVO com a pasta das fotos originais (uma subpasta por tema, com _creditos.json).")
ACERVO = pathlib.Path(os.environ["ACERVO"])
FUNDO = (5, 2, 0)

IMG.mkdir(parents=True, exist_ok=True)
PUB.mkdir(parents=True, exist_ok=True)

logo = Image.open(RAIZ / "marca" / "brasa-nobre-logo.png").convert("RGB")
assert logo.size == (1254, 1254), logo.size


def salvar_webp(im, nome, q=84):
    destino = IMG / nome
    im.save(destino, "WEBP", quality=q, method=6)
    print(f"  {nome:34} {im.size[0]}x{im.size[1]}  {destino.stat().st_size // 1024} KB")


def luma(im):
    a = np.asarray(im.convert("RGB")).astype(np.float32) / 255
    return 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]


def caixa_clara(im, limiar=0.42, margem=10):
    """Menor retângulo que contém os pixels acima do limiar (a tinta dourada)."""
    ys, xs = np.nonzero(luma(im) > limiar)
    return (max(xs.min() - margem, 0), max(ys.min() - margem, 0),
            min(xs.max() + margem, im.width), min(ys.max() + margem, im.height))


def recorte_com_alfa(im, baixo=0.15, alto=0.36):
    """Dourado sobre fundo escuro: o alfa sai da própria luminância (o fundo da
    logo tem fumaça e brilho, não é cor chapada)."""
    L = luma(im)
    a = np.clip((L - baixo) / (alto - baixo), 0, 1) ** 0.85
    rgba = np.dstack([np.asarray(im.convert("RGB")), (a * 255).astype(np.uint8)])
    return Image.fromarray(rgba)


print("\nlogo")
salvar_webp(logo, "logo-brasa-nobre.webp", 86)
salvar_webp(logo.resize((720, 720), Image.LANCZOS), "logo-brasa-nobre-720.webp", 84)

# Palavra "BRASA NOBRE" para o menu e o rodapé, com fundo transparente.
faixa = logo.crop((0, 760, 1254, 905))
x0, y0, x1, y1 = caixa_clara(faixa, 0.42, 8)
palavra = recorte_com_alfa(faixa.crop((x0, y0, x1, y1)))
palavra = palavra.resize((560, round(palavra.height * 560 / palavra.width)), Image.LANCZOS)
salvar_webp(palavra, "marca-palavra.webp", 90)

print("\nícones")
# Ícone grande: o monograma inteiro (espeto e chama). Favicon: só as letras BN,
# que continuam legíveis em 16 e 32px.
mono = logo.crop((262, 44, 962, 744))
letras = logo.crop((312, 170, 907, 765))


def icone(fonte, tam):
    im = fonte.resize((tam, tam), Image.LANCZOS)
    if tam <= 48:
        im = ImageEnhance.Contrast(im).enhance(1.15).filter(ImageFilter.UnsharpMask(radius=0.6, percent=110, threshold=0))
    return im


for tam, nome in [(16, "favicon-16.png"), (32, "favicon-32.png")]:
    icone(letras, tam).save(PUB / nome, "PNG", optimize=True)
    print(f"  {nome:34} {tam}x{tam}")
icone(letras, 48).save(PUB / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
print(f"  {'favicon.ico':34} 16, 32 e 48")
for tam, nome in [(180, "apple-touch-icon.png"), (192, "icone-192.png"), (512, "icone-512.png")]:
    # Paleta de 256 cores: o 512 cai de ~430 KB para ~170 KB sem diferença visível.
    icone(mono, tam).quantize(colors=256, dither=Image.Dither.FLOYDSTEINBERG).save(PUB / nome, "PNG", optimize=True)
    print(f"  {nome:34} {tam}x{tam}")

# Imagem de compartilhamento 1200x630: logo inteira sobre o preto, bordas fundidas.
og = Image.new("RGB", (1200, 630), FUNDO)
peca = logo.resize((630, 630), Image.LANCZOS)
yy, xx = np.mgrid[0:630, 0:630]
d = np.sqrt(((xx - 315) / 315) ** 2 + ((yy - 315) / 315) ** 2)
mascara = Image.fromarray((np.clip((1.02 - d) / 0.22, 0, 1) * 255).astype(np.uint8))
og.paste(peca, (285, 0), mascara)
og.save(PUB / "og.jpg", "JPEG", quality=84, optimize=True, progressive=True)
print(f"  {'og.jpg':34} 1200x630  {(PUB / 'og.jpg').stat().st_size // 1024} KB")

# Fotos de banco: fogo, brasa e evento. Nunca comida: foto de banco de prato
# passaria por produto da casa.
# (pasta, arquivo, saída, recorte ou None, largura final)
FOTOS = [
    # fundos
    ("brasa-chama", "brasa-chama-pexels-009.jpg", "textura-chama.webp", (0, 70, 867, 1300), 740),
    ("brasa-carvao", "brasa-carvao-pexels-005.jpg", "textura-carvao.webp", (360, 0, 1497, 1251), 1000),
    ("brasa-carvao", "brasa-carvao-pexels-003.jpg", "brasa-larga.webp", None, 1400),
    # aba Churrasco e passo 03
    ("brasa-chama", "brasa-chama-pexels-013.jpg", "churrasco-chama.webp", None, 740),
    ("brasa-carvao", "brasa-carvao-pexels-013.jpg", "churrasco-brasa.webp", None, 1000),
    ("brasa-carvao", "brasa-carvao-pexels-007.jpg", "churrasco-carvao.webp", None, 1000),
    ("brasa-chama", "brasa-chama-pexels-005.jpg", "passo-fogo.webp", None, 740),
    # aba Decoração
    ("evento-outro", "evento-outro-pexels-001.jpg", "decoracao-salao.webp", None, 1000),
    ("evento-outro", "evento-outro-pexels-011.jpg", "decoracao-arranjos.webp", None, 1000),
    ("evento-fim-de-ano", "evento-fim-de-ano-pexels-001.jpg", "decoracao-fim-de-ano.webp", None, 1000),
    # aba Apoio ao evento
    ("evento-recepcao", "evento-recepcao-pexels-009.jpg", "apoio-recepcao.webp", None, 1000),
    ("evento-treinamento", "evento-treinamento-pexels-007.jpg", "apoio-pausa.webp", None, 1000),
    ("evento-happy-hour", "evento-happy-hour-pexels-009.jpg", "apoio-brinde.webp", None, 1000),
    # Diferencial e Parceiros
    ("evento-outro", "evento-outro-pexels-003.jpg", "evento-montado.webp", None, 1000),
    ("evento-outro", "evento-outro-pexels-009.jpg", "parceiros-ambiente.webp", None, 1000),
]
# Cartões de evento: recorte central 3:2, no tamanho em que aparecem em tela retina.
CARTOES = [
    ("evento-confraternizacao", "evento-confraternizacao-pexels-007.jpg", "evento-confraternizacao.webp"),
    ("evento-happy-hour", "evento-happy-hour-pexels-003.jpg", "evento-happy-hour.webp"),
    ("evento-fim-de-ano", "evento-fim-de-ano-pexels-007.jpg", "evento-fim-de-ano.webp"),
    ("evento-treinamento", "evento-treinamento-pexels-001.jpg", "evento-treinamento.webp"),
    ("evento-recepcao", "evento-recepcao-pexels-007.jpg", "evento-recepcao.webp"),
    ("evento-outro", "evento-outro-pexels-005.jpg", "evento-outro.webp"),
]

creditos = []


def credito(pasta, arquivo, nome):
    meta = {c["arquivo"]: c for c in json.loads((ACERVO / pasta / "_creditos.json").read_text(encoding="utf8"))}[arquivo]
    creditos.append({"arquivo": nome, "autor": meta["autor"], "licenca": meta["licenca"], "fonte": meta["fonte"]})


print("\nfotos")
for pasta, arquivo, nome, caixa, largura in FOTOS:
    src = Image.open(ACERVO / pasta / arquivo).convert("RGB")
    if caixa:
        src = src.crop(caixa)
    largura = min(largura, src.width)
    salvar_webp(src.resize((largura, round(src.height * largura / src.width)), Image.LANCZOS), nome, 78 if largura > 1200 else 74)
    credito(pasta, arquivo, nome)

print("\ncartões de evento")
for pasta, arquivo, nome in CARTOES:
    src = Image.open(ACERVO / pasta / arquivo).convert("RGB")
    w, h = src.size
    if w / h > 1.5:
        nw = round(h * 1.5)
        src = src.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = round(w / 1.5)
        src = src.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    salvar_webp(src.resize((960, 640), Image.LANCZOS), nome, 74)
    credito(pasta, arquivo, nome)

(RAIZ / "docs").mkdir(exist_ok=True)
(RAIZ / "docs" / "creditos-imagens.json").write_text(json.dumps(creditos, ensure_ascii=False, indent=2), encoding="utf8")
print(f"\n{len(creditos)} créditos em docs/creditos-imagens.json")
