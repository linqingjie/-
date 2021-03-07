<template>
  <div class="home">
    <!-- 搜索框 -->
    <div class="search">
      <van-nav-bar>
        <template #right>
          <van-search
            v-model="searchs"
            shape="round"
            placeholder="请输入商品关键词"
            @clear="loseFocus"
          ></van-search>
        </template>
        <template #left>
          <div class="user">
            <span>{{ date | filter }}</span>
            <span class="userName">{{ userName || "未登录" }}</span>
          </div>
        </template>
      </van-nav-bar>
    </div>
    <!-- 轮播图 -->
    <div class="banner" v-show="show">
      <van-swipe autoplay="2000" @change="onChange" width="100%">
        <van-swipe-item
          v-for="(image, index) in banner"
          :key="index"
          @click="homejump(image.pid)"
        >
          <img :src="image.bannerImg" />
        </van-swipe-item>

        <template #indicator>
          <div class="point">
            <div
              class="custom-indicator"
              v-for="(image, index) in banner"
              :key="index"
              :class="{ highlight: current === index }"
            ></div>
          </div>
        </template>
      </van-swipe>
    </div>
    <!-- 热卖推荐 -->
    <div class="bestSellers" v-show="show">
      <span> 热卖推荐 </span>
    </div>
    <!-- 推荐商品 -->
    <div class="commodity" v-show="show">
      <Coffeelist class="detail" v-for="v in commodity" :key="v.pid" :data="v">
      </Coffeelist>
    </div>
    <!-- 推荐商品 -->
    <div class="commodity" v-show="!show">
      <Coffeelist class="detail" v-for="v in searchData" :key="v.pid" :data="v">
      </Coffeelist>
    </div>
  </div>
</template>

<script>
import "../assets/less/home.less";
import Coffeelist from "../components/Coffeelist";
export default {
  name: "Home",
  components: {
    Coffeelist,
  },
  data() {
    return {
      searchs: "", //搜索框
      current: 0, //导航条下标
      banner: [], //轮播图数据
      commodity: [], //热门推荐商品
      userName: "",
      date: 0, //当前时间
      show: true, //时候是搜索状态
      searchData: [], //搜索商品数据
    };
  },
  filters: {
    filter(val) {
      if (val >= 0 && val < 5) {
        return "凌晨好";
      } else if (val >= 5 && val < 11) {
        return "早上好";
      } else if (val >= 11 && val < 13) {
        return "中午好";
      } else if (val >= 13 && val < 17) {
        return "下午好";
      } else if (val >= 17 && val < 19) {
        return "傍晚好";
      } else if (val >= 19 && val < 24) {
        return "晚上好";
      }
    },
  },
  watch: {
    searchs(val) {
      this.show = false;
      this.searchData = [];
      if (val) {
        this.axios({
          method: "get",
          url: "/search",
          params: {
            appkey: this.appkey,
            name: val,
          },
        })
          .then((data) => {
            this.$toast.clear();
            if (data.data.code == 700) {
              this.$toast.fail(data.data.msg);
              this.$router.push({ path: "/login" });
            }
            if (data.data.code == "Q001") {
              this.searchData = data.data.result;
            } else {
              this.$toast({
                message: data.data.msg,
                forbidClick: true,
                duration: 3000,
              });
            }
          })
          .catch((err) => {
            this.$toast.clear();
          });
      } else {
        this.show = true;
      }
    },
  },
  methods: {
    //清空
    loseFocus() {
      this.show = true;
    },
    //切换导航条高亮
    onChange(index) {
      this.current = index;
    },
    //点击轮播图跳转详情页
    homejump(pid) {
      this.$router.push({
        path: "/introduce/:id",
        query: { id: pid },
      });
    },
    purchase() {
      //添加购物车
    },
    //获取用户名
    getMydata() {
      //let tokenString = this.$cookies.get("tokenString");
      let tokenString = localStorage.getItem("tokenString");
      if (!tokenString) {
        this.$toast({
          message: "未登录",
          forbidClick: true,
          duration: 3000,
        });
        return;
      }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "get",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString: tokenString,
        },
      })
        .then((data) => {
          this.$toast.clear();
          if (data.data.code == 700) {
            this.$toast.fail(data.data.msg);
            this.$router.push({ path: "/login" });
          }
          if (data.data.code == "A001") {
            this.userName = data.data.result[0].nickName;
          } else {
            this.$toast({
              message: data.data.msg,
              forbidClick: true,
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
  },
  created() {
    this.$toast.loading({
      message: "加载中...",
      forbidClick: true,
      duration: 0,
    });
    //获取轮播图
    this.axios({
      method: "get",
      url: "/banner",
      params: {
        appkey: this.appkey,
      },
    }).then((data) => {
      this.banner = data.data.result;
    });
    this.axios({
      method: "get",
      url: "/typeProducts",
      params: {
        appkey: this.appkey,
        key: "isHot",
        value: 1,
      },
    }).then((data) => {
      this.$toast.clear();
      this.commodity = data.data.result;
    });
    this.getMydata();
    let d = new Date();
    this.date = d.getHours();
  },
};
</script>

