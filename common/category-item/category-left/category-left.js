// common/category-item/category-left/category-left.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    categorySelected:String,
    categoryToView:String,
    singleNavHeight: Number
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      this.initData();
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
    goodsToView: "",
    categoryToView: "",
    categories: [],
    goodsWrap: [],
    categorySelected: ''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onCategoryClick(e){
      let id = e.currentTarget.dataset.id;
      app.data.categoryClick = true
      const myEventDetail = {goodsToView: id} // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption)
    },
    initData() {
      let that = this;
      wx.showNavigationBarLoading();
      // WXAPI.goodsCategory().then((res)=> {
      //   var categories = [];
      //   console.log(res)
      //   if (res.code == 0) {
      //     for (var i = 0; i < res.data.length; i++) {
      //       let item = res.data[i];
      //       item.scrollId = "s" + item.id;
      //       categories.push(item);
      //       if (i == 0) {
      //         that.setData({
      //           categorySelected: item.scrollId,
      //         })
      //       }
      //     }
      //   }
      //   that.setData({
      //     categories: categories,
      //   });
      //   console.log(categories);
      //   this.getGoodsList(0);
      // }).catch((e) => {
      //   wx.hideNavigationBarLoading();
      // });
    },
    getGoodsList: function (categoryId, append) {
      let that = this;
      // WXAPI.goods({
      //   categoryId: "",
      //   page: 1,
      //   pageSize: 100000
      // }).then(function (res) {
      //   if (res.code == 404 || res.code == 700) {
      //     return
      //   }
      //   let goodsWrap = [];
      //   that.data.categories.forEach((o, index) => {
      //     let wrap = {};
      //     wrap.id = o.id;
      //     wrap.scrollId = "s" + o.id;
      //     wrap.name = o.name;
      //     let goods = [];
      //     wrap.goods = goods;
      //     res.data.forEach((item, i) => {
      //       if (item.categoryId == wrap.id) {
      //         goods.push(item)
      //       }
      //     })
      //     goodsWrap.push(wrap);
      //   })
      //   that.setData({
      //     goodsWrap: goodsWrap,
      //   });
      //   console.log(goodsWrap);

      //   wx.hideNavigationBarLoading();
      // }).catch((e) => {
      //   wx.hideNavigationBarLoading();
      // });
    }
  }
})
