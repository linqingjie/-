<template>
  <div class="myOrder">
    <div class="title">
      <van-nav-bar
        title="我的订单"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </div>
    <Bg>
      <van-tabs v-model="active" swipeable>
        <van-tab title="全部">
          <van-empty description="无订单" v-show="orderMsg.length == 0" />
          <div class="orderDetails" v-for="(i, k) in orderMsg" :key="k">
            <div class="commodity">
              <div class="title">
                <div class="lf">
                  <span>{{ i.oid }}</span>
                </div>
                <div class="rg">
                  <span @click="confirmReceipt(i.oid, i.msg[0].status, k)">{{
                    i.msg[0].status == 1 ? "确认收货" : "已完成"
                  }}</span
                  ><span
                    v-if="i.msg[0].status == 2"
                    @click="removeDate(i.oid, k)"
                    ><img src="../assets/img/remove.svg" alt=""
                  /></span>
                </div>
              </div>
              <div class="box">
                <van-card
                  v-for="(v, g) in i.msg"
                  :key="g"
                  :num="i.count"
                  :price="i.price"
                  :desc="v.enname"
                  :title="v.name"
                  :thumb="v.smallImg"
                >
                  <template #tags>
                    <van-tag plain type="danger">{{ v.rule }}</van-tag>
                  </template>
                </van-card>
              </div>
            </div>
            <div class="total">
              <h2>{{ i.createdAt[0] }} {{ i.createdAt[1] }}</h2>
              <div>
                <span>共 {{ i.count }} 件</span>
                <span>合计￥{{ i.price }}元</span>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="进行中">
          <van-empty description="无进行中订单" v-show="show1" />
          <div class="orderDetails" v-for="(i, k) in orderMsg" :key="k">
            <div v-if="i.msg[0].status == 1">
              <div class="commodity">
                <div class="title">
                  <div class="lf">
                    <span>{{ i.oid }}</span>
                  </div>
                  <div class="rg">
                    <span @click="confirmReceipt(i.oid, i.msg[0].status, k)">{{
                      i.msg[0].status == 1 ? "确认收货" : "已完成"
                    }}</span
                    ><span
                      v-if="i.msg[0].status == 2"
                      @click="removeDate(i.oid, k)"
                      ><img src="../assets/img/remove.svg" alt=""
                    /></span>
                  </div>
                </div>
                <div class="box">
                  <van-card
                    v-for="(v, g) in i.msg"
                    :key="g"
                    :num="i.count"
                    :price="i.price"
                    :desc="v.enname"
                    :title="v.name"
                    :thumb="v.smallImg"
                  >
                    <template #tags>
                      <van-tag plain type="danger">{{ v.rule }}</van-tag>
                    </template>
                  </van-card>
                </div>
              </div>
              <div class="total">
                <h2>{{ i.createdAt[0] }} {{ i.createdAt[1] }}</h2>
                <div>
                  <span>共 {{ i.count }} 件</span>
                  <span>合计￥{{ i.price }}元</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="已完成">
          <van-empty description="无完成订单" v-show="show2" />
          <div class="orderDetails" v-for="(i, k) in orderMsg" :key="k">
            <div v-if="i.msg[0].status == 2">
              <div class="commodity">
                <div class="title">
                  <div class="lf">
                    <span>{{ i.oid }}</span>
                  </div>
                  <div class="rg">
                    <span @click="confirmReceipt(i.oid, i.msg[0].status, k)"
                      >已完成</span
                    ><span
                      v-if="i.msg[0].status == 2"
                      @click="removeDate(i.oid, k)"
                      ><img src="../assets/img/remove.svg" alt=""
                    /></span>
                  </div>
                </div>
                <div class="box">
                  <van-card
                    v-for="(v, g) in i.msg"
                    :key="g"
                    :num="i.count"
                    :price="i.price"
                    :desc="v.enname"
                    :title="v.name"
                    :thumb="v.smallImg"
                  >
                    <template #tags>
                      <van-tag plain type="danger">{{ v.rule }}</van-tag>
                    </template>
                  </van-card>
                </div>
              </div>
              <div class="total">
                <h2>{{ i.createdAt[0] }} {{ i.createdAt[1] }}</h2>
                <div>
                  <span>共 {{ i.count }} 件</span>
                  <span>合计￥{{ i.price }}元</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </Bg>
  </div>
</template>

<script>
import Bg from "../components/Bg";
import "../assets/less/myOrder.less";
export default {
  components: { Bg },
  data() {
    return {
      active: 0, //默认显示全部
      orderNumber: [], //订单号
      orderMsg: [], //商品信息,
      show1: true, //是否有进行中订单
      show2: true, //是否有完成订单
    };
  },
  methods: {
    //确认收货
    confirmReceipt(oid, state, index) {
      if (state == 1) {
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
          method: "post",
          url: "/receive",
          data: {
            appkey: this.appkey,
            tokenString: tokenString,
            oid,
          },
        })
          .then((data) => {
            this.$toast.clear();
            if (data.data.code == 700) {
              this.$toast.fail(data.data.msg);
              this.$router.push({ path: "/login" });
            }
            if (data.data.code == 80000) {
              this.orderMsg[index].msg[0].status = 2;
              for (let v of this.orderMsg) {
                this.show1 = true;
                if (v.msg[0].status == 1) {
                  this.show1 = false;
                }
              }
              this.show2 = false;
              this.orderMsg.forEach((v) => {
                if (v.status == 1) {
                  this.show1 = false;
                }
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
      }
    },
    //删除已完成订单
    removeDate(oid, index) {
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
        method: "post",
        url: "/removeOrder",
        data: {
          appkey: this.appkey,
          tokenString: tokenString,
          oid,
        },
      })
        .then((data) => {
          this.$toast.clear();
          if (data.data.code == 700) {
            this.$toast.fail(data.data.msg);
            this.$router.push({ path: "/login" });
          }
          if (data.data.code == 90000) {
            this.orderMsg.splice(index, 1);
            this.show2 = true;
            this.orderMsg.forEach((v) => {
              if (v.msg[0].status == 2) {
                this.show2 = false;
              }
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
    //返回上一级
    onClickLeft() {
      this.$router.push("/my");
    },
    //获取订单时间
    getData(date) {
      let d = date.split("T");
      let full = d[0];
      let dates = d[1].split(".")[0];
      return [full, dates];
    },
    //获取订单商品
    cmdOrder() {
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
        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString: tokenString,
          status: 0,
        },
      })
        .then((data) => {
          this.$toast.clear();
          if (data.data.code == 700) {
            this.$toast.fail(data.data.msg);
            this.$router.push({ path: "/login" });
          }
          if (data.data.code == 70000) {
            let orderNumber = [];
            data.data.result.forEach((v) => {
              orderNumber.push(v.oid);
            });
            this.orderNumber = [...new Set(orderNumber)];
            //遍历订单号
            for (let i = 0; i < this.orderNumber.length; i++) {
              let obj = {
                oid: this.orderNumber[i],
                count: 0,
                price: 0,
                msg: [],
              };
              data.data.result.forEach((v) => {
                if (v.status == 1) {
                  this.show1 = false;
                }
                if (v.status == 2) {
                  this.show2 = false;
                }
                if (this.orderNumber[i] == v.oid) {
                  let cmdMsg = {};
                  cmdMsg.enname = v.enname;
                  cmdMsg.name = v.name;
                  cmdMsg.smallImg = v.smallImg;
                  cmdMsg.count = v.count;
                  cmdMsg.price = v.price;
                  cmdMsg.rule = v.rule;
                  cmdMsg.status = v.status;
                  cmdMsg.createdAt = v.createdAt;
                  obj.msg.push(cmdMsg);
                  obj.count += v.count;
                  obj.price += v.count * v.price;
                }
                orderNumber.push(v.oid);
                this.count += v.count;
                this.price += v.count * v.price;
              });
              this.orderMsg.push(obj);
              obj.createdAt = this.getData(obj.msg[0].createdAt);
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
  },
  created() {
    this.cmdOrder();
  },
};
</script>

<style lang="less" scoped>
</style>