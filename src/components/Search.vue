<template>
  <div class="page">
    <div class="page__bd">
      <div class="weui-search-bar">
        <div class="weui-search-bar__form">
          <div class="weui-search-bar__box">
            <icon class="weui-icon-search_in-box" type="search" size="14"></icon>
            <input type="text" class="weui-search-bar__input" placeholder="请输入款号或者其他关键词" v-model="inputVal" :focus="inputShowed" @input="inputTyping" />
            <div class="weui-icon-clear" v-if="inputVal.length > 0" @click="clearInput">
              <icon type="clear" size="14"></icon>
            </div>
          </div>
          <label class="weui-search-bar__label" :hidden="inputShowed" @click="showInput">
            <icon class="weui-icon-search" type="search" size="14"></icon>
            <div class="weui-search-bar__text">搜索</div>
          </label>
        </div>
        <div class="weui-search-bar__cancel-btn" :hidden="!inputShowed" @click="enterInput">确定</div>
      </div>
      <div class="weui-cells searchbar-result" v-if="xwList.length > 0" :hidden="!inputShowed"   >
        <!-- <a v-for=" item in xwList" :key="item.id" :url="parasXW" :xw-name="item.name" class="weui-cell" hover-class="weui-cell_active">
          <div class="weui-cell__bd">
            <div>{{item.name}}</div>
          </div>
        </a> -->
         <Xw :xw="xw.color" v-for="xw in xwList" :key="xw._id"></Xw>
      </div>
      <div class="msg" v-if="msgShow">抱歉!没有相关信息!换个词试试吧</div>
    </div>
  </div>
</template>

<script>
import { get } from '@/utils'
export default {
  data() {
    return {
      inputShowed: false,
      inputVal: '',
      xwList: [],
      msgShow: false,
      searchKey: ''
    }
  },
  computed: {},
  methods: {
    showInput() {
      this.inputShowed = true
    },
    enterInput() {
      // this.inputVal = ''
      // this.xwList = []
      // this.inputShowed = false
      console.log('hello')
      // this.getSearch()
      let searchKey = this.inputVal
      this.searchKey = searchKey.toUpperCase()

      wx.navigateTo({
        url: `/pages/searchList/main?searchKey=${this.searchKey}`
      })
      // 这种跳转方式好像不行
      // return `/pages/detail/main?name=${encodeURI(this.xw)}`
    },
    clearInput() {
      this.inputVal = ''
      this.xwList = []
    },
    inputTyping(e) {
      console.log(e)
      this.inputVal = e.mp.detail.value
    },
    parasXW(e) {
      // 加上了一个斜杠解决了,跳转的时候总是有前面的一坨
      console.log('------------------------')
      console.log(e)
      return `/pages/detail/main?name=${encodeURI(e.mp.detail.value)}`
    },
    async getSearch() {
      wx.showToast({
        title: '玩命加载中--',
        icon: 'loading',
        duration: 5000
      })
      // let res
      // try {
      //   let fly = new Fly()
      //   res = await fly.get('/weapp/search', { searchKey: this.inputVal })
      // } catch (error) {
      //   console.log(error)
      // }
      let res = {}
      // 如果最终输入的是汉子则查询
      // let str = this.inputVal.replace(/[^\u4e00-\u9fa5]/gi, '').trim()
      let str = this.inputVal.trim()
      if (str.length > 0) {
        console.log('--------true--------' + str)
        res = await get('/mina/search', {
          searchKey: encodeURI(this.inputVal)
        })
      }
      if (res.list.length <= 0) {
        this.msgShow = true
      }
      this.xwList = res.list
      console.log('-------------')

      console.log(this.xwList)
      wx.hideToast()
    }
  },
  // watch: {
  //   inputVal(news, olds) {
  //     console.log('change....' + news)
  //     if (news.trim().length > 0) {
  //       this.debounceGetSearch()
  //       this.msgShow = false
  //     } else if (news.trim().length <= 0) {
  //       this.xwList = []
  //     }
  //     if (news.trim().length === 0) {
  //       this.msgShow = false
  //     }
  //   }
  // },
  created() {
    // this.debounceGetSearch = _.debounce(this.getSearch, 1000)
  }
}
</script>

<style scoped>
.searchbar-result {
  margin-top: 0;
  font-size: 14px;
}
.searchbar-result:before {
  display: none;
}
.weui-cell {
  padding: 12px 15px 12px 35px;
}
.msg {
  font-size: 16px;
}
</style>
