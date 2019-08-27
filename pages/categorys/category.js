// pages/category/category.js
const app = getApp();
require('../../module/mall.js')

var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};
var categoryModName = 'categoryModName';
var categoryListModName = 'categoryListModName';

const _mall = com.lightningdog.rrq.mall;
Page({
  _event: com.lightningdog.rrq.event,
  /**
   * 页面的初始数据
   */
  data: {
    goodsToView: '',
    categorySelected: '',
    autoIntHeight: 0,
    singleNavHeight: 0,
    curCategory: 0,//当前分类
    goods: [],
    imgUrl: app.staticUrl,
    pageSize: 10,
    noticeList: [
      {
        id: 1,
        title: '503起送，今日下单，享五折特惠！',
      },
      {
        id: 2,
        title: '200起送，今日下单，享五折特惠！'
      },
      {
        id: 3,
        title: '300起送，今日下单，享五折特惠！'
      }
    ],

    categories: [
      {
        code: '1',
        name: '食品',
        curPage: 1,
        infoArray: [],
        isLoad: false,
        total: 0//条目总数
      },
      {
        code: '2',
        name: '服装',
        curPage: 1,
        infoArray: [],
        isLoad: false,
        total: 0//条目总数
      },
      {
        code: '3',
        name: '鞋帽',
        curPage: 1,
        infoArray: [],
        isLoad: false,
        total: 0//条目总数
      },
      {
        code: '4',
        name: '日用品',
        curPage: 1,
        infoArray: [],
        isLoad: false,
        total: 0//条目总数
      },
      {
        code: '5',
        name: '家具',
        curPage: 1,
        infoArray: [],
        isLoad: false,
        total: 0//条目总数
      },
      {
        code: '6',
        name: '家用电器',
        curPage: 1,
        infoArray: [],
        isLoad: false,
        total: 0//条目总数
      },
      {
        code: '7',
        name: '纺织品',
        curPage: 1,
        infoArray: [],
        isLoad: false,
        total: 0//条目总数
      },
      {
        code: '8',
        name: '五金电料',
        curPage: 1,
        infoArray: [],
        isLoad: false,
        total: 0//条目总数
      },
      {
        code: '9',
        name: '厨具',
        curPage: 1,
        infoArray: [],
        isLoad: false,
        total: 0//条目总数
      },
      {
        code: '10',
        name: '水果',
        curPage: 1,
        infoArray: [],
        isLoad: false,
        total: 0//条目总数
      }
    ]
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    let that = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          viewHeight: res.windowHeight,
          screenHeight: res.screenHeight
        })
      }
    })
    this.bindCategoryEvent();
    this.bindEvent();
    this.getCategoryFetch();
  },
  /**
   * @description: 绑定分类获取事件
   * @return: 
   */
  bindCategoryEvent() {
    this._event.on(categoryModName, "com.lightningdog.rrq.mall", "list-right-scrollview", (event, data) => {
      if (data.length) {
        let newArray = data;
        newArray.map((item) => {
          item.curPage = 1;
          item.infoArray = [];
          item.isLoad = false;
          item.total = 0;
        });
        this.setData({
          categories: newArray
        })
        this.apiFetch();
      }
      wx.hideLoading({})
    });
  },
  /**
   * @description: 分类目获取请求
   * @return: 
   */
  getCategoryFetch() {
    wx.showLoading({
      title: '加载中'
    });
    this.loading = true;
    _mall.goodsCategory({}, categoryModName);
  },
  /**
   * @description: 绑定加载事件
   * @param {type} 
   * @return: 
   */
  bindEvent() {
    this._event.on(categoryListModName, "com.lightningdog.rrq.mall", "scrollview", (event, data) => {
      let curCategoryInObj = this.data.categories[this.data.curCategory];
      let dataInfo = [];
      if (curCategoryInObj.curPage > 1) {//上拉
        dataInfo = [...curCategoryInObj.infoArray, ...data.rows];
      } else {
        dataInfo = [...data.rows];
      }
      this.setData({
        goods: dataInfo,
        [`categories[${this.data.curCategory}].infoArray`]: dataInfo,
        [`categories[${this.data.curCategory}].total`]: data.total,
        [`categories[${this.data.curCategory}].isLoad`]: true,
      })
      console.log('列表条目数：' + curCategoryInObj.infoArray.length)
      this.loading = false;
      wx.hideLoading({})
      wx.stopPullDownRefresh();
    });
  },
  /**
   * @description: 网络请求
   * @return: none
   */
  apiFetch(type = '1', pageNum = 1) {
    wx.showLoading({
      title: '加载中'
    });
    this.loading = true;
    let condition = {
      type: type,
      pageNum: pageNum,
      pageSize: this.data.pageSize
    }
    _mall.list(condition, categoryListModName);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
    console.log('onShow')
  },
  onReady() {
    const query = wx.createSelectorQuery()
    query.select('.content').boundingClientRect((res) => {
      // try {
      //   wx.setStorageSync('searchHeight', res.height)
      // } catch (e) {
      // }
      this.setData({
        autoIntHeight: res.height,
        singleNavHeight: res.height / 11
      })
    }).exec()
    console.log('onReady')
  },
  /**
   * @description: 去往搜索页面
   * @return: 
   */
  toSearch() {
    wx.navigateTo({
      url: "/pages/search-detail/search-detail"
    })
  },
  onCategoryClick: function (e) {
    this.setData({
      goodsToView: e.detail.goodsToView[0],
      categorySelected: e.detail.goodsToView[0]
    })
  },
  scroll(e) {
    this.setData({
      categoryToView: e.detail.categoryToView,
      categorySelected: e.detail.categoryToView
    })
  },
  listLeft(e) {
    console.log(e)
    this.setData({
      curCategory: e.detail.index
    });
    if (!this.data.categories[e.detail.index].isLoad) {
      this.apiFetch(this.data.categories[e.detail.index].code, 1);
    } else {
      this.setData({
        goods: this.data.categories[e.detail.index].infoArray,
      })
    }
  },
  myReachBottom(e) {
    console.log(e)
    let curCategoryInObj = this.data.categories[this.data.curCategory];
    if (!this.loading && curCategoryInObj.infoArray.length < Number(curCategoryInObj.total)) {
      let nextPage = curCategoryInObj.curPage + 1;
      this.setData({
        [`categories[${this.data.curCategory}].curPage`]: nextPage
      })
      this.apiFetch(curCategoryInObj.code, nextPage);
    } else {
      wx.showToast({
        title: '亲，没有更多商品了！',
        icon: 'none'
      })
    }
  },
  myClickPhone(e) {
    console.log(e)
  },
  goCart: function (e) {
    wx.navigateTo({
      url: "/pages/shop-cart/index"
    })
  }
})
