<template lang='pug'>
.container
  .doc-title.zan-hairline--bottom 选鞋步骤
    .zan-panel
      .zan-cell
        .zan-cell__bd
          ZanSteps(v-bind="{ steps: steps }")
  .bt(v-if="shoesData.sex==='男'")
    .selectBtn( v-for='(item,index) in items.male' :key='index')
      button.zan-btn.zan-btn--large(@click="setSize($event,item)") {{item}}
  .bt(v-else)
    .selectBtn(v-for='(item,inex) in items.female' :key='inex')
      button.zan-btn.zan-btn--large(@click="setSize($event,item)") {{item}}

</template>

<script>
import { get } from '@/utils'
import ZanSteps from 'mpvue-zanui/src/components/zan/steps'

export default {
  components: {
    ZanSteps
  },
  data() {
    return {
      userInfo: {},
      items: {
        male: [
          '6/235/38.5',
          '6.5/240/39',
          '7/245/39.5',
          '7.5/250/40.5',
          '8/255/41',
          '8.5/260/41.5',
          '9/265/42.5',
          '9.5/270/43',
          '10/275/43.5',
          '10.5/280/44.5',
          '11/285/45',
          '11.5/290/45.5',
          '12/295/46.5',
          '12.5/300/47',
          '13/305/47.5',
          '13.5/310/48.5',
          '14/315/49'
        ],
        female: [
          '4/205/33.5',
          '4.5/210/34.5',
          '5/215/35',
          '5.5/220/35.5',
          '6/225/36.5',
          '6.5/230/37',
          '7/235/37.5',
          '7.5/240/38.5',
          '8/245/39',
          '8.5/250/39.5'
        ]
      },
      steps: [
        {
          current: false,
          done: true,
          text: '1.选择性别',
          desc: '10.01'
        },
        {
          done: true,
          current: false,
          text: '2.选择鞋类',
          desc: '10.02'
        },
        {
          done: true,
          current: true,
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
    async setSize(e, key) {
      // build a json
      this.shoesData = Object.assign(this.shoesData, {
        size: key
      })
      wx.navigateTo({
        url: `/pages/queryList/main?shoesData=${JSON.stringify(this.shoesData)}`
      })
      console.log(this.shoesData)

      // this[key] = e.mp.detail.value
    }
  },
  async mounted() {
    wx.setNavigationBarTitle({
      title: '请选择鞋的尺寸'
    })
    wx.showToast({
      title: '玩命加载中',
      icon: 'loading',
      duration: 5000
    })

    // 接收其他页面传递过来的数据
    this.shoesData = JSON.parse(this.$root.$mp.query.shoesData)
    // console.log('性别')
    // console.log(this.shoesData.style)
    wx.hideToast()
  }
}
</script>

<style lang="sass" scoped>



</style>
