<!--
 * @Descripttion: 
 * @version: 
 * @Author: 马琳峰
 * @Date: 2021-01-04 08:58:48
 * @LastEditors: 马琳峰
 * @LastEditTime: 2021-01-04 15:14:07
-->
<template>
  <div>
    <!-- header -->
    <nav class="navbar navbar-light">
      <div class="container">
        <nuxt-link class="navbar-brand" to="/">conduit</nuxt-link>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <!-- Add "active" class when you're on that page" -->
            <nuxt-link class="nav-link" to="/" exact>Home</nuxt-link>
          </li>
          <template v-if="user">
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/editor"
                ><i class="ion-compose"></i>&nbsp;New Post</nuxt-link
              >
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/settings"
                ><i class="ion-compose"></i>
                <i class="ion-gear-a"></i>&nbsp;Settings</nuxt-link
              >
            </li>
            <li class="nav-item">
              <a class="nav-link">
              <img class="user-pic" :src="user.image">
              {{user.username}}
            </a>
            </li>
          </template>
          <template v-else>
              <li class="nav-item">
              <nuxt-link class="nav-link" to="/register"
                ><i class="ion-compose"></i>Sign up</nuxt-link
              >
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/login"
                ><i class="ion-compose"></i>Sign in</nuxt-link
              >
            </li>
          </template>
          
        </ul>
      </div>
    </nav>

    <!-- 子路由 -->
    <nuxt-child></nuxt-child>

    <!-- footer -->
    <footer>
      <div class="container">
        <a href="/" class="logo-font">conduit</a>
        <span class="attribution">
          An interactive learning project from
          <a href="https://thinkster.io">Thinkster</a>. Code &amp; design
          licensed under MIT.
        </span>
      </div>
    </footer>
  </div>
</template>


<script>
import { mapState } from 'vuex';
export default {
  name: "commonHtml",
  computed:{
    ...mapState(['user'])
  }
};
</script>