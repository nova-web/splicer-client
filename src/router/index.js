import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/chat'
        },
        {
            path: '/',
            component: resolve => require(['../views/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/chat',
                    component: resolve => require(['../views/page/Chat.vue'], resolve),
                    meta: { title: '聊天室' }
                },
                {
                    path: '/chat2',
                    component: resolve => require(['../views/page/TestsocketApi.vue'], resolve),
                    meta: { title: '聊天室2' }
                },
                {
                    path: '/divPrinter',
                    component: resolve => require(['../views/page/DivPrinter.vue'], resolve),
                    meta: { title: 'div绘图' }
                },
                {
                    path: '/canvasPrinter',
                    component: resolve => require(['../views/page/CanvasPrinter.vue'], resolve),
                    meta: { title: 'canvas绘图' }
                },
                {
                    path: '/videos',
                    component: resolve => require(['../views/page/Videos.vue'], resolve),
                    meta: { title: 'videos' }
                },
                {
                    path: '/404',
                    component: resolve => require(['../views/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../views/page/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
