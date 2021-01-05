# 综合案例

### 创建项目

1. 创建项目目录 mkdir `文件夹名字`
2. 进入项目目录 cd `文件夹名字`
3. 生成 package.json 文件  `npm init -y `
4. 安装 nuxt 依赖 `npm install nuxt`
5. 在 `package.json` 中添加启动脚本：
```json
"scripts": {
    "dev": "nuxt"
}
```
6. 创建 `pages/index.vue `
```vue
<template>
    <div>
    <h1>Home Page</h1>
    </div>
</template>
<script>
export default {
	name: 'HomePage'
}
</script>
<style>
</style>
```
7. 启动服务

```
npm run dev
```



### 处理页面功能逻辑（注）

####  1. asyncData

- **类型：** `Function`

`asyncData`方法会在组件（**限于页面组件**）每次加载之前被调用。它可以在服务端或路由更新之前被调用。在这个方法被调用的时候，第一个参数被设定为当前页面的**上下文对象**，你可以利用 `asyncData`方法来获取数据并返回给当前组件。

```js
export default {
  data() {
    return { project: 'default' }
  },
  asyncData(context) {
    return { project: 'nuxt' }
  }
}
```

注意：由于`asyncData`方法是在组件 **初始化** 前被调用的，所以在方法内是没有办法通过 `this` 来引用组件的实例对象。



#### 2.  nuxt.config.js

***nuxt.config.js*** 是 Nuxt.js 的配置文件，可以通过针对一系列参数的设置来完成 Nuxt.js 项目的配置

1.  `nuxt.config.js` 配置 自定义路由

```javascript
router: {
    	//路由匹配nuxt-link 的class
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
                            path: '/profile/:username/:favorites?',
                            name: 'profile',
                            component: resolve(__dirname, 'pages/profile'),
                        },
                        {
                            path: '/settings',
                            name: 'settings',
                            component: resolve(__dirname, 'pages/settings'),
                        },
                        {
                            path: '/editor/:slug?',
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
```

2. `watchQuery` 监听路由参数改变重新执行asyncData

```
`watchQuery` : ["需要监听的值", "需要监听的值", "需要监听的值"]
```

3. 登录需要设置cookie ，
4. 如果存储用户信息(token)到vuex中需要特殊actions

```javascript
nuxtServerInit ({ commit }, { req }) {
        let user = null
        // 如果请求头中有cookie
        if (req.headers.cookie) {
            // 使用 cookieparser 吧 cookie 字符串 转为javascript对象
            const parsed = cookieparser.parse(req.headers.cookie)
            try {
                user = JSON.parse(parsed.user)
            } catch (err) {
                // No valid cookie found
            }
        }
        //提交mutation 修改state状态
        commit('setUser', user)
    }
```

5. 统一请求拦截需要注册插件这样才能在服务端渲染时拿到store中的数据

```javascript
 plugins: [
        '~/plugins/request.js',
 ],
```

封装请求文件中：

```javascript
export default ({ store }) => {
    // 请求拦截器
    request.interceptors.request.use(
        config => {
            const {user} = store.state;

            if (user && user.token ) { // 判断是否存在token，如果存在的话，则每个http header都加上token
                config.headers.authorization =  `Token ${user.token}` //请求头加上token
            }
            return config
        },
        err => {
            return Promise.reject(err)
        }
    )
}
```





### pm2 使用方法

 *pm2*是一个进程管理工具,可以用它来管理你的node进程,并查看node进程的状态,当然也支持性能监控,进程守护,负载均衡等功能

- m2需要全局安装
 `npm install -g pm2`
 
 

- 进入根目录
    1. 启动动进程/应用           `pm2 start bin/www 或 pm2 start app.js`

    2. 重命名进程/应用           `pm2 start app.js --name wb123`

    3.  添加进程/应用 watch         `pm2 start bin/www --watch`

    4.  结束进程/应用            `pm2 stop www`

    5.  结束所有进程/应用           `pm2 stop all`

    6.  删除进程/应用            `pm2 delete www`

    7.  删除所有进程/应用             `pm2 delete all`

    8.  列出所有进程/应用          `pm2 list`

    9.  查看某个进程/应用具体情况      `pm2 describe www`

    10. 看进程/应用的资源消耗情况       `pm2 monit`

    11. 查看pm2的日志                 `pm2 logs`

    12. 若要查看某个进程/应用的日志,使用  `pm2 logs www`

    13. 重新启动进程/应用            `pm2 restart www`

    14. 重新启动所有进程/应用        `pm2 restart all`



**提示**:  要将参数传递给`npm`命令，您需要一个额外的 -- 脚本名称(例如： `npm run dev --参数 --spa` )

