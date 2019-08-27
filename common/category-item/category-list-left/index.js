// common/category-item/category-left2/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    autoIntHeight:Number,
    singleNavHeight:Number,
    list:Array
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
  },

  pageLifetimes: {
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
    navScrollTop:'',
    singleNavHeight:0,
    goodsWrap: [],
    categorySelected: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onCategoryClick(e) {
      let cur = e.currentTarget.dataset.idx;
      let id = e.currentTarget.dataset.id;
      let singleNavHeight = this.data.autoIntHeight /11;
      this.setData({
        navScrollTop: (cur - 5) * singleNavHeight,
        categorySelected: e.currentTarget.dataset.idx
      });
      const myEventDetail = { index: cur, id: id} // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('myListLeft', myEventDetail, myEventOption)
    },
    initData() {
    }
  }
})
