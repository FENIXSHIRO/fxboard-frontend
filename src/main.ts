import { createApp } from 'vue';
import VueKonva from 'vue-konva';
import App from './App.vue';
import './index.css';
import router from './router';

const app = createApp(App)
app.use(router)
app.use(VueKonva)
app.mount('#app')
