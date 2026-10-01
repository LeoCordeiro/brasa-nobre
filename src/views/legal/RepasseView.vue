<script setup>
import PaginaLegal from '@/components/PaginaLegal.vue'
import { empresa, documentos } from '@/config/site'
import { linkWhatsAppSimples } from '@/utils/whatsapp'
</script>

<template>
  <PaginaLegal titulo="Política de repasse e parceiros">
    <template #intro>
      Vigente a partir de {{ documentos.vigencia }}. Explica como funciona a contratação quando o seu evento inclui serviços feitos por parceiros da Brasa Nobre, como esses parceiros são pagos e quem responde por cada parte.
    </template>

    <h2>1. Por que esta política existe</h2>
    <p>
      O Código de Defesa do Consumidor (art. 6º, III) garante informação clara sobre o serviço contratado. Quando o
      evento inclui decoração ou outros serviços de apoio feitos por parceiros, você tem o direito de saber quem faz o
      quê e como o pagamento é distribuído.
    </p>

    <h2>2. Como funciona a contratação</h2>
    <p>
      Você contrata a Brasa Nobre. O churrasco é preparado e servido pela própria Brasa Nobre. Quando o evento pede
      decoração ou outros serviços de apoio, a Brasa Nobre contrata parceiros para executá-los e coordena todos no dia
      do evento. Você recebe uma proposta, assina um contrato e faz os pagamentos para a Brasa Nobre.
    </p>

    <h2>3. O que é o repasse</h2>
    <p>
      Do valor pago à Brasa Nobre, a parte que corresponde aos serviços executados por parceiros é repassada a eles
      pela própria Brasa Nobre, nas condições combinadas com cada um. Você não precisa pagar nenhum parceiro
      diretamente, e nenhum parceiro está autorizado a cobrar de você valores fora da proposta.
    </p>

    <h2>4. O que a proposta mostra</h2>
    <p>
      A proposta indica o que será feito pela Brasa Nobre e o que será feito por parceiros. O valor total e qualquer
      taxa de coordenação, se houver, aparecem na proposta antes da contratação. Você pode perguntar, antes ou depois
      de contratar, quais parceiros vão atender o seu evento.
    </p>

    <h2>5. Quem responde pelo serviço</h2>
    <p>
      Perante você, a Brasa Nobre responde por todo o serviço contratado com ela, inclusive pela parte executada por
      parceiros. Se algo sair diferente do combinado, você trata diretamente com a Brasa Nobre, que resolve com o
      parceiro.
    </p>

    <h2>6. Se você preferir contratar por conta própria</h2>
    <p>
      Você pode contratar só o churrasco e trazer decoração ou outros serviços de fornecedores da sua escolha. Nesse
      caso, o contrato desses serviços é entre você e o fornecedor, que responde por eles, e a Brasa Nobre combina com
      ele apenas o necessário para o churrasco acontecer no mesmo evento.
    </p>

    <h2>7. Como os parceiros são escolhidos</h2>
    <p>
      A Brasa Nobre escolhe parceiros pela experiência com eventos corporativos, pela qualidade do trabalho e pela
      disponibilidade na data. Fornecedores podem se apresentar pela página
      <RouterLink to="/parceiro">Seja um parceiro</RouterLink>; o cadastro registra o interesse e não garante
      participação em eventos.
    </p>

    <h2>8. O que vale para os parceiros</h2>
    <p>
      Cada participação é combinada por escrito entre o parceiro e a Brasa Nobre, evento a evento, com escopo, valor e
      prazo de pagamento definidos antes do evento e sem exclusividade para nenhum dos lados. O parceiro presta o seu
      serviço com autonomia, e o cadastro não cria vínculo de emprego nem de sociedade.
    </p>

    <h2>9. Alterações</h2>
    <p>
      Esta política pode ser atualizada para refletir mudanças na forma de trabalhar com parceiros. A versão válida é
      sempre a publicada nesta página, com a data de vigência no topo.
    </p>

    <h2>10. Contato</h2>
    <p>
      {{ empresa.razaoSocial }} ({{ empresa.fantasia }}), CNPJ {{ empresa.cnpj }}<br />
      {{ empresa.bairro }}, {{ empresa.cidade }}/{{ empresa.uf }}<br />
      E-mail: <a :href="`mailto:${empresa.email}`">{{ empresa.emailExibicao }}</a><br />
      WhatsApp: <a :href="linkWhatsAppSimples()" target="_blank" rel="noopener">{{ empresa.whatsappExibicao }}</a>
    </p>
  </PaginaLegal>
</template>
