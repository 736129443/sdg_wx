const app = getApp()
require('../../module/location.js')
var amapFile = require('../../utils/amap-wx.js');//如：..­/..­/libs/amap-wx.js

import Toast from '../../vanUI/dist/toast/toast';


var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};

var modName = "addressModName"
Page({
  _location: com.lightningdog.rrq.location,
  _event: com.lightningdog.rrq.event,
  _pattern: com.lightningdog.rrq.pattern,
  myAmapFun: null,
  data: {
    popW: app.globalData.winWidth - 80,
    pageSize: 10,
    curPage: 1,
    refreshing: false,
    nomore: false,
    total: 0,
    showPop: false,
    editOrAdd: '',
    editInfo: {
      contractor: '',
      phone: '',
      address: '',
    },
    addressArr: []
  },
  openAddPop(e) {
    let type = e.currentTarget.dataset.type;
    let index = e.currentTarget.dataset.index;
    if (type == 'edit') {
      this.setData({
        editInfo: this.data.addressArr[index]
      })
      console.log(this.data.editInfo);
    }
    this.setData({
      editOrAdd: type,
      showPop: true
    })
  },
  onLoad() {
    this.myAmapFun = new amapFile.AMapWX({ key: getApp().globalData.ampKey });

    this.bindListEvent();
    this.bindAddEvent();
    this.bindEdtiEvent();
    this.bindDeleteEvent();
    this.listApiFetch();
  },
  afterOption(tips) {
    wx.showToast({
      title: tips
    });
    this.setData({
      editInfo: {}
    })
    setTimeout(() => {
      // 刷新列表
      this._onPullDownRefresh();
    }, 1500);
  },
  bindDeleteEvent() {
    this._event.on('delAddress', "com.lightningdog.rrq.location", "del", (event, data) => {
      this.afterOption('已删除');
    });
  },
  bindEdtiEvent() {
    this._event.on('editAddress', "com.lightningdog.rrq.location", "edit", (event, data) => {
      this.afterOption('修改成功');
    });
  },
  bindAddEvent() {
    this._event.on('addAddress', "com.lightningdog.rrq.location", "add", (event, data) => {
      this.afterOption('添加成功');
    });
  },
  deleteItem(e) {
    let id = e.currentTarget.dataset.id;
    wx.showLoading({
      title: '请稍等'
    });
    if (id) {
      this._location.del(id);
    }
  },
  /**
   * @description: 选中某行
   * @param {Object} e 事件对象
   * @return: none
   */
  sureSelect(e) {
    let item = e.currentTarget.dataset.item;
    console.log(item);
    wx.setStorageSync('addressData', item);
    wx.navigateBack({})
  },
  submit() {
    let title = ['contractor', 'phone', 'address'];
    let tips = ['请输入联系人姓名', '请输入联系电话', '请选择地址'];
    let self = this;
    let pass = title.every((item, index) => {
      if (!this.data.editInfo[item].length) {
        Toast({
          duration: 2000,
          message: tips[index]
        });
        return false;
      }
      return true;
    })
    if (!pass) return;

    if (!self._pattern.check(self._pattern.regex.phone, self.data.editInfo.phone)) {
      wx.showToast({
        title: '请输入正确手机号码！',
        icon: 'none'
      })
      return;
    }
    this.setData({
      showPop: false
    })
    wx.showLoading({
      title: '请稍等'
    })
    this._location[this.data.editOrAdd](this.data.editInfo);

  },
  bindListEvent() {
    this._event.on(modName, "com.lightningdog.rrq.location", "list", (event, data) => {
      if (data && data.list) {
        let arr = data.list;
        if (this.data.curPage > 1) {
          arr = [...this.data.addressArr, ...arr];
        }
        this.setData({
          addressArr: arr,
          total: data.total
        })
        if (Number(this.data.total) <= this.data.addressArr.length) {
          this.setData({ nomore: true });
        }
      }
      this.setData({
        refreshing: false
      })
    });
  },
  listApiFetch() {
    wx.showLoading({
      title: '加载中'
    })
    this.setData({
      refreshing: true,
    })
    this._location.list({
      pageNum: this.data.curPage,
      pageSize: this.data.pageSize
    }, modName);
  },
  _onPullDownRefresh() {
    this.setData({
      curPage: 1,
      nomore: false
    })
    this.listApiFetch();
  },
  _onLoadmore() {
    if (this.data.nomore) return;

    this.setData({
      curPage: this.data.curPage + 1
    })
    this.listApiFetch();
  },
  setContractor(e) {
    this.setData({
      'editInfo.contractor': e.detail
    })
  },
  setPhone(e) {
    this.setData({
      'editInfo.phone': e.detail
    })
  },
  selectAddress() {
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
            let info = { ...this.data.editInfo };
            info.address = desc;
            info.province = data[0].regeocodeData.addressComponent.province;
            info.area = data[0].regeocodeData.addressComponent.city;
            info.county = data[0].regeocodeData.addressComponent.district;
            info.latitude = res.latitude;
            info.longitude = res.longitude;
            console.log(info);
            this.setData({
              editInfo: info
            })
          }
        })
      }
    })
  }
});