/*
 * @Descripttion: 
 * @version: 
 * @Author: 马琳峰
 * @Date: 2021-01-04 08:58:48
 * @LastEditors: 马琳峰
 * @LastEditTime: 2021-01-04 14:39:25
 */
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

/** 
 * @name 关注用户
 * @param {String} data.username 关注用户的用户名
*/
export const addFollow = username => {
    return request({
        method: 'POST',
        url: `/api/profiles/${username}/follow`,
    })
}

/** 
 * @name 取消关注
 * @param {String} data.username 关注用户的用户名
*/
export const deleteFollow = username => {
    return request({
        method: 'DELETE',
        url: `/api/profiles/${username}/follow`,
    })
}