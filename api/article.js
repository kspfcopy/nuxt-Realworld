/*
 * @Descripttion: 
 * @version: 
 * @Author: 马琳峰
 * @Date: 2021-01-04 08:58:48
 * @LastEditors: 马琳峰
 * @LastEditTime: 2021-01-04 16:22:26
 */
import request from "@/utils/request";

/**
 * @name 获取公共文章列表
 * @param {String} params.tag       按标签过滤 
 * @param {String} params.author    按作者筛选 
 * @param {String} params.favorited 被用户收藏 
 * @param {Number} params.limit     限制文章数默认 20 
 * @param {Number} params.offset    文章的偏移量/跳过数（默认为0）
 */
export const getArticle = params => {
    return request({
        method: 'GET',
        url: '/api/articles',
        params
    })
}

/**
 * @name 获取关注用户文章列表
 * @param {String} params.tag       按标签过滤 
 * @param {String} params.author    按作者筛选 
 * @param {String} params.favorited 被用户收藏 
 * @param {Number} params.limit     限制文章数默认 20 
 * @param {Number} params.offset    文章的偏移量/跳过数（默认为0）
 */
export const getFeedArticle = params => {
    return request({
        method: 'GET',
        url: '/api/articles/feed',
        params
    })
}

/** 
 * @name 添加点赞
 * @param {String} slug  文章标识
*/

export const addFavorite = slug => {
    return request({
        method: 'POST',
        url: `/api/articles/${slug}/favorite`,
    })
}

/** 
 * @name 取消点赞
 * @param {String} slug  文章标识
*/
export const deleteFavorite = slug => {
    return request({
        method: 'DELETE',
        url: `/api/articles/${slug}/favorite`,
    })
}

/**
 * @name  获取文章详情
 * @param {String} slug 文章标识
 */
export const getArticleDetails = slug => {
    return request({
        method: 'GET',
        url: `/api/articles/${slug}`
    })
} 

/**
 * @name  获取评论详情
 * @param {String} slug 文章标识
 */
export const getComments = slug => {
    return request({
        method: 'GET',
        url: `/api/articles/${slug}/comments`
    })
} 

/**
 * @name  创建文章
 * @param {String} data.title 标题
 * @param {String} data.description 描述
 * @param {String} data.body 正文
 * @param {Array[String]} data.tagList 标签列表
 * 
 */
export const createArticle = data => {
    return request({
        method: 'POST',
        url: `/api/articles`,
        data:{
            article: data,
        }
    })
} 

/**
 * @name  更新文章
 * @param {String} data.title 标题
 * @param {String} data.description 描述
 * @param {String} data.body 正文
 * @param {Array[String]} data.tagList 标签列表
 * 
 */
export const updateArticle = data => {
    return request({
        method: 'PUT',
        url: `/api/articles/:slug`,
        data:{
            article: data,
        }
    })
} 


/**
 * @name  删除文章
 * @param {String} slug 文章唯一标识
 * 
 */
export const deleteArticle = slug => {
    return request({
        method: 'DELETE',
        url: `/api/articles/${slug}`,
    })
} 