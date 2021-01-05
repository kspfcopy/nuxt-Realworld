<!--
 * @Descripttion: 
 * @version: 
 * @Author: 马琳峰
 * @Date: 2021-01-04 08:58:48
 * @LastEditors: 马琳峰
 * @LastEditTime: 2021-01-05 14:08:33
-->
<template>
    <div class="profile-page">
        <div class="user-info">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12 col-md-10 offset-md-1">
                        <img :src="profile.image" class="user-img" />
                        <h4>{{ profile.username }}</h4>
                        <p v-if="profile.bio">
                            {{ profile.bio }}
                        </p>

                        <nuxt-link
                            to="/settings"
                            v-if="profile.username === user.username"
                            class="btn btn-sm btn-outline-secondary action-btn"
                        >
                            <i class="ion-gear-a"></i> Edit Profile Settings
                        </nuxt-link>

                        <button
                            v-else
                            class="btn btn-sm btn-outline-secondary action-btn"
                             :disabled="profile.followdisabled"
                            @click="onFollow"
                        >
                            <i class="ion-plus-round"></i>
                            {{ profile.following ? 'Unfollow' : 'Follow' }}
                            {{ profile.username }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="row">
                <div class="col-xs-12 col-md-10 offset-md-1">
                    <div class="articles-toggle">
                        <ul class="nav nav-pills outline-active">
                            <li class="nav-item">
                                <nuxt-link
                                    class="nav-link"
                                    exact
                                    :to="{
                                        name: 'profile',
                                        params: {
                                            username: profile.username,
                                        },
                                    }"
                                    >My Articles</nuxt-link
                                >
                            </li>
                            <li class="nav-item">
                                <nuxt-link
                                    class="nav-link"
                                    exact
                                    :to="{
                                        name: 'profile',
                                        params: {
                                            username: profile.username,
                                            favorites: 'favorites',
                                        },
                                    }"
                                    >Favorited Articles</nuxt-link
                                >
                            </li>
                        </ul>
                    </div>

                    <div
                        v-for="article in articles"
                        :key="article.slug"
                        class="article-preview"
                    >
                        <div class="article-meta">
                            <nuxt-link
                                :to="{
                                    name: 'profile',
                                    params: {
                                        username: article.author.username,
                                    },
                                }"
                                ><img :src="article.author.image"
                            /></nuxt-link>
                            <div class="info">
                                <nuxt-link
                                    :to="{
                                        name: 'profile',
                                        params: {
                                            username: article.author.username,
                                        },
                                    }"
                                    class="author"
                                    >{{ article.author.username }}</nuxt-link
                                >
                                <span class="date">
                                    {{
                                        article.createdAt | date('MMM DD, YYYY')
                                    }}</span
                                >
                            </div>
                            <button
                                @click="onFavorite(article)"
                                class="btn btn-outline-primary btn-sm pull-xs-right"
                                :class="[
                                    'btn btn-outline-primary btn-sm pull-xs-right',
                                    { active: article.favorited },
                                ]"
                                :disabled="article.favoriteDisabled"
                            >
                                <i class="ion-heart"></i>
                                {{ article.favoritesCount }}
                            </button>
                        </div>
                        <nuxt-link
                            :to="{
                                name: 'article',
                                params: {
                                    slug: article.slug,
                                },
                            }"
                            class="preview-link"
                        >
                            <h1>{{ article.title }}</h1>
                            <p>{{ article.description }}</p>
                            <span>Read more...</span>
                            <ul class="tag-list">
                                <li
                                    v-for="tag in article.tagList"
                                    :key="tag"
                                    class="tag-default tag-pill tag-outline"
                                >
                                    {{ tag }}
                                </li>
                            </ul>
                        </nuxt-link>
                    </div>
                    <nav>
                        <ul class="pagination" v-show="totalPage > 1">
                            <li
                                class="page-item"
                                :class="{ active: page == item }"
                                v-for="item in totalPage"
                                :key="item"
                            >
                                <nuxt-link
                                    class="page-link"
                                    :to="{
                                        name: 'profile',
                                        params: {
                                            username: profile.username,
                                            favorites: $route.params.favorites,
                                        },
                                        query: {
                                            page: item,
                                        },
                                    }"
                                    >{{ item }}</nuxt-link
                                >
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { getProfile ,addFollow, deleteFollow } from '@/api/user';
import { getArticle, addFavorite, deleteFavorite } from '@/api/article';
export default {
    middleware: 'isLogin',
    name: 'userProfile',
    async asyncData({ params, query }) {
        const isMy =
            params.favorites === 'favorites'
                ? { favorited: params.username }
                : { author: params.username };
        let page = query.page || 1;
        let limit = 5;

        const [articlesData, profileData] = await Promise.all([
            getArticle({
                ...isMy,
                limit,
                offset: (page - 1) * limit,
            }),
            getProfile(params.username),
        ]);

        const { articles, articlesCount } = articlesData.data;

        articles.forEach((article) => (article.favoriteDisabled = false));
    
        const { profile } = profileData.data;

        profile.followdisabled = false;


        return {
            username: params.username,
            limit,
            page,
            articles,
            articlesCount,
            profile,
        };
    },
    computed: {
        ...mapState(['user']),
        totalPage() {
            return Math.ceil(this.articlesCount / this.limit);
        },
    },
    methods: {
        async onFavorite(article) {
            article.favoriteDisabled = true;
            if (article.favorited) {
                await deleteFavorite(article.slug);
                article.favorited = false;
                article.favoritesCount -= 1;
            } else {
                await addFavorite(article.slug);
                article.favorited = true;
                article.favoritesCount += 1;
            }
            article.favoriteDisabled = false;
        },
        async onFollow() {
            this.profile.followdisabled = true;
            if (!this.profile.following) {
                const { data } = await addFollow(
                    this.profile.username
                );
                this.profile.following = data.profile;
            } else {
                const { data } = await deleteFollow(
                    this.profile.username
                );
                this.profile.following = data.profile;
            }
            this.profile.followdisabled = false;
        },
    },
    watchQuery: ['favorites', 'page'], //监听参数改变重新执行asyncdata
};
</script>

<style>
</style>