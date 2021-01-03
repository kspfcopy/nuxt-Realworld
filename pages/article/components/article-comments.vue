<template>
  <div class="row">
    <div class="col-xs-12 col-md-8 offset-md-2">
      <form class="card comment-form">
        <div class="card-block">
          <textarea
            class="form-control"
            placeholder="Write a comment..."
            rows="3"
          ></textarea>
        </div>
        <div class="card-footer">
          <img
            :src="user.image"
            class="comment-author-img"
          />
          <button class="btn btn-sm btn-primary">Post Comment</button>
        </div>
      </form>

      <div v-for="comment in Comments" class="card" :key="comment.id">
        <div class="card-block">
          <p class="card-text">
            {{comment.body}}
          </p>
        </div>
        <div class="card-footer">
          <nuxt-link :to="{
              name:'',
              params:{
                  username : comment.author.username
              }
          }" class="comment-author">
            <img
              :src="comment.author.image"
              class="comment-author-img"
            />
          </nuxt-link>
          &nbsp;
          <a href="" class="comment-author">{{comment.author.username}}</a>
          <span class="date-posted">{{comment.createAt | date('MMM DD, YYYY')}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments } from '@/api/article'
import { mapState } from 'vuex'
export default {
  name: "articleComments",
  props:{
      article: {
          type: Object,
          required: true,
      }
  },
  data(){
      return {
          Comments: []
      }
  },
  async mounted(){
      const { data } = await getComments(this.article.slug);
      this.Comments = data.comments;
  },
  computed:{
      ...mapState(['user'])
  }
};
</script>

<style>
</style>