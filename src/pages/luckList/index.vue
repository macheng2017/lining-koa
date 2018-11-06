<template lang="pug">
.container
  img.teachOne(src="../../../public/img/teach1.png" height="500rpx")
  img.teachTwo(src="../../../public/img/teach2.png")
  img(src="../../../public/img/teach3.png")
  img(src="../../../public/img/teach4.png")
  img(src="../../../public/img/teach5.png")


</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {}
  },
  components: {},
  computed: {
    ...mapState(['imageCDN', 'defImg'])
  },
  methods: {},
  onPullDownRefresh() {
    this.getList(true)
  }
}
</script>

<style lang="sass" scoped>
  img
    width: 800rpx
    height: 2000rpx
    margin: 0 auto
  .teachOne
    width: 750rpx
    height: 800rpx
  .teachTwo

    height: 2000rpx
  .teachThree

    height: 2000rpx
  .teachFour

    height: 2000rpx
  .teachFive

    height: 2000rpx

</style>
