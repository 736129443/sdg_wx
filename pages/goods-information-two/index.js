// pages/goods-information/index.js
const app = getApp()
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};
let _pattern = com.lightningdog.rrq.pattern;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: [
      { name: '装修材料' },
      { name: '冷冻食品' },
      { name: '易碎品' },
      { name:''}
    ],
    goodsTypeVal:'',
    pieceVal:'',
    volumeVal:'',
    priceVal:'',
    weightVal:'',
    paymentTime:'',
    arr2: [
      { name: '小于20公斤', value: "<20" },
      { name: '20-50公斤', value: "20-50" },
      { name: '大于50公斤', value: ">50" }
    ],
    arr3: [
      { name: '装货后付款', value: "afterLoading" },
      { name: '卸货后付款', value: "afterUnloading" }
    ],
    iconActive: true
  },
  toPages() {
    let title = ['goodsTypeVal', 'pieceVal', 'volumeVal', 'weightVal', 'priceVal','paymentTime'];
    let tips = ['请选择货物类型！', '请输入货物件数！', '请输入货物体积！', '请选择货物重量！','请输入运费报价','请选择付款时间！'];
    for (let [index, val] of title.entries()) {
      console.log(index, val, this.data[val]);
      if (this.data[val] == '') {
        wx.showToast({
          title: tips[index],
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }
    if (!_pattern.check(_pattern.regex.name, this.data.goodsTypeVal)) {
      wx.showToast({
        title: "您的输入包含特殊字符！",
        icon: 'none'
      })
      return;
    }
    let parameter = {
      type: 'zeroOrder',
      goodsTypeVal: this.data.goodsTypeVal,
      weightVal: this.data.weightVal,
      pieceVal: Number(this.data.pieceVal),
      priceVal: Number(this.data.priceVal),
      volumeVal: Number( this.data.volumeVal),
      paymentTime: this.data.paymentTime,
      iconActive: this.data.iconActive
    };
    wx.navigateTo({
      url: `/pages/notarize-information/index?obj=${JSON.stringify(parameter)}`,
    })
    console.log('topage')
  },
  onChangeOffer(e){
    console.log(e.detail)
    this.setData({
      priceVal: e.detail
    })
  },
  onChangeVolume(e){
    console.log(e)
    this.setData({
      volumeVal: e.detail
    })
  },
  onChangePiece(e){
    console.log(e)
    this.setData({
      pieceVal: e.detail
    })
  },
  toPage() {
    console.log('topage')
  },
  selectProduct(e) {
    console.log(e)
    this.setData({
      iconActive: !this.data.iconActive
    })
  },
  selectGoodsType(e){
    console.log(e)
    if (e.currentTarget.dataset.index != this.data.arr.length - 1) {
      this.data.arr[this.data.arr.length - 1].name = "";
      this.setData({
        arr: this.data.arr
      })
    }
    this.setData({
      activeT: e.currentTarget.dataset.index,
      goodsTypeVal: e.currentTarget.dataset.item.name,
      arr: this.data.arr
    })
    console.log(this.data.goodsTypeVal)
  },
  selectGoodsWeight(e) {
    this.setData({
      activeW: e.currentTarget.dataset.index,
      weightVal: e.currentTarget.dataset.item
    })
    console.log(this.data.weightVal)
  },
  selectPaymentTime(e){
    this.setData({
      activeTI: e.currentTarget.dataset.index,
      paymentTime: e.currentTarget.dataset.item
    })
  },
  selectInput(e){
    this.data.arr[this.data.activeT].name = e.detail.value;
    this.setData({
      goodsTypeVal: e.detail.value,
      arr: this.data.arr
    })
    console.log(this.data.goodsTypeVal)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    // console.log(app.data.valuation.configParams)
    app.data.valuation.configParams=5
    this.setData({
      futurePrices: app.data.valuation.configParams
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