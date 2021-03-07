<template>
  <div class="main">
    <keep-alive>
      <router-view />
    </keep-alive>
    <div class="navs">
      <van-tabbar
        v-model="active"
        inactive-color="#646566"
        active-color="#007751"
        route
      >
        <van-tabbar-item
          v-for="(v, k) in tabbarData"
          :key="k"
          :badge="v.badge > 0 ? v.badge : ''"
          :dot="v.dot"
          :to="v.to"
        >
          <span>{{ v.title }}</span>
          <template #icon="props">
            <img :src="props.active ? v.icon.inactive : v.icon.active" />
          </template>
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
import "../assets/less/main.less";
import { mapMutations, mapState } from "vuex";
export default {
  name: "Main",
  data() {
    return {
      active: 0,
    };
  },
  computed: {
    ...mapState(["Shoppingcartnum", "isLoad"]),
    tabbarData() {
      return [
        //导航栏数据
        {
          title: "首页",
          icon: {
            active: require("../assets/img/homes.svg"),
            inactive: require("../assets/img/home.svg"),
          },
          to: "/",
        },
        {
          title: "菜单",
          icon: {
            active: require("../assets/img/menus.svg"),
            inactive: require("../assets/img/menu.svg"),
          },
          to: "/menu",
        },
        {
          title: "购物车",
          icon: {
            active: require("../assets/img/Shoppings.svg"),
            inactive: require("../assets/img/Shopping.svg"),
          },
          badge: this.Shoppingcartnum,
          to: "/shopbag",
        },
        {
          title: "我的",
          icon: {
            active: require("../assets/img/mys.svg"),
            inactive: require("../assets/img/my.svg"),
          },
          dot: false,
          to: "/my",
        },
      ];
    },
  },
  created() {
    this.Shoppingnumber();
  },
  methods: {
    ...mapMutations(["changenum", "changeBoll"]),
    //获取购物车数量
    Shoppingnumber() {
      //let tokenString = this.$cookies.get("tokenString");
      let tokenString = localStorage.getItem("tokenString");
      if (!tokenString) {
        return;
      }
      if (!this.isLoad) {
        this.changeBoll(true);
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });
        this.axios({
          method: "get",
          url: "/shopcartRows",
          params: {
            appkey: this.appkey,
            tokenString: tokenString,
          },
        })
          .then((data) => {
            this.$toast.clear();
            //没登陆
            if (data.data.code == 700) {
              return;
            }
            if (data.data.code == 8000) {
              this.changenum(data.data.result);
            }
          })
          .catch((err) => {
            this.$toast.clear();
          });
      }
    },
  },
};
</script>
<style lang="less">
.main {
  padding-bottom: 50px;
}
</style>
