<template>
    <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
            <form class="card comment-form" @submit.prevent="addComments">
                <div class="card-block">
                    <textarea
                        class="form-control"
                        placeholder="Write a comment..."
                        rows="3"
                        v-model="body"
                        required
                    ></textarea>
                </div>
                <div class="card-footer">
                    <img :src="user.image" class="comment-author-img" />
                    <button
                        :disabled="pushingdisabled"
                        class="btn btn-sm btn-primary"
                    >
                        Post Comment
                    </button>
                </div>
            </form>

            <div v-for="comment in Comments" class="card" :key="comment.id">
                <div class="card-block">
                    <p class="card-text">
                        {{ comment.body }}
                    </p>
                </div>
                <div class="card-footer">
                    <nuxt-link
                        :to="{
                            name: 'profile',
                            params: {
                                username: comment.author.username,
                            },
                        }"
                        class="comment-author"
                    >
                        <img
                            :src="comment.author.image"
                            class="comment-author-img"
                        />
                    </nuxt-link>

                    <nuxt-link
                        :to="{
                            name: 'profile',
                            params: {
                                username: comment.author.username,
                            },
                        }"
                        class="comment-author"
                        >{{ comment.author.username }}</nuxt-link
                    >
                    <span class="date-posted">{{
                        comment.createAt | date('MMM DD, YYYY')
                    }}</span>

                    <button
                        v-if="comment.author.username === user.username"
                        class="mod-options btn btn-sm"
                        @click="deleteComments( comment )"
                        :disabled="deleteIng"
                    >
                        <i class="ion-trash-a"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    getComments,
    addCommentsToArticle,
    deleteComments,
} from '@/api/article';
import { mapState } from 'vuex';
export default {
    name: 'articleComments',
    props: {
        article: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            Comments: [],
            body: '',
            pushingdisabled: false,
            deleteIng: false,
        };
    },
    async mounted() {
        const { data } = await getComments(this.article.slug);
        this.Comments = data.comments;
    },
    computed: {
        ...mapState(['user']),
    },
    methods: {
        async addComments() {
            try {
                this.pushingdisabled = true;
                const { data } = await addCommentsToArticle({
                    body: this.body,
                    slug: this.article.slug,
                });

                this.Comments.unshift(data.comment);

                this.body = '';
            } catch (err) {
                console.dir(err.response.data.errors);
            } finally {
                this.$nextTick(() => {
                    this.pushingdisabled = false;
                });
            }
        },
        async deleteComments( comment ) {
          try {
            this.deleteIng = true;
            
            const index = this.Comments.findIndex(item => item.id === comment.id);
            
            const { data } = await deleteComments({
              slug: this.article.slug,
              id: comment.id,
            })

            this.Comments.splice(index, 1);

          }
          catch(err){
            console.dir(err.response.data.errors);
          }
          finally{
             this.deleteIng = false;
          }
        },
    },
};
</script>

<style>
</style>