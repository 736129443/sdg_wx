const CONFIG = require('config.js')
App({
  data: {
    categoryClick: false,
    isClickCart: false,
    valuation: null,
    needToOrderManger: false, // 需要跳转至订单管理页面
    timestamp: [],//全局时间戳不能超过5分钟取消订单
    creatPrderParams: {
      addressAll: [],//全局确认订单信息地址
      vehicleModel: null, //全局确认车型
      kilometre: 0,//全局公里
      inputParams: null,
      goodsList: [],
      poolParams: null,
      oneParams: null
    },
    times: null,//全局定时器
    timestamp: [],//全局时间戳不能超过5分钟取消订单
    startLocation: null,
    isTurePage: false,
    uctIndex: 0
  },
  onLaunch: function () {
    const that = this;
    wx.getSystemInfo({
      success: res => {
        this.globalData.navHeight = res.statusBarHeight + 44;
        this.globalData.winHeight = res.windowHeight;
        this.globalData.winWidth = res.windowWidth;
      }
    });
    // this.judgeIsLogin();
    // 检测新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  },
  judgeIsLogin() {
    if (!wx.getStorageSync('users')) {
      this.goLoginPage();
    } else {
      this.goHomePage();
    }
  },
  goLoginPage: function () {
    setTimeout(function () {
      wx.reLaunch({
        url: "/pages/login/index"
      })
    }, 500)
  },
  goHomePage: function () {
    setTimeout(function () {
      wx.reLaunch({
        url: "/pages/home/index"
      })
    }, 500)
  },
  onShow(e) {
    const _this = this
  },
  globalData: {
    isConnected: true,
    launchOption: undefined,
    vipLevel: 0,
    navHeight: 0,
    winHeight: 0,
    winWidth: 0,
    ampKey: 'c61e3e90543cb5d7abcdd2267012d304',//高德地图keys
    defaultCity: '',
    defaultCounty: '',
    needRefresh: false //是否需要刷新列表
  },
  baseURL: CONFIG.baseURL,
  staticUrl: CONFIG.staticUrl,
  port: CONFIG.port,
  com: {},
})