<!--
 * @Descripttion: 
 * @version: 
 * @Author: 马琳峰
 * @Date: 2021-01-04 08:58:48
 * @LastEditors: 马琳峰
 * @LastEditTime: 2021-01-04 14:02:48
-->
<template>
    <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent="onUseArticle">
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="article.title"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="article.description"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  v-model="article.body"
                  required
                  placeholder="Write your article (in markdown)"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="tag"
                  @keydown.enter.prevent="createTag"
                />
                <div class="tag-list">
                  <span v-for="tag in article.tagList" :key="tag" class="tag-default tag-pill ng-binding ng-scope">
                    <i class="ion-close-round" @click="removeTag(tag)"></i>
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                
                :disabled="disabled"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createArticle } from '@/api/article'
export default {
  middleware: 'isLogin',
  name: 'editor',
  async asyncData({ params }){
    
  },
  data () {
    return {
      "article":{
        "title": "",//标题
        "description": "", //描述
        "body": "", //正文
        "tagList": []  //标签列表
      },
      "tag": "",//
      "disabled": false,
      "errors": []
    }
  },
  methods:{
    async onUseArticle(event){
      try {
        this.disabled = true;
        const { data } = await createArticle(this.article);
       
        this.$router.push({
          name: "article",
          params:{
            slug: data.article.slug
          }
        })

        this.disabled = false;
      }
      catch(err) {
        this.errors = err.response.data.errors;
      }
    },
    //删除tag
    removeTag(tag){
      let index = this.article.tagList.indexOf(tag);
      this.article.tagList.splice(index, 1);
    },
    //添加tag
    createTag(event){
      event.preventDefault();
      let tag = this.tag;
      if(this.article.tagList.indexOf(tag) != -1) return;
      this.article.tagList.push(tag);
    }
  }
}
</script>

<style>

</style>