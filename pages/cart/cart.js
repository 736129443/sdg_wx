// pages/cart/cart.js
require('../../module/shopcart.js');
const app = getApp();
var modName = 'cartPageSync';

var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};
const _shopcart = com.lightningdog.rrq.shopcart;
Page({
  _event: com.lightningdog.rrq.event,
  /**
   * 页面的初始数据
   */
  data: {
    shopCarList: [],
    allSelect: false,
    imgUrl: app.staticUrl,
    total: 0,
    isTrue: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._event.on(modName, "com.lightningdog.rrq.shopcart", "cartSync", (event, data) => {
      wx.hideLoading({})
    });
    this.bindListEvent();
    this.apiFetchLoad();
  },
  bindListEvent() {
    this._event.on('onLoad', "com.lightningdog.rrq.shopcart", "list-scrollview", (event, data) => {
      console.log('监听触发')
      if (data) {
        this.dealData(data);
      }
      wx.hideLoading({})
    });
  },
  dealData(res) {
    let arr = [];
    for (let key in res) {
      arr.push(res[key])
    }
    if (arr.length) {
      this.setData({
        shopCarList: arr
      });
    }
  },
  apiFetchLoad() {
    wx.showLoading({
      title: '加载中'
    })
    _shopcart.load();
  },
  toIndexPage: function () {
    wx.switchTab({
      url: "/pages/home/index"
    });
  },
  delete(e) {
    let subIndex = e.currentTarget.dataset.index;
    let superIndex = e.currentTarget.dataset.superIndex
    let list = this.data.shopCarList[superIndex];
    let subItem = `shopCarList[${superIndex}]`;
    let subSubItem = list[subIndex];
    wx.showModal({
      content: '你确定在购物车中删除该商品',
      showCancel: true,
      success: (res) => {
        if (res.confirm == 0) {
          return;
        }
        list.splice(subIndex, 1);
        if (list.length == 0) {
          let superList = this.data.shopCarList;
          superList.splice(superIndex, 1);
          this.setData({
            shopCarList: superList,
            total: this.calculate()
          })
        } else {
          this.setData({
            [subItem]: list,
            total: this.calculate()
          })
        }
        subSubItem.goodsNum = 0;
        this.cartInfoSync(subSubItem);
      }
    });
  },
  onChange(e) {
    let subIndex = e.currentTarget.dataset.index;
    let superIndex = e.currentTarget.dataset.superIndex
    let list = this.data.shopCarList[superIndex];
    let subItem = `shopCarList[${superIndex}]`
    let subSubItem = list[subIndex];
    let num = e.detail;
    if (subIndex !== "" && subIndex != null) {
      // 添加判断当前商品购买数量是否超过当前商品可购买库存
      list[subIndex].goodsNum = num;
      this.setData({
        [subItem]: list,
        total: this.calculate()
      })
      this.cartInfoSync(subSubItem);
    }
  },
  /**
   * @description: 购物车同步
   * @return: none
   */
  cartInfoSync(goods) {
    wx.showLoading({
      title: '加载中'
    });

    _shopcart.sync(modName, [goods], '0');
  },
  onClickButton() {
    let arrList = []
    let list = this.data.shopCarList;
    app.data.isClickCart = true

    for (let i = 0; i < list.length; i++) {
      let curItem = list[i];
      let subArr = [];
      let subTotal = 0;
      curItem.forEach(item => {
        if (item.active) {
          item.amount = item.goodsNum;
          item.goodsPic = item.goodsThumbnails;
          subArr.push(item);
          subTotal += Number(item.goodsNum) * Number(item.price);
        }
      })
      if (subArr.length) {
        let locations = {
          latitude: subArr[0].latitude,
          longitude: subArr[0].longitude,
          province: subArr[0].province,
          area: subArr[0].city,
          county: subArr[0].district,
          phone: subArr[0].phone,
          contractor: subArr[0].contacts,
          address: subArr[0].address
        };
        arrList.push({
          market: subArr[0].market,
          marketId: subArr[0].marketId,
          goods: subArr,
          total: subTotal.toFixed(2),
          locations: locations,
        });
      }
    }
    wx.setStorageSync('shopInfo', arrList);
    wx.navigateTo({
      url: "/pages/pay-order/pay-order"
    })
  },
  allSelected() {
    let isAllSelect = true
    let list = this.data.shopCarList;
    for (let i = 0; i < list.length; i++) {
      let curItem = list[i];
      if (curItem.length) {
        curItem.every(item => {
          if (!item.active) {
            isAllSelect = false
            return false;
          }
          return true;
        })
      }
    }
    return isAllSelect
  },
  calculate() {
    let total = 0;
    let flag = false
    let list = this.data.shopCarList;
    for (let i = 0; i < list.length; i++) {
      let curItem = list[i];
      if (curItem.length) {
        curItem.forEach(item => {
          if (item.active) {
            total += Number(item.price) * Number(item.goodsNum);
            flag = true
          }
        })
      }
    }
    if (flag) {
      this.data.isTrue = false
    } else {
      this.data.isTrue = true
    }
    this.setData({
      isTrue: this.data.isTrue
    });
    let price = parseFloat(total.toFixed(2) * 100);
    return price;
  },
  selectProduct(e) {
    let subIndex = e.currentTarget.dataset.index;
    let superIndex = e.currentTarget.dataset.superIndex;
    let sub = this.data.shopCarList[superIndex];
    let subItem = `shopCarList[${superIndex}]`;
    if (subIndex !== "" && subIndex != null) {
      sub[subIndex].active = !sub[subIndex].active;
      this.setData({
        allSelect: this.allSelected(),
        [subItem]: sub,
        total: this.calculate()
      })
    }
  },
  selectAllProduct(e) {
    let list = this.data.shopCarList;
    let currentAllSelect = this.data.allSelect;
    if (currentAllSelect) {
      for (let i = 0; i < list.length; i++) {
        let curItem = list[i];
        curItem.forEach(item => {
          item.active = false;
        })
      }
    } else {
      for (let i = 0; i < list.length; i++) {
        let curItem = list[i];
        curItem.forEach(item => {
          item.active = true;
        })
      }
    }
    this.setData({
      allSelect: !this.data.allSelect,
      shopCarList: list,
      total: this.calculate()
    })
  },
  toDetail(e) {
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    var pages = getCurrentPages();
    let lastPage = pages[pages.length - 2];
    if (lastPage.route.indexOf('goods-detail') > -1) {
      lastPage.setData({
        goodsId: id,
        goodsType: type
      })
      app.globalData.needRefresh = true;
      wx.navigateBack();
      return;
    }
    wx.navigateTo({
      url: "/pages/goods-detail/goods-detail?id=" + id + '&type=' + type
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      total: this.calculate()
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.data.needToOrderManger) {
      app.data.needToOrderManger = false;
      wx.navigateTo({
        url: "/pages/order-manager/index?type=1"
      });
    }
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
    console.log('页面销毁')
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