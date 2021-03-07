<template>
  <div class="bg">
    <div class="bkg"></div>
    <div class="conten">
      <slot>还未添加地址</slot>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.bg {
  .bkg {
    height: 100px;
    background-color: #007751;
  }
  .conten {
    margin: 0 15px;
    background-color: white;
    border-radius: 10px 10px;
    position: relative;
    top: -20px;
    padding-top: 20px;
  }
}
</style>