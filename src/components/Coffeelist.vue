<template>
  <div class="details">
    <div class="imgs" @click="details(data.pid)">
      <div class="sign" v-if="data.isHot == 1">hot</div>
      <img :src="data.smallImg" />
    </div>
    <h1>{{ data.name }}</h1>
    <h6>{{ data.enname }}</h6>
    <div class="prie">
      <span
        >￥<span>{{ data.price }}</span
        >元/杯</span
      >
      <slot name="insert"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ["data"],
  methods: {
    //打开商品详情页
    details(id) {
      this.$router.push({
        path: "/introduce/:id",
        query: { id: id },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.details {
  margin-bottom: 10px;
  border-radius: 10px;
  background-color: white;
  padding: 10px;
  .imgs {
    width: 100%;
    position: relative;
    .sign {
      position: absolute;
      left: 5px;
      top: 0px;
      padding: 2px;
      color: white;
      background-color: #007751;
    }
    img {
      display: block;
      width: 100%;
      border-radius: 5px;
    }
  }
  .prie {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    button {
      background-color: #007751;
      color: white;
      font-weight: bold;
      border: none;
      padding: 8px;
      border-radius: 5px;
    }
    span {
      line-height: 25px;
      font-size: 12px;
      margin-top: 5px;
      font-weight: bold;
      span {
        color: #007751;
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
  h1 {
    margin-top: 10px;
    line-height: 20px;
    font-size: 16px;
  }
  h6 {
    color: #9f9f9f;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>