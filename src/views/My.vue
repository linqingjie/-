<template>
  <div class="My">
    <div
      class="bg"
      :style="{
        '--background': `url(${myData.userBg}) no-repeat center center/100% auto`,
      }"
    >
      <form>
        <input type="file" id="upload-file" ref="file" @change="validateImg" />
      </form>
      <div class="headPortrait">
        <div>
          <img :src="myData.userImg" />
        </div>
        <h1>{{ myData.nickName }}</h1>
        <h2>{{ myData.desc || "这家伙很懒什么也没留下!" }}</h2>
      </div>
    </div>
    <div class="list">
      <div class="myMsg" @click="myJump('/myData')">
        <div class="lf">
          <span><img src="../assets/img/myData.svg" alt="" /></span>个人资料
        </div>
        <div class="rg">
          <img src="../assets/img/right.svg" alt="" />
        </div>
      </div>
      <div class="myMsg" @click="myJump('/myOrder')">
        <div class="lf">
          <span><img src="../assets/img/order.svg" alt="" /></span>我的订单
        </div>
        <div class="rg"><img src="../assets/img/right.svg" alt="" /></div>
      </div>
      <div class="myMsg" @click="myJump('/collection')">
        <div class="lf">
          <span><img src="../assets/img/Collection.svg" alt="" /></span>我的收藏
        </div>
        <div class="rg"><img src="../assets/img/right.svg" alt="" /></div>
      </div>
      <div class="myMsg" @click="myJump('/address')">
        <div class="lf">
          <span><img src="../assets/img/address.svg" alt="" /></span>地址管理
        </div>
        <div class="rg"><img src="../assets/img/right.svg" alt="" /></div>
      </div>
      <div class="myMsg" @click="myJump('/security')">
        <div class="lf">
          <span><img src="../assets/img/security.svg" alt="" /></span>安全中心
        </div>
        <div class="rg"><img src="../assets/img/right.svg" alt="" /></div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/My.less";
export default {
  name: "My",
  data() {
    return {
      myData: {}, //我的信息
      url: "http://www.kangliuyong.com:10002/assets/default.png",
    };
  },
  methods: {
    //获取我的信息
    getMydata() {
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
            this.myData = data.data.result[0];
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
    //跳转页面
    myJump(str) {
      this.$router.push(str);
    },
    //更改背景
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
      var file = this.$refs.file.files[0];
      var type = this.$refs.file.files[0].type.split("/")[1];
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        this.axios({
          method: "post",
          url: "/updateUserBg",
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
            if (data.data.code == "I001") {
              this.myData.userBg = data.data.userBg;
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
            this.$toast({
              message: "上传图片太大!",
              forbidClick: true,
              duration: 3000,
            });
          });
      };
    },
  },
  created() {
    this.getMydata();
  },
};
</script>