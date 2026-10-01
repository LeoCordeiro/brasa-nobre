/**
 * Fonte única do conteúdo. Sem import de imagem: os scripts leem este arquivo no Node.
 * O texto público não fala em intermediação, comissão, hub ou marketplace (o teste barra).
 */

/** "5511912345678" → "(11) 91234-5678". */
function exibirWhatsApp(numero) {
  const m = String(numero).match(/^55(\d{2})(\d{4,5})(\d{4})$/)
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : numero
}

export const empresa = {
  razaoSocial: '38.485.925 LUIS CARLOS DA SILVA EPIFANIO',
  // Sem nome fantasia no cadastro da Receita: "Brasa Nobre" é a marca de uso,
  // e os documentos dizem que a empresa "atua sob a marca".
  fantasia: 'Brasa Nobre Espetaria',
  cnpj: '38.485.925/0001-42',
  atividade: 'Restaurantes e similares',
  bairro: 'Jardim Soares',
  cidade: 'São Paulo',
  uf: 'SP',
  tagline: 'Sabor em boas companhias',

  // wa.me: 55 + DDD + número, só dígitos.
  whatsapp: '5511920898978',
  email: 'atendimento@brasanobreespetaria.com.br',
  instagram: 'brasanobre_espetaria',
  reclameAqui: 'brasanobre',
}
empresa.whatsappExibicao = exibirWhatsApp(empresa.whatsapp)
empresa.emailExibicao = empresa.email
empresa.instagramUrl = `https://www.instagram.com/${empresa.instagram}/`
empresa.reclameAquiUrl = `https://www.reclameaqui.com.br/empresa/${empresa.reclameAqui}/`

export const documentos = { vigencia: '01/10/2026' }

export const mensagens = {
  zapPadrao: 'Olá! Vim pelo site da Brasa Nobre e quero um orçamento para um evento da minha empresa.',
  tituloPedido: 'Pedido de orçamento, site Brasa Nobre',
  assuntoEmail: 'Orçamento de evento corporativo',
  tituloParceria: 'Cadastro de parceiro, site Brasa Nobre',
  assuntoParceria: 'Cadastro de parceiro',
}

/** Menus e rodapé. `para` é rota do router (hash history). */
export const navegacao = [
  { nome: 'Serviços', para: '/servicos' },
  { nome: 'Eventos', para: '/eventos' },
  { nome: 'Sobre', para: '/sobre' },
  { nome: 'Seja um parceiro', para: '/parceiro' },
]
export const navegacaoCelular = [{ nome: 'Início', para: '/' }, ...navegacao, { nome: 'Contato', para: '/contato' }]
export const navegacaoRodape = [...navegacao, { nome: 'Contato', para: '/contato' }]

export const topbar = {
  esquerda: `Eventos corporativos · ${empresa.bairro}, ${empresa.cidade}`,
  direita: empresa.tagline,
}

export const hero = {
  selo: 'Churrasco para eventos corporativos',
  titulo: empresa.fantasia,
  texto:
    'Sabor em boas companhias. Churrasco de qualidade premium para confraternizações, happy hours, fim de ano, ' +
    'treinamentos e recepção de clientes, com parceiros de confiança para completar o evento.',
}

/** Só números que a empresa consegue provar: nada de histórico, volume ou "clientes atendidos". */
export const numeros = [
  { valor: 100, sufixo: '%', rotulo: 'churrasco próprio' },
  { valor: 1, rotulo: 'contratação única' },
  { valor: 3, rotulo: 'frentes de serviço' },
  { valor: 5, rotulo: 'formatos de evento' },
]

/** Abas de serviços. `fotos` são chaves de config/imagens.js, na ordem principal · lado · base. */
export const servicos = {
  selo: 'Serviços',
  titulo: 'Comece pelo churrasco. Complete o evento.',
  texto: 'Decoração e outros serviços de apoio entram com parceiros, se o evento precisar.',
  abas: [
    {
      id: 'churrasco',
      nome: 'Churrasco',
      cta: 'Ver o churrasco',
      resumo: 'Preparado na brasa pela própria Brasa Nobre, com o cardápio definido na proposta.',
      pontos: [
        'Churrasco de qualidade premium, preparado na brasa pela própria Brasa Nobre',
        'Cardápio definido na proposta, de acordo com o formato do evento e os convidados',
        'Do happy hour à recepção de clientes, o mesmo padrão de preparo',
        'Sem terceirização: o centro do evento fica com a Brasa Nobre',
      ],
      complemento: 'Só o churrasco',
      fotos: ['churrascoChama', 'churrascoBrasa', 'churrascoCarvao'],
      legendas: ['Chama alta', 'Brasa no ponto', 'Carvão em brasa'],
    },
    {
      id: 'decoracao',
      nome: 'Decoração',
      cta: 'Ver a decoração',
      resumo: 'Ambientação feita por parceiros, pensada junto com o churrasco e o tipo de evento.',
      pontos: [
        'Ambientação feita por parceiros',
        'Pensada junto com o churrasco e o tipo de evento',
        'Entra na mesma contratação, sem decorador para pesquisar à parte',
      ],
      complemento: 'Churrasco + decoração',
      fotos: ['decoracaoSalao', 'decoracaoArranjos', 'decoracaoFimDeAno'],
      legendas: ['Salão decorado', 'Arranjos do evento', 'Mesa de fim de ano'],
    },
    {
      id: 'apoio',
      nome: 'Apoio ao evento',
      cta: 'Ver o apoio ao evento',
      resumo: 'Outros serviços que o evento pedir, coordenados pela Brasa Nobre.',
      pontos: [
        'Outros serviços de apoio, trazidos pela Brasa Nobre conforme a necessidade do evento',
        'Parceria direta e de bastidor: você fala com a Brasa Nobre, e ela aciona quem faz',
        'Conte no pedido do que o evento precisa; a proposta diz o que dá para incluir',
      ],
      complemento: 'Churrasco + decoração + outros serviços de apoio',
      fotos: ['apoioRecepcao', 'apoioPausa', 'apoioBrinde'],
      legendas: ['Recepção', 'Pausa entre sessões', 'Brinde da equipe'],
    },
  ],
}

export const diferencial = {
  selo: 'Experiência Brasa Nobre',
  titulo: ['Um fornecedor.', 'O evento resolvido.'],
  itens: [
    { n: '01', titulo: 'Churrasco premium', desc: 'Feito pela casa, sem terceirizar o centro do evento.' },
    { n: '02', titulo: 'Uma contratação só', desc: 'Churrasco, decoração e apoio resolvidos juntos.' },
    { n: '03', titulo: 'Parceiros de confiança', desc: 'Decoração e apoio chegam por parceiros que a Brasa Nobre coordena.' },
  ],
}

/** Cartões de evento. `tipo` é o valor que o cartão marca no formulário. */
export const eventos = {
  selo: 'Eventos corporativos',
  titulo: 'Escolha o formato do seu evento.',
  texto: 'Da confraternização da equipe à recepção de clientes. O pedido de orçamento já abre com o formato que você escolher.',
  inclui: [
    { id: 'churrasco', nome: 'Churrasco' },
    { id: 'decoracao', nome: 'Decoração' },
    { id: 'apoio', nome: 'Apoio' },
  ],
  itens: [
    { id: 'confraternizacao', nome: 'Confraternizações', tag: 'Equipe reunida em volta da brasa', tipo: 'Confraternização', foto: 'confraternizacao' },
    { id: 'happy-hour', nome: 'Happy hours', tag: 'Fim de expediente em boa companhia', tipo: 'Happy hour', foto: 'happyHour' },
    { id: 'fim-de-ano', nome: 'Fim de ano', tag: 'A celebração que fecha o ano da empresa', tipo: 'Evento de fim de ano', foto: 'fimDeAno' },
    { id: 'treinamento', nome: 'Treinamentos', tag: 'Pausa bem servida entre as sessões', tipo: 'Treinamento', foto: 'treinamento' },
    { id: 'recepcao', nome: 'Recepção de clientes', tag: 'Quando o convidado é o cliente', tipo: 'Recepção de clientes', foto: 'recepcao' },
    { id: 'outro', nome: 'Outro formato', tag: 'Sob medida para a sua empresa', tipo: 'Outro formato', foto: 'outro' },
  ],
}

export const parceiros = {
  selo: 'Parceiros de confiança',
  titulo: 'Encontros que merecem outra mesa.',
  texto:
    'Além do churrasco, a Brasa Nobre traz parceiros para decoração e outros serviços de apoio. Você não ' +
    'precisa pesquisar nem contratar cada fornecedor separadamente.',
  lista: [
    'Churrasco feito pela própria Brasa Nobre',
    'Decoração, feita por parceiros',
    'Outros serviços de apoio, quando o evento pedir',
  ],
  legenda: {
    titulo: 'Ambientação pensada junto com o churrasco.',
    sub: 'Confraternizações · fim de ano · recepção de clientes',
  },
}

export const sobre = {
  // Quem organiza evento de empresa costuma ter que cadastrar o fornecedor:
  // a ficha com razão social e CNPJ fica à mão na página Sobre.
  ficha: 'Dados da empresa',
  selo: 'Quem somos',
  titulo: 'Churrasco de verdade, feito para empresas.',
  texto:
    'A Brasa Nobre é uma espetaria de São Paulo especializada em eventos corporativos. Atende quem organiza o ' +
    'evento dentro da empresa, no RH, em facilities ou no marketing interno, com o churrasco feito pela casa.',
}

export const faixa = {
  selo: 'Evento completo',
  titulo: 'Tudo o que o evento pede, com um fornecedor só.',
  itens: [
    'Churrasco na brasa',
    'Decoração',
    'Apoio ao evento',
    'Confraternizações',
    'Happy hours',
    'Fim de ano',
    'Treinamentos',
    'Recepção de clientes',
  ],
}

export const comoFunciona = {
  selo: 'Como funciona',
  titulo: 'Do pedido ao evento, sem complicação.',
  passos: [
    { n: '01', rotulo: 'O pedido', texto: 'Você conta o formato, a data e o número de convidados.', foto: 'carvao' },
    { n: '02', rotulo: 'A proposta', texto: 'Churrasco e, se precisar, decoração e apoio no mesmo orçamento.', foto: 'chama' },
    { n: '03', rotulo: 'O evento', texto: 'A Brasa Nobre conduz o churrasco e alinha os parceiros nos bastidores.', foto: 'passoFogo' },
  ],
}

export const central = {
  selo: 'Central Brasa Nobre',
  titulo: 'Seu próximo evento começa aqui.',
  texto: 'Peça o orçamento e fale diretamente com a Brasa Nobre.',
}

/**
 * Página para fornecedor, não para quem contrata. A parceria é direta e
 * combinada evento a evento: sem vitrine, sem taxa, sem cadastro público.
 */
export const parceiro = {
  selo: 'Como é a parceria',
  titulo: 'Você cuida do seu serviço. A Brasa Nobre cuida do evento.',
  itens: [
    { n: '01', titulo: 'Conversa direta', desc: 'Cada evento é combinado por escrito entre você e a Brasa Nobre, sem exclusividade para nenhum dos lados. O seu cadastro não é publicado no site.' },
    { n: '02', titulo: 'A casa coordena', desc: 'Em regra, a Brasa Nobre fala com a empresa contratante e coordena o evento. Cada parceiro executa o próprio serviço com autonomia.' },
    { n: '03', titulo: 'Eventos corporativos', desc: 'Confraternizações, happy hours, fim de ano, treinamentos e recepção de clientes em São Paulo.' },
  ],
  procura: {
    selo: 'O que procuramos',
    texto:
      'Serviços que completam o churrasco. A sua área não está na lista? Envie mesmo assim: a Brasa Nobre avalia ' +
      'cada cadastro e conversa sobre eventos em que o seu serviço possa entrar.',
  },
  categorias: ['Decoração e ambientação', 'Mobiliário e estrutura', 'Som e iluminação', 'Foto e vídeo'],
}

/** Faixas de chamada que fecham as páginas. */
export const chamadas = {
  orcamento: {
    selo: central.selo,
    titulo: central.titulo,
    texto: central.texto,
  },
  parceiro: {
    selo: 'Para fornecedores',
    titulo: 'Atende eventos corporativos?',
    texto: 'Decoração, estrutura, som, foto e vídeo: apresente o seu trabalho à Brasa Nobre.',
  },
}

/**
 * Cabeçalho de cada página interna. `imagem` é chave de config/imagens.js;
 * `aba` vai para o título da aba do navegador (router).
 */
export const paginas = {
  servicos: { selo: servicos.selo, titulo: servicos.titulo, texto: servicos.texto, imagem: 'brasaLarga', aba: 'Serviços' },
  eventos: { selo: eventos.selo, titulo: eventos.titulo, texto: eventos.texto, imagem: 'confraternizacao', aba: 'Eventos corporativos' },
  sobre: { selo: sobre.selo, titulo: sobre.titulo, texto: sobre.texto, imagem: 'carvao', aba: 'Sobre' },
  parceiro: {
    selo: 'Seja um parceiro',
    titulo: 'Apresente o seu serviço à Brasa Nobre.',
    texto:
      'A Brasa Nobre faz o churrasco e, quando o evento pede, traz parceiros para decoração e apoio. Se você atende ' +
      'eventos corporativos em São Paulo, faça o seu cadastro.',
    imagem: 'outro',
    aba: 'Seja um parceiro',
  },
  contato: {
    selo: 'Contato',
    titulo: central.titulo,
    texto: 'Peça o orçamento pelo formulário ou fale direto com a Brasa Nobre.',
    imagem: 'chama',
    aba: 'Contato e orçamento',
  },
}

/** Opções dos formulários (v-select e grupo de rádio); não duplicar na view. */
export const opcoes = {
  servicoParceiro: [...parceiro.categorias, 'Outro serviço para eventos'],
  tipoEvento: ['Confraternização', 'Happy hour', 'Evento de fim de ano', 'Treinamento', 'Recepção de clientes', 'Outro formato'],
  complementos: [
    { valor: 'Só o churrasco', rotulo: 'Só o churrasco' },
    { valor: 'Churrasco + decoração', rotulo: 'Churrasco + decoração' },
    { valor: 'Churrasco + decoração + outros serviços de apoio', rotulo: 'Churrasco + decoração + outros serviços' },
    { valor: 'Ainda não sei, quero orientação', rotulo: 'Ainda não sei, quero orientação' },
  ],
}
