/**
 * Imagens do site, importadas uma vez só (o Vite põe hash no nome de cada uma
 * no build). Fotos de banco com crédito em docs/creditos-imagens.json.
 */
import fogo from '@/assets/img/fogo-hero.webp'
import brasaLarga from '@/assets/img/brasa-larga.webp'
import carvao from '@/assets/img/textura-carvao.webp'
import chama from '@/assets/img/textura-chama.webp'
import churrascoChama from '@/assets/img/churrasco-chama.webp'
import churrascoBrasa from '@/assets/img/churrasco-brasa.webp'
import churrascoCarvao from '@/assets/img/churrasco-carvao.webp'
import passoFogo from '@/assets/img/passo-fogo.webp'
import decoracaoSalao from '@/assets/img/decoracao-salao.webp'
import decoracaoArranjos from '@/assets/img/decoracao-arranjos.webp'
import decoracaoFimDeAno from '@/assets/img/decoracao-fim-de-ano.webp'
import apoioRecepcao from '@/assets/img/apoio-recepcao.webp'
import apoioPausa from '@/assets/img/apoio-pausa.webp'
import apoioBrinde from '@/assets/img/apoio-brinde.webp'
import eventoMontado from '@/assets/img/evento-montado.webp'
import parceirosAmbiente from '@/assets/img/parceiros-ambiente.webp'
import confraternizacao from '@/assets/img/evento-confraternizacao.webp'
import happyHour from '@/assets/img/evento-happy-hour.webp'
import fimDeAno from '@/assets/img/evento-fim-de-ano.webp'
import treinamento from '@/assets/img/evento-treinamento.webp'
import recepcao from '@/assets/img/evento-recepcao.webp'
import outro from '@/assets/img/evento-outro.webp'
import logo from '@/assets/img/logo-brasa-nobre.webp'
import logo720 from '@/assets/img/logo-brasa-nobre-720.webp'
import palavra from '@/assets/img/marca-palavra.webp'

export const fotos = {
  fogo,
  brasaLarga,
  carvao,
  chama,
  churrascoChama,
  churrascoBrasa,
  churrascoCarvao,
  passoFogo,
  decoracaoSalao,
  decoracaoArranjos,
  decoracaoFimDeAno,
  apoioRecepcao,
  apoioPausa,
  apoioBrinde,
  eventoMontado,
  parceirosAmbiente,
  confraternizacao,
  happyHour,
  fimDeAno,
  treinamento,
  recepcao,
  outro,
}

/** Dimensões reais, para width/height no <img> (sem pulo de layout ao carregar). */
export const dimensoes = {
  fogo: [1600, 1066],
  brasaLarga: [1400, 935],
  carvao: [1000, 1100],
  chama: [740, 1050],
  churrascoChama: [740, 1110],
  churrascoBrasa: [1000, 666],
  churrascoCarvao: [1000, 666],
  passoFogo: [740, 1110],
  decoracaoSalao: [1000, 666],
  decoracaoArranjos: [1000, 666],
  decoracaoFimDeAno: [1000, 668],
  apoioRecepcao: [1000, 668],
  apoioPausa: [1000, 666],
  apoioBrinde: [1000, 666],
  eventoMontado: [1000, 666],
  parceirosAmbiente: [1000, 666],
  confraternizacao: [960, 640],
  happyHour: [960, 640],
  fimDeAno: [960, 640],
  treinamento: [960, 640],
  recepcao: [960, 640],
  outro: [960, 640],
}

export const marca = { logo, logo720, palavra }

/**
 * Fundo do hero. Para usar vídeo, coloque o arquivo em public/video/ e informe
 * o caminho em `mp4` (o pôster continua sendo a primeira imagem).
 */
export const videoHero = { mp4: '', poster: fogo }
