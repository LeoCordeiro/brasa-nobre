import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import revela from './directives/revela'
import { aplicarTokens } from './config/tokens'
import './styles/global.css'

// Os tokens entram antes do mount, senão a primeira pintura sai com os valores de fallback.
aplicarTokens()

createApp(App).use(router).use(vuetify).directive('revela', revela).mount('#app')
