// import './assets/main.css'
import Antd from 'ant-design-vue';
import 'ant-design-vue/lib/notification/style/index.css'
import '@/assets/scss/index.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/components/Custom/components/assets/colors.scss'
import PrimeVue from "primevue/config";
import  'primevue/resources/themes/md-light-indigo/theme.css';
import "primevue/resources/primevue.min.css";
import Button from "primevue/button"
import Card from 'primevue/card';
import VueExcelEditor from 'vue3-excel-editor'
import OverlayPanel from 'primevue/overlaypanel';
import Tooltip from 'primevue/tooltip';
import DevMode from '@/plugins/devModePlugin'
const app = createApp(App)

app.directive('tooltip', Tooltip);
app.component('Button', Button);
app.component('Card', Card);
app.component('OverlayPanel', OverlayPanel);
app.use(VueExcelEditor)
app.use(createPinia())
app.use(DevMode)
app.use(PrimeVue)
app.use(router)
app.use(Antd)

app.mount('#app')
