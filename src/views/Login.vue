<template>
  <div class="login">
    <Navs />
    <div class="land">
      <h2>欢迎回来!</h2>
      <p>welcome back!</p>
      <!-- 登录 -->
      <van-cell-group>
        <van-field
          v-model="signMsg.phone"
          label="手机号"
          placeholder="请输入手机号(11位)"
        />
        <van-field
          v-model="signMsg.password"
          label="密码"
          :right-icon="bool ? 'closed-eye' : 'eye-o'"
          placeholder="请输入密码(6-16位)"
          :type="bool ? 'password' : 'text'"
          @click-right-icon="isShows"
        />
      </van-cell-group>
      <div class="forget">
        <span @click="findPassword">忘记密码?</span
        ><span @click="isopen">立即注册</span>
      </div>
      <van-button
        @click="signis"
        type="primary"
        size="large"
        round
        color=" #007751"
        >登录</van-button
      >
      <!-- 注册弹窗 -->
      <van-popup v-model="show" position="bottom" closeable>
        <h1>注册</h1>
        <van-cell-group>
          <van-field
            v-model="registerMsg.phone"
            label="手机号"
            placeholder="请输入手机号(11位)"
          />
          <van-field
            v-model="registerMsg.password"
            label="密码"
            :right-icon="bool ? 'closed-eye' : 'eye-o'"
            placeholder="请输入密码(6-16位)"
            :type="bool ? 'password' : 'text'"
            @click-right-icon="isShows"
          />
          <van-field
            v-model="registerMsg.userName"
            label="昵称"
            placeholder="请输入昵称"
          />
        </van-cell-group>
        <van-button
          type="primary"
          size="large"
          round
          color=" #007751"
          @click="registers"
          >注册</van-button
        >
      </van-popup>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import "../assets/less/login.less";
import Navs from "../components/Navs.vue";
import { methods } from "../assets/js/publicMethod";
export default {
  name: "login",
  data() {
    return {
      show: false, //弹窗是否出现
      bool: true, //是否显示密码
      signMsg: {
        //登录信息
        phone: "",
        password: "",
      },
      registerMsg: {
        //注册信息
        phone: "",
        password: "",
        userName: "",
      },
    };
  },
  components: {
    Navs,
  },
  methods: {
    ...mapMutations(["changenum", "changeBoll"]),
    //跳转忘记密码页面
    findPassword() {
      this.$router.push("/findPassword");
    },
    // 是否显示注册弹窗
    isopen() {
      this.show = true;
    },
    // 是否显示密码
    isShows() {
      this.bool = !this.bool;
    },
    //注册事件
    registers() {
      let o = {
        phone: {
          value: this.registerMsg.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机号码格式错误",
        },
        password: {
          value: this.registerMsg.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码首字符为字母,支持字母数字下划线组合",
        },
        userName: {
          value: this.registerMsg.userName,
          reg: /^[\u4e00-\u9fa5A-Za-z0-9]{1,10}$/,
          errorMsg: "昵称支持汉字字母数字组合",
        },
      };
      //验证表单
      if (!methods.verification(o)) {
        return;
      }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "post",
        url: "/register",
        data: {
          appkey: this.appkey,
          nickName: this.registerMsg.userName,
          password: this.registerMsg.password,
          phone: this.registerMsg.phone,
        },
      }).then((data) => {
        this.$toast.clear();
        if (data.data.code == 100) {
          this.$toast.success({
            message: data.data.msg,
            forbidClick: true,
            duration: 1500,
          });
          this.show = false;
          for (let k in this.registerMsg) {
            this.registerMsg[k] = "";
          }
        } else if (data.data.code == 102) {
          this.$toast.success({
            message: data.data.msg,
            forbidClick: true,
            duration: 1500,
          });
        }
      });
    },
    //登录
    signis() {
      let o = {
        phone: {
          value: this.signMsg.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机号码格式错误",
        },
        password: {
          value: this.signMsg.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码首字符为字母,支持字母数字下划线组合",
        },
      };
      if (!methods.verification(o)) {
        return;
      }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "post",
        url: "/login",
        data: {
          appkey: this.appkey,
          password: this.signMsg.password,
          phone: this.signMsg.phone,
        },
      }).then((data) => {
        this.$toast.clear();
        if (data.data.code == 200) {
          this.$toast.success({
            message: data.data.msg,
            forbidClick: true,
            duration: 1500,
          });
          localStorage.setItem("tokenString", data.data.token);
          this.changenum(0);
          this.changeBoll(false);
          this.$router.push({ path: "/" });
        } else if (data.data.code == 201) {
          this.$toast.fail({
            message: data.data.msg,
            forbidClick: true,
            duration: 1500,
          });
        } else if (data.data.code == 202) {
          this.$toast.fail({
            message: data.data.msg,
            forbidClick: true,
            duration: 1500,
          });
        }
      });
    },
  },
};
</script>
