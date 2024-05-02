import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createApp } from 'vue';
import VueKonva from 'vue-konva';
import App from './App.vue';
import './index.css';
import router from './router';

const app = createApp(App)
app.use(router)
app.use(VueKonva)
app.use(ElementPlus)
app.mount('#app')
