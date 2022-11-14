<template>
  <div class="shopbag">
    <div class="title">
      <van-nav-bar
        title="购物车"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      >
        <template #right>
          <div @click="onClickRight" v-show="cmdDatas.length > 0">
            {{ !change ? "编辑" : "完成" }}
          </div>
        </template>
      </van-nav-bar>
    </div>

    <van-list
      v-show="cmdDatas.length > 0"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      offset="100"
    >
      <div class="box" v-for="(v, k) in cmdDatas" :key="v.sid">
        <van-swipe-cell :disabled="change">
          <div class="lf">
            <van-checkbox v-model="v.bool" @click="isChoice"></van-checkbox>
          </div>
          <div class="rg">
            <van-card
              :price="v.price"
              :desc="v.enname"
              :title="v.name"
              :thumb="v.small_img"
            >
              <template #tags>
                <van-tag plain type="danger">{{ v.rule }}</van-tag>
              </template>
              <template #footer>
                <van-stepper
                  v-model="v.count"
                  theme="round"
                  button-size="22"
                  disable-input
                  @change="modifyNumber(v.count, v.sid)"
                />
              </template>
            </van-card>
          </div>
          <template #right>
            <van-button
              square
              type="danger"
              text="删除"
              @click="removeData([v.sid], k)"
            />
          </template>
        </van-swipe-cell>
      </div>
    </van-list>
    <div class="order" v-show="cmdDatas.length > 0">
      <van-submit-bar
        v-show="!change"
        :price="amount"
        button-text="提交订单"
        button-color="#007751"
        @submit="settlement"
      >
        <van-checkbox v-model="checked" @click="checkAll">全选</van-checkbox>
      </van-submit-bar>

      <van-submit-bar
        v-show="change"
        button-text="删除选择"
        button-color="#EE0A24"
        @submit="removeDatas()"
      >
        <van-checkbox v-model="checked" @click="checkAll">全选</van-checkbox>
      </van-submit-bar>
    </div>
    <div v-show="cmdDatas.length == 0">
      <van-empty description="购物车空空如也，赶紧去逛一逛！">
        <div class="guang" @click="goHome">逛一逛</div>
      </van-empty>
    </div>
  </div>
</template>

<script>
import "../assets/less/shopbag.less";
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      result: [],
      checked: false, //全选
      change: false, //编辑或删除状态
      wholeCmdDatas: [], //购物车全部数据
      cmdDatas: [], //购物车显示数据
      startIndex: 0, //开始剪切下标
      endIndex: 5, //结束剪切下标
      loading: false, //异步操作并更新数据
      finished: false, //数据全部加载完成
      amount: 0, //商品总金额
    };
  },
  computed: {
    ...mapState(["Shoppingcartnum"]),
  },
  methods: {
    ...mapMutations(["changenum"]),
    //跳转结算页面
    settlement() {
      let check = []; //记录勾选的商品
      if (this.checked) {
        this.wholeCmdDatas.forEach((v) => {
          if (v.bool) {
            check.push(v.sid);
          }
        });
      } else {
        this.cmdDatas.forEach((v) => {
          if (v.bool) {
            check.push(v.sid);
          }
        });
      }

      let str = check.join("/");
      if (check.length > 0) {
        this.$router.push({
          path: "/settlement",
          query: { id: str },
        });
      } else {
        this.$toast({
          message: "未勾选商品!",
          forbidClick: true,
          duration: 1500,
        });
      }
    },
    //逛一逛
    goHome() {
      this.$router.push({
        path: "/",
      });
    },
    //修改商品数量
    modifyNumber(count, sid) {
      let tokenString = localStorage.getItem("tokenString");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      this.axios({
        method: "post",
        url: "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString: tokenString,
          sid,
          count,
        },
      })
        .then((data) => {
          this.$toast.clear();
          if (data.data.code == 700) {
            this.$toast.fail(data.data.msg);
            this.$router.push({ path: "/login" });
          }
          if (data.data.code == 6000) {
            this.TotalAmount();
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //删除多个商品数据
    removeDatas() {
      //let tokenString = this.$cookies.get("tokenString");
      let tokenString = localStorage.getItem("tokenString");
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      let sids = [];
      if (!this.checked) {
        this.cmdDatas.forEach((v) => {
          if (v.bool) {
            sids.push(v.sid);
          }
        });
      } else {
        this.wholeCmdDatas.forEach((v) => {
          sids.push(v.sid);
        });
      }
      if (sids.length > 0) {
        this.axios({
          method: "post",
          url: "/removeShopcart",
          data: {
            appkey: this.appkey,
            tokenString: tokenString,
            sids: JSON.stringify(sids),
          },
        })
          .then((data) => {
            this.$toast.clear();
            if (data.data.code == 700) {
              this.$toast.fail(data.data.msg);
              this.$router.push({ path: "/login" });
            }
            if (data.data.code == 7000) {
              if (!this.checked) {
                for (let i = 0; i < this.cmdDatas.length; i++) {
                  sids.forEach((v) => {
                    if (v == this.cmdDatas[i].sid) {
                      this.cmdDatas.splice(i, 1);
                      this.changenum(this.Shoppingcartnum - 1);
                      return;
                    }
                  });
                }
                this.TotalAmount();
                // 判断删除完商品还有没有未加载的
                if (this.startIndex < this.wholeCmdDatas.length) {
                  let data = this.wholeCmdDatas.slice(
                    this.startIndex,
                    this.startIndex + sids.length
                  );
                  if (this.checked) {
                    data.forEach((v) => {
                      v.bool = true;
                      return v;
                    });
                  }
                  this.cmdDatas.push(...data);
                  this.startIndex += sids.length;
                }
              } else {
                this.cmdDatas = [];
                this.changenum(0);
              }
              this.$toast({
                message: data.data.msg,
                forbidClick: true,
                duration: 1500,
              });
            }
          })
          .catch((err) => {
            this.$toast.clear();
          });
      } else {
        this.$toast.clear();
      }
    },
    //删除单个商品数据
    removeData(sids, index) {
      //let tokenString = this.$cookies.get("tokenString");
      let tokenString = localStorage.getItem("tokenString");
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "post",
        url: "/removeShopcart",
        data: {
          appkey: this.appkey,
          tokenString: tokenString,
          sids: JSON.stringify(sids),
        },
      })
        .then((data) => {
          this.$toast.clear();
          if (data.data.code == 700) {
            this.$toast.fail(data.data.msg);
            this.$router.push({ path: "/login" });
          }
          if (data.data.code == 7000) {
            this.cmdDatas.splice(index, 1);
            this.changenum(this.Shoppingcartnum - 1);
            this.isChoice();
            //判断删除完商品还有没有未加载的
            if (this.startIndex < this.wholeCmdDatas.length) {
              let data = this.wholeCmdDatas.slice(
                this.startIndex,
                this.startIndex + 1
              );
              if (this.checked) {
                data.forEach((v) => {
                  v.bool = true;
                  return v;
                });
              }
              this.cmdDatas.push(...data);
              ++this.startIndex;
            }
            this.$toast({
              message: data.data.msg,
              forbidClick: true,
              duration: 1500,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //返回上一级
    onClickLeft() {
      this.$router.back();
    },
    //切换编辑状态
    onClickRight() {
      this.change = !this.change;
    },
    //全选反选
    checkAll() {
      this.cmdDatas.forEach((v) => {
        v.bool = this.checked;
      });
      this.wholeCmdDatas.forEach((v) => {
        v.bool = this.checked;
      });
      let amount = 0;
      for (let i = 0; i < this.wholeCmdDatas.length; i++) {
        if (this.wholeCmdDatas[i].bool) {
          amount += this.wholeCmdDatas[i].count * this.wholeCmdDatas[i].price;
        }
      }
      this.amount = amount * 100;
    },
    //单选,判断商品勾选是否全选
    isChoice() {
      this.TotalAmount();
      for (let i = 0; i < this.cmdDatas.length; i++) {
        if (!this.cmdDatas[i].bool) {
          this.checked = false;
          return;
        }
      }
      this.checked = true;
    },
    //获取购物车数据
    cmdData() {
      //let tokenString = this.$cookies.get("tokenString");
      let tokenString = localStorage.getItem("tokenString");
      if (!tokenString) {
        return this.$router.push({ path: "/login" });
      }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "get",
        url: "/findAllShopcart",
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
          if (data.data.code == 5000) {
            data.data.result.forEach((element) => {
              element.bool = false;
            });
            this.wholeCmdDatas = data.data.result;
            this.cmdDatas = this.wholeCmdDatas.slice(
              this.startIndex,
              this.startIndex + this.endIndex
            );
            this.startIndex += this.endIndex;
            if (this.wholeCmdDatas.length < this.cmdDatas) {
              this.finished = true;
              return;
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
    //数据懒加载
    onLoad() {
      setTimeout(() => {
        let data = this.wholeCmdDatas.slice(
          this.startIndex,
          this.startIndex + this.endIndex
        );
        if (this.checked) {
          data.forEach((v) => {
            v.bool = true;
            return v;
          });
        }
        this.cmdDatas.push(...data);
        this.startIndex += this.endIndex;

        // 数据全部加载完成
        if (data.length < this.endIndex) {
          this.finished = true;
          return;
        }
        // 加载状态结束
        this.loading = false;
      }, 1000);
    },
    //计算商品总金额
    TotalAmount() {
      let amount = 0;
      for (let i = 0; i < this.cmdDatas.length; i++) {
        if (this.cmdDatas[i].bool) {
          amount += this.cmdDatas[i].count * this.cmdDatas[i].price;
        }
      }
      this.amount = amount * 100;
    },
    handleFn(){}
  },
  created() {
    this.cmdData();
  },
};
</script>
