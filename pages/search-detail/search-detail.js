// pages/search-detail/search-detail.js
require('../../module/mall.js')
//获取应用实例
var app = getApp()
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};
const _mall = com.lightningdog.rrq.mall;
Page({
  _event: com.lightningdog.rrq.event,
  isBoutique: true,
  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    pageSize: 10,
    pageNum: 1,
    goods: [],
    total: 0,
    imgUrl: app.staticUrl,
    hotSearchList: [],
    searchStorage: []
  },
  historySearch(e) {
    this.setData({
      value: e.currentTarget.dataset.name
    })
    this.setSearchStorage(e.currentTarget.dataset.name);
    this.apiFetch();
  },
  hotSearch(e) {
    this.setData({
      value: e.currentTarget.dataset.name,
    })
    this.setSearchStorage(e.currentTarget.dataset.name);
    this.apiFetch();
  },
  onSearch(e) {
    this.setData({
      value: e.detail
    })
    if (e.type != 'change') {
      this.setSearchStorage(this.data.value);
      this.apiFetch();
    }
  },
  onSearchs() {
    console.log('搜索按钮');
    this.setSearchStorage(this.data.value);
    this.apiFetch();
  },
  clearStorage() {
    wx.removeStorage({
      key: "searchStorage",
      success: (res) => {
        this.setData({
          searchStorage: []
        })
      },
    })
  },
  setSearchStorage(name) {
    let searchStorage = this.data.searchStorage;
    let flag = false;
    if (searchStorage.length > 0) {
      for (let i = 0; i < searchStorage.length; i++) {
        if (name == searchStorage[i]) {
          searchStorage.splice(i, 1)
          searchStorage.unshift(name)
          flag = true;
          this.setData({
            searchStorage: searchStorage
          })
          break
        }
      }
    }
    if (!flag) {
      searchStorage.unshift(name)
      this.setData({
        searchStorage: searchStorage
      })
    }
    wx.setStorage({
      key: "searchStorage",
      data: JSON.stringify(searchStorage)
    })
  },
  myReachBottom() {
    if (!this.loading && this.data.goods.length < Number(this.data.total)) {
      this.setData({
        pageNum: this.data.pageNum + 1
      });
      this.apiFetch();
    } else {
      wx.showToast({
        icon: 'none',
        title: '亲，没有更多商品了！'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.bindEvent();
    this.loading = true;
    this.isBoutique = true;
    _mall.search({
      name: '',
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      isBoutique: '1',
    });
  },
  bindEvent: function () {
    this._event.on('onSearch', "com.lightningdog.rrq.mall", "scrollview", (event, data) => {
      console.log(event);
      this.loading = false;
      if (data) {
        if (this.isBoutique) {
          this.setData({
            hotSearchList: data.result
          })
          return;
        }
        let dataInfo = [];
        if (this.data.pageNum > 1) {//上拉
          dataInfo = [...this.data.goods, ...data.result];
        } else {
          dataInfo = [...data.result];
        }
        this.setData({
          goods: dataInfo,
          total: data.total
        })
        console.log('列表条目数：' + this.data.goods.length)
      } else {
        this.setData({
          goods: []
        });
      }
    });
  },
  /**
   * @description: 获取数据
   * @param {type} 
   * @return: 
   */
  apiFetch() {
    if (!this.loading) {
      this.isBoutique = false;
      let condition = {
        name: this.data.value,
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize
      };
      this.loading = true;
      _mall.search(condition);
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取购物车数据
    wx.getStorage({
      key: 'searchStorage',
      success: (res) => {
        let arr = JSON.parse(res.data);
        this.setData({
          searchStorage: arr
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})