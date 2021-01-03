// 

export default {
    router: {
        linkActiveClass: 'active',
        extendRoutes(routes, resolve) {
            // 清除nuxtjs 基于pages 目录默认生成的路由表规则
            routes.splice(0);

            //自定义的路由
            routes.push(...[
                {
                    path: '/',
                    component: resolve(__dirname, 'pages/layouts'),
                    children: [
                        {
                            path: '',
                            name: 'home',
                            component: resolve(__dirname, 'pages/home'),
                        },
                        {
                            path: '/login',
                            name: 'login',
                            component: resolve(__dirname, 'pages/login'),
                        },
                        {
                            path: '/register',
                            name: 'register',
                            component: resolve(__dirname, 'pages/login'),
                        },
                        {
                            path: '/profile/:username',
                            name: 'profile',
                            component: resolve(__dirname, 'pages/profile'),
                        },
                        {
                            path: '/settings',
                            name: 'settings',
                            component: resolve(__dirname, 'pages/settings'),
                        },
                        {
                            path: '/editor',
                            name: 'editor',
                            component: resolve(__dirname, 'pages/editor'),
                        },
                        {
                            path: '/article/:slug',
                            name: 'article',
                            component: resolve(__dirname, 'pages/article'),
                        },
                    ]
                },
            ])
        }
    },
    plugins: [
        '~/plugins/request.js',
        '~/plugins/day.js'
    ],
    serve:{
        host: '0.0.0.0',
        port: 3000
    }
}