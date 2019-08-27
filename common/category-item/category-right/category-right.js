// common/category-item/category-right/category-right.js
const app=getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    categoryClick: Boolean,
    goodsToView: String
  },
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
    },
    ready() {
      //在组件在视图层布局完成后执行

    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
    show() {
      // 页面被展示

    },
    hide() {
      // 页面被隐藏
    },
    resize(size) {
      // 页面尺寸变化
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    goodsToView: "",
    categoryToView: "",
    categories: [],
    goodsWrap: [],
    categorySelected: '',
    categoryClick: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDetailsTap: function (e) {
      wx.navigateTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    },
    scroll(e) {
      if (app.data.categoryClick) {
        app.data.categoryClick = false
        return
      }
      let scrollTop = e.detail.scrollTop;
      let that = this;
      let offset = 41;
      let isBreak = false;
      for (let g = 0; g < this.data.goodsWrap.length; g++) {
        let goodWrap = this.data.goodsWrap[g];
        offset += 30;
        if (scrollTop <= offset) {
          if (this.data.categoryToView != goodWrap.scrollId) {
            // this.setData({
            //   categorySelected: goodWrap.scrollId,
            //   categoryToView: goodWrap.scrollId,
            // })
            const myEventDetail = { categoryToView: goodWrap.scrollId } // detail对象，提供给事件监听函数
            const myEventOption = {} // 触发事件的选项
            this.triggerEvent('myscroll', myEventDetail, myEventOption)
          }
          break;
        }
        for (let i = 0; i < goodWrap.goods.length; i++) {
          offset += 117;
          if (scrollTop <= offset) {
            if (this.data.categoryToView != goodWrap.scrollId) {
              // this.setData({
              //   categorySelected: goodWrap.scrollId,
              //   categoryToView: goodWrap.scrollId,
              // })
              const myEventDetail = { categoryToView: goodWrap.scrollId } // detail对象，提供给事件监听函数
              const myEventOption = {} // 触发事件的选项
              this.triggerEvent('myscroll', myEventDetail, myEventOption)
            }
            isBreak = true;
            break;
          }
        }
        if (isBreak) {
          break;
        }
      }
    },
  }
})
