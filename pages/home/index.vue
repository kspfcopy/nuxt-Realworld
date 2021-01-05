<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <nuxt-link
                  exact
                  :class="[
                    'nav-link',
                    {
                      active: tab === 'you_feed',
                    },
                  ]"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'you_feed',
                    },
                  }"
                  >Your Feed</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  exact
                  :class="['nav-link', { active: (tab === 'global_feed') }]"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed',
                    },
                  }"
                  >Global Feed</nuxt-link
                >
              </li>
              <li class="nav-item" v-if="tag">
                <nuxt-link
                  exact
                  :class="['nav-link', { active: tag }]"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag: tag,
                    },
                  }"
                  ># {{ tag }}</nuxt-link
                >
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }"
              >
                <img :src="article.author.image" />
              </nuxt-link>

              <div class="info">
                <nuxt-link
                  class="author"
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                >
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">
                  {{ article.createdAt | date('MMM DD, YYYY') }}
                </span>
              </div>
              <button
                @click="onFavorite(article)"
                :class="[
                  'btn btn-outline-primary btn-sm pull-xs-right',
                  { active: article.favorited },
                ]"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
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

              <ul class="tag-list" v-for="item in article.tagList" :key="item">
                <li class="tag-default tag-pill tag-outline">{{ item }}</li>
              </ul>
            </nuxt-link>
          </div>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                v-for="item in tags"
                :key="item"
                :to="{
                  name: 'home',
                  query: {
                    tag: item,
                    tab: 'tag',
                    page: page,
                  },
                }"
                class="tag-pill tag-default"
              >
                {{ item }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
      <nav>
        <ul class="pagination">
          <li
            class="page-item"
            :class="{ active: page == item }"
            v-for="item in totalPage"
            :key="item"
          >
            <nuxt-link
              class="page-link"
              :to="{
                name: 'home',
                query: {
                  page: item,
                  tab: tab,
                  tag: $route.query.tag,
                },
              }"
              >{{ item }}</nuxt-link
            >
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { getArticle , getFeedArticle, addFavorite, deleteFavorite} from "@/api/article";
import { getTags } from "@/api/tag";
import { mapState } from "vuex";
export default {
  name: "home",
  async asyncData({ query, store }) {
    let page = Number.parseInt(query.page || 1);
    let limit = 20;
    let { tag } = query;
    let tab = query.tab || "global_feed";

    const loadArticle = store.state.user && tab == 'you_feed' ?   getFeedArticle : getArticle

    // const getFeedArticle
    const [articleRes, tagRes] = await Promise.all([
      loadArticle({
        limit,
        offset: (page - 1) * limit,
        tag: query.tag,
      }),
      getTags(),
    ]);

    const { articles, articlesCount } = articleRes.data;
    const { tags } = tagRes.data;


    articles.forEach(article => article.favoriteDisabled = false);

    return {
      articles, //数据
      articlesCount, // 数据总条数
      limit,
      page,
      tags,
      tag,
      tab
    };
  },
  computed: {
    ...mapState(["user"]),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  watchQuery: ["page", "tag", "tab"], //监听page参数改变重新执行asyncdata
  methods:{
    async onFavorite(article){
      article.favoriteDisabled = true;
      if(article.favorited){
        await deleteFavorite(article.slug);
        article.favorited = false;
        article.favoritesCount -= 1;
      }else{
        await addFavorite(article.slug);
        article.favorited = true;
        article.favoritesCount += 1;
      }
      article.favoriteDisabled = false;
    }
  }
};
</script>

<style>
</style>