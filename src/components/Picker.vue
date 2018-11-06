<template>
  <div class="mvpue-picker">
    <div class="page-hd">
      <div class="page-title">请在下方选择性别,鞋类,鞋码</div>
      <div class="page__desc">您选中的鞋:</div>
      <div class="picker-text">{{pickerText}}</div>
    </div>
    <div class="page-bd">

      <button type="default" @click="showMulLinkageThreePicker">点我选择</button>
    </div>
    <mpvue-picker ref="mpvuePicker" :mode="mode" :deepLength=deepLength :pickerValueDefault="pickerValueDefault" @onChange="onChange" @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
  </div>
</template>

<script>
// import mpvuePicker from '@/mpvue-picker/mpvuePicker.vue'
import mpvuePicker from 'mpvue-picker'
export default {
  components: {
    mpvuePicker
  },
  data() {
    return {
      mode: 'selector',
      deepLength: 0, // 几级联动
      pickerValueDefault: [], // 初始化值
      pickerValueArray: [], // picker 数组值
      pickerText: '',
      mulLinkageThreePicker: [
        {
          label: '男',
          value: 0,
          children: [
            {
              label: '电光蓝',
              value: 1,
              children: [
                {
                  label: '40',
                  value: 1
                },
                {
                  label: '45',
                  value: 2
                },
                {
                  label: '46',
                  value: 3
                }
              ]
            },
            {
              label: '基础白',
              value: 1,
              children: [
                {
                  label: '40',
                  value: 1
                },
                {
                  label: '42',
                  value: 2
                },
                {
                  label: '44',
                  value: 3
                }
              ]
            }
          ]
        },
        {
          label: '女',
          value: 0,
          children: [
            {
              label: '朱砂红',
              value: 1,
              children: [
                {
                  label: '35',
                  value: 1
                },
                {
                  label: '36',
                  value: 2
                },
                {
                  label: '38',
                  value: 3
                },
                {
                  label: '39',
                  value: 3
                }
              ]
            },
            {
              label: '微晶灰',
              value: 1,
              children: [
                {
                  label: '39',
                  value: 1
                },
                {
                  label: '39',
                  value: 2
                },
                {
                  label: '40',
                  value: 3
                }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    onChange(e) {
      console.log(e)
    },
    onCancel(e) {
      console.log(e)
    },
    // // 单列
    // showSinglePicker() {
    //   this.pickerValueArray = this.pickerSingleArray
    //   this.mode = 'selector'
    //   this.pickerValueDefault = []
    //   this.$refs.mpvuePicker.show()
    // },
    // // 时间选择
    // showTimePicker() {
    //   this.mode = 'timeSelector'
    //   this.pickerValueDefault = [1, 2]
    //   this.$refs.mpvuePicker.show()
    // },
    // // 多列选择
    // showMulPicker() {
    //   this.pickerValueArray = this.pickerMulArray
    //   this.mode = 'multiSelector'
    //   this.pickerValueDefault = [1, 1, 1]
    //   this.$refs.mpvuePicker.show()
    // },
    // // 二级联动选择
    // showMulLinkageTwoPicker() {
    //   this.pickerValueArray = this.mulLinkageTwoPicker
    //   this.mode = 'multiLinkageSelector'
    //   this.deepLength = 2
    //   this.pickerValueDefault = [1, 0]
    //   this.$refs.mpvuePicker.show()
    // },
    // 三级联动选择
    showMulLinkageThreePicker() {
      this.pickerValueArray = this.mulLinkageThreePicker
      this.mode = 'multiLinkageSelector'
      this.deepLength = 3
      this.pickerValueDefault = [1, 1, 1]
      this.$refs.mpvuePicker.show()
    },
    showPickerView() {
      this.$refs.mpvuePicker.show()
    },
    onConfirm(e) {
      console.log(e)
      if (this.mode === 'selector') {
        this.pickerText = e.label
      } else if (this.mode === 'timeSelector') {
        this.pickerText = e.label
      } else if (this.mode === 'multiSelector') {
        this.pickerText = e.label
      } else if (
        this.mode === 'multiLinkageSelector' &&
        this.deepLength === 2
      ) {
        this.pickerText = e.label
      } else if (
        this.mode === 'multiLinkageSelector' &&
        this.deepLength === 3
      ) {
        this.pickerText = e.label
      }
    }
  }
}
</script>

<style>
.page-hd {
  padding: 40px;
}
.page-title {
  font-size: 20px;
  font-weight: 400px;
}
.page-bd {
  padding: 15px;
}
.picker-text,
.page__desc {
  margin-top: 10px;
}
button {
  margin-top: 15px;
}
</style>
