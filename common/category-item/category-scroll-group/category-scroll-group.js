// common/category-scroll-list/category-scroll-list.js
const app=getApp();
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    noticeList: Array
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
  pageLifetimes:{
    show() {
      // 页面被展示
      //this.initData();
     
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
  },
  /**
   * 组件的方法列表
   */
  methods: {
  }
})
