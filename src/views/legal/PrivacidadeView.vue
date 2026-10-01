<script setup>
import PaginaLegal from '@/components/PaginaLegal.vue'
import { empresa, documentos } from '@/config/site'
import { linkWhatsAppSimples } from '@/utils/whatsapp'
</script>

<template>
  <PaginaLegal titulo="Política de privacidade">
    <template #intro>
      Vigente a partir de {{ documentos.vigencia }}. Explica quais dados os dois formulários deste site (pedido de orçamento e cadastro de parceiro) coletam, para que servem, com quem são compartilhados e como exercer os seus direitos.
    </template>

  <h2>1. Quem somos</h2>
  <p>
    Este site é mantido por <strong>{{ empresa.razaoSocial }}</strong>, inscrita no CNPJ {{ empresa.cnpj }}, que atua sob a marca
    <strong>{{ empresa.fantasia }}</strong>, com sede no bairro {{ empresa.bairro }}, {{ empresa.cidade }}/{{ empresa.uf }}. Para os efeitos da
    Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais, LGPD), a Brasa Nobre é a controladora dos dados
    pessoais tratados por meio deste site.
  </p>

  <h2>2. Dados que coletamos e por quê</h2>
  <p>
    O site tem dois pontos de coleta: o formulário de pedido de orçamento e o cadastro de parceiro. Fora deles, o
    site não coleta dado pessoal. Se você nos chamar direto pelo WhatsApp ou por e-mail, recebemos o seu número ou
    endereço e o que você escrever, e usamos só para responder. Não há conta de usuário, login, carrinho ou pagamento
    pelo site.
  </p>
  <p>
    No pedido de orçamento, você informa: nome, empresa, e-mail, WhatsApp, tipo de evento, data prevista, número
    de convidados, local do evento, se precisa de decoração ou outros serviços e, se quiser, detalhes livres sobre o
    evento. Usamos esses dados apenas para entender o pedido, montar a proposta e falar com você sobre ela.
  </p>
  <p>
    No cadastro de parceiro, quem oferece serviço para eventos informa: nome, empresa ou nome profissional, WhatsApp,
    e-mail, serviço oferecido, região que atende e, se quiser, Instagram ou site e uma descrição do trabalho. Usamos
    esses dados apenas para avaliar a parceria, olhar o perfil ou site que você indicar e conversar com você sobre
    eventos em que o seu serviço possa entrar. O cadastro é só para maiores de 18 anos e não pede CPF, RG, endereço,
    dados bancários nem foto; se a parceria avançar, o que for preciso para contratar é pedido depois, no contrato.
  </p>
  <h3>Dado sensível enviado por conta própria</h3>
  <p>
    Pedimos que o campo de detalhes não traga dado sensível (saúde, religião, origem racial e similares) além do
    necessário para o evento. Se você informar, por iniciativa própria, uma restrição alimentar por motivo de saúde
    ou de crença, ela será usada apenas para preparar aquele evento e compartilhada somente com quem precisa dela
    para isso.
  </p>
  <p>
    No cadastro de parceiro vale o mesmo: não inclua dado sensível seu nem dado pessoal de terceiros (equipe,
    clientes) sem que eles saibam que você está enviando.
  </p>

  <h2>3. Como o envio funciona</h2>
  <p>
    Os formulários não enviam os dados para servidor do site e o site não os guarda. Ao tocar em "Enviar pelo
    WhatsApp" ou "Enviar por e-mail", o seu navegador abre o WhatsApp ou o seu programa de e-mail com a mensagem já
    escrita para a Brasa Nobre; ela só chega até nós quando você a envia dentro desse aplicativo.
  </p>
  <p>
    No WhatsApp, o texto da mensagem vai no próprio endereço do link (wa.me), que pertence à Meta Platforms e pode ser
    processado por ela antes de você enviar, conforme a política de privacidade dela. No e-mail, o texto fica no seu
    programa até o envio e passa pelos provedores que você e a Brasa Nobre usam. Esses serviços podem tratar dados em
    servidores fora do Brasil.
  </p>

  <h2>4. Base legal</h2>
  <ul>
    <li>
      <strong>Pedido de orçamento</strong>: art. 7º, V, da LGPD (procedimentos preliminares relacionados a contrato)
      quando você contrata para si, e art. 7º, IX (legítimo interesse de responder à solicitação) quando você pede o
      orçamento em nome da sua empresa.
    </li>
    <li>
      <strong>Cadastro de parceiro</strong>: art. 7º, V, da LGPD (procedimentos preliminares relacionados a contrato,
      a pedido do titular), para avaliar e responder o cadastro de quem se apresenta em nome próprio, como autônomo ou
      MEI; e art. 7º, IX (legítimo interesse de selecionar fornecedores e manter contato), para quem se apresenta em
      nome de uma empresa e, para todos, para guardar o cadastro e chamar você em eventos futuros depois da primeira
      conversa.
    </li>
    <li>
      <strong>Dado sensível informado por você</strong>: art. 11, I, da LGPD, pelo consentimento que você manifesta ao
      informá-lo, limitado à finalidade do evento.
    </li>
  </ul>

  <h2>5. Com quem compartilhamos</h2>
  <p>
    Se o pedido for só de churrasco, os dados ficam com a Brasa Nobre. Se você pedir decoração ou outros serviços de
    apoio, compartilhamos com os parceiros envolvidos apenas o que eles precisam para participar da proposta e do
    evento, como tipo de evento, data, local, número de convidados e preferências. Seus dados de contato só vão para
    um parceiro quando for necessário falar diretamente com você, e você pode perguntar a qualquer momento quais
    parceiros receberam dados do seu evento.
  </p>
  <p>
    Os dados do cadastro de parceiro ficam com a Brasa Nobre. Não os publicamos no site nem os passamos a outros
    fornecedores. Se você for chamado para um evento, o cliente recebe apenas o que for preciso para aquele evento, e
    só depois de combinado com você.
  </p>
  <p>Não vendemos dados pessoais e não os compartilhamos para publicidade. Também podem ter acesso:</p>
  <ul>
    <li>o WhatsApp (Meta) ou o provedor de e-mail, como consequência do canal escolhido (item 3);</li>
    <li>a empresa que hospeda o site, que registra dados técnicos de acesso, como o endereço IP, mas não recebe o conteúdo dos formulários;</li>
    <li>autoridades públicas, quando a lei ou uma ordem judicial exigir.</li>
  </ul>

  <h2>6. Por quanto tempo guardamos</h2>
  <p>
    Pelo tempo necessário para responder ao pedido e, se o evento for contratado, para executá-lo e cumprir
    obrigações legais, fiscais ou de defesa em eventual disputa. Pedido que não vira contratação é mantido enquanto
    houver expectativa de retomar a conversa. Depois disso, os dados são eliminados ou anonimizados.
  </p>
  <p>
    O cadastro de parceiro é guardado por até 24 meses contados do último contato entre você e a Brasa Nobre. Depois
    disso é eliminado, a menos que você confirme que quer continuar. Se a parceria não seguir, ou se você pedir,
    eliminamos antes, salvo o que a lei obrigar a guardar. Se você participar de um evento, os dados dele ficam pelo
    prazo e pelas razões do parágrafo anterior.
  </p>

  <h2>7. Seus direitos</h2>
  <p>Nos termos do art. 18 da LGPD, você pode pedir a qualquer momento:</p>
  <ul>
    <li>confirmação de que tratamos dados seus e acesso a eles;</li>
    <li>correção de dado incompleto, inexato ou desatualizado;</li>
    <li>anonimização, bloqueio ou eliminação de dado desnecessário ou tratado em desconformidade com a lei;</li>
    <li>portabilidade dos dados;</li>
    <li>informação sobre com quem compartilhamos os seus dados;</li>
    <li>eliminação dos dados tratados com base no seu consentimento e revogação desse consentimento;</li>
    <li>oposição a tratamento feito sem o seu consentimento, se houver descumprimento da lei (art. 18, § 2º), inclusive o feito com base em legítimo interesse;</li>
    <li>informação sobre a possibilidade de não fornecer consentimento e sobre as consequências da negativa;</li>
    <li>petição contra a Brasa Nobre à Autoridade Nacional de Proteção de Dados (art. 18, § 1º).</li>
  </ul>

  <h2>8. Como exercer os seus direitos</h2>
  <p>
    Envie o pedido para <a :href="`mailto:${empresa.email}`">{{ empresa.emailExibicao }}</a> ou pelo WhatsApp
    <a :href="linkWhatsAppSimples()" target="_blank" rel="noopener">{{ empresa.whatsappExibicao }}</a>. A Brasa Nobre é
    agente de tratamento de pequeno porte e, como permite a Resolução CD/ANPD nº 2/2022, mantém esses canais de
    comunicação com o titular no lugar de um encarregado formalmente indicado.
  </p>

  <h2>9. Cookies e ferramentas de terceiros</h2>
  <p>
    O site não usa cookies, não tem ferramenta de estatística nem pixel de anúncio, e não carrega fonte, script ou
    imagem de servidor de terceiros: tudo é servido pelo próprio site. Se isso mudar, esta política será atualizada
    antes, e o site passará a pedir a sua escolha sobre o que não for essencial.
  </p>

  <h2>10. Segurança</h2>
  <p>
    O site é servido por conexão segura (HTTPS) e não mantém banco de dados com o conteúdo dos formulários. Nenhum
    sistema é infalível: havendo incidente de segurança que possa trazer risco relevante, comunicaremos os titulares
    afetados e a Autoridade Nacional de Proteção de Dados, conforme o art. 48 da LGPD.
  </p>

  <h2>11. Alterações</h2>
  <p>
    Esta política pode ser atualizada para refletir mudanças no site ou na legislação. A versão válida é sempre a
    publicada nesta página, com a data de vigência no topo.
  </p>

  <h2>12. Contato</h2>
  <p>
    {{ empresa.razaoSocial }} ({{ empresa.fantasia }}), CNPJ {{ empresa.cnpj }}<br>
    {{ empresa.bairro }}, {{ empresa.cidade }}/{{ empresa.uf }}<br>
    E-mail: <a :href="`mailto:${empresa.email}`">{{ empresa.emailExibicao }}</a><br>
    WhatsApp: <a :href="linkWhatsAppSimples()" target="_blank" rel="noopener">{{ empresa.whatsappExibicao }}</a>
  </p>
  </PaginaLegal>
</template>
