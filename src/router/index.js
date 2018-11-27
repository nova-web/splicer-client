import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/sockio'
        },
        {
            path: '/',
            component: resolve => require(['../views/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/sockio',
                    component: resolve => require(['../views/page/Sockio.vue'], resolve),
                    meta: { title: '测试Sock.io' }
                },
                {
                    path: '/fabric-base',
                    component: resolve => require(['../views/page/FabricBase.vue'], resolve),
                    meta: { title: 'Fabric基础' }
                },
                {
                    path: '/videos',
                    component: resolve => require(['../views/page/Videos.vue'], resolve),
                    meta: { title: '直播' }
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
