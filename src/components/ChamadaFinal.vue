<script setup>
import { mdiArrowRight, mdiWhatsapp } from '@mdi/js'
import { chamadas } from '@/config/site'
import { linkWhatsAppSimples } from '@/utils/whatsapp'

/** Faixa que fecha a página: pedido de orçamento (padrão) ou convite a fornecedor. */
const props = defineProps({
  tipo: { type: String, default: 'orcamento', validator: (v) => v in chamadas },
})
const c = chamadas[props.tipo]
</script>

<template>
  <section class="chamada" :class="`chamada--${tipo}`">
    <div class="container">
      <div v-revela class="chamada-caixa">
        <div>
          <p class="rotulo-secao">{{ c.selo }}</p>
          <h2>{{ c.titulo }}</h2>
          <p class="texto-lead">{{ c.texto }}</p>
        </div>
        <div class="acoes">
          <template v-if="tipo === 'orcamento'">
            <RouterLink to="/contato" class="btn btn-ouro">
              Pedir orçamento <v-icon :icon="mdiArrowRight" />
            </RouterLink>
            <a class="btn btn-contorno" :href="linkWhatsAppSimples()" target="_blank" rel="noopener">
              <v-icon :icon="mdiWhatsapp" /> Falar no WhatsApp
            </a>
          </template>
          <RouterLink v-else to="/parceiro" class="btn btn-ouro">
            Conhecer a parceria <v-icon :icon="mdiArrowRight" />
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.chamada {
  padding: 0 0 120px;
}
/* Depois da faixa marfim (sem respiro próprio embaixo) a caixa não pode encostar. */
.faixa + .chamada {
  padding-top: 120px;
}
.chamada-caixa {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 40px 64px;
  align-items: end;
  padding: 64px;
  border: 1px solid rgb(var(--c-ouro-rgb) / 0.28);
  border-radius: var(--r-painel);
  background:
    radial-gradient(120% 140% at 100% 0%, rgb(var(--c-ouro-rgb) / 0.14), transparent 55%),
    linear-gradient(135deg, var(--c-brasa), var(--c-superficie));
  box-shadow: 0 40px 90px -50px rgb(var(--c-ouro-rgb) / 0.45);
}
.chamada--parceiro .chamada-caixa {
  border-color: var(--l-sobre-escuro);
  background: var(--c-superficie);
  box-shadow: none;
}
h2 {
  max-width: 720px;
}
.texto-lead {
  max-width: 600px;
  margin-top: 20px;
}
.acoes {
  margin-top: 0;
}

@media (max-width: 980px) {
  .chamada {
    padding-bottom: 82px;
  }
  .faixa + .chamada {
    padding-top: 82px;
  }
  .chamada-caixa {
    grid-template-columns: minmax(0, 1fr);
    align-items: start;
    padding: 48px 40px;
  }
}

@media (max-width: 620px) {
  .chamada {
    padding-bottom: 64px;
  }
  .faixa + .chamada {
    padding-top: 64px;
  }
  .chamada-caixa {
    gap: 28px;
    padding: 34px 22px;
  }
}
</style>
