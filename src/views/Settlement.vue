<template>
  <div class="settlement">
    <div class="title">
      <van-nav-bar
        title="确认订单"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </div>
    <div class="box">
      <van-popup
        v-model="show"
        closeable
        position="bottom"
        :style="{ height: 'auto' }"
      >
        <h1>请选择地址</h1>
        <van-address-list
          v-model="chosenAddressId"
          :list="list"
          default-tag-text="默认"
          add-button-text="新增地址"
          @select="toggleId"
          @edit="edit"
          @add="addAddress"
        />
      </van-popup>
    </div>
    <!-- 选择地址 -->
    <div class="selectAddress">
      <div class="select" @click="isShow">选择地址 ＞</div>
      <div class="addressS" v-if="address.id > 0">
        <div class="userMsg">
          <span>{{ address.name }}</span> <span>{{ address.tel }}</span>
          <span v-if="address.isDefault == 1">默认</span>
        </div>
        <div class="addressMsg">{{ address.address }}</div>
      </div>
    </div>
    <!-- 商品详情 -->
    <div class="commodity" :class="{ complete: isComplete }">
      <div class="title">订单信息</div>
      <div class="box">
        <van-card
          v-for="(v, k) in comDatas"
          :key="k"
          :num="v.count"
          :price="v.price"
          :desc="v.enname"
          :title="v.name"
          :thumb="v.large_img"
        >
          <template #tags>
            <van-tag plain type="danger">{{ v.rule }}</van-tag>
          </template>
        </van-card>
      </div>
    </div>
    <div class="completeList" @click="completeList" v-if="id.length > 2">
      {{ !this.isComplete ? "查看完整" : "收起" }}
    </div>
    <div class="total">
      <h2>{{ date.full }} {{ date.date }}</h2>
      <div>
        <span>共 {{ count }} 件</span> <span>合计￥{{ price }}元</span>
      </div>
    </div>
    <div class="btn">
      <van-button
        color="#007751"
        type="primary"
        round
        block
        @click="orderSettlement"
        >立即结算</van-button
      >
    </div>
  </div>
</template>

<script>
import "../assets/less/settlement.less";
import { mapMutations, mapState } from "vuex";
export default {
  name: "settlement",
  data() {
    return {
      comDatas: [], //商品数据
      isComplete: false, //是否显示所有商品
      id: [], //商品id
      date: {}, //订单日期
      count: 0, //商品数量
      price: 0, //商品总金额
      list: [], //所以地址信息
      address: {}, //收货地址
      show: false, //是否显示弹窗
      chosenAddressId: 1,
    };
  },
  computed: {
    ...mapState(["Shoppingcartnum"]),
  },
  methods: {
    ...mapMutations(["changenum"]),
    //新增地址
    addAddress() {
      this.$router.push({
        name: "AddedAddress",
      });
    },
    //结算订单
    orderSettlement() {
      if (Object.keys(this.address).length === 0) {
        this.$toast({
          message: "地址不能为空!",
          forbidClick: true,
          duration: 3000,
        });
        return;
      }
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
        url: "/pay",
        data: {
          appkey: this.appkey,
          tokenString: tokenString,
          sids: JSON.stringify(this.id),
          phone: this.address.phone,
          address: this.address.address,
          receiver: this.address.name,
        },
      })
        .then((data) => {
          this.changenum(this.Shoppingcartnum - this.id.length);

          this.$toast.clear();
          if (data.data.code == 700) {
            this.$toast.fail(data.data.msg);
            this.$router.push({ path: "/login" });
          }
          if (data.data.code == 60000) {
            this.$router.push("/myOrder");
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
    //跳转编辑地址页面
    edit(item) {
      this.$router.push({
        path: "/addedAddress",
        query: { id: item.aid },
      });
    },
    //选择收货地址
    toggleId(item) {
      this.address = item;
    },
    //显示弹窗
    isShow() {
      this.show = true;
    },
    //返回上一级
    onClickLeft() {
      this.$router.back();
    },
    //查询购买商品
    purchase(sids) {
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
        url: "/commitShopcart",
        params: {
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
          if (data.data.code == 50000) {
            data.data.result.forEach((v) => {
              this.count += v.count;
              this.price += v.count * v.price;
            });
            this.comDatas = data.data.result;
            this.getData();
          } else {
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
    //释放完整列表
    completeList() {
      this.isComplete = !this.isComplete;
    },
    //获取当前时间
    getData() {
      //获取时间
      let d = this.comDatas[0].updated_at.split("T");
      this.date.full = d[0];
      this.date.date = d[1].split(".")[0];
    },
    //获取地址
    getAddressListData() {
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
        url: "/findAddress",
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
          if (data.data.code == 20000) {
            data.data.result.forEach((v) => {
              v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;

              if (v.isDefault == 1) {
                this.address = v;
              }
            });
            this.list = data.data.result;
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
    this.id = this.$route.query.id.split("/");
    this.purchase(this.id);
    this.getAddressListData();
  },
};
</script>

<style lang="less" scoped>
</style>