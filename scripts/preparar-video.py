"""Gera o vídeo do topo da home e o pôster a partir do vídeo original.

  python scripts/preparar-video.py caminho/do/original.mp4 [início em segundos]

Recorta 13 s a partir do início, emenda o fim no começo com 1 s de fusão (o
loop não pula), tira o áudio, reduz para 1280x720 e grava public/video/brasa.mp4.
O pôster é o primeiro quadro do loop, para a troca pôster → vídeo não piscar.
Precisa do ffmpeg no PATH.
"""
import json
import pathlib
import subprocess
import sys

from PIL import Image

RAIZ = pathlib.Path(__file__).resolve().parent.parent
VIDEO = RAIZ / "public" / "video" / "brasa.mp4"
POSTER = RAIZ / "src" / "assets" / "img" / "hero-brasa.webp"
CREDITO = {
    "arquivo": "public/video/brasa.mp4 e src/assets/img/hero-brasa.webp",
    "autor": "Dylan Omed",
    "licenca": "Pexels",
    "fonte": "https://www.pexels.com/video/a-burning-charcoal-2339304/",
}

if len(sys.argv) < 2:
    raise SystemExit(__doc__)
original = pathlib.Path(sys.argv[1])
inicio = float(sys.argv[2]) if len(sys.argv) > 2 else 12.0
VIDEO.parent.mkdir(parents=True, exist_ok=True)

# trecho de 13 s: os 12 primeiros são o loop; o último segundo entra por cima do
# começo, em fusão, e o quadro final do vídeo emenda no primeiro.
filtro = (
    "[0:v]scale=1280:720:flags=lanczos,setpts=PTS-STARTPTS,split[a][b];"
    "[a]trim=0:12,setpts=PTS-STARTPTS[loop];"
    "[b]trim=12:13,setpts=PTS-STARTPTS[fim];"
    "[fim][loop]xfade=transition=fade:duration=1:offset=0,format=yuv420p[v]"
)
subprocess.run(
    ["ffmpeg", "-v", "error", "-y", "-ss", str(inicio), "-t", "13", "-i", str(original),
     "-filter_complex", filtro, "-map", "[v]", "-an",
     "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-r", "25",
     "-movflags", "+faststart", str(VIDEO)],
    check=True,
)

# pôster: o mesmo quadro que abre o loop (início + 12 s), em resolução maior
quadro = RAIZ / "_poster.png"
subprocess.run(
    ["ffmpeg", "-v", "error", "-y", "-ss", str(inicio + 12), "-i", str(original), "-frames:v", "1", str(quadro)],
    check=True,
)
im = Image.open(quadro).convert("RGB")
im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS).save(POSTER, "WEBP", quality=78, method=6)
quadro.unlink()

(RAIZ / "docs" / "creditos-video.json").write_text(json.dumps([CREDITO], ensure_ascii=False, indent=2), encoding="utf8")
print(f"{VIDEO.relative_to(RAIZ)}: {VIDEO.stat().st_size / 1048576:.1f} MB")
print(f"{POSTER.relative_to(RAIZ)}: {POSTER.stat().st_size // 1024} KB")
