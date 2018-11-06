import Vue from 'vue'
import App from './App'
import store from '@/store'
import '../static/css/weui.css'

Vue.config.productionTip = false
App.mpType = 'app'
// 传入store
const app = new Vue({ store, ...App })
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: ['^pages/index/main', 'pages/me/main', 'pages/luckList/main', 'pages/versionInfo/main'],
    window: {
      backgroundTextStyle: 'light',
      // navigationBarBackgroundColor: '#42C593',
      navigationBarTitleText: '袜妖',
      navigationBarTextStyle: 'light'
    },
    tabBar: {
      selectedColor: '#4ADB97',
      list: [
        {
          pagePath: 'pages/index/main',
          text: '选择页面',
          iconPath: 'static/img/icon_home_nor.png',
          selectedIconPath: 'static/img/icon_home_sel.png'
        },
        {
          pagePath: 'pages/luckList/main',
          text: '教你怎么淘',
          iconPath: 'static/img/icon_learn_nor.png',
          selectedIconPath: 'static/img/icon_learn_sel.png'
        },
        {
          pagePath: 'pages/me/main',
          text: '我的信息',
          iconPath: 'static/img/icon_my_nor.png',
          selectedIconPath: 'static/img/icon_my_sel.png'
        }
      ]
    }
  }
}
