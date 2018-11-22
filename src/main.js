import Vue from 'vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import '../static/css/icon.css';
import App from './App';
import 'babel-polyfill';
import components from '@/components'; // 加载公共组件
import VueSocketio from 'vue-socket.io';

Vue.config.productionTip = false;
Vue.use(
    new VueSocketio({
        debug: true,
        connection: 'http://172.16.6.192:7001'
    })
);

Vue.use(ElementUI, { size: 'small' });
Vue.prototype.$axios = axios;

// 重定义全局组件
Object.keys(components).forEach(key => {
    var name = key.replace(/(\w)/, v => v.toUpperCase()); //首字母大写
    Vue.component(`v${name}`, components[key]);
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
