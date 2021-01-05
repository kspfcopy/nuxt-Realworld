- Vue组件通信方式
- Vuex核心概念和基本使用回顾
- 购物车案例
- 模拟实现 Vuex



###  组件内的状态管理流程

### 状态管理

- state： 驱动应用的数据源

- actions： 响应在view上的用户输入导致的状态变化

- view： 以申明的方式将state映射到视图

单向数据流
![image-20201213131525948](C:\Users\m1762\AppData\Roaming\Typora\typora-user-images\image-20201213131525948.png)

箭头是数据的流向，此处数据流向是单向的 ，数据绑定到视图展示给用户，当用户和视图交互通过actions更改数据后，在把更改后的数据绑定到视图



###  组件间通信方式回顾-父组件给子组件传值

- **父组件给子组件传值**
  - 字符串中通过props接受数据
  - 父组件中给子组件通过相应属性传值

```vue
//父组件
<template>
  <div>
    <h1>Props Down Parent</h1>
    <child title="My journey with Vue"></child>
  </div>
</template>

<script>
import child from './01-Child'
export default {
  components: {
    child
  }
}
</script>
```

```vue
//子组件
<template>
  <div>
    <h1>Props Down Child</h1>
    <h2>{{ title }}</h2>
  </div>
</template>

<script>
export default {
  // props: ['title'],
  props: {
    title: String
  }
}
</script>
```



- **子组件给父组件传值**
  - 通过自定义事件子组件给父组件传值
  - 在父组件注册子组件的事件
  - 在子组件触发事件向父组件传值

```vue 
//父组件
<template>
  <div>
    <h1 :style="{ fontSize: hFontSize + 'em'}">Event Up Parent</h1>

    这里的文字不需要变化

    <child :fontSize="hFontSize" v-on:enlargeText="enlargeText"></child>
    <child :fontSize="hFontSize" v-on:enlargeText="enlargeText"></child>
    <child :fontSize="hFontSize" v-on:enlargeText="hFontSize += $event"></child>
  </div>
</template>

<script>
import child from './02-Child'
export default {
  components: {
    child
  },
  data () {
    return {
      hFontSize: 1
    }
  },
  methods: {
    enlargeText (size) {
      this.hFontSize += size
    }
  }
}
</script>
```

```vue
//子组件
<template>
  <div>
    <h1 :style="{ fontSize: fontSize + 'em' }">Props Down Child</h1>
    <button @click="handler">文字增大</button>
  </div>
</template>

<script>
export default {
  props: {
    fontSize: Number
  },
  methods: {
    handler () {
      this.$emit('enlargeText', 0.1)
    }
  }
}
</script>
```



- **不相关组件之间传值**
  - 自定义事件传值`event-bus`
  - 创建event-bus文件创建vue实例并导出，只需要使用此vue对象的 $on #emit方法注册和触发方法
  - 需要传值的组件中引入该对象并注册或者触发事件

```javascript
//event-bus事件中心
import Vue from 'vue'
export default new Vue()
```

```vue
//组件1
<template>
  <div>
    <h1>Event Bus Sibling01</h1>
    <div class="number" @click="sub">-</div>
    <input type="text" style="width: 30px; text-align: center" :value="value">
    <div class="number" @click="add">+</div>
  </div>
</template>

<script>
import bus from './eventbus'

export default {
  props: {
    num: Number
  },
  created () {
    this.value = this.num
  },
  data () {
    return {
      value: -1
    }
  },
  methods: {
    sub () {
      if (this.value > 1) {
        this.value--
        bus.$emit('numchange', this.value)
      }
    },
    add () {
      this.value++
      bus.$emit('numchange', this.value)
    }
  }
}
</script>

<style>
.number {
  display: inline-block;
  cursor: pointer;
  width: 20px;
  text-align: center;
}
</style>
```

```vue
//组件2
<template>
  <div>
    <h1>Event Bus Sibling02</h1>

    <div>{{ msg }}</div>
  </div>
</template>

<script>
import bus from './eventbus'
export default {
  data () {
    return {
      msg: ''
    }
  },
  created () {
    bus.$on('numchange', (value) => {
      this.msg = `您选择了${value}件商品`
    })
  }
}
</script>
```

![image-20201213132147608](C:\Users\m1762\AppData\Roaming\Typora\typora-user-images\image-20201213132147608.png)


## 组件间通信方式回顾-通过 ref 获取子组件
- $root
- $parent
- $children
- $refs
	- 在普通HTML标签上使用ref，获取到的是dom对象
	- 在组件标签上使用ref，获取到的是组件实例

```vue
<template>
  <div>
    <h1>ref Parent</h1>

    <child ref="c"></child>
  </div>
</template>

<script>
import child from './04-Child'
export default {
  components: {
    child
  },
  mounted () {
    this.$refs.c.focus()
    this.$refs.c.value = 'hello input'
  }
}
</script>
```

```vue
<template>
  <div>
    <h1>ref Child</h1>
    <input ref="input" type="text" v-model="value">
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: ''
    }
  },
  methods: {
    focus () {
      this.$refs.input.focus()
    }
  }
}
</script>
```



## 简易的状态管理方案

- 问题：
    - 多个视图依赖同一状态
    - 来自不同的视图的行为需要变更统一状态

- 更好的方法：
	- 把不同组件的共享状态抽离出来，存储到一个全局对象中，并且要保证这个对象是响应式的



##  Vuex 概念回顾

### 什么是vuex

- vuex 是专门为vue.js 设计的状态管理库
- vuex 采用集中式的方式存储要共享的状态
- vuex 的作用是进行状态管理，解决复杂的组件通信，数据共享

- vuex 集成到了devtools中，提供了time-travel时光旅行历史回滚功能

### 什么情况下使用vuex

- 非必要的情况不要使用vuex
- 大型的单页应用程序
  - 多个视图依赖同一状态
  - 来自不同视图的行为需要变同统一状态



## Vuex 的核心概念

![image-20201213212320729](C:\Users\m1762\AppData\Roaming\Typora\typora-user-images\image-20201213212320729.png)

- Store 
  - 仓库，每一个应用只有一个Store，不能直接改变Store的状态，需要提交Mutation来更改Store状态
- State
  - 状态，保存在Store中，因为Store是唯一的，所以State也是唯一的，称为单一状态书，但是所有的状态都保存在State中会让程序难以维护，可以通过后续的模块解决该问题，
  - State是响应式的
- Getter
  - 就像是vuex中的计算属性，方便从一个属性派生出其他的值，内部对结果缓存，只有依赖的状态改变时才会重新计算
- Mutation
  - 状态的变化需要提交Mutation来完成
- Action
  - 和Mutation 类似，Action可以进行异步操作，内部改变状态的时候都需要提交Mutation
- Module
  - 由于使用单一状态树应用的所有状态会集中到一个比较大的对象上来，当应用变得非常复杂时，Store会变的相当臃肿，解决改问题，vuex允许我们将Store分割成模块，每个模块拥有自己的state,Getter,Mutation,Action 甚至是子模块



## 基本代码结构

- Store模块中基础代码

```javascript
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
```

- mian.js中挂载到vue实例上

```javascript
import store from './store'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```



### State基本使用
#### Store模块中state
```javascript
state: {
    count: 0,
    msg: 'Hello Vuex'
},
```

### 需要使用的组件中

```vue
<template>
	<div>count: {{$store.state.count}}</div>
	<div>msg: {{$store.state.msg}}</div>
</template>
```

#### 简化重复的$store.state
- 使用计算属性来简化$store.state
- 这种方式简化了视图中 重复的$store.state 
- 如果当前组件已经定义了vuex中的重复属性key则会冲突

```vue
<template>
	<div>count: {{count}}</div>
	<div>msg: {{msg}}</div>
</template>
<script>

import {mapState} from "vuex"
export default {
    computed:{
    	//方式1 mapState 传入数据
        ...mapState(['count','msg'])
        /* mapState传入数组相当于
        count: state => state.count,
        msg: state => state.msg
        */
        
        
        //方式2 mapState传入对象
        ...mapState({
            num:'count', 
			message:'msg'
        })
        /* mapState传入对象相当于
        mun: state => state.count,
        message: state => state.msg
        */
    }
}
</script>
```

### getter的基本使用
#### Store模块中添加getters
```javascript
{
  state: {
        count: 0,
        msg: 'Hello Vuex'
  },
  getters: {
        reverseMsg (state) {
          return state.msg.split('').reverse().join('')
        }
   },
}
```
#### 需要使用的组件中
```vue
<template>
	<div>getter-msg: {{$store.getter.reverseMsg}}</div>
</template>
```
#### 简化重复的$store.getter
```vue
<template>
	<div>getter-msg: {{reverseMsg}}</div>
</template>
<script>
import {mapGetters} from "vuex"
export default {
	computed:{
		...mapGetter(['reverseMsg'])
	}
}
</script>
```



## Mutation的基本使用

Mutation必须是同步执行的

### Store模块中增加

```javascript
mutations: {
    increate (state, payload) {
      state.count += payload
    }
},
```

### 用map方法映射到组件methods中

```vue
<template>
  <div id="app">
    <button @click="increate(3)">Mutation</button>
  </div>
</template>
<script>
import {mapMutations} from 'vuex'
export default {
  methods: {
      ...mapMutations(['increate']),
  }
}
</script>

```



### 时光旅行

还原到点击按钮这次的值，方便调试

![image-20201216215853277](C:\Users\m1762\AppData\Roaming\Typora\typora-user-images\image-20201216215853277.png)

### 历史回滚

回滚到这次提交

![image-20201216215725092](C:\Users\m1762\AppData\Roaming\Typora\typora-user-images\image-20201216215725092.png)



## Action

- 执行异步操作，提交Mutation来修改state
- Action的调用需要使用dispatch来调用

### 用settimeout来演示异步操作，在store模块中添加Action

```javascript
 actions: {
    increateAsync (context, payload) {
      setTimeout(() => {
        context.commit('increate', payload)
      }, 2000)
    }
  },
```

### 使用map方法映射到methods

```vue
<template>
  <div id="app">
    <button @click="increateAsync(3)">Mutation</button>
  </div>
</template>
<script>
import {mapActions} from 'vuex'
export default {
  methods: {
      ...mapActions(['increateAsync']),
  }
}
</script>
```



## module的基本使用

- 目录结构

>store
>
>> modules  模块文件夹
>>
>> > cart.js
>> >
>> > products.js
>
>> index.js

### 模块cart内容

```javascript
const state = {
  products: [
    { id: 1, title: 'iPhone 11', price: 8000 },
    { id: 2, title: 'iPhone 12', price: 10000 }
  ]
}
const getters = {}
const mutations = {
  setProducts (state, payload) {
    state.products = payload
  }
}
const actions = {}

export default {
  namespaced: true,//命名空间
  state,
  getters,
  mutations,
  actions
}

```



### 模块products内容

```javascript
const state = {}
const getters = {}
const mutations = {}
const actions = {}

export default {
  namespaced: true, //命名空间
  state,
  getters,
  mutations,
  actions
}

```



### Store模块入口

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import products from './modules/products'
import cart from './modules/cart'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    products,
    cart
  }
})

```



### 组件中使用 命名空间方式

```vue
<template>
  <div id="app">
    products: {{ products }} <br>
    <button @click="setProducts([])">Mutation</button>
  </div>
</template>
<script>
import { mapState, mapMutations} from 'vuex'
export default {
  computed: {
    ...mapState('products', ['products'])
  },
  methods: {
    ...mapMutations('products', ['setProducts'])
  }
}
</script>
```



## Vuex 严格模式

所有的状态变更必须通过Mutation,这仅仅只是约定, 如果不遵从约定直接更改state,devtools无法跟踪到这次状态的修改，开启严格模式后直接修改state会抛出错误

- 在new Store的时候strict设置为true打开严格模式
- 不要在生产环境中开启严格模式严格模式会深度检查状态树，来检查不合规的状态改变会影响性能

```javascript
export default new Vuex.Store({
     strict: process.env.NODE_ENV !== 'production',
})
```





## vuex插件

- vuex的插件就是一个函数
- 这个函数接收一个store的参数

### 本地储存（存储到localStorage,sessionStorage中）

1. 获取本地储存中的数据

```javascript
state: cartProducts: JSON.parse(window.localStorage.getItem('cart-products')) || []
```

2. 插件函数

```javascript
const myPlugin = store => {
  store.subscribe((mutation, state) => {
    if (mutation.type.startsWith('cart/')) {
      window.localStorage.setItem('cart-products', JSON.stringify(state.cart.cartProducts))
    }
  })
}
```

3. 注册插件

```javascript
plugins: [myPlugin]
```



注意： 

- 不是任何项目都适合vuex
- 中大型项目需要管理状态较多才合适vuex
- 小型项目使用vuex会适得其反

