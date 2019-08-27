// common/category-search/category-search.js
const app=getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
 
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      console.log('attached')
    },
    ready() {
      //在组件在视图层布局完成后执行
      console.log('ready')
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  pageLifetimes: {
    show() {
      // 页面被展示
      console.log('show')
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
    getScrollHeight(){
    
   }
  }
})
