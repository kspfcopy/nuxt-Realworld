<!--
 * @Descripttion: 
 * @version: 
 * @Author: 马琳峰
 * @Date: 2021-01-04 08:58:48
 * @LastEditors: 马琳峰
 * @LastEditTime: 2021-01-04 16:27:20
-->
<template>
    <div class="article-page">
        <div class="banner">
            <div class="container">
                <h1>{{ article.title }}</h1>

                <article-meta
                    @onFavorite="onFavorite"
                    @onFollow="onFollow"
                    @deleteArticle="deleteArticle"
                    :article="article"
                ></article-meta>
            </div>
        </div>

        <div class="container page">
            <div class="row article-content">
                <div class="col-md-12" v-html="article.body"></div>
            </div>

            <ul class="tag-list">
                <li class="tag-default tag-pill tag-outline ng-binding ng-scope" v-for="tag in article.tagList" :key="tag">{{tag}}</li>
            </ul>

            <hr />

            <div class="article-actions">
                <article-meta
                    @onFavorite="onFavorite"
                    @onFollow="onFollow"
                    @deleteArticle="deleteArticle"
                    :article="article"
                ></article-meta>
            </div>

            <article-comments :article="article"></article-comments>
        </div>
    </div>
</template>

<script>
import { getArticleDetails, addFavorite, deleteArticle, deleteFavorite } from '@/api/article';
import { addFollow, deleteFollow } from '@/api/user';
import articleMeta from './components/article-meta';
import articleComments from './components/article-comments';
import MarkdownIt from 'markdown-it';
export default {
    middleware: 'isLogin',
    name: 'Article',
    async asyncData({ params }) {
        const { data } = await getArticleDetails(params.slug);
        const { article } = data;
        article.favoritedisabled = false;
        article.followdisabled = false;
        article.deleteing = false;
        const md = new MarkdownIt();
        article.body = md.render(article.body);
        return {
            article,
        };
    },
    components: {
        articleMeta,
        articleComments,
    },
    head() {
        return {
            title: `${this.article.title} - Realworld`,
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: this.article.description,
                },
            ],
        };
    },
    methods: {
        async onFavorite() {
            this.article.favoritedisabled = true;
            if (!this.article.favorited) {
                await addFavorite(this.article.slug);
                this.article.favorited = true;
                this.article.favoritesCount += 1;
            } else {
                await deleteFavorite(this.article.slug);
                this.article.favorited = false;
                this.article.favoritesCount -= 1;
            }
            this.article.favoritedisabled = false;
        },
        async onFollow() {
            this.article.followdisabled = true;
            if (!this.article.author.following) {
                const { data } = await addFollow(
                    this.article.author.username
                );
                this.article.author = data.profile;
            } else {
                const { data } = await deleteFollow(
                    this.article.author.username
                );
                this.article.author = data.profile;
            }
            this.article.followdisabled = false;
        },
        async deleteArticle(){
            this.article.deleteing = true;
            await deleteArticle(this.article.slug);
            this.$router.push("/");
            this.article.deleteing = false;
        }
    },
};
</script>

<style>
</style>