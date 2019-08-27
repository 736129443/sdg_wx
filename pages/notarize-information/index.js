// pages/notarize-information/index.js
require('../../module/order.js');
//获取应用实例
var app = getApp()
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};
let _order = com.lightningdog.rrq.order;
let _event = com.lightningdog.rrq.event;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    globalTimestamp:0,
    popTimeView: false,//是否展示时间弹出框
    minDate: new Date().getTime() + (60 + 5) * 60 * 1000,//最小时间 获取一小时5分钟之后时间戳（预留5分钟）
    maxDate: new Date().getTime() + 5 * 24 * 60 * 60 * 1000, //最大时间  5天后
      goods:{
        type:'食物',
        weight:100,
        packaging:'长1米高3米',
        shipments:'立即发货',
        piece:'',
        volume:'',
        price:''
      },
     arr:[
     {
       addressName:'鹏博大厦',
       address: '鹏博大厦雁塔路103号'
     },
    {
      addressName: '鹏博大厦',
      address: '鹏博大厦雁塔路103号'
    },
    {
      addressName: '鹏博大厦',
      address: '鹏博大厦雁塔路103号'
       },
       {
         addressName: '鹏博大厦',
         address: '鹏博大厦雁塔路103号'
       }
       ,
       {
         addressName: '鹏博大厦',
         address: '鹏博大厦雁塔路103号'
       }
       ,
       {
         addressName: '鹏博大厦',
         address: '鹏博大厦雁塔路103号'
       }
       ,
       {
         addressName: '鹏博大厦',
         address: '鹏博大厦雁塔路103号'
       }
       
     ],
    ticketPrice:10,
    price:1000 ,
    queryBean:{},
    userConfig:{}
  },
  openOrClosePopView() {
    this.setData({
      popTimeView: !this.data.popTimeView
    })
  },
  sureSelect(e) {
    this.setData({
      globalTimestamp: e.detail
    })
    app.data.creatPrderParams.shipTimestamp = e.detail
    this.openOrClosePopView();
  },
  apiOdFetch(param) {
    wx.showLoading({
      title: '加载中'
    })
    _order.singleCreate(param);
  },
  bindSingleCreate() {
    _event.on('onSingleCreate', "com.lightningdog.rrq.order", "creat", (event, data) => {
      console.log(data);
      wx.showToast({
        title: "创建订单成功",
        icon: 'success'
      });
    });
  },
  onClickButton(e){
    let params={};
    let timestamp = new Date().getTime();
    let addressArr=app.data.creatPrderParams.addressAll.map((item,index,arr)=>{
      let json={
        action: item.action,
        address: item.address,
        area: item.area,
        contractor: item.contractor,
        county: item.county,
        latitude:Number(item.latitude),
        longitude:Number(item.longitude),
        phone: item.phone,
        province: item.province,
        timestamp: timestamp
      };
      return json;
    });
    console.log(addressArr)
    params.goodsList = app.data.creatPrderParams.goodsList;
    params.vehicleReqs = app.data.creatPrderParams.vehicleModel;
    params.roadLine = {
      direction: "莲湖区",
      distance: app.data.creatPrderParams.kilometre,
      locations: addressArr
    }
    params.businessConfig = {
      bill: app.data.valuation,
      createTime: this.data.userConfig.businessConfig.createTime,
      lastTime: this.data.userConfig.businessConfig.lastTime,
      locations: [],
      market: this.data.userConfig.businessConfig.market,
      scene: this.data.queryBean.type == 'vehicle' ? "one" :"pool", //one  整车   pool  // 拼单
      taskConfigs: this.data.userConfig.businessConfig.taskConfigs
   }
    if (this.data.queryBean.type == 'vehicle'){
      params.otherParams = {
        insurance: this.data.goods.iconActive,
        packaging: this.data.goods.packaging.value,
        paymentTime: this.data.goods.paymentTime.value,
        goodsType: this.data.goods.type,
        goodsWeight: this.data.goods.weight.value,
        price: this.data.goods.price
      }
    }else{
      params.otherParams = {
        insurance: this.data.goods.iconActive,
        paymentTime: this.data.goods.paymentTime.value,
        goodsType: this.data.goods.type,
        goodsWeight: this.data.goods.weight.value,
        piece: this.data.goods.piece,
        price: this.data.goods.price,
        volume: this.data.goods.volume
      }
    }
    console.log(params);
    // wx.reLaunch({
    //   url: '/pages/order-find/index'
    // })
    this.apiOdFetch(params)
  },
  toBack(){
    if (this.data.queryBean.type =="vehicle"){
      app.data.isTurePage=true;
      wx.redirectTo({
        url: `/pages/goods-information/index?info=${JSON.stringify(this.data.queryBean)}`
      })
      return;
    }
    wx.navigateBack({});
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let queryBean = JSON.parse(options.obj);
    this.setData({
      goods:{}
    })
    if (queryBean.type =='vehicle'){
      this.setData({
        queryBean: queryBean,
        isShowType: true, 
        ["goods.type"]: queryBean.goodsTypeVal,
        ["goods.weight"]: queryBean.weightVal,
        ["goods.packaging"]: queryBean.packVal,
        ["goods.paymentTime"]: queryBean.paymentTime,
        ["goods.iconActive"]: queryBean.iconActive,
        ["goods.price"]: queryBean.price
      })
    }else{
      this.setData({
        isShowType: false,
        ["goods.type"]: queryBean.goodsTypeVal,
        ["goods.weight"]: queryBean.weightVal,
        ["goods.volume"]: queryBean.volumeVal,
        ["goods.piece"]: queryBean.pieceVal,
        ["goods.price"]: queryBean.priceVal,
        ["goods.paymentTime"]: queryBean.paymentTime,
        ["goods.iconActive"]: queryBean.iconActive
      })
    }
    console.log(this.data.goods)
    try {
      let users = wx.getStorageSync("userConfig");
      if (users.length) {
        console.log(JSON.parse(users));
        this.setData({
          userConfig:JSON.parse(users)
        })
        // Do something with return value
      }
    } catch (e) {
      // Do something when catch error
    }
    // console.log(this.data.goods)
    this.bindSingleCreate();
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
    console.log(app.data.creatPrderParams.shipTimestamp)
    this.setData({
      arr: app.data.creatPrderParams.addressAll,
      globalTimestamp: app.data.creatPrderParams.shipTimestamp
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