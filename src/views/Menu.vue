<template>
  <div class="menu">
    <div class="titles">
      <div class="lf">
        <img src="../assets/img/logo.png" alt="" />
      </div>
      <div class="rg">
        <van-search
          :focus="true"
          v-model="value"
          shape="round"
          placeholder="请输入商品关键词"
          @clear="loseFocus"
        />
      </div>
    </div>
    <div class="tabType" v-show="show">
      <van-tabbar
        v-model="active"
        inactive-color="#646566"
        active-color="#007751"
        :fixed="false"
        :placeholder="false"
      >
        <van-tabbar-item
          v-for="(v, k) in tabbarData"
          :key="k"
          :badge="v.badge > 0 ? v.badge : ''"
          @click="tab(k)"
        >
          <span>{{ v.title }}</span>
          <template #icon="props">
            <img :src="props.active ? v.icon.inactive : v.icon.active" />
          </template>
        </van-tabbar-item>
      </van-tabbar>
    </div>

    <div class="commodity" v-show="show">
      <Coffeelist class="detail" v-for="v in cmdDate" :key="v.pid" :data="v">
      </Coffeelist>
    </div>
    <div class="commodity" v-show="!show">
      <Coffeelist class="detail" v-for="v in searchData" :key="v.pid" :data="v">
      </Coffeelist>
    </div>
    <van-empty
      description="无此商品"
      v-show="(searchData.length == 0) & !show"
    />
  </div>
</template>

<script>
import "../assets/less/menu.less";
import Coffeelist from "../components/Coffeelist";
export default {
  name: "Menu",
  data() {
    return {
      value: "",
      cmdType: [],
      active: 0,
      cmdDate: [],
      show: true,
      searchData: [], //搜索商品数据
    };
  },
  components: {
    Coffeelist,
  },
  watch: {
    value(val) {
      this.show = false;
      this.searchData = [];
      if (val) {
        this.axios({
          method: "get",
          url: "/search",
          params: {
            appkey: this.appkey,
            name: val,
          },
        })
          .then((data) => {
            this.$toast.clear();
            if (data.data.code == 700) {
              this.$toast.fail(data.data.msg);
              this.$router.push({ path: "/login" });
            }
            if (data.data.code == "Q001") {
              this.searchData = data.data.result;
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
      } else {
        this.show = true;
      }
    },
  },
  methods: {
    //清空
    loseFocus() {
      this.show = true;
    },
    //获取商品类型
    getCmdtype() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "get",
        url: "/type",
        params: {
          appkey: this.appkey,
        },
      })
        .then((data) => {
          this.$toast.clear();
          if (data.data.code == 700) {
            this.$toast.fail(data.data.msg);
            this.$router.push({ path: "/login" });
          }
          if (data.data.code == 400) {
            this.cmdType = data.data.result;
            this.tab(this.active);
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
    //获取商品
    tab(k) {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "get",
        url: "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "type",
          value: this.cmdType[k].type,
        },
      })
        .then((data) => {
          this.$toast.clear();
          if (data.data.code == 700) {
            this.$toast.fail(data.data.msg);
            this.$router.push({ path: "/login" });
          }
          if (data.data.code == 500) {
            this.cmdDate = data.data.result;
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
  computed: {
    tabbarData() {
      return [
        //导航栏数据
        {
          title: "拿铁",
          icon: {
            active: require("../assets/img/nt1.svg"),
            inactive: require("../assets/img/nt2.svg"),
          },
        },
        {
          title: "咖啡",
          icon: {
            active: require("../assets/img/kf1.svg"),
            inactive: require("../assets/img/kf2.svg"),
          },
        },
        {
          title: "瑞纳冰",
          icon: {
            active: require("../assets/img/bs1.svg"),
            inactive: require("../assets/img/bs2.svg"),
          },
        },
        {
          title: "水果茶",
          icon: {
            active: require("../assets/img/sg1.svg"),
            inactive: require("../assets/img/sg2.svg"),
          },
        },
      ];
    },
  },
  created() {
    this.getCmdtype();
  },
};
</script>
