<template>
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
            <span class="date">{{
                article.updatedAt | date('MMM DD, YYYY')
            }}</span>
        </div>
        <template v-if="user.username !== article.author.username">
            <button
                class="btn btn-sm btn-outline-secondary"
                :class="{
                    active: article.author.following,
                }"
                :disabled="article.followdisabled"
                @click="onFollow"
            >
                <i class="ion-plus-round"></i>
                {{ article.author.following ? 'Unfollow' : 'Follow' }}
                {{ article.author.username }}
            </button>
            <button
                class="btn btn-sm btn-outline-primary"
                :class="{
                    active: article.favorited,
                }"
                :disabled="article.favoritedisabled"
                @click="onFavorite"
            >
                <i class="ion-heart"></i>
                &nbsp; Favorite Post
                <span class="counter">({{ article.favoritesCount }})</span>
            </button>
        </template>
        <template v-else>
            <nuxt-link
                class="btn btn-outline-secondary btn-sm"
                :to="{
                    name: 'editor',
                    params: {
                        slug: article.slug,
                    },
                }"
            >
                <i class="ion-edit"></i> Edit Article
            </nuxt-link>
            <button class="btn btn-outline-danger btn-sm" @click="deleteArticle" :disabled="article.deleteing">
                <i class="ion-trash-a"></i> Delete Article
            </button>
        </template>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'article-meta',
    props: {
        article: {
            type: Object,
            required: true,
        },
    },
    computed: {
        ...mapState(['user']),
    },
    methods: {
        // 点赞
        onFavorite() {
            this.$emit('onFavorite');
        },
        // 关注
        onFollow() {
            this.$emit('onFollow');
        },
        //删除
        deleteArticle() {
            this.$emit('deleteArticle');
        },
    },
};
</script>

<style>
</style>