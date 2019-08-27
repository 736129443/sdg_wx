// common/category-item/cate-list-right/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['my-class'],
  properties: {
    toPage: String,
    bigPhone: {
      type: Boolean,
      value: false
    },
    imgUrl: String,
    list: {
      type: Array,
      value: null,
      observer: function (newData, oldData) {
        // console.log(newData, oldData)
        // this.setData({
        //   scrollTop: 0
        // })
      }
    }
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
    },
    ready() {
      //在组件在视图层布局完成后执行 
      // this.setData({
      //   categoryItem: { index: 0, id: this.data.categories[0].id }
      // })

    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  data: {
    scrollTop: 0,
    currentPage: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    lower(e) {
      console.log(this.properties.bigPhone)
      // wx.showLoading({
      //   "mask": true
      // })
      // setTimeout(() => {
      //   wx.hideLoading();
      // }, 1000)
      const myEventDetail = { currentPage: 0 } // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('myReachBottom', myEventDetail, myEventOption)
      console.log(e)
    },
    upper(e) {
      wx.showLoading({
        "mask": true
      })
      setTimeout(() => {
        wx.hideLoading();
      }, 1000)
      // console.log(e)
    },
    toDetailsTap(e) {
      wx.navigateTo({
        url: this.data.toPage + '?id=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type
      })
    },
    clickPhone(e) {
      if (e.currentTarget.dataset.phone) {
        wx.makePhoneCall({
          phoneNumber: e.currentTarget.dataset.phone // 仅为示例，并非真实的电话号码
        })
      }
    }
    // const myEventDetail = {goodsToView: id} // detail对象，提供给事件监听函数
    //     const myEventOption = {} // 触发事件的选项
    //     this.triggerEvent('myevent', myEventDetail, myEventOption)
  }
})
