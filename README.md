# Brasa Nobre Espetaria

Site da Brasa Nobre Espetaria: churrasco premium para eventos corporativos em
São Paulo. Páginas: Início, Serviços, Eventos, Sobre, Seja um parceiro e
Contato, mais Política de privacidade, Termos de uso e Política de repasse.

Os dois formulários (pedido de orçamento e cadastro de parceiro) não têm
backend: ao enviar, abrem o WhatsApp ou o e-mail da Brasa Nobre com a mensagem
pronta.

## Tecnologia

Vite 6, Vue 3, Vuetify 3 e vue-router (rotas com `#`). Node 24 (`.nvmrc`).
Hospedagem na Netlify.

## Rodar

```bash
npm install
npm run dev        # http://localhost:5230
npm run build      # gera dist/
npm run testar     # build + testes automatizados
```

## Publicar na Netlify

1. Na Netlify: **Add new site → Import an existing project** e escolha este
   repositório.
2. Não precisa configurar nada: comando de build, pasta publicada, versão do
   Node, redirecionamento das rotas e cabeçalhos de segurança já estão no
   `netlify.toml`.
3. Para usar domínio próprio: **Domain management → Add a domain**. A imagem
   de compartilhamento (`og:image`) passa a usar o endereço principal do site
   automaticamente no build.

## Onde mexer

| O quê | Onde |
|---|---|
| WhatsApp, e-mail, Instagram, Reclame Aqui, CNPJ, endereço | `src/config/site.js` → `empresa` |
| Textos de todas as páginas, menu e opções dos formulários | `src/config/site.js` |
| Título, texto e foto do topo de cada página | `paginas` em `src/config/site.js` |
| Cores, raios, sombras, fontes e tempos de animação | `src/config/tokens.js` |
| Fotos e qual foto vai em cada lugar | `src/config/imagens.js` (arquivos em `src/assets/img/`) |
| Vídeo no fundo da página inicial | arquivo em `public/video/` e o caminho em `videoHero` (`src/config/imagens.js`) |
| Seções | `src/components/` (uma por arquivo) |
| Páginas | `src/views/` e as rotas em `src/router/index.js` |
| Políticas | `src/views/legal/` |
| Logo, ícones e imagem de compartilhamento | `npm run imagens` com `ACERVO` apontando para a pasta das fotos originais (gera a partir de `marca/brasa-nobre-logo.png`) |

## Estrutura

```
src/
  config/        site.js (conteúdo), tokens.js (visual), imagens.js (fotos)
  components/    seções, cabeçalho, rodapé, formulários
  views/         uma por página; legal/ com as políticas
  composables/   estado dos formulários e rolagem entre páginas
  directives/    v-revela (entrada das seções ao rolar)
  utils/         mensagem do WhatsApp/e-mail e validações
  styles/        estilo global
public/          ícones, manifesto, imagem de compartilhamento, robots.txt
scripts/         testes, servidor do build e geração de imagens
marca/           logo original
docs/            créditos das fotos de banco
```

## Testes (`npm run testar`)

Rodam no build servido como na Netlify (mesmos cabeçalhos, inclusive a CSP),
em Chrome sem interface:

| Teste | O que verifica |
|---|---|
| estrutura | metadados, dados estruturados, arquivos públicos, imagens sem metadado, peso do site |
| paleta | contraste das cores e contatos preenchidos |
| layout | todas as páginas em 6 larguras (1440 a 320): nada vazando ou cortado, fontes, imagens, contraste, menu, barra do celular |
| contraste sobre foto | texto do topo de cada página medido sobre a foto de fundo |
| navegação | menu, rodapé, barra do celular, abas, cartões que preenchem o formulário |
| formulário | validações e a mensagem montada dos dois formulários |

## Fotos

Fotos de banco do Pexels (licença de uso livre, inclusive comercial), com autor
e endereço de cada uma em `docs/creditos-imagens.json`. Para trocar uma foto,
salve a nova em `src/assets/img/` e aponte o `import` em
`src/config/imagens.js` (com as dimensões em `dimensoes`).
