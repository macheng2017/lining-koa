<template lang='pug'>
.container
  .doc-title.zan-hairline--bottom 选鞋步骤
      .zan-panel
        .zan-cell
          .zan-cell__bd
            ZanSteps(v-bind="{ steps: steps }")
  .selectBtn(v-for='(item,inex) in items' :key='index')
    button.zan-btn.zan-btn--large(@click="setShoeStyle(item.value)") {{item.style}}
</template>

<script>
import { get } from '@/utils'
import ZanSteps from 'mpvue-zanui/src/components/zan/steps'

export default {
  data() {
    return {
      userInfo: {},
      items: [
        { style: '篮球鞋', value: '篮球' },
        { style: '慢跑鞋', value: '文化' }
      ],
      steps: [
        {
          current: false,
          done: true,
          text: '1.选择性别',
          desc: '10.01'
        },
        {
          done: true,
          current: true,
          text: '2.选择鞋类',
          desc: '10.02'
        },
        {
          done: false,
          current: false,
          text: '3.选择尺码'
        },
        {
          done: false,
          current: false,
          text: '4.复制到淘宝备注'
        }
      ],
      shoesData: {}
    }
  },
  components: {
    ZanSteps
  },
  methods: {
    // 获取经络数据
    async getList() {
      wx.showNavigationBarLoading()

      const items = await get('/weapp/jlList')
      this.items = items.list
      // console.log('--------------------')
      // console.log(this.items)

      wx.hideNavigationBarLoading()
    },
    async setShoeStyle(key) {
      this.shoesData.style = key
      console.log(this.shoesData)
      wx.navigateTo({
        url: `/pages/selectSize/main?shoesData=${JSON.stringify(
          this.shoesData
        )}`
      })
    }
  },
  async mounted() {
    wx.setNavigationBarTitle({
      title: '请选择鞋的类型'
    })
    wx.showToast({
      title: '玩命加载中',
      icon: 'loading',
      duration: 5000
    })
    this.shoesData.sex = this.$root.$mp.query.sex
    console.log(this.shoesData.sex)
    wx.hideToast()
  }
}
</script>

<style lang="sass" scoped>



</style>
