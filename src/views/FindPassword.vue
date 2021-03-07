<template>
  <div class="findPassword">
    <Navs />
    <div class="land">
      <h2>找回密码</h2>
      <p>Find the password</p>
      <!-- 登录 -->
      <van-cell-group>
        <van-field
          v-model="FindMsg.mailbox"
          label="邮箱"
          placeholder="请输入邮箱"
        />
        <van-field
          v-model="FindMsg.verificationCode"
          center
          clearable
          label="验证码"
          placeholder="请输入验证码(6个字符)"
        >
          <template #button>
            <van-button @click="Verification" size="small" type="primary"
              >发送验证码</van-button
            >
          </template>
        </van-field>
      </van-cell-group>
      <div class="forget">
        <span></span><span @click="login">已有账号,立即登录</span>
      </div>
      <van-button
        type="primary"
        size="large"
        round
        color=" #007751"
        @click="isopen"
        >下一步</van-button
      >
      <!-- 修改密码弹窗 -->
      <van-popup v-model="show" position="bottom" closeable>
        <h1>修改密码</h1>
        <van-cell-group>
          <van-field
            v-model="registerMsg.phone"
            label="手机号"
            placeholder="请输入手机号(11位)"
          />
          <van-field
            v-model="registerMsg.password"
            label="新密码"
            :right-icon="bool ? 'closed-eye' : 'eye-o'"
            placeholder="请输入密码(6-16位)"
            :type="bool ? 'password' : 'text'"
            @click-right-icon="isShows"
          />
        </van-cell-group>
        <van-button
          type="primary"
          size="large"
          round
          color=" #007751"
          @click="reserve"
          >确定</van-button
        >
      </van-popup>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import "../assets/less/findPassword.less";
import Navs from "../components/Navs.vue";
import { methods } from "../assets/js/publicMethod";
export default {
  name: "login",
  data() {
    return {
      show: false, //弹窗是否出现
      bool: true, //是否显示密码
      FindMsg: {
        //邮箱验证
        mailbox: "",
        verificationCode: "",
      },
      registerMsg: {
        //找回密码
        phone: "",
        password: "",
      },
    };
  },
  components: {
    Navs,
  },
  methods: {
    ...mapMutations(["changenum", "changeBoll"]),
    //   是否显示注册弹窗
    isopen() {
      if (!this.FindMsg.verificationCode && !this.FindMsg.mailbox) {
        this.$toast.fail({
          message: "验证码和邮箱不能为空!",
          forbidClick: true,
          duration: 1500,
        });
        return;
      }
      let o = {
        mailbox: {
          value: this.FindMsg.mailbox,
          reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
          errorMsg: "邮箱码格式错误",
        },
        verificationCode: {
          value: this.FindMsg.verificationCode,
          reg: /^\d{6}$/,
          errorMsg: "验证码需要填写6位数字",
        },
      };
      if (!methods.verification(o)) {
        return;
      }
      this.axios({
        method: "post",
        url: "/checkValidCode",
        data: {
          appkey: this.appkey,
          validCode: this.FindMsg.verificationCode,
        },
      }).then((data) => {
        this.$toast.clear();
        if (data.data.code == "K001") {
          this.$toast.success({
            message: data.data.msg,
            forbidClick: true,
            duration: 1500,
          });
          this.show = true;
        } else if (data.data.code == "K002") {
          this.$toast.fail({
            message: data.data.msg,
            forbidClick: true,
            duration: 1500,
          });
        }
      });
    },
    // 是否显示密码
    isShows() {
      this.bool = !this.bool;
    },
    //跳转登录页面
    login() {
      this.$router.push("/login");
    },
    //获取验证码
    Verification() {
      let o = {
        mailbox: {
          value: this.FindMsg.mailbox,
          reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
          errorMsg: "邮箱码格式错误",
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
        url: "/emailValidCode",
        data: {
          appkey: this.appkey,
          email: this.FindMsg.mailbox,
        },
      }).then((data) => {
        this.$toast.clear();
        if (data.data.code == "J001") {
          this.$toast.success({
            message: data.data.msg,
            forbidClick: true,
            duration: 1500,
          });
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
    //修改密码
    reserve() {
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
        url: "/retrievePassword",
        data: {
          appkey: this.appkey,
          password: this.registerMsg.password,
          phone: this.registerMsg.phone,
        },
      }).then((data) => {
        this.$toast.clear();
        if (data.data.code == "L001") {
          this.$toast.success({
            message: data.data.msg,
            forbidClick: true,
            duration: 1500,
          });
          this.show = false;
          this.registerMsg.password = "";
          this.registerMsg.phone = "";
        } else if (data.data.code == "L004") {
          this.$toast.success({
            message: data.data.msg,
            forbidClick: true,
            duration: 1500,
          });
        } else if (data.data.code == "L003") {
          this.$toast.success({
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
