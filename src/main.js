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
// import vConsole from 'vconsole';
// const vConsole2 = new vConsole();

Vue.config.productionTip = false;
// Vue.use(
//     new VueSocketio({
//         // debug: true,
//         connection: 'http://172.16.6.173/'
//         // connection: process.env.NODE_ENV === 'development' ? 'http://172.16.6.192:7001/' : 'http://172.16.6.173/'
//     })
// );

Vue.use(ElementUI, { size: 'small' });
Vue.prototype.$axios = axios;

// 重定义全局组件
Object.keys(components).forEach(key => {
    var name = key.replace(/(\w)/, v => v.toUpperCase()); //首字母大写
    Vue.component(`v${name}`, components[key]);
});

Vue.directive('drag', {
    inserted(el, binding) {
        let oDiv = el;
        //  左边距最大值
        let maxLeft = el.parentNode.clientWidth - el.clientWidth;
        //  上边距最大值
        let maxTop = el.parentNode.clientHeight - el.clientHeight;
        oDiv.onmousedown = function(e) {
            //  鼠标按下，计算当前元素距离可视区的距离
            console.log(e);
            let disX = e.clientX - oDiv.offsetLeft;
            let disY = e.clientY - oDiv.offsetTop;
            document.onmousemove = function(e) {
                //  获取到鼠标拖拽后的横向位移(距离父级元素)
                let l = e.clientX - disX;
                //  获取到鼠标拖拽后的纵向位移(距离父级元素)
                let t = e.clientY - disY;

                oDiv.style.left = l + 'px';

                oDiv.style.top = t + 'px';

                if (e.clientX - disX <= 0) {
                    oDiv.style.left = 0 + 'px';
                }

                if (e.clientY - disY <= 0) {
                    oDiv.style.top = 0 + 'px';
                }

                if (e.clientX - disX >= maxLeft) {
                    oDiv.style.left = maxLeft + 'px';
                }

                if (e.clientY - disY >= maxTop) {
                    oDiv.style.top = maxTop + 'px';
                }

                //     将此时的位置传出去
                binding.value({ x: oDiv.style.left, y: oDiv.style.top });
            };
            //     松开事件后，移除事件
            document.onmouseup = function(e) {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
    }
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
