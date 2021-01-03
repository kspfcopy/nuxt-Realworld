import request from "@/utils/request";


/**
 * @name 登录
 * @param {String} data.email 邮箱
 * @param {String} data.password 密码
 */
export const login = data => {
    return request({
        method: 'POST',
        url: '/api/users/login',
        data
    })
}

/**
 * @name 注册
 * @param {String} data.username 用户名
 * @param {String} data.email 邮箱
 * @param {String} data.password 密码
 */
export const register = data => {
    return request({
        method: 'POST',
        url: '/api/users',
        data
    })
}