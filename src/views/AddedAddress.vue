<template>
  <div class="addedAddress">
    <div class="title">
      <van-nav-bar
        :title="!!id ? '编辑地址' : '新增地址'"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </div>
    <van-address-edit
      :save-button-text="!!id ? '保存修改' : '保存地址'"
      :area-list="areaList"
      :show-delete="!!id"
      show-postal
      show-set-default
      show-search-result
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      :address-info="item"
      @delete="onDelete(id)"
    />
  </div>
</template>

<script>
import areaList from "../assets/js/area";
export default {
  name: "addedAddress",
  data() {
    return {
      areaList,
      item: {},
      id: "",
    };
  },
  methods: {
    //返回上一级
    onClickLeft() {
      this.$router.back();
    },
    //删除地址
    onDelete(id) {
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
        method: "POST",
        url: "/deleteAddress",
        data: {
          appkey: this.appkey,
          tokenString: tokenString,
          aid: id,
        },
      })
        .then((data) => {
          this.$toast.clear();
          if (data.data.code == 700) {
            this.$toast.fail(data.data.msg);
            this.$router.push({ path: "/login" });
          }
          if (data.data.code == 10000) {
            this.$router.push({
              name: "Address",
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
    //添加地址或修改信息
    onSave(value) {
      let Interface = "";
      if (this.id) {
        let bool = false;
        Interface = "/editAddress";
        for (let key in value) {
          if (value[key] != this.item[key]) {
            bool = true;
          }
        }

        if (!bool) {
          return;
        }
        value.aid = this.id;
      } else {
        Interface = "/addAddress";
      }
      let content = { ...value };
      let tokenString = localStorage.getItem("tokenString");
      if (!tokenString) {
        return this.$router.push({ path: "/login" });
      }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      content.isDefault = content.isDefault ? 1 : 0;
      this.axios({
        method: "POST",
        url: Interface,
        data: {
          appkey: this.appkey,
          tokenString: tokenString,
          ...content,
        },
      })
        .then((data) => {
          this.$toast.clear();
          if (data.data.code == 700) {
            this.$toast.fail(data.data.msg);
            this.$router.push({ path: "/login" });
          }
          if (data.data.code == 9000 || data.data.code == 30000) {
            this.$router.back();
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
    //查询商品信息
    queryData(id) {
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
        url: "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString: tokenString,
          aid: id,
        },
      })
        .then((data) => {
          this.$toast.clear();
          if (data.data.code == 700) {
            this.$toast.fail(data.data.msg);
            this.$router.push({ path: "/login" });
          }
          if (data.data.code == 40000) {
            data.data.result[0].isDefault = !!data.data.result[0].isDefault;
            this.item = data.data.result[0];
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
    this.id = this.$route.query.id;
    if (this.id) {
      this.queryData(this.id);
    }
  },
};
</script>

<style lang="less" scoped>
.addedAddress {
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
  /deep/.van-button--danger {
    border-color: #007751;
    background-color: #007751;
  }
  /deep/.van-switch--on {
    background-color: #007751;
  }
}
</style>

