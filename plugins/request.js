import axios from 'axios';

export const request = axios.create({
    baseURL: 'https://conduit.productionready.io',
});
// 插件导出函数必须作为defuault成员
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