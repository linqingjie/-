<template>
  <div class="addresss">
    <div class="title">
      <van-nav-bar
        title="安全中心"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </div>
    <Bg>
      <div class="list">
        <div class="myMsg" @click="modify">
          <div class="lf">修改密码</div>
          <div class="rg"><img src="../assets/img/right.svg" alt="" /></div>
        </div>
        <div class="myMsg" @click="cancellation">
          <div class="lf">注销账号</div>
          <div class="rg"><img src="../assets/img/right.svg" alt="" /></div>
        </div>
      </div>
    </Bg>
    <div class="btn">
      <van-button
        type="primary"
        size="large"
        round
        color="#007751"
        @click="signOut"
        >退出登录</van-button
      >
    </div>
    <van-popup
      v-model="show"
      closeable
      position="bottom"
      :style="{ height: '30%' }"
    >
      <van-form @submit="onSubmit">
        <van-field
          v-model="oldPassword"
          type="password"
          name="oldPassword"
          label="旧密码"
          placeholder="请输入旧密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="新密码"
          placeholder="请输入新密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit"
            >提交</van-button
          >
        </div>
      </van-form>
    </van-popup>
  </div>
</template>

<script>
import Bg from "../components/Bg";
export default {
  name: "addresss",
  data() {
    return {
      show: false,
      password: "", //新密码
      oldPassword: "", //旧密码
    };
  },
  components: {
    Bg,
  },
  methods: {
    //退出登录
    signOut() {
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
        url: "/logout",
        data: {
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
          if (data.data.code == "F001") {
            this.$toast({
              message: data.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            this.$router.push("/login");
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
    //注销账号
    cancellation() {
      this.$dialog
        .confirm({
          title: "注销账号",
          message: "是否确定注销账号,一旦注销无法恢复!",
        })
        .then(() => {
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
            url: "/destroyAccount",
            data: {
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
              if (data.data.code == "G001") {
                this.$toast({
                  message: "账户已注销!",
                  forbidClick: true,
                  duration: 3000,
                });
                this.$router.push("/login");
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
        });
    },
    //开启弹窗
    modify() {
      this.show = true;
    },
    //修改密码
    onSubmit(values) {
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
        url: "/updatePassword",
        data: {
          appkey: this.appkey,
          tokenString: tokenString,
          password: values.password,
          oldPassword: values.oldPassword,
        },
      })
        .then((data) => {
          this.$toast.clear();
          if (data.data.code == 700) {
            this.$toast.fail(data.data.msg);
            this.$router.push({ path: "/login" });
          }
          if (data.data.code == "E001") {
            this.show = false;
            this.$router.push("/login");
            this.$toast({
              message: "请重新登录!",
              forbidClick: true,
              duration: 3000,
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
      this.$router.back();
    },
    //获取个人资料
    personalData() {
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
        url: "/findAccountInfo",
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
          if (data.data.code == "B001") {
            this.personalMsg = data.data.result[0];
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
  created() {},
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
  .list {
    padding-bottom: 20px;
    .myMsg {
      display: flex;
      justify-content: space-between;
      line-height: 40px;
      margin: 0 15px 10px 15px;
      border-bottom: 2px solid #f5f6f7;
      align-items: center;
      &:last-child {
        border-bottom: none;
      }
      .rg {
        position: relative;
        img {
          display: block;
          height: 20px;
          width: 20px;
        }
      }
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
  /deep/.van-form {
    margin-top: 40px;
  }
  /deep/.van-button--info {
    background-color: #007751;
    border-color: #007751;
  }
  /deep/.van-dialog__confirm {
    color: #007751 !important;
  }
  .btn {
    width: 100vw;
    padding: 0 15px;
    position: fixed;
    bottom: 100px;
  }
}
</style>

