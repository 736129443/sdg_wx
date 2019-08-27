require("config.js")
var app = getApp();
var com = app.com || {};
var amapFile = require('../utils/amap-wx.js');//如：..­/..­/libs/amap-wx.js
var myAmap = new amapFile.AMapWX({ key: app.globalData.ampKey });
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};
var _global = com.lightningdog.rrq.global;

var billWay = {
  _request: com.lightningdog.rrq.request,
  _event: com.lightningdog.rrq.event,
  init: function () {
    return this;
  },
  billAll: function () {
    wx.showLoading({
      title: '加载中'
    })
    this._request.post("billWay", "list", {
      token: _global.token
    }).done((errorcode, result) => {
      wx.hideLoading({})
      if (errorcode == 0) {
        this._event.trigger("billWayAll", "com.lightningdog.rrq.billWay", result);
        return;
      }
      wx.showToast({
        icon: "none",
        title: result
      })
    })
  },
  billOne: function (params) {
    wx.showLoading({
      title: '加载中'
    })
    this._request.post("billWay", "one", {
      token: _global.token,
      market: params 
    }).done((errorcode, result) => {
      wx.hideLoading({})
      if (errorcode == 0) {
        this._event.trigger("billWayOne", "com.lightningdog.rrq.billWay", result);
        return;
      }
      wx.showToast({
        icon: "none",
        title: result
      })
    })
  },
  billVehicle: function (params) {
    wx.showLoading({
      title: '加载中'
    })
    this._request.post("billWay", "vehicle", {
      token: _global.token,
      vehicle: params.name
    }).done((errorcode, result) => {
      wx.hideLoading({})
      if (errorcode == 0) {
        this._event.trigger("billVehicle", "com.lightningdog.rrq.billWay", result);
        return;
      }
      wx.showToast({
        icon: "none",
        title: result
      })
    })
  },
  calculationKm: function (params, callback, errback){
    console.log(params)
    let lineArr=params;
    let startLine = `${lineArr[0].longitude},${lineArr[0].latitude}`;//起点
    let approachLine = ""; //途径点
    let endLine = `${lineArr[lineArr.length - 1].longitude}, ${lineArr[lineArr.length - 1].latitude}`;//重点

    //查找途径点
    if (lineArr.length > 2) {
      for (let i = 1; i < lineArr.length - 1; i++) {
        if (i == lineArr.length - 2) {
          console.log(i)
          approachLine += `${lineArr[i].longitude}, ${lineArr[i].latitude}`
        } else {
          approachLine += `${lineArr[i].longitude}, ${lineArr[i].latitude};`
        }
      }
    } 

    //计算结果
    this.creatLinePromise(startLine, approachLine, endLine).then(res => {
      callback((Number(res.paths[0].distance) / 1000).toFixed(2));
    }, err => {
      errback(err);
    });
  },
  creatLinePromise:function(start,middle,end){
    return new Promise((resolve, reject) => {
      myAmap.getDrivingRoute({
        origin: start,
        destination: end,
        waypoints: middle,
        success: function (res) {
          resolve(res);
        },
        fail: function (err) {
          reject(err);
        }
      });
    });  
  },
  pricingWay(params){
    let result;
    switch (params.way) {
      //票
      case "BT":
        result=this.formulaBT(params);
        break;
      //一口价
      case "BF":
        result=this.formulaBF(params);
        break;
      //整车     
      case "BV":
        result=this.formulaBV(params);
        break;
      //商品计价
      case "BG":
        result = this.formulaBG(params);
        break;
      //小时
      case "BH":
        result = this.formulaBH(params);
        break;  
      case "BK":
        result = this.formulaBK(params);
        break;  
      case "BP":
        result = this.formulaBP(params);
        break;   
    }
    return result;
  },
  formulaBF(params) {
    let CP = params.configParams == null ? 0 : params.configParams;
    let IP = params.inputParams == null ? 0 : params.configParams;
    //PC*PP
    return CP;
  },
  formulaBP(params){
    let PC = params.configParams.PC.value == null ? 0 : params.configParams.PC.value;
    let PP = params.inputParams.PP.value; 
    //PC*PP
    return this.accMul(PC, PP); 
  },
  formulaBK(params){
    //系统返回-超里程数单价
    let OPP = params.configParams.OPP.value == null ? 0 : params.configParams.OPP.value;
    //系统返回-超里程数单价
    let OKP = params.configParams.OKP.value == null ? 0 : params.configParams.OKP.value;
    //系统返回-超票单价
    let OTP = params.configParams.OTP.value == null ? 0 : params.configParams.OTP.value;
    //系统返回-超体积单价
    let OVP = params.configParams.OVP.value == null ? 0 : params.configParams.OVP.value;
    //系统返回-超重量单价
    let OWP = params.configParams.OWP.value == null ? 0 : params.configParams.OWP.value;
    //系统返回-超起步价内点位数
    let UIT = params.configParams.UIT.value == null ? 0 : params.configParams.UIT.value;
    //系统返回-超起步价内公里数
    let UK = params.configParams.UK.value == null ? 0 : params.configParams.UK.value;
    //系统返回-起步价格
    let UP = params.configParams.UP.value == null ? 0 : params.configParams.UP.value;
    //系统返回-起步价内票数
    let UT = params.configParams.UT.value == null ? 0 : params.configParams.UT.value;
    //系统返回-起步价内体积
    let UV = params.configParams.UV.value == null ? 0 : params.configParams.UV.value;
    //系统返回-起步价内重量
    let UW = params.configParams.UW.value == null ? 0 : params.configParams.UW.value;

    //实跑公里数
    let KC = params.inputParams.KC.value == null ? 0 : params.inputParams.KC.value;
    //实际点数
    let PIC = params.inputParams.PIC.value == null ? 0 : params.inputParams.PIC.value;
    //实际票数
    let TC = params.inputParams.TC.value == null ? 0 : params.inputParams.TC.value;
    //实际体积
    let VC = params.inputParams.VC.value == null ? 0 : params.inputParams.VC.value;
    //实际重量
    let WTC = params.inputParams.WTC.value == null ? 0 : params.inputParams.WTC.value;

    //(KC-UK)*OKP
    let resultOne = this.accMul(this.subtr(KC, UK), OKP);
    //(PIC-UIT)*OPP
    let resultTwo = this.accMul(this.subtr(PIC, UIT), OPP);
    //(WTC-UW)*OWP
    let resultThree = this.accMul(this.subtr(WTC, UW), OWP);
    //(VC-UV)*OVP
    let resultFour = this.accMul(this.subtr(VC, UV), OVP);
    //(TC-UT)*OTP
    let resultFive = this.accMul(this.subtr(TC, UT), OTP);
    //UP+(KC-UK)*OKP+(PIC-UIT)*OPP+(WTC-UW)*OWP+(VC-UV)*OVP+(TC-UT)*OTP
    console.log(resultOne, resultTwo, resultThree, resultFour, resultFive);
    return this.accAdd(UP, this.accAdd(resultOne, this.accAdd(resultTwo, this.accAdd(resultThree, this.accAdd(resultFour, resultFive)))));
  },
  formulaBH(params) {
    //4小时系统值
    let FHP = params.configParams.FHP.value == null ? 0 : params.configParams.FHP.value;
    //9小时系统值
    let NHP = params.configParams.NHP.value == null ? 0 : params.configParams.NHP.value;
    //13小时系统值
    let THP = params.configParams.THP.value == null ? 0 : params.configParams.THP.value;

    //4小时输入值
    let HRF = params.inputParams.HRF.value == undefined ? 0 : params.inputParams.HRF.value;
    //9小时输入值
    let HRN = params.inputParams.HRN.value == undefined ? 0 : params.inputParams.HRN.value;
    //13小时输入值
    let HRT = params.inputParams.HRT.value == undefined ? 0 : params.inputParams.HRT.value;

    //FHP*HRF+NHP*HRN+THP*HRT
    return this.accAdd(this.accAdd(this.accMul(FHP, HRF), this.accMul(NHP, HRN)), this.accMul(THP, HRT));
  },
  formulaBT(params){
    let TP = params.configParams.TP.value == null ? 0 : params.configParams.TP.value;
    let TC = params.inputParams.TC.value; 

    //TP*TC
    return this.accMul(TP,TC); 
  },
  formulaBG(params) {

  },
  formulaBV(params) {

  },
  formulaBT(params) {

  },
  //js 加法计算
  //调用：accAdd(arg1,arg2)
  //返回值：arg1加arg2的精确结果
  accAdd(arg1, arg2) {
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2))
    return Number(((arg1 * m + arg2 * m) / m).toFixed(2));
  },
//js 减法计算
//调用：Subtr(arg1,arg2)
//返回值：arg1减arg2的精确结果
  subtr(arg1, arg2) {
    var r1, r2, m, n;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    //last modify by deeka
    //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return Number(((arg1 * m - arg2 * m) / m).toFixed(2));
  },
  //js 乘法函数
  //调用：accMul(arg1,arg2)
  //返回值：arg1乘以arg2的精确结果
  accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    var result = (Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)).toFixed(2);
    return Number(result);
  },
//js 除法函数
//调用：accDiv(arg1,arg2)
//返回值：arg1除以arg2的精确结果
  accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
    try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
    r1 = Number(arg1.toString().replace(".", ""))
    r2 = Number(arg2.toString().replace(".", ""))
    var result = ((r1 / r2) * Math.pow(10, t2 - t1)).toFixed(2);
    return Number(result);
  } 
};

(function (NS, billWay) {
  NS.billWay = billWay;
  module.exports = NS.config;
  // var looper = function () {
  //   console.log("looper ....")
  //   var _global = NS.global;
  //   var _account = NS.account;
  //   if (_global.token) {
  //     // _account.heartbeat();
  //   }
  //   setTimeout(looper, 60000)
  // }

  // setTimeout(looper, 60000)
})(com.lightningdog.rrq, billWay)