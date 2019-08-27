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
      { name: '装修材料'},
      { name: '生鲜水果'},
      { name: '冷冻食品'},
      { name: '易碎品'},
      { name: '重物'},
      { name: '防挤压'},
      { name: '电子产品'},
      { name: '家具'},
      { name: '', }
    ],
    goodsTypeVal: '',
    weightVal: '',
    packVal:'',
    paymentTime: '',
    arr2: [
      { name: '小于20公斤' ,value:"<20"},
      { name: '20-50公斤', value: "20-50"},
      { name: '大于50公斤', value: ">50" }
    ],
    arr3: [
      { name: '长1米内' ,value:"L1"},
      { name: '长1-2米', value: "1-2"},
      { name: '长2米以上', value: ">2" },
      { name: '高1米内',value:"H1"},
      { name: '高1-2米', value: "1-2" },
      { name: '高2-2.5米', value: "2-2.5" },
      { name: '高2.5米以上',value: ">2.5"}
    ],
    arr4: [
      { name: '现在付款', value:"now"},
      { name: '装货后付款', value: "afterLoading" },
      { name: '卸货后付款', value: "afterUnloading" }
    ],
    iconActive:true
  },
  toPages(){
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];  //上一个页面
    let title = ['goodsTypeVal', 'weightVal', 'packVal','paymentTime'];
    let tips = ['请选择货物类型！', '请选择单价重量！', '请选择包装规格！','请选择付款时间！'];
    for (let [index, val] of title.entries()) {
      console.log(index, val, this.data[val]);
      if (this.data[val]=='') {
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
    prevPage.setData({
      goodsInfomation:{
        type: 'vehicle',
        goodsTypeVal: this.data.goodsTypeVal,
        weightVal: this.data.weightVal,
        packVal: this.data.packVal,
        paymentTime: this.data.paymentTime,
        activeT: this.data.activeT,
        activeW: this.data.activeW,
        activeP: this.data.activeP,
        activeTI: this.data.activeTI
      }
    })
    
    if (app.data.isTurePage){
      let parameter = {
        type: 'vehicle',
        goodsTypeVal: this.data.goodsTypeVal,
        weightVal: this.data.weightVal,
        packVal: this.data.packVal,
        paymentTime: this.data.paymentTime,
        activeT: this.data.activeT,
        activeW: this.data.activeW,
        activeP: this.data.activeP,
        activeTI: this.data.activeTI
      };  
      wx.redirectTo({
        url: `/pages/notarize-information/index?obj=${JSON.stringify(parameter)}`
      })
    }else{
      wx.navigateBack({});
    }
  },
  selectProduct(e){
    console.log(e)
    this.setData({
      iconActive: !this.data.iconActive
    })
  },
  selectGoodsType(e) {
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
  },
  selectInput(e) {
    console.log(e.detail)
    this.data.arr[this.data.activeT].name = e.detail.value;
    this.setData({
      goodsTypeVal: e.detail.value,
      arr: this.data.arr
    })
  },
  selectGoodsWeight(e) {
    this.setData({
      activeW: e.currentTarget.dataset.index,
      weightVal: e.currentTarget.dataset.item
    })
    console.log(this.data.weightVal)
  },
  selectGoodsPack(e){
    this.setData({
      activeP: e.currentTarget.dataset.index,
      packVal: e.currentTarget.dataset.item
    })
    console.log(this.data.packVal)
  },
  selectPaymentTime(e) {
    this.setData({
      activeTI: e.currentTarget.dataset.index,
      paymentTime: e.currentTarget.dataset.item
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let infoObj=JSON.parse(options.info);
    if(infoObj!=null){
      if (infoObj.activeT==this.data.arr.length-1){
        this.data.arr[infoObj.activeT].name = infoObj.goodsTypeVal;
      }
      this.setData({
        goodsTypeVal: infoObj.goodsTypeVal,
        weightVal: infoObj.weightVal,
        packVal: infoObj.packVal,
        paymentTime:infoObj.paymentTime,
        activeT: infoObj.activeT,
        activeW: infoObj.activeW,
        activeP: infoObj.activeP,
        activeTI: infoObj.activeTI,
        arr:this.data.arr
      })
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
    //this.setLineData()
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