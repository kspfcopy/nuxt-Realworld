<!--
 * @Descripttion: 
 * @version: 
 * @Author: 马琳峰
 * @Date: 2021-01-04 08:58:48
 * @LastEditors: 马琳峰
 * @LastEditTime: 2021-01-04 15:49:11
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
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { updateUserProfile } from '@/api/user';
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
                await updateUserProfile(this.user);
                this.disabled = false;
            } catch (err) {
                this.errors = err.response.data.errors;
                this.disabled = false;
            }
        },
    },
};
</script>

<style>
</style>