<template>
  <div class="title">
    <van-nav-bar left-arrow>
      <template #left>
        <div class="img">
          <img src="../assets/img/logo.png" alt="" />
        </div>
        <div class="text">SAME</div>
      </template>
      <template #right>
        <div class="right" @click="jumpHome">先逛一逛</div>
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
import "../assets/less/Navs.less";
export default {
  name: "navs",
  methods: {
    jumpHome() {
      this.$cookies.remove("tokenString");
      this.$router.push("/");
    },
  },
};
</script>
