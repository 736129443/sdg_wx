require('../../module/billWay.js');
require('../../module/vehicle.js')
let amapFile = require('../../utils/amap-wx.js');//如：..­/..­/libs/amap-wx.js
const startIcon = '/images/fast-ride/map/ic_begin.png'; //标记图片
const middleIcon = '/images/fast-ride/map/ic_through.png'; //标记图片
const endIcon = '/images/fast-ride/map/ic_finish.png'; //标记图片
let app = getApp();
const imgW = 34.5;// 地图标记点图片宽度
const imgH = 42.5;// 地图标记点图片高度
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};
let _billWay = com.lightningdog.rrq.billWay;
let _vehicle = com.lightningdog.rrq.vehicle;
let _event = com.lightningdog.rrq.event;
let _pattern = com.lightningdog.rrq.pattern;
Page({
  data: {
    futurePrices: 0,
    user: null,
    indexFlag: null,
    windowHeight: 0,
    windowWidth: 0,
    kilometre: 0,
    active: 0,//当前用车类型
    active2: 0,//当前车辆类型
    navTitle: '西安市',//导航城市名称
    reversal: false,
    markers: [
      {
        latitude: '',
        longitude: '',
        iconPath: startIcon,
        width: imgW,
        height: imgH,
        callout: {
          content: '',
          color: '#424242',
          display: 'ALWAYS',
          padding: 4,
          borderRadius: 6,
          fontSize: 8
        }
      },
      {
        latitude: '',
        longitude: '',
        iconPath: endIcon,
        width: imgW,
        height: imgH,
        callout: {
          content: '',
          color: '#424242',
          display: 'ALWAYS',
          padding: 4,
          borderRadius: 6,
          fontSize: 8
        }
      }
    ],// 地图标记点数组
    siteArray: [],// 地点数组
    imgAnimationData: null,//图片动画数据
    rotateNum: 0, //旋转按钮角度
    startLocation: null,//定位坐标
    popTimeView: false,//是否展示时间弹出框
    startAddress: null,//起点
    secondAddress: null,// 第二个点
    points: [],//地图包含点
    appointmentTimestamp: new Date().getTime() + (60 + 5) * 60 * 1000,// 获取一小时5分钟之后时间戳（预留5分钟）
    minDate: new Date().getTime() + (60 + 5) * 60 * 1000,//最小时间
    maxDate: new Date().getTime() + 5 * 24 * 60 * 60 * 1000, //最大时间  5天后
    carTypeList: [// 车辆类型列表
    ],
    selectedCar: null,
    showLoc: true,// 是否展示定位
    latitude: '', //地图当前中心纬度
    longitude: '',//地图当前中心经度
    navH: app.globalData.navHeight + 'px',
    myAmapFun: null, ///地图实例
    infoArray: [{
      status: '2',
    },
    {
      status: '2',
    },
    {
      status: '2',
    },
    {
      status: '2',
    }],
    goodsInfomation: null,
    tabTitle: '发整车',
    recomPrice: '',
    carClaim: ['叉车', '托盘', '宿舍', '食堂', '办公室', '停车场'],//配套设施数组
    carClaimStr: "",
    showMultiple: false,
    defaultMultipleStr: '',//默认多选值
    multipleData: [],// 多选数组
    flag: '', // 多选标识
    iconActive: true,//畅心保险
    isNow: true,//是否是 现在状态
    isShowPopup: false,//是否显示地图信息框
    isShowGoodBox: false,//整车货物信息
    isShowButton: false,//零单按钮
    isShowVehicleBox: true,//车型信息
    isShowPredictBox: true,//预估价
    billWayObj: null
  },

  toPages() {
    let startAddress = this.data.startAddress;
    let secondAddress = this.data.secondAddress;
    let siteArray = this.data.siteArray;
    if (siteArray.length) {
      for (let [index, val] of siteArray.entries()) {
        console.log(index, val);
        if (val.latitude == undefined && val.longitude == undefined) {
          wx.showToast({
            title: `第${index + 3}行,地址不能为空！`,
            icon: 'none'
          });
          return;
        }
        if (val.phone == '') {
          wx.showToast({
            title: `第${index + 3}行,手机号码不能为空！`,
            icon: 'none'
          });
          return;
        }
        if (!_pattern.check(_pattern.regex.phone, val.phone)) {
          wx.showToast({
            title: `第${index + 3}行,手机号码格式有误！`,
            icon: 'none'
          });
          return;
        }
      }
    };

    let title = ['startAddress', 'secondAddress', 'goodsInfomation'];
    let tips = ['地址不完善!', '地址不完善!', '货物信息选项不能为空！'];
    for (let [index, val] of title.entries()) {
      console.log(index, val, this.data[val]);
      if (this.data[val] == '' || this.data[val] == null) {
        wx.showToast({
          title: tips[index],
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (this.data[val]['phone'] != undefined) {
        if (this.data[val]['phone'] == '') {
          wx.showToast({
            title: `第${index + 1}行,手机号码不能为空！`,
            icon: 'none',
            duration: 2000
          })
          return;
        }
        if (!_pattern.check(_pattern.regex.phone, this.data[val]['phone'])) {
          wx.showToast({
            title: `第${index + 1}行,手机号码格式有误!`,
            icon: 'none'
          })
          return;
        }
      }
    }
    if (this.data.billWayObj.way == "BF" && this.data.recomPrice == "") {
      wx.showToast({
        title: "报价运费不能为空！",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    //全局车型
    this.setAppData("addressAll", [startAddress, secondAddress, ...siteArray]);
    //全局用车计算公式参数整理
    this.setAppData("bill", this.data.billWayObj, Number(this.data.recomPrice));
    //全局发货时间
    app.data.creatPrderParams.shipTimestamp = this.data.appointmentTimestamp;
    let parameter = {
      type: 'vehicle',
      goodsTypeVal: this.data.goodsInfomation.goodsTypeVal,
      weightVal: this.data.goodsInfomation.weightVal,
      packVal: this.data.goodsInfomation.packVal,
      paymentTime: this.data.goodsInfomation.paymentTime,
      activeT: this.data.goodsInfomation.activeT,
      activeW: this.data.goodsInfomation.activeW,
      activeP: this.data.goodsInfomation.activeP,
      activeTI: this.data.goodsInfomation.activeTI,
      iconActive: this.data.iconActive,
      price: this.data.billWayObj.way == "BK" ? Number(this.data.futurePrices) : Number(this.data.recomPrice)
    };
    wx.navigateTo({
      url: `/pages/notarize-information/index?obj=${JSON.stringify(parameter)}`
    })
  },
  multipleSure(e) {
    let flag = e.detail.flag;
    console.log(e)
    if (flag == 'carClaim') {
      this.setData({
        showMultiple: false,
        carClaimStr: e.detail.select
      })
    }
    console.log(this.data.carClaimStr)
  },
  carClaim() {
    this.setData({
      showMultiple: true,
      multipleData: this.data.carClaim,
      defaultMultipleStr: this.data.carClaimStr,
      flag: 'carClaim'
    })
  },
  selectProduct(e) {
    console.log(e)
    this.setData({
      iconActive: !this.data.iconActive
    })
  },
  commonAddress() {
    wx.navigateTo({
      url: '/pages/common-address/index',
    })
  },
  setPrice(e) {
    this.setData({
      recomPrice: e.detail.value
    })
    console.log(this.data.recomPrice);
  },
  selectCar(e) {
    this.setAppData("vehicleModel", this.data.carTypeList[e.detail.index]);
    this.setData({
      selectedCar: this.data.carTypeList[e.detail.index],
      active2: e.detail.index,
      futurePrices: 0
    })
    this.apiBillVehicleFetch({ name: this.data.selectedCar.name });
  },
  onHide: function () {
    console.log("onHide");
    // this.setData({
    //   isInit:true
    // })
  },
  breakbulk() {
    this.setData({
      isShowButton: true,
      isShowGoodBox: false,
      isShowVehicleBox: false,
      isShowPredictBox: false
    })
  },
  vehicle() {
    if (this.data.startAddress != null && this.data.secondAddress != null) {
      if (this.data.startAddress.latitude != undefined && this.data.secondAddress.latitude != undefined) {
        if (this.data.billWayObj.way == 'BK' && this.data.billWayObj != null) {
          this.setData({
            isShowPredictBox: true,
          })
        } else {
          this.setData({
            isShowPredictBox: false,
          })
        }
        this.setData({
          isShowGoodBox: true,
        })
      } else {
        this.setData({
          isShowGoodBox: false
        })
      }
    }
    this.setData({
      isShowButton: false,
      isShowVehicleBox: true,
    })
  },
  tabIndex() {
    switch (this.data.active) {
      case 0: //整车
        this.vehicle();
        break;
      case 1: //零担
        this.breakbulk();
        break;
    }
  },
  onShow: function () {
    app.data.isTurePage = false;
    this.editAddressInfo('init');
    this.includePoints();
    // console.log(this.data.goodsInfomation)
    //页面显示触发：请求系统公式-->获取里程-->参数整理-->计算结果(满足最少有两个经纬度地址)
    if (this.data.startAddress != null && this.data.secondAddress != null && this.data.startAddress.latitude != undefined && this.data.secondAddress.latitude != undefined) {
      this.apiBillVehicleFetch({ name: this.data.selectedCar.name });
    }
  },
  bindBillVehicleEvent() {
    _event.on('billVehicle', "com.lightningdog.rrq.billWay", "list", (event, data) => {
      //计算公里
      if (this.data.startAddress != null && this.data.secondAddress != null && this.data.startAddress.latitude != undefined && this.data.secondAddress.latitude != undefined) {
        if (this.data.active2 == 1) {
          data.way = "BF"
          data.configParams = 5;
        } else {
          data.way = "BK"
          data.configParams.OKP.value = 2;
          data.configParams.UK.value = 2;
          data.configParams.UP.value = 10;
        }
        if (this.data.active2 == 0) {
          data.configParams.OKP.value = 6;
          data.configParams.UK.value = 2;
          data.configParams.UP.value = 10;
        }
        switch (data.way) {
          case "BK": //车型与公里计价
            this.lineMileage(data);
            break;
          case "BF": //一口价
            this.setParamsBF(data);
            break;
        }
        this.setData({
          billWayObj: data
        })
        //显示控制
        this.tabIndex();
      }
    });
  },
  bindEhicleAllEvent() {
    _event.on('vehicleAll', "com.lightningdog.rrq.vehicle", "list", (event, data) => {
      console.log(data);
      if (data.length) {
        this.setData({
          carTypeList: data,
          selectedCar: data[0]
        })
        this.setAppData("vehicleModel", data[0]);
        //this.apiBillVehicleFetch({ name: data[0].name });
      }
    });
  },
  apiBillVehicleFetch(param) {
    _billWay.billVehicle(param);
  },
  apiEhicleAllFetch() {
    _vehicle.vehicleAll();
  },
  lineMileage(obj) {
    console.log(this.data.startAddress);
    _billWay.calculationKm([this.data.startAddress, this.data.secondAddress, ... this.data.siteArray], (res) => {
      this.setAppData("kilometre", res);
      this.setData({
        kilometre: res
      })
      console.log(res)
      this.setParamsBK(obj, res);
    }, (err) => {
      console.log(err);
    })
  },
  setParamsBK(obj, other) {
    let addressArr = [obj].map((item, index, arr) => {
      console.log(item, index, arr)
      let json = {
        cname: item.cname,
        formula: item.formula,
        way: item.way
      };
      if (item.configParams != null) {
        for (var key of Object.keys(item.configParams)) {
          // console.log(key + ': ' + item.configParams[key].value);
          if (item.configParams[key].value == null) {
            item.configParams[key].value = 0;
          }
        }
      }
      if (item.inputParams != null) {
        for (var key of Object.keys(item.inputParams)) {
          if (item.inputParams[key].value == null) {
            item.inputParams[key].value = 0;
          }
        }
      }
      json.configParams = item.configParams;
      json.inputParams = item.inputParams;
      return json;
    });
    addressArr[0].inputParams.KC.value = Number(other);
    //BK 计算结果
    let result = _billWay.pricingWay(addressArr[0]);
    //app.data.futurePrices = result;
    this.setData({
      futurePrices: result,
      billWayObj: addressArr[0]
    })
  },
  setParamsBF(obj) {
    //BK 计算结果
    let result = _billWay.pricingWay(obj);
    //app.data.futurePrices = result;
    this.setData({
      futurePrices: result
    })
  },
  /** 生命周期函数 初始加载 */
  onLoad: function () {
    var self = this;
    self.mapCtx = wx.createMapContext('map')
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success: (result) => {
        self.getMarkerRegeo(`${result.longitude},${result.latitude}`, 0);
      },
      fail: () => {
        wx.showToast({
          title: '定位失败，请检查网络',
          icon: 'none'
        });
      },
      complete: () => { }
    });
    self.data.myAmapFun = new amapFile.AMapWX({ key: getApp().globalData.ampKey });
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });
    //绑定成型接口
    this.bindEhicleAllEvent();
    this.bindBillVehicleEvent();
    //初始化--请求车型
    this.apiEhicleAllFetch();
  },
  setAppData(type, params, price = 0) {
    if (type == "bill") {
      if (params.way == "BK") {
        app.data.valuation = params;
        return;
      }
      if (params.way == "BF") {
        params.inputParams = price;
        params.configParams = price;
        params.cname = "一口价";
        params.formula = "";
        app.data.valuation = params;
        return;
      }
    }
    if (type == "addressAll") {
      app.data.creatPrderParams.addressAll = params;
      return;
    }
    if (type == "vehicleModel") {
      app.data.creatPrderParams.vehicleModel = [params];
      return;
    }
    if (type == "kilometre") {
      app.data.creatPrderParams.kilometre = params;
      return;
    }
  },
  toPriceDetail() {
    wx.navigateTo({
      url: '/pages/price-detail/index',
    })
  },
  toNextPage() {
    let startAddress = this.data.startAddress;
    let secondAddress = this.data.secondAddress;
    let siteArray = this.data.siteArray;
    if (siteArray.length) {
      for (let [index, val] of siteArray.entries()) {
        if (val.latitude == undefined && val.longitude == undefined) {
          wx.showToast({
            title: `第${index + 3}行,地址不能为空！`,
            icon: 'none'
          });
          return;
        }
        if (val.phone == '') {
          wx.showToast({
            title: `第${index + 3}行,手机号码不能为空！`,
            icon: 'none'
          });
          return;
        }
        if (!_pattern.check(_pattern.regex.phone, val.phone)) {
          wx.showToast({
            title: `第${index + 3}行,手机号码格式有误！`,
            icon: 'none'
          });
          return;
        }
      }
    }
    let title = ['startAddress', 'secondAddress'];
    let tips = ['地址不完善!', '地址不完善!'];
    for (let [index, val] of title.entries()) {
      console.log(index, val, this.data[val]);
      if (this.data[val] == '' || this.data[val] == undefined) {
        wx.showToast({
          title: tips[index],
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (this.data[val]['phone'] == '') {
        wx.showToast({
          title: `第${index + 1}行,手机号码不能为空！`,
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (!_pattern.check(_pattern.regex.phone, this.data[val]['phone'])) {
        wx.showToast({
          title: `第${index + 1}行,手机号码格式有误!`,
          icon: 'none'
        })
        return;
      }
    }
    if (this.data.startAddress == null || this.data.secondAddress == null) {
      wx.showToast({
        title: '地址不完善!',
        icon: 'none'
      });
      return;
    }
    //全局地址
    this.setAppData("addressAll", [startAddress, secondAddress, ...siteArray]);
    //全局零担计算公式参数重新整理
    let obj = {}
    obj.way = "BF";
    obj.cname = "一口价";
    // obj.configParams = this.data.billWayObj.inputParams;
    obj.configParams = 0;
    obj.inputParams = 0;
    obj.formula = "";
    this.setAppData("bill", obj);
    //全局发货时间
    app.data.creatPrderParams.shipTimestamp = this.data.appointmentTimestamp;
    if (this.data.tabTitle == '发整车') {
      wx.navigateTo({
        url: `/pages/goods-information/index?info=${JSON.stringify(this.data.goodsInfomation)}`
      })
    } else {
      wx.navigateTo({
        url: '/pages/goods-information-two/index'
      })
    }

  },
  includePoints: function () {
    let arr = [];
    for (let i = 0; i < this.data.markers.length; i++) {
      if (this.data.markers[i].longitude != '' || this.data.markers[i].latitude != '') {
        arr.push({
          latitude: this.data.markers[i].latitude,
          longitude: this.data.markers[i].longitude,
        })
      }
    }
    console.log(arr);
    this.mapCtx.includePoints({
      padding: [100],
      points: arr
    })
  },
  /**
   * @description: 逆地理编码
   * @param {location} 经纬度字符串
   * @param {i} 下标
   * @return: none
   */
  getMarkerRegeo(location, i) {
    var self = this;
    self.data.myAmapFun.getRegeo({
      location: location,
      success: (res) => {
        console.log(res)
        // let obj = self.data.markers[i];
        // let desc = res[0].desc;
        //去掉附近
        // if (res[0].desc.indexOf('附近') >= 0) {
        //   desc = desc.split("附近").join("");
        // }
        // obj.address = desc;
        // obj.detail = res[0].name;
        // obj.adcode = res[0].regeocodeData.addressComponent.adcode;
        // let arrObj = `self.data.markers[${i}]`;

        if (i == 0 || i == 1) {// 起点或者第二个点
          //let addressObj = {
          // address: desc,
          // detail: res[0].name,
          //latitude: res[0].latitude,
          //longitude: res[0].longitude
          // adcode: res[0].regeocodeData.addressComponent.adcode
          //};
          if (i == 0) {
            self.setData({
              latitude: res[0].latitude,
              longitude: res[0].longitude
            })
            console.log(self.data.startAddress, this.data.latitude, this.data.longitude)
          }
        }
        // self.setData({
        //   [arrObj]: obj,
        // });
      },
      fail: () => {

      }
    })
  },
  /**
   * @description: 地图视野改变回调
   * @param {e} 事件对象
   * @return: none
   */
  mapChange(e) {
    if (this.data.markers.length > 1) {//标记点超过两个不执行
      return;
    }
    let self = this;
    if (e.type == 'begin') {
      self.setData({
        markers: []
      })
    } else if (e.type == 'end') {
      let mapCtx = wx.createMapContext('map')
      mapCtx.getCenterLocation({
        success: function (result) {
          let firstObj = {
            latitude: result.latitude,
            longitude: result.longitude,
            iconPath: selfIcon,
            width: imgW,
            height: imgH,
            id: 0
          };
          let markerArr = [firstObj];
          self.setData({
            markers: markerArr,
            showLoc: false
          });

          self.getMarkerRegeo(`${result.longitude},${result.latitude}`, 0);
        }
      })
    }
  },
  /**
   * @description: 打开/关闭蒙层
   * @return: 
   */
  openOrClosePopView() {
    this.setData({
      popTimeView: !this.data.popTimeView
    })
  },
  onTabsClick(e) {
    console.log(e)
  },
  /**
   * @description: 现在/预约切换
   * @param {e} 事件对象 
   * @return: none
   */
  timeStateSwitch(e) {
    let self = this;
    // if (e.currentTarget.dataset.isnow == self.data.isNow) {
    //   return;
    // }
    let isNow;
    if (e.detail.index == 0) {//现在
      isNow = true;
    } else {// 预约
      isNow = false;
      wx.showToast({
        title: '请提前1小时预约用车',
        icon: 'none'
      });
    }
    self.setData({
      isNow: isNow,
      active: e.detail.index,
      tabTitle: e.detail.title
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    this.tabIndex();

  },
  /**
   * @description: 确定选择时间
   * @param {id} e  回调参数
   * @return: none
   */
  sureSelect(e) {
    this.setData({
      appointmentTimestamp: e.detail
    })
    this.openOrClosePopView();
  },
  /**
   * @description: 左右切换
   * @param {e} 事件对象  
   * @return: none
   */
  switchTab(e) {
    let self = this;
    let active = self.data.active2;
    switch (Number(e.currentTarget.dataset.type)) {
      case 0: //左
        active--;
        break;
      case 1: //右
        active++;
        break;
    }
    if (active > self.data.carTypeList.length - 1) {
      active = 0;
    } else if (active < 0) {
      active = self.data.carTypeList.length - 1;
    }
    this.setAppData("vehicleModel", this.data.carTypeList[active]);
    self.setData({
      active2: active,
      isInit: false,
      selectedCar: this.data.carTypeList[active],
      futurePrices: 0
    })
    console.log(this.data.selectedCar)
    this.apiBillVehicleFetch({ name: this.data.selectedCar.name });
  },
  sunbmits() {
    wx.showTabBar();
    let self = this;
    let index = this.data.indexFlag;
    self.setData({
      isShowPopup: false
    })
    switch (index) {
      case 99://起点
        if (self.data.user == null || self.data.user.number == undefined || self.data.user.contractor == undefined || self.data.user.phone == undefined) {
          return;
        }
        self.setData({
          ["startAddress.number"]: this.data.user.number,
          ["startAddress.contractor"]: this.data.user.contractor,
          ["startAddress.phone"]: this.data.user.phone
        })
        break;
      case 0://第二个点
        if (self.data.user == null || self.data.user.number == undefined || self.data.user.contractor == undefined || self.data.user.phone == undefined) {
          return;
        }
        self.setData({
          ["secondAddress.number"]: this.data.user.number,
          ["secondAddress.contractor"]: this.data.user.contractor,
          ["secondAddress.phone"]: this.data.user.phone
        })
        break;
      default:
        if (self.data.user == null || self.data.user.number == undefined || self.data.user.contractor == undefined || self.data.user.phone == undefined) {
          return;
        }
        let item = this.data.siteArray[index - 1];
        self.setData({
          ["item.number"]: this.data.user.number,
          ["item.contractor"]: this.data.user.contractor,
          ["item.phone"]: this.data.user.phone
        })
    }

  },
  onChangeNumber(e) {
    this.setData({
      ["user.number"]: e.detail
    })
    console.log(e.detail)
  },
  onChangePhone(e) {
    this.setData({
      ["user.phone"]: e.detail
    })
    console.log(e.detail)
  },
  onChangeName(e) {
    this.setData({
      ["user.contractor"]: e.detail
    })
    console.log(e.detail)
  },
  /**
   * @description: 编辑地址信息
   * @param {e} 事件对象
   * @return: none
   */
  editAddressInfo(e) {
    let self = this;
    let index;
    if (e == 'init') {
      index = this.data.indexFlag;
    } else {
      index = Number(e.currentTarget.dataset.index);
    }
    switch (index) {
      case 99://起点
        self.setData({
          user: this.data.startAddress
        })
        break;
      case 0://第二个点
        self.setData({
          user: this.data.secondAddress
        })
        break;
      default:
        self.setData({
          user: this.data.siteArray.length > 0 ? this.data.siteArray[index - 1] : null
        })
    }
    if (e != 'init') {
      self.setData({
        isShowPopup: true,
        indexFlag: index
      })
    }
    if (this.data.isShowPopup) {
      wx.hideTabBar();
    }
    this.includePoints()
    console.log(this.data.startAddress, this.data.secondAddress)
  },
  /**
   * @description: 添加地址
   * @param {e} 事件对象
   * @return: none
   */
  addAddress(e) {
    let self = this;
    let site = [...self.data.siteArray];
    let newObj = {};
    let firstObj = {
      latitude: '',
      longitude: '',
      iconPath: endIcon,
      width: imgW,
      height: imgH,
      callout: {
        content: '',
        color: '#424242',
        display: 'ALWAYS',
        padding: 4,
        borderRadius: 6,
        fontSize: 8
      }
    }
    site.push(newObj);
    this.data.markers.push(firstObj)

    self.setData({
      siteArray: site,
      markers: this.data.markers
    })
    if (this.data.markers.length > 2) {
      for (let i = 1; i < this.data.markers.length; i++) {
        if (i < this.data.markers.length - 1) {
          this.data.markers[i].iconPath = middleIcon
        }
      }
      self.setData({
        markers: this.data.markers
      })
      console.log(this.data.markers)
    }
  },
  /**
   * @description: 删除地址
   * @param {e} 事件对象
   * @return: none
   */
  deleteAddress(e) {
    let self = this;
    let site = [...self.data.siteArray];
    let index = Number(e.currentTarget.dataset.index);
    if (index > 0) {
      site.splice(index - 1, 1);
      this.data.markers.splice(index + 1, 1)
      self.setData({
        siteArray: site,
        markers: this.data.markers
      })
    }

    for (let i = 1; i < this.data.markers.length; i++) {
      if (i == this.data.markers.length - 1) {
        this.data.markers[i].iconPath = endIcon
      }
    }
    self.setData({
      markers: this.data.markers
    })
    console.log(this.data.markers);

    this.lineMileage(this.data.billWayObj)

  },
  /**
   * @description: 交换起终点
   * @param {e} 事件对象
   * @return: none
   */
  changeAddress(e) {
    let self = this;
    let animation = wx.createAnimation({});
    let rotateNum = self.data.rotateNum + 180;
    animation.rotate(rotateNum).step();
    if (!this.data.reversal) {
      this.data.markers[0].iconPath = endIcon;
      this.data.markers[1].iconPath = startIcon;
    } else {
      this.data.markers[1].iconPath = endIcon;
      this.data.markers[0].iconPath = startIcon;
    }
    self.setData({
      reversal: !this.data.reversal,
      markers: this.data.markers,
      imgAnimationData: animation.export(),
      rotateNum: rotateNum,
      startAddress: self.data.secondAddress,
      secondAddress: self.data.startAddress
    })
  },
  /**
   * @description: cell点击事件
   * @param {e} 事件对象
   * @return: none
   */
  cellClick(e) {
    let index;
    if (e.currentTarget.dataset.index == 'popup') {
      index = this.data.indexFlag;
    } else {
      index = Number(e.currentTarget.dataset.index);
    }
    let loc = {
      index: index
    };
    console.log(this.data.secondAddress)
    console.log(index)
    switch (index) {
      case 99://起点
        loc.lat = this.data.latitude;
        loc.lng = this.data.longitude;
        loc.contractor = this.data.startAddress != null && this.data.startAddress.contractor != undefined ? this.data.startAddress.contractor : '';
        loc.phone = this.data.startAddress != null && this.data.startAddress.phone != undefined ? this.data.startAddress.phone : '';
        loc.number = this.data.startAddress != null && this.data.startAddress.number != undefined ? this.data.startAddress.number : '';
        // loc.adcode = this.data.startAddress.adcode;
        break;
      case 0://第二个点
        loc.lat = this.data.secondAddress != null && this.data.secondAddress.latitude != undefined ? this.data.secondAddress.latitude : `${this.data.latitude}`;
        loc.lng = this.data.secondAddress != null && this.data.secondAddress.longitude != undefined ? this.data.secondAddress.longitude : `${this.data.longitude}`;
        loc.contractor = this.data.secondAddress != null && this.data.secondAddress.contractor != undefined ? this.data.secondAddress.contractor : '';
        loc.phone = this.data.secondAddress != null && this.data.secondAddress.phone != undefined ? this.data.secondAddress.phone : '';
        loc.number = this.data.secondAddress != null && this.data.secondAddress.number != undefined ? this.data.secondAddress.number : '';
        break;
      default:
        let item = this.data.siteArray[index - 1];
        loc.lat = item.latitude || `${this.data.latitude}`;
        loc.lng = item.longitude || `${this.data.longitude}`;
        loc.contractor = item.contractor != undefined ? item.contractor : '';
        loc.phone = item.phone != undefined ? item.phone : '';
        loc.number = item.number != undefined ? item.number : '';
        loc.arr = this.data.siteArray
    }
    console.log(loc);
    app.data.startLocation = loc;
    if (app.data.startLocation != null) {
      wx.navigateTo({
        url: "/pages/fast-ride/pois-select/index?params=" + JSON.stringify(loc)
      })
    }
  }
})