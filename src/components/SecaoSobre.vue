<script setup>
import { sobre, empresa } from '@/config/site'
import { marca } from '@/config/imagens'

/** A ficha traz o que o RH pede para cadastrar a empresa como fornecedor. */
const ficha = [
  ['Razão social', empresa.razaoSocial],
  ['CNPJ', empresa.cnpj],
  ['Atividade', empresa.atividade],
  ['Localização', `${empresa.bairro} · ${empresa.cidade}/${empresa.uf}`],
]
</script>

<template>
  <section id="sobre" class="secao sobre">
    <div class="container sobre-layout">
      <div v-revela>
        <h2 class="rotulo-secao ficha-titulo">{{ sobre.ficha }}</h2>
        <dl class="ficha">
          <div v-for="[campo, valor] in ficha" :key="campo">
            <dt>{{ campo }}</dt>
            <dd>{{ valor }}</dd>
          </div>
        </dl>
      </div>

      <!-- A logo é quadrada: o cartão também é, senão o fundo dele aparece como
           faixa nas laterais. -->
      <figure v-revela="120" class="cartao-logo">
        <img
          :src="marca.logo"
          :srcset="`${marca.logo720} 720w, ${marca.logo} 1254w`"
          sizes="(max-width: 980px) 90vw, 560px"
          alt="Logo da Brasa Nobre: monograma BN em dourado com espeto e chama"
          width="1254"
          height="1254"
          loading="lazy"
          decoding="async"
        />
      </figure>
    </div>
  </section>
</template>

<style scoped>
.sobre {
  background: var(--c-brasa);
}

.sobre-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 80px;
  align-items: center;
}

.ficha-titulo {
  font-family: var(--f-corpo);
}
.ficha {
  margin: 28px 0 0;
}
.ficha div {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  gap: 16px;
  padding: 18px 0;
  border-top: 1px solid var(--l-sobre-escuro);
}
.ficha div:last-child {
  border-bottom: 1px solid var(--l-sobre-escuro);
}
dt {
  color: var(--c-suave);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  line-height: 1.6;
  text-transform: uppercase;
}
dd {
  margin: 0;
  color: var(--c-texto);
  font-size: 17px;
  font-variant-numeric: lining-nums;
  line-height: 1.45;
}

.cartao-logo {
  width: min(100%, 560px);
  aspect-ratio: 1;
  margin: 0;
  justify-self: end;
  overflow: hidden;
  border: 1px solid var(--l-sobre-escuro);
  border-radius: var(--r-painel);
  box-shadow: 0 40px 90px -40px rgb(var(--c-ouro-rgb) / 0.35);
}
.cartao-logo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 980px) {
  .sobre-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 48px;
  }
  .cartao-logo {
    justify-self: center;
  }
}

@media (max-width: 620px) {
  .ficha div {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
    padding: 14px 0;
  }
}
</style>
