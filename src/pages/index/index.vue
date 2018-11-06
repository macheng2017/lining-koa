<template lang='pug'>
.container
  Search()
  TopSwiper(:tops="tops" :imageCDN='imageCDN' :defImg='defImg')
  //- Picker
  .doc-title.zan-hairline--bottom 选鞋步骤
    .zan-panel
      .zan-cell
        .zan-cell__bd
          ZanSteps(v-bind="{ steps: steps }")



  .zan-btns(v-for='(item,inex) in items' :key='index')
    button.zan-btn(@click="setSix($event,item.value)") {{item.sex}}
  //- contact-button(type="default-dark" size="20" session-from="weapp") 呼叫客服
  //- button(open-type="contact") 客服消息


</template>

<script>
// import { get } from '@/utils'
import Search from '@/components/Search'
import TopSwiper from '@/components/TopSwiper'
import ZanSwitch from 'mpvue-zanui/src/components/zan/switch'
import ZanSteps from 'mpvue-zanui/src/components/zan/steps'
// import Picker from '@/components/Picker'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      userInfo: {},
      items: [{ sex: '男', value: '男' }, { sex: '女', value: '女' }],
      steps: [
        {
          current: true,
          done: true,
          text: '1,选择性别',
          desc: '10.01'
        },
        {
          done: false,
          current: false,
          text: '2,选择鞋类',
          desc: '10.02'
        },
        {
          done: false,
          current: false,
          text: '3,选择尺码'
        },
        {
          done: false,
          current: false,
          text: '4,复制到淘宝备注'
        }
      ]
      // slideShowData: []
    }
  },
  components: {
    Search,
    TopSwiper,
    ZanSwitch,
    ZanSteps
    // Picker
  },
  computed: {
    ...mapState(['imageCDN', 'defImg'])
  },
  methods: {
    // 获取轮播图片地址
    // async getSlideShow() {
    //   wx.showNavigationBarLoading()

    //   wx.showLoading({
    //     title: '玩命加载中...'
    //   })
    //   let slideShowData = await get('/mina/slideShow/list')
    //   slideShowData = slideShowData.list
    //   slideShowData = slideShowData.map(v => {
    //     return (v.img = `${this.imageCDN}/img/${v.img}`)
    //   })
    //   this.slideShowData = slideShowData
    //   console.log('--------------------')
    //   console.log(this.slideShowData)
    //   wx.hideLoading()
    //   wx.hideNavigationBarLoading()
    // },
    //
    async setSix(e, key) {
      // console.log('-------------')
      // console.log(key)
      wx.navigateTo({
        url: `/pages/selectStyle/main?sex=${key}`
      })
    }
  },
  async mounted() {
    // await this.getSlideShow()
  },
  onLoad: function(options) {
    if (options.name) {
      // 这个pageId的值存在则证明首页的开启来源于用户点击来首页,同时可以通过获取到的pageId的值跳转导航到对应的详情页
      wx.navigateTo({
        url: '/pages/detail/main?name=' + options.name
      })
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
