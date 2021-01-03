<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>

        <article-meta :article="article"></article-meta>
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12" v-html="article.body"></div>
      </div>

      <hr />

      <div class="article-actions">
        <article-meta :article="article"></article-meta>
      </div>

      <article-comments :article="article"></article-comments>
    </div>
  </div>
</template>

<script>
import { getArticleDetails } from "@/api/article";
import articleMeta from "./components/article-meta";
import articleComments from "./components/article-comments";
import MarkdownIt from "markdown-it";
export default {
  middleware: "isLogin",
  name: "Article",
  async asyncData({ params }) {
    const { data } = await getArticleDetails(params.slug);
    const { article } = data;
    const md = new MarkdownIt();
    article.body = md.render(article.body);
    return {
      article,
    };
  },
  components: {
    articleMeta,
    articleComments
  },
  head() {
    return {
      title: `${this.article.title} - Realworld`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.article.description,
        },
      ],
    };
  },
};
</script>

<style>
</style>