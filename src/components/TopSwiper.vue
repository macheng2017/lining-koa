<template>
  <div class="page">
    <div class="page__bd page__bd_spacing">
      <swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" :circular="circular" @change="swiperChange" @animationfinish="animationfinish">
        <div v-for="item in imgUrls" :key="index">
          <a :href="item.url">

          <swiper-item>
               <image :src="item.img" class="slide-image" width="355" height="350"/>
          </swiper-item>
          </a>
        </div>
      </swiper>
    </div>
  </div>
</template>

<script>
import { get } from '@/utils'

export default {
  data() {
    return {
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 900,
      circular: true,
      imgUrls: [
        {
          img:
            'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
        }
      ]
    }
  },
  props: ['slideShowData', 'imageCDN', 'defImg'],
  methods: {
    swiperChange(e) {
      // console.log('第' + e.mp.detail.current + '张轮播图发生了滑动')
    },
    animationfinish(e) {
      // console.log('第' + e.mp.detail.current + '张轮播图滑动结束')
    },
    // 获取轮播图片地址
    async getSlideShow() {
      wx.showNavigationBarLoading()

      wx.showLoading({
        title: '玩命加载中...'
      })
      let slideShowData = await get('/mina/slideShow/list')
      slideShowData = slideShowData.list
      slideShowData = slideShowData.map(v => {
        return Object.assign(
          {},
          {
            img: `${this.imageCDN}/img/${v.img}`,
            url: v.url
          }
        )
      })
      console.log('--------------------')
      console.log(slideShowData)
      if (slideShowData.length > 0) {
        this.imgUrls = slideShowData
      }

      wx.hideLoading()
      wx.hideNavigationBarLoading()
    }
  },
  mounted() {
    console.log('-------topSwiper----------')
    // console.log(this.imgUrls)
    this.getSlideShow()
  }
}
</script>

<style>
.slide-image {
  width: 100%;
  height: 100%;
}
.swiper {
  width: 100%;
  height: 400rpx;
}
</style>
