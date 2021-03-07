<template>
  <div class="addresss">
    <div class="title">
      <van-nav-bar
        title="我的收藏"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </div>
    <Bg>
      <van-empty
        description="还未添加收藏"
        v-show="myCollectionData.length == 0"
      />
      <div class="cmd">
        <div class="box" v-for="(v, k) in myCollectionData" :key="k">
          <div class="lf" @click="homejump(v.pid)">
            <img :src="v.smallImg" />
          </div>
          <div class="rg">
            <h1>{{ v.name }}</h1>
            <div class="text">
              <p>{{ v.enname }}</p>
              <p>类型:{{ v.typeDesc }}</p>
              <div class="type-price">
                <div class="lf">
                  ￥<span>{{ v.price }}</span> 元/杯
                </div>
                <div class="rg" @click.stop="remove(v.pid, k)">
                  <span><img src="../assets/img/remove.svg" alt="" /></span>
                </div>
              </div>
            </div>
            <div class="hot" v-if="v.isHot == 1">hot</div>
          </div>
        </div>
      </div>
    </Bg>
  </div>
</template>

<script>
import Bg from "../components/Bg";
export default {
  name: "addresss",
  data() {
    return {
      myCollectionData: [], //收藏商品数据
    };
  },
  components: {
    Bg,
  },
  methods: {
    //点击图片跳转详情页
    homejump(pid) {
      this.$router.push({
        path: "/introduce/:id",
        query: { id: pid },
      });
    },
    //返回上一级
    onClickLeft() {
      this.$router.back();
    },
    //获取我的收藏
    myCollection() {
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
        url: "/findAllLike",
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
          if (data.data.code == 2000) {
            this.myCollectionData = data.data.result;
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
    //删除收藏
    remove(pid, index) {
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
        url: "/notlike",
        data: {
          appkey: this.appkey,
          tokenString: tokenString,
          pid,
        },
      })
        .then((data) => {
          this.$toast.clear();
          if (data.data.code == 700) {
            this.$toast.fail(data.data.msg);
            this.$router.push({ path: "/login" });
          }
          if (data.data.code == 900) {
            this.myCollectionData.splice(index, 1);
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
    this.myCollection();
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
  .cmd {
    .box {
      margin: 0 15px 10px 15px;
      padding: 10px 10px;
      height: 100px;
      display: flex;
      box-sizing: content-box;
      box-shadow: 0 1px 4px #e8e8e8;
      background-color: #f7f7f7;
      border-radius: 10px;
      .lf {
        flex: 5;
        width: 100px;
        img {
          height: 100px;
          width: 100px;
          display: block;
          border-radius: 10px;
        }
      }
      .rg {
        padding-left: 10px;
        position: relative;
        h1 {
          height: 30px;
          font-size: 18px;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        p {
          width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        p:nth-child(2) {
          padding: 10px 0;
          font-size: 14px;
          font-weight: bold;
        }
        .type-price {
          display: flex;
          justify-content: space-between;
          .lf {
            flex: 10;
            width: 60px;
            line-height: 26px;
            font-size: 14px;
            span {
              font-size: 20px;
              font-weight: bold;
              color: #007751;
            }
          }
          .rg {
            flex: 2;
            span {
              height: 26px;
              display: block;
              img {
                height: 26px;
                transform: translateY(-5px);
              }
            }
          }
        }
        .hot {
          position: absolute;
          top: -10px;
          right: 0px;
          padding: 10px 5px 5px 5px;
          color: white;
          background-color: #007751;
          border-radius: 0 0 5px 5px;
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

