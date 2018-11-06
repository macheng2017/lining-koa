<template lang='pug'>
.container
  h2.title v1.04 本次更新
    p.context 1. 解决搜索内容与选择器之间冲突
    p.context 2. 忽略搜索中的大小写
    p.context 3. 添加复制按钮
    p.context 4. 简化复制的内容,提供款号,尺码,库存仓库编号
    p.context 5. 商品标题上添加款号
    p.context 6. 首页李宁专卖改为,袜妖
    p.context 7. 下面的tab改为教你怎么淘
  h2.title v1.03 本次更新
    p.context 1. 修改男女尺码选择数据,让尺码显示的更完整
    p.context 2. 增加选择引导组件
    p.context 3. 修改了一些按钮的外观
  h2.title v1.02 本次更新
    p.context 1. 小程序端复制信息,添加款号与库存项
    p.context 2. 在商品card页面显示库存信息,将库存为0的商品显示为售罄
</template>

<script>

export default {
  data() {
    return {
      userInfo: {}
    }
  },
  methods: {}
}
</script>

<style lang="sass" scoped>
   .title,.context
      font-size: 12px




</style>
