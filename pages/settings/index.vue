<!--
 * @Descripttion: 
 * @version: 
 * @Author: 马琳峰
 * @Date: 2021-01-04 08:58:48
 * @LastEditors: 马琳峰
 * @LastEditTime: 2021-01-05 14:27:25
-->
<template>
    <div class="settings-page">
        <div class="container page">
            <div class="row">
                <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">Your Settings</h1>

                    <ul class="error-messages">
                        <template v-for="(messages, field) in errors">
                            <li
                                v-for="(message, index) in messages"
                                :key="index"
                            >
                                {{ field }} {{ message }}
                            </li>
                        </template>
                    </ul>
                    <form @submit.prevent="updateUserProfile">
                        <fieldset>
                            <fieldset class="form-group">
                                <input
                                    class="form-control"
                                    type="text"
                                    placeholder="URL of profile picture"
                                    autocomplete="new-password"
                                    v-model="user.image"
                                />
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                    class="form-control form-control-lg"
                                    type="text"
                                    placeholder="Your Name"
                                    autocomplete="new-password"
                                    v-model="user.username"
                                />
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea
                                    class="form-control form-control-lg"
                                    rows="8"
                                    placeholder="Short bio about you"
                                    autocomplete="new-password"
                                    v-model="user.bio"
                                ></textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                    class="form-control form-control-lg"
                                    type="text"
                                    placeholder="Email"
                                    autocomplete="new-password"
                                    v-model="user.email"
                                />
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                    class="form-control form-control-lg"
                                    type="password"
                                    placeholder="Password"
                                    autocomplete="new-password"
                                    v-model="user.password"
                                />
                            </fieldset>
                            <button
                                class="btn btn-lg btn-primary pull-xs-right"
                                :disabled="disabled"
                            >
                                Update Settings
                            </button>
                        </fieldset>
                    </form>
                    <hr>

                    <button class="btn btn-outline-danger" @click="logout()">
                        Or click here to logout.
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { updateUserProfile } from '@/api/user';
// 仅在客户端加载js-cookie包
const Cookie = process.client ? require("js-cookie") : undefined;
export default {
    middleware: 'isLogin',
    name: 'settings',
    asyncData({ store }) {
        return {
            user: {
                email: store.state.user.email || '',
                username: store.state.user.username || '',
                password: store.state.user.password || '',
                image: store.state.user.image || '',
                bio: store.state.user.bio || '',
            },
            errors: [],
            disabled: false
        };
    },
    methods: {
        async updateUserProfile() {
            try {
                this.disabled = true;
                const { data } = await updateUserProfile(this.user);
                this.setUser(data.user)
                this.disabled = false;
            } catch (err) {
                this.errors = err.response.data.errors;
                this.disabled = false;
            }
        },
        async logout(){
            Cookie.remove('user');
            this.setUser(null);
            this.$router.push("/")
        },
        ...mapMutations(['setUser'])
    },
};
</script>

<style>
</style>