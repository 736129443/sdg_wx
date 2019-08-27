// common/cart-item/cart-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:Array
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
    deletes(e){
      let index = e.currentTarget.dataset.index;
      const myEventDetail = { index: index } // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('mydelete', myEventDetail, myEventOption)
    },
    selectProduct(e){
      let index = e.currentTarget.dataset.index;
      const myEventDetail = { index: index } // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('myselect', myEventDetail, myEventOption)
    },
    onChange(e){
      let index = e.currentTarget.dataset.index;
      let num = e.detail
      const myEventDetail = { index: index, num: num} // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('mychange', myEventDetail, myEventOption)
    }
  }
})
