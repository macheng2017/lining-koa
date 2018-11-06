import Vue from 'vue'
import App from './index'
import store from '@/store'
// 手动挂载到页面
const app = new Vue({ store, ...App })
app.$mount()
