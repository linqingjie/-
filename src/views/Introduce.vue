<template>
  <div class="introduce">
    <div class="nav">
      <van-nav-bar
        title="商品详情"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </div>
    <div class="bkg">
      <img :src="Commodity_data.large_img" alt="" />
    </div>
    <!-- 商品详情 -->
    <div class="message">
      <div class="content">
        <div class="titler">
          <div class="left">
            <h1>{{ Commodity_data.name }}</h1>
            <span>{{ Commodity_data.enname }}</span>
          </div>
          <div class="right">
            <p>￥{{ Commodity_data.price }}</p>
            <p>{{ Commodity_data.type_desc }}</p>
          </div>
        </div>
        <div class="flavor">
          <div class="temperature" v-for="(v, k) in flavor" :key="k">
            <div class="box1">{{ v.name }}</div>
            <div class="box2">
              <span
                :class="{ select: v.currentIndex === j }"
                @click="Select(v, j)"
                v-for="(i, j) in v.data"
                :key="j"
                >{{ i }}</span
              >
            </div>
          </div>
        </div>
        <!-- 商品数量 -->
        <div class="number">
          <div class="fl">
            <span>选择数量</span>
          </div>
          <div class="rg">
            <van-stepper
              v-model="number"
              theme="round"
              button-size="22"
              disable-input
            />
          </div>
        </div>
        <div class="cmd-details">
          <div class="cmd-title">商品描述</div>
          <div class="cmd-content">
            <p v-for="(v, k) in text" :key="k">{{ k + 1 }}、{{ v }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品导航栏 -->
    <div>
      <van-goods-action>
        <van-goods-action-icon
          icon="shopping-cart"
          text="购物车"
          color="#646566"
          :badge="Shoppingcartnum <= 0 ? '' : Shoppingcartnum"
          @click="Jump"
        />
        <van-goods-action-icon
          icon="like"
          :text="bool ? '已收藏' : '收藏'"
          :color="bool ? '#ee3f4d' : '#646566'"
          @click="collection"
        />
        <van-goods-action-button
          color="#61ac85"
          type="warning"
          text="加入购物车"
          @click="addshopping"
        />
        <van-goods-action-button
          color="#007751"
          type="danger"
          text="立即购买"
          @click="settlement"
        />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
import "../assets/less/introduce.less";
import { mapMutations, mapState } from "vuex";
export default {
  name: "introduce",
  data() {
    return {
      flavor: [
        //商品口味数据
      ],
      number: 1, //商品数量
      text: [],
      Commodity_data: {},
      bool: false, //判断是否收藏
      text: [], //商品介绍
    };
  },
  computed: {
    ...mapState(["Shoppingcartnum", "isLoad"]),
  },
  methods: {
    //跳转结算页面
    settlement() {
      let tokenString = localStorage.getItem("tokenString");
      if (!tokenString) {
        return this.$router.push({ path: "/login" });
      }
      let id = this.$route.query.id;
      let rule = [];
      this.flavor.forEach((v) => {
        rule.push(v.data[v.currentIndex]);
      });
      rule = rule.join("/");
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "post",
        url: "/addShopcart",
        data: {
          appkey: this.appkey,
          pid: id,
          rule,
          count: this.number,
          tokenString: tokenString,
        },
      })
        .then((data) => {
          this.$toast.clear();
          if (data.data.code == 700) {
            this.$toast.fail(data.data.msg);
            this.$router.push({ path: "/login" });
          }
          if (data.data.code == 3000) {
            this.$router.push({
              path: "/settlement",
              query: { id: data.data.sid },
            });
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
    //收藏或取消
    collection() {
      let tokenString = localStorage.getItem("tokenString");
      let id = this.$route.query.id;
      if (!tokenString) {
        return this.$router.push({ path: "/login" });
      }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      if (!this.bool) {
        //收藏
        this.axios({
          method: "post",
          url: "/like",
          data: {
            appkey: this.appkey,
            pid: id,
            tokenString: tokenString,
          },
        })
          .then((data) => {
            this.$toast.clear();
            if (data.data.code == 700) {
              this.$toast.fail(data.data.msg);
              this.$router.push({ path: "/login" });
            }
            if (data.data.code == 800) {
              this.$toast.success(data.data.msg);
              this.bool = true;
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
        //取消收藏
        this.axios({
          method: "post",
          url: "/notlike",
          data: {
            appkey: this.appkey,
            pid: id,
            tokenString: tokenString,
          },
        }).then((data) => {
          if (data.data.code == 900) {
            this.$toast.success(data.data.msg);
            this.bool = !this.bool;
          }
        });
      }
    },
    //判断商品是否被收藏
    judeg() {
      let tokenString = localStorage.getItem("tokenString");
      let id = this.$route.query.id;
      if (tokenString) {
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });
        this.axios({
          method: "get",
          url: "/findlike",
          params: {
            appkey: this.appkey,
            pid: id,
            tokenString: tokenString,
          },
        }).then((data) => {
          this.$toast.clear();
          if (data.data.code == 700) {
            return;
          }
          if (data.data.code === 1000) {
            if (data.data.result.length > 0) {
              this.bool = true;
            }
          }
        });
      } else {
        return;
      }
    },
    //返回上一级
    onClickLeft() {
      this.$router.back();
    },
    // 选中商品下标
    Select(v, j) {
      if (v.currentIndex === j) {
        return;
      }
      v.currentIndex = j;
    },
    //添加购物车
    addshopping() {
      let tokenString = localStorage.getItem("tokenString");
      if (!tokenString) {
        return this.$router.push({ path: "/login" });
      }
      let id = this.$route.query.id;
      let rule = [];
      this.flavor.forEach((v) => {
        rule.push(v.data[v.currentIndex]);
      });
      rule = rule.join("/");
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "post",
        url: "/addShopcart",
        data: {
          appkey: this.appkey,
          pid: id,
          rule,
          count: this.number,
          tokenString: tokenString,
        },
      })
        .then((data) => {
          this.$toast.clear();
          if (data.data.code == 700) {
            this.$toast.fail(data.data.msg);
            this.$router.push({ path: "/login" });
          }
          if (data.data.code == 3000) {
            this.$toast.success(data.data.msg);
            if (data.data.status == 1) {
              this.changenum(this.Shoppingcartnum + 1);
            }
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
    ...mapMutations(["changenum", "changeBoll"]),
    //跳转购物车
    Jump() {
      this.$router.push({
        name: "Shopbag",
      });
    },
    //获取购物车数量
    Shoppingnumber() {
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
  created() {
    this.judeg();
    this.Shoppingnumber();
    this.$toast.loading({
      message: "加载中...",
      forbidClick: true,
      duration: 0,
    });
    let id = this.$route.query.id;
    this.axios({
      method: "get",
      url: "/productDetail",
      params: {
        appkey: this.appkey,
        pid: id,
      },
    }).then((data) => {
      if (data.data.code == 600) {
        this.Commodity_data = data.data.result[0];
        this.text = data.data.result[0].desc.split(/\n/);
        let rules = ["tem", "sugar", "cream", "milk"];
        let Specifications = [];
        rules.forEach((v) => {
          if (!this.Commodity_data[v]) {
            return;
          }
          let rulesText = this.Commodity_data[v].split("/");
          let obj = {
            name: this.Commodity_data[v + "_desc"],
            data: rulesText,
            currentIndex: 0,
          };
          Specifications.push(obj);
        });
        this.flavor = Specifications;
        this.$toast.clear();
      }
    });
  },
};
</script>
