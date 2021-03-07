<template>
  <div class="addresss">
    <div class="title">
      <van-nav-bar
        title="地址管理"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </div>
    <Bg>
      <van-empty description="您还未添加地址" v-if="list.length == 0" />
      <van-address-list
        v-model="chosenAddressId"
        :switchable="false"
        :list="list"
        default-tag-text="默认"
        @add="addAddress"
        @edit="edit"
      />
    </Bg>
  </div>
</template>

<script>
import Bg from "../components/Bg";
export default {
  name: "addresss",
  data() {
    return {
      chosenAddressId: "1",
      list: [],
    };
  },
  components: {
    Bg,
  },
  methods: {
    //跳转编辑地址页面
    edit(item) {
      this.$router.push({
        path: "/addedAddress",
        query: { id: item.aid },
      });
    },
    //跳转新增地址页面
    addAddress() {
      this.$router.push({
        name: "AddedAddress",
      });
    },
    //返回上一级
    onClickLeft() {
      this.$router.back();
    },
    //获取地址
    getAddressListData() {
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
              v.isDefault = v.isDefault ? 1 : 0;
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
    this.getAddressListData();
  },
};
</script>

<style lang="less" scoped>
.addresss {
  .title {
    /deep/.van-nav-bar__text,
    .van-nav-bar__title {
      color: #646566;
    }
    /deep/.van-nav-bar__text,
    .van-nav-bar .van-icon {
      color: #007751;
    }
    /deep/.van-nav-bar .van-icon {
      color: #007751;
    }
  }
  /deep/.van-address-list {
    padding: 0 0 20px 0;
  }
  /deep/.van-tag--danger {
    background-color: #007751;
  }
  /deep/.van-button--danger {
    background-color: #007751;
    border-color: #007751;
  }
  /deep/.van-address-item .van-radio__icon--checked .van-icon {
    background-color: #007751;
    border-color: #007751;
  }
}
</style>

