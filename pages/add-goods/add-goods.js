// pages/add-goods/add-goods.js
require('../../module/mall.js')
require('../../module/integratedconfig.js')
var amapFile = require('../../utils/amap-wx.js');//如：..­/..­/libs/amap-wx.js

//获取应用实例
var app = getApp()
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};

var categoryModName = 'addGoods';
Page({
  _event: com.lightningdog.rrq.event,
  _mall: com.lightningdog.rrq.mall,
  _integratedconfig: com.lightningdog.rrq.integratedconfig,
  _pattern: com.lightningdog.rrq.pattern,
  myAmapFun: null,
  /**
   * 页面的初始数据
   */
  data: {
    showBack: false,
    baseId: '', //商品基础库id
    baseSearchList: [],//baseGoods 搜索记录
    date: '2016-09-01',
    time: '12:01',
    varietyArray: [],
    variety: '',
    price: '',
    add: '/images/add.jpg',
    close: '/images/popup-close.png',
    packageArray: [],
    goodsAddress: '',
    district: '',// 分区
    city: '',//城市
    province: '',//省份
    longitude: '',
    latitude: '',
    packageWay: '',
    contacts: '',
    phone: '',
    goodsDetail: '',
    goodsName: '',
    picArray: [],
    goodsId: '',//商品id
    varietyIndex: 0, // 商品种类index
    packageIndex: 0 // 打包方式下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.myAmapFun = new amapFile.AMapWX({ key: getApp().globalData.ampKey });
    // 监听商品分类事件
    this.bindCategoryEvent();
    // 监听商品搜索列表事件
    this.bindbaseGoodsListEvent();
    // 商品分类请求
    this.getCategoryFetch();
    // 打包方式事件绑定
    this.bindUnitEvent();
    // 打包方式请求
    this.unitApiFetch();

    // 监听商品发布
    this.bindPublish();
    // 监听图片上传
    this.bindImageUpload();
  },
  /**
   * @description: 监听单位接口事件
   * @return: none
   */
  bindUnitEvent() {
    this._event.on("onPackage", "com.lightningdog.rrq.integratedconfig", "package-picker", (event, data) => {
      if (data.length) {
        this.setData({
          packageArray: data
        })
      }
      wx.hideLoading();
    });
  },
  bindbaseGoodsListEvent() {
    this._event.on("onBaseGoods", "com.lightningdog.rrq.mall", "base-goods-list", (event, data) => {
      if (data.length) {
        this.setData({
          baseSearchList: data,
        })
      }
      wx.hideLoading();
    });
  },
  /**
   * @description: 选中某个基础商品
   * @param {Object} e 事件对象 
   * @return: none
   */
  selectItem(e) {
    /// TODO 填充表单
    let info = e.currentTarget.dataset.info;
    this.setData({
      goodsName: info.name,
      goodsDetail: info.goodsDesc,
      price: info.price,
      unit: info.unit,
      goodsAddress: info.address,
      district: info.district,
      city: info.city,
      province: info.province,
      latitude: info.latitude,
      longitude: info.longitude,
      baseSearchList: [],
      showBack: false,
      baseId: info.id
    })
    let varietyIndex = this.queryArrayIndex(this.data.varietyArray, 'code', info.type);
    let packageIndex = this.queryArrayIndex(this.data.packageArray, 'name', info.packageWay);
    console.log('商品种类下标：' + varietyIndex);
    console.log('打包方式下标：' + packageIndex);
    if (varietyIndex != null) {//预防0时  不进判断
      this.setData({
        varietyIndex,
        variety: this.data.varietyArray[varietyIndex].name
      })
    }
    if (packageIndex != null) {//预防0时  不进判断
      this.setData({
        packageIndex,
        packageWay: this.data.packageArray[packageIndex].cname
      })
    }
  },
  /**
   * @description: 查询数组下标
   * @param {Array} array 查询数组
   * @param {String} key 查询键
   * @param {String} compareKey 对比值
   * @return: 数组下标 （若没有找到则返回null）
   */
  queryArrayIndex(array, key, compareKey) {
    let i = null;
    array.some((item, index) => {
      i = index;
      return item[key] == compareKey;
    })
    return i;
  },
  /**
   * @description: 发送单位接口请求
   * @return: none
   */
  unitApiFetch() {
    wx.showLoading({
      title: '加载中'
    })
    this._integratedconfig.package();
  },
  /**
   * @description: 绑定发布事件
   * @return: none
   */
  bindPublish() {
    this.loading = true;
    this._event.on("onCreate", "com.lightningdog.rrq.mall", "publish-form", (event, data) => {
      if (data.length) {
        this.setData({
          goodsId: data
        })
        this.imageApiRequest();
      }
    });
  },
  /**
     * @description: 绑定分类获取事件
     * @return: none
     */
  bindCategoryEvent() {
    this.loading = true;
    this._event.on(categoryModName, "com.lightningdog.rrq.mall", "picker", (event, data) => {
      this.setData({
        varietyArray: data
      })
      wx.hideLoading({})
    });
  },
  /**
     * @description: 绑定图片上传事件
     * @return: none
     */
  bindImageUpload() {
    this._event.on('mall', "com.lightningdog.rrq.mall", "image", (event, data) => {
      if (data) {
        this.backAndRefresh();
      }
    })
  },
  /**
   * @description: 返回并刷新
   * @return: 
   */
  backAndRefresh() {
    wx.showToast({
      title: '发布成功',
      icon: 'none'
    });
    app.globalData.needRefresh = true;
    wx.navigateBack();
  },
  /**
   * @description: 分类目获取请求
   * @return: none
   */
  getCategoryFetch() {
    wx.showLoading({
      title: '加载中'
    })
    this._mall.goodsCategory({}, categoryModName);
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
  focus() {
    this.setData({
      showBack: true
    })
  },
  cancel() {
    this.setData({
      showBack: false,
      baseSearchList: []
    })
  },
  search(e) {
    // 假设现在需要检测到用户输入的值，用户 500 毫秒内没有继续输入就将该值打印出来
    this.throttle(this.queryData, null, 500, e.detail);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * @description: 位置选择
   * @return: none
   */
  gotoMap() {
    wx.chooseLocation({
      success: (res) => {
        console.log(res);
        this.myAmapFun.getRegeo({
          location: `${res.longitude},${res.latitude}`,
          success: data => {
            let desc = data[0].desc;
            //去掉附近
            if (data[0].desc.indexOf('附近') >= 0) {
              desc = desc.split("附近").join("");
            }
            console.log(data);
            this.setData({
              goodsAddress: desc,
              district: data[0].regeocodeData.addressComponent.district,
              city: data[0].regeocodeData.addressComponent.city,
              province: data[0].regeocodeData.addressComponent.province,
              latitude: data[0].latitude,
              longitude: data[0].longitude
            })
          }
        })
      }
    })
  },
  bindPickerChange(e) {
    if (this.data.varietyArray.length) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        varietyIndex: Number(e.detail.value),
        variety: this.data.varietyArray[e.detail.value].name
      })
    }
  },
  bindPackageChange(e) {
    if (this.data.packageArray.length) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        packageIndex: Number(e.detail.value),
        packageWay: this.data.packageArray[e.detail.value].cname
      })
    }
  },
  setAddress(e) {
    this.setData({
      goodsAddress: e.detail.value
    })
  },
  setPrice(e) {
    this.setData({
      price: e.detail.value
    })
  },
  setContacts(e) {
    this.setData({
      contacts: e.detail.value
    })
  },
  setPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  setGoodsDetail(e) {

    this.setData({
      goodsDetail: e.detail.value
    })
  },
  setGoodsName(e) {
    console.log(e.detail.cursor);
    this.setData({
      goodsName: e.detail.value
    })
  },
  // 节流
  throttle(fn, context, delay, text) {
    clearTimeout(fn.timeoutId);
    fn.timeoutId = setTimeout(function () {
      fn.call(context, text);
    }, delay);
  },

  // 此处方法里面调用查询接口
  queryData(e) {
    console.log(e) // 打印 用户输入的值
    // 
    // TODO 此处请求接口
    if (e.length) {
      this._mall.baseGoodsList(e);
      return;
    }
    this.setData({
      baseSearchList: []
    })
    //
  },
  publishTextApiRequest() {
    wx.showLoading({
      title: '发布中'
    })
    let params = {
      name: this.data.goodsName,
      goodsDesc: this.data.goodsDetail,
      packageWay: this.data.packageArray[this.data.packageIndex].name,
      price: this.data.price,
      type: this.data.varietyArray[this.data.varietyIndex].code,
      goodsStatus: '1',
      phone: this.data.phone,
      unit: this.data.packageArray[this.data.packageIndex].unit,
      contacts: this.data.contacts,
      address: this.data.goodsAddress,
      district: this.data.district,
      city: this.data.city,
      province: this.data.province,
      latitude: this.data.latitude,
      longitude: this.data.longitude
    };
    if (this.data.baseId.length) {
      params.baseId = this.data.baseId;
    }
    this._mall.publish(params);
  },
  /**
   * @description: 图片上传请求
   * @return: 
   */
  imageApiRequest() {
    if (this.data.picArray.length) {
      this._mall.upload(this.data.picArray, this.data.goodsId);
      return;
    }
    this.backAndRefresh();
  },
  /**
   * @description: 提交发布请求
   * @return: none
   */
  submits() {
    let verifyObj = ['goodsName', 'goodsDetail', 'variety', 'price', 'contacts', 'phone', 'packageWay', 'goodsAddress'];
    let verifyName = ['商品名称', '商品描述', '商品种类', '商品价格', '联系人', '联系电话', '打包方式', '商品地址'];
    let self = this;
    let pass = verifyObj.every((item, index) => {
      let type = '请输入';
      if (index == 2 || index == verifyObj.length - 1 || index == verifyObj.length - 2) {
        type = '请选择';
      }
      return verifyTips(item, index, type);
    })
    function verifyTips(item, index, type = '请输入') {
      if (!self.data[item] || self.data[item].length == 0) {
        wx.showToast({
          title: type + verifyName[index] + '！',
          icon: 'none'
        })
        return false;
      }
      return true;
    }
    if (!pass) return;

    if (!self._pattern.check(self._pattern.regex.phone, self.data.phone)) {
      wx.showToast({
        title: '请输入正确手机号码！',
        icon: 'none'
      })
      return;
    }

    if (this.data.goodsId.length) {
      this.imageApiRequest();
      return;
    }
    this.publishTextApiRequest();
  },
  change(e) {
    this.setData({
      picArray: e.detail.imgArray
    })
  }
})