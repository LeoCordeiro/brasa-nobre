<script setup>
import PaginaLegal from '@/components/PaginaLegal.vue'
import { empresa, documentos } from '@/config/site'
import { linkWhatsAppSimples } from '@/utils/whatsapp'
</script>

<template>
  <PaginaLegal titulo="Termos de uso">
    <template #intro>
      Vigentes a partir de {{ documentos.vigencia }}. Regras de uso deste site e de como funcionam o pedido de orçamento e o cadastro de parceiro feitos por ele.
    </template>

  <h2>1. Sobre este site</h2>
  <p>
    Este site é mantido por <strong>{{ empresa.razaoSocial }}</strong>, CNPJ {{ empresa.cnpj }}, que atua sob a marca
    <strong>{{ empresa.fantasia }}</strong>, com sede no bairro {{ empresa.bairro }}, {{ empresa.cidade }}/{{ empresa.uf }}. Ele apresenta os
    serviços de churrasco para eventos corporativos e recebe pedidos de orçamento e cadastros de fornecedores que
    queiram ser parceiros. Ao usar o site, você concorda com estes termos.
  </p>

  <h2>2. Pedido de orçamento e cadastro de parceiro não são contratação</h2>
  <p>
    O formulário de orçamento envia um pedido para a Brasa Nobre avaliar. A contratação só existe depois que a
    proposta com escopo, valores e condições for aceita pelas duas partes, e o que vale para o evento é o que estiver
    nessa proposta ou no contrato assinado.
  </p>
  <p>
    Da mesma forma, o cadastro de parceiro é uma apresentação: não garante convite para eventos nem cria vínculo de
    emprego, sociedade, representação ou exclusividade, para nenhum dos lados. Cada participação é combinada por
    escrito com a Brasa Nobre, evento a evento, e o parceiro presta o seu serviço com autonomia.
  </p>

  <h2>3. Serviços próprios e serviços de parceiros</h2>
  <p>
    O churrasco é executado pela própria Brasa Nobre. Decoração e outros serviços de apoio são executados por
    parceiros contratados pela Brasa Nobre e entram no evento a pedido do cliente. Em cada proposta, a Brasa Nobre
    informa quais serviços serão prestados por parceiros e o que está incluído. Como funciona o pagamento desses
    serviços e quem responde por eles está na <RouterLink to="/repasse">Política de repasse e parceiros</RouterLink>.
  </p>
  <p>
    A disponibilidade de parceiros depende da data, do local e do porte do evento. Você não é obrigado a usar os
    parceiros indicados: pode contratar só o churrasco e trazer os fornecedores que preferir.
  </p>

  <h2>4. Informações do site</h2>
  <p>
    As descrições de serviços e formatos de evento são gerais. Cardápio, quantidades, horários e estrutura são
    definidos para cada evento, na proposta. As fotografias usadas no site são ilustrativas.
  </p>

  <h2>5. Propriedade intelectual</h2>
  <p>
    O nome Brasa Nobre, a logo, os textos e a identidade visual deste site pertencem à Brasa Nobre e não podem ser
    reproduzidos sem autorização. As fotografias de banco de imagens são usadas conforme a licença de cada banco.
  </p>

  <h2>6. Links e aplicativos de terceiros</h2>
  <p>
    O envio do orçamento ou do cadastro de parceiro abre o WhatsApp ou o seu programa de e-mail, e o site tem links
    para o Instagram e o Reclame Aqui da Brasa Nobre. Esses serviços têm termos e políticas próprios, que não são
    controlados pela Brasa Nobre.
  </p>

  <h2>7. Disponibilidade do site</h2>
  <p>
    Buscamos manter o site no ar e com informações corretas, mas ele pode passar por manutenção ou ficar
    temporariamente indisponível. Se notar alguma informação errada, avise pelos canais abaixo.
  </p>

  <h2>8. Dados pessoais</h2>
  <p>
    O tratamento dos dados enviados pelo pedido de orçamento e pelo cadastro de parceiro está descrito na
    <RouterLink to="/privacidade">Política de privacidade</RouterLink>.
  </p>

  <h2>9. Legislação e foro</h2>
  <p>
    Estes termos seguem as leis brasileiras. Fica eleito o foro da comarca de {{ empresa.cidade }}/{{ empresa.uf }}, ressalvado
    o foro do domicílio do consumidor quando a lei assim determinar.
  </p>

  <h2>10. Contato</h2>
  <p>
    {{ empresa.razaoSocial }} ({{ empresa.fantasia }}), CNPJ {{ empresa.cnpj }}<br>
    E-mail: <a :href="`mailto:${empresa.email}`">{{ empresa.emailExibicao }}</a><br>
    WhatsApp: <a :href="linkWhatsAppSimples()" target="_blank" rel="noopener">{{ empresa.whatsappExibicao }}</a>
  </p>
  </PaginaLegal>
</template>
