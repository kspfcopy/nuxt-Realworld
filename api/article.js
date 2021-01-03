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
 * @param {String} slug  
*/

export const addFavorite = slug => {
    return request({
        method: 'POST',
        url: `/api/articles/${slug}/favorite`,
    })
}


/** 
 * @name 取消点赞
 * @param {String} slug  
*/
export const deleteFavorite = slug => {
    return request({
        method: 'DELETE',
        url: `/api/articles/${slug}/favorite`,
    })
}

/**
 * @name  获取文章详情
 * @param {String} slug 
 */
export const getArticleDetails = slug => {
    return request({
        method: 'GET',
        url: `/api/articles/${slug}`
    })
} 


/**
 * @name  获取评论详情
 * @param {String} slug 
 */
export const getComments = slug => {
    return request({
        method: 'GET',
        url: `/api/articles/${slug}/comments`
    })
} 

