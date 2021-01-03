// 服务端操作cookie用的
const cookieparser = process.server ? require('cookieparser') : undefined
// 在服务器期间运行的都是同一个实例
// 为了防止数据冲突 务必把state 定义成一个函数 返回数据对象
export const state = () => {
    return {
        user: null
    }
}

export const mutations = {
    setUser: (state, data) => {
        state.user = data;
    }
}

export const actions = {
    // nuxtServerInit是一个特殊的action方法
    // 这个action 会在服务端渲染期间自动调用
    // 作用： 初始化容器数据， 传递数据给客户端使用
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
}