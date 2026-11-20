import { createApp } from 'vue'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import './styles/tokens.css'
import './styles/base.css'
import './styles/diagrams.css'
import App from './App.vue'
import { router } from './router.js'
import { reveal } from './directives/reveal.js'

createApp(App).use(router).directive('reveal', reveal).mount('#app')
