<template>
  <div class="container">
    <div class="zan-panel">
      <div class="zan-card">
        <div class="zan-card__thumb">
          <!-- <image class="zan-card__img"
                 :src="imgSrc"
                 mode="aspectFit">
          </image> -->
          <image class="zan-card__img" v-if="imgSrc" :src="imgSrc" />
          <img-load ref="imgLoad"></img-load>
        </div>
        <div class="zan-card__detail">
          <div class="zan-card__detail-row">
            <div class="zan-card__right-col">¥ {{item.taobaoPrice}}</div>
            <div class="zan-card__left-col zan-ellipsis--l2">
              {{item.color}}{{item.styleNumber}}
            </div>
          </div>

          <div class="zan-card__detail-row zan-c-gray-darker">
            <button class="zan-card__right-col zan-btn zan-btn--mini zan-btn--primary zan-btn--plain" @click="setClip(item)">复制到淘宝备注</button>
            <!-- <div class="zan-card__right-col">长按我复制并粘贴到淘宝备注</div> -->
            <div class="zan-card__left-col">
            <div class="zan-text-deleted zan-font-12 zan-font-bold">吊牌价 {{item.cardPrice}}</div>

            </div>
          </div>

          <div class="zan-card__detail-row zan-c-gray-darker">
            <div class="zan-card__left-col zan-c-red">库存: {{item.count < 1 ? '售罄':item.count}}</div>
            <div class="zan-card__left-col zan-c-red">尺码: {{item.size}}</div>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import imgLoad from 'mpvue-img-load'
export default {
  data() {
    return {
      data: {},
      imgSrc: ''
    }
  },
  props: ['item', 'imageCDN', 'defImg'],
  // computed: {
  //   imgSrc() {
  //     return this.imageCDN + '/img/' + this.defImg
  //     // this.imageCDN + '/upload/img/' + this.item.img
  //   }
  // },
  components: {
    imgLoad
  },
  methods: {
    // 向剪贴板中写入信息
    async setClip(data) {
      let str = `款号: ${data.styleNumber} 价格: ${data.taobaoPrice} 尺码: ${
        data.size
      } 库存: ${data.count}`
      wx.setClipboardData({
        data: str
      })
      // 震动下表示完成
      wx.vibrateShort()
    },
    loadImage() {
      // 加载缩略图 80x50 3KB
      // this.imgSrc = this.imageCDN + '/img/' + this.defImg
      this.imgSrc = '../../static/img/default.jpg'
      // 原图 3200x2000 1.6MB
      const imgUrlOriginal = this.imageCDN + '/upload/img/' + this.item.img
      // 同时对原图进行预加载，加载成功后再替换
      this.$refs.imgLoad.load(imgUrlOriginal, (err, data) => {
        if (!err) {
          this.imgSrc = data.src
        }
      })
    }
  },
  onload() {
    this.imgSrc = ''
  },
  mounted() {
    this.loadImage()
  }
}
</script>
<style >
</style>
<style  scoped>
</style>
