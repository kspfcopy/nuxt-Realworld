/*
 * @Descripttion: 
 * @version: 
 * @Author: 马琳峰
 * @Date: 2021-01-04 08:58:48
 * @LastEditors: 马琳峰
 * @LastEditTime: 2021-01-04 18:32:40
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

/** 
 * @name 更新用户资料
 * @param {String} data.email 邮箱（可选参数）
 * @param {String} data.username 用户名（可选参数）
 * @param {String} data.password 密码（可选参数）
 * @param {String} data.image 头像（可选参数）
 * @param {String} data.bio 简介（可选参数）
*/
export const updateUserProfile = data => {
    return request({
        method: 'PUT',
        url: `/api/user`,
        data: {
            user: data
        }
    })
}


/**
 * @name 获取用户资料
 * 
 */
export const getProfile = username => {
    return request({
        method: 'GET',
        url: `/api/profiles/${encodeURI(username)}`,
    })
}