<template>
  <div class="addresss">
    <div class="title">
      <van-nav-bar
        title="个人资料"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </div>
    <Bg>
      <div class="list">
        <div class="myMsg">
          <div class="lf">头像</div>
          <div class="rg">
            <img :src="personalMsg.userImg" />
            <input
              type="file"
              id="upload-file"
              ref="file"
              @change="validateImg()"
            />
          </div>
        </div>
        <div class="myMsg">
          <div class="lf">用户id</div>
          <div class="rg">{{ personalMsg.userId }}</div>
        </div>
        <div class="myMsg">
          <div class="lf">昵称</div>
          <div class="rg">
            <input type="text" v-model="userName" />
          </div>
        </div>
        <div class="myMsg">
          <div class="lf">简介</div>
          <div class="rg">
            <input type="text" v-model="desc" />
          </div>
        </div>
      </div>
    </Bg>
  </div>
</template>

<script>
// !/.(gif|jpg|jpeg|png|GIF|JPG|bmp)$/.test(file)
import Bg from "../components/Bg";
export default {
  name: "addresss",
  data() {
    return {
      chosenAddressId: "1",
      list: [],
      personalMsg: [],
      userName: "",
      desc: "",
    };
  },
  components: {
    Bg,
  },
  watch: {
    //更改简介
    desc(val) {
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
        url: "/updateDesc",
        data: {
          appkey: this.appkey,
          tokenString: tokenString,
          desc: val,
        },
      })
        .then((data) => {
          this.$toast.clear();
          if (data.data.code == 700) {
            this.$toast.fail(data.data.msg);
            this.$router.push({ path: "/login" });
          }
          if (data.data.code == "D001") {
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
    userName(val) {
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
        url: "/updateNickName",
        data: {
          appkey: this.appkey,
          tokenString: tokenString,
          nickName: val,
        },
      })
        .then((data) => {
          this.$toast.clear();
          if (data.data.code == 700) {
            this.$toast.fail(data.data.msg);
            this.$router.push({ path: "/login" });
          }
          if (data.data.code == "C001") {
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
  methods: {
    //更改头像
    validateImg() {
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
      var fileReader = new FileReader();
      if (this.$refs.file.files.length == 0) {
        this.$toast.clear();
        return;
      }
      var type = this.$refs.file.files[0].type.split("/")[1];

      var file = this.$refs.file.files[0];
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        this.axios({
          method: "post",
          url: "/updateAvatar",
          data: {
            appkey: this.appkey,
            tokenString: tokenString,
            imgType: type,
            serverBase64Img: fileReader.result.split("base64,")[1],
          },
        })
          .then((data) => {
            this.$toast.clear();
            if (data.data.code == 700) {
              this.$toast.fail(data.data.msg);
              this.$router.push({ path: "/login" });
            }
            if (data.data.code == "H001") {
              this.personalMsg.userImg = data.data.userImg;
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
      };
    },
    //返回上一级
    onClickLeft() {
      this.$router.back();
    },
    //获取个人资料
    personalData() {
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
            this.userName = data.data.result[0].nickName;
            this.desc = data.data.result[0].desc || "这个家伙很懒什么也没留下!";
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
    this.personalData();
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
          height: 36px;
          width: 36px;
          border-radius: 50%;
        }
      }
      &:nth-child(1) {
        input {
          opacity: 0;
          filter: alpha(opacity=0);
          height: 100%;
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 9;
        }
      }
      &:nth-child(3),
      &:nth-child(4) {
        input {
          border: none;
          height: 100%;
          width: 100%;
          text-align: right;
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
}
</style>

