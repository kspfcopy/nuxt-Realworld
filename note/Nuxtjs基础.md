# Nuxtjs基础

- 同构渲染应用框架
- 可以开发单页面应用
  - 可以但不是强项



## 初始化项目

- 初始项目
- 已有的nodejs服务端项目
  - 直接把nuxt当做一个中间件集成到node web server
- 现有的vue项目
  - 非常熟悉nuxt
  - 代码改动10%



## 从头开始新建项目

1. 创建项目文件夹
2. 初始化package.json文件
3. 安装nuxt `npm install nuxt --save`
4. 修改package.json文件 增加nuxt 启动命令

```json
{
  "scripts": {
    "dev": "nuxt"
  },
}

```

5. 创建`pages`文件夹 nuxt会根据pages文件夹自动生成路由
   1. pages中index.vue认为是根`/`路由其他依次（嵌套路由文件夹作为路由上级下面的index.vue认为是当前层级的根`/`）
   2. 可以在生成的.nuxt的文件夹下面router.js中查看到路由信息





### 路由导航

- a标签
  - 他会刷新整个页面，不推荐使用

```html
 <a href="/">跳转到根</a> 
```

- unxt-link组件
  - 和router-link一样

```html
<nuxt-link to="/">跳转到根</nuxt-link>
```



- 编程式导航
  - 和vue实例router使用一样查看文档在vue编程式导航查看

```vue
<button @click="jumpRoot">跳转到根</button>
<script>
export default {
    methods:{
        jumpRoot(){
            this.$router.push("/")
        }
    }
}
</script>
```



### 动态路由

创建下划线开头的文件夹或者.vue文件



以下

```bash
pages/
--| _slug/
-----| comments.vue
-----| index.vue
--| users/
-----| _id.vue
--| index.vue
```

Nuxt.js 生成对应的路由配置表为：

```js
router: {
  routes: [
    {
      name: 'index',
      path: '/',
      component: 'pages/index.vue'
    },
    {
      name: 'users-id',
      path: '/users/:id?',
      component: 'pages/users/_id.vue'
    },
    {
      name: 'slug',
      path: '/:slug',
      component: 'pages/_slug/index.vue'
    },
    {
      name: 'slug-comments',
      path: '/:slug/comments',
      component: 'pages/_slug/comments.vue'
    }
  ]
}
```

你会发现名称为 `users-id` 的路由路径带有 `:id?` 参数，表示该路由是可选的。如果你想将它设置为必选的路由，需要在 `users/_id` 目录内创建一个 `index.vue` 文件。



### 嵌套路由

你可以通过 vue-router 的子路由创建 Nuxt.js 应用的嵌套路由。

创建内嵌子路由，你需要添加一个 Vue 文件，同时添加一个**与该文件同名**的目录用来存放子视图组件。

**Warning:** 别忘了在父组件(`.vue`文件) 内增加 `<nuxt-child/>` 用于显示子视图内容。

假设文件结构如：

```bash
pages/
--| users/
-----| _id.vue
-----| index.vue
--| users.vue
```

Nuxt.js 自动生成的路由配置如下：

```js
router: {
  routes: [
    {
      path: '/users',
      component: 'pages/users.vue',
      children: [
        {
          path: '',
          component: 'pages/users/index.vue',
          name: 'users'
        },
        {
          path: ':id',
          component: 'pages/users/_id.vue',
          name: 'users-id'
        }
      ]
    }
  ]
}
```



### 自定义路由配置

[文档地址](https://www.nuxtjs.cn/api/configuration-router)

1. 创建nuxt.config.js 文件导出一个配置对象(遵循commonjs规范)
2. 扩展路由`extendRoutes` 扩展一个路由地址

```js
export default {
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'hello',
        path: '/hello',
        component: resolve(__dirname, 'pages/about.vue')
      })
    }
  }
}
```



### 视图-模板

![image-20201227221529121](C:\Users\m1762\AppData\Roaming\Typora\typora-user-images\image-20201227221529121.png)

- document-html file    文档页面单页面或者服务端渲染的页面
- layout     相当于所有页面的父路由
- page   页面组件有自己的成员方法
- opt 子组件配置



#### 模板

[文档地址](https://www.nuxtjs.cn/guide/views)

在根目录创建app.html 文件

```html
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>

<head {{ HEAD_ATTRS }}>
    {{ HEAD }}
</head>

<body {{ BODY_ATTRS }}>

    <!--  -->
    <h1>app html </h1>
    <!-- 所有页面内容会插入到这里 -->
    {{ APP }}
</body>

</html>
```



#### 默认布局

可通过添加 `layouts/default.vue` 文件来扩展应用的默认布局。

**提示:** 别忘了在布局文件中添加 `<nuxt/>` 组件用于显示页面的主体内容。

默认布局的源码如下：

```html
<template>
  <nuxt />
</template>
```

####  自定义布局

`layouts` 目录中的每个文件 (*顶级*) 都将创建一个可通过页面组件中的 `layout` 属性访问的自定义布局。

假设我们要创建一个 *博客布局* 并将其保存到`layouts/blog.vue`:

```html
<template>
  <div>
    <div>我的博客导航栏在这里</div>
    <nuxt />
  </div>
</template>
```

然后我们必须告诉页面 (即`pages/posts.vue`) 使用您的自定义布局：

```html
<template>
  <!-- Your template -->
</template>
<script>
  export default {
    layout: 'blog'
    // page component definitions
  }
</script>
```



注意：	

- 只要用的layout default 所有页面都会使用
- 可以新建其他文件指定 layout



### 异步数据

- 基本用法
  - 它会将asyncData返回的数据融合组件data方法返回数据一并给组件
  - 调用时机：服务端渲染期间和客户端路由更新之前
- 注意事项
  - 只能在页面组件中使用
    - 因为组件中不会调用asyncData
  - 没有this，应为他是在组件初始化之前被调用的

- 使用时机：
  - 有利于SEO或者提升首屏渲染速度的时候



### 异步数据上下文对象



[文档地址](https://www.nuxtjs.cn/guide/async-data)

在服务器端调用`asyncData`时，您可以访问用户请求的`req`和`res`对象。

```js
export default {
  async asyncData({ req, res }) {
    // 请检查您是否在服务器端
    // 使用 req 和 res
    if (process.server) {
      return { host: req.headers.host }
    }

    return {}
  }
}
```

### 访问动态路由数据

您可以使用`注入`asyncData 属性的`context`对象来访问动态路由数据。例如，可以使用配置它的文件或文件夹的名称访问动态路径参数。所以，如果你定义一个名为`_slug.vue`的文件，您可以通过`context.params.slug`来访问它。

```js
export default {
  async asyncData({ params }) {
    const slug = params.slug // When calling /abc the slug will be "abc"
    return { slug }
  }
}
```



