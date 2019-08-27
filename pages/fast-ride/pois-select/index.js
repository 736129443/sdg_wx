var amapFile = require('../../../utils/amap-wx.js');//如：..­/..­/libs/amap-wx.js
let app = getApp();
Page({
  data: {
    navH: getApp().globalData.navHeight,//导航高度
    cityCode: "",//搜索关键字
    myAmapFun: null,//地图对象
    options: {},//参数对象
    poisList: [],//周边商圈数组
  },
  /**
   * @description: 生命周期函数
   * @param {type} 页面参数
   * @return: none
   */
  onLoad(option) {
    this.data.myAmapFun = new amapFile.AMapWX({ key: getApp().globalData.ampKey });
    this.setData({
      options: JSON.parse(option.params)
    });
    console.log(JSON.parse(option.params), app.data.startLocation)
    this.getSearchPoisInfo();
    // this.data.myAmapFun.getPoiAround({
    //   location: `${app.data.startLocation.lng},${app.data.startLocation.lat}`,
    //   success: (data) => {
    //     if (data.poisData.length > 0) {
    //       console.log(data)
    //       this.setData({
    //         poisList: data.poisData
    //       });
    //     }
    //   },
    //   fail: (info) => { }
    // })
  },
  /**
   * @description: 搜索关键字
   * @param {Object} e 事件对象
   * @return: none
   */
  search(e) {
    console.log(e);
    this.getSearchPoisInfo(e.detail);
  },
  /**
   * @description:获取周边poi信息 
   * @param {String} key 关键字
   * @return: none
   */
  getSearchPoisInfo(key = '') {
    this.data.myAmapFun.getInputtips({
      keywords: key.length ? key : '火车站',
      citylimit: this.data.options.adcode ? true : false,
      city: this.data.options.adcode || '',
      location: `${this.data.options.lng},${this.data.options.lat}`,
      success: (data) => {
        console.log(data)
        this.setData({
          poisList: data.tips
        });
      },
      fail: (info) => { }
    })
  },
  /**
   * @description: 选中地址
   * @param {Object} e 事件对象 
   * @return: none
   */
  cellSelect(e) {
    let index = e.currentTarget.dataset.index;
    let item = this.data.poisList[Number(index)];
    this.data.myAmapFun.getRegeo({
      location: item.location,
      success: (res) => {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        let locArr = item.location.split(',');
        let lng = locArr[0];
        let lat = locArr[1];
        let [province, city, district, township, name] = [res[0].regeocodeData.addressComponent.province, res[0].regeocodeData.addressComponent.city, res[0].regeocodeData.addressComponent.district, res[0].regeocodeData.addressComponent.township, item.name];
        switch (this.data.options.index) {
          case 99://起点
            prevPage.data.markers[0].latitude = lat;
            prevPage.data.markers[0].longitude = lng;
            prevPage.data.markers[0].callout.content = name;
            prevPage.setData({
              startAddress: {
                addressName: name,
                address: province + city + district + township,
                contractor: this.data.options.contractor,
                phone: this.data.options.phone,
                number: this.data.options.number,
                latitude: lat,
                longitude: lng,
                province: province,
                area: city,
                county: district,
                action: null
              },
              isShowPopup: true,
              indexFlag: this.data.options.index,
              markers: prevPage.data.markers
            })
            break;
          case 0://第二个点
            prevPage.data.markers[1].latitude = lat;
            prevPage.data.markers[1].longitude = lng;
            prevPage.data.markers[1].callout.content = item.name;
            prevPage.setData({
              secondAddress: {
                addressName: name,
                address: province + city + district + township,
                contractor: this.data.options.contractor,
                phone: this.data.options.phone,
                number: this.data.options.number,
                latitude: lat,
                longitude: lng,
                province: province,
                area: city,
                county: district,
                action: null
              },
              isShowPopup: true,
              indexFlag: this.data.options.index,
              markers: prevPage.data.markers
            })
            break;
          default:
            this.data.options.arr[this.data.options.index - 1].addressName = name;
            this.data.options.arr[this.data.options.index - 1].address = province + city + district + township;
            this.data.options.arr[this.data.options.index - 1].latitude = lat;
            this.data.options.arr[this.data.options.index - 1].longitude = lng;
            this.data.options.arr[this.data.options.index - 1].contractor = this.data.options.contractor;
            this.data.options.arr[this.data.options.index - 1].phone = this.data.options.phone;
            this.data.options.arr[this.data.options.index - 1].number = this.data.options.number;
            this.data.options.arr[this.data.options.index - 1].province = province;
            this.data.options.arr[this.data.options.index - 1].area = city;
            this.data.options.arr[this.data.options.index - 1].county = district;
            this.data.options.arr[this.data.options.index - 1].action = null;
            prevPage.data.markers[this.data.options.index + 1].latitude = lat;
            prevPage.data.markers[this.data.options.index + 1].longitude = lng;
            prevPage.data.markers[this.data.options.index + 1].callout.content = name;
            prevPage.setData({
              siteArray: this.data.options.arr,
              isShowPopup: true,
              indexFlag: this.data.options.index,
              markers: prevPage.data.markers
            })
        }
        console.log(prevPage.data)
        wx.navigateBack({})
      },
      fail: (err) => {
        wx.showToast({
          title: err.errMsg ? err.errMsg : '逆地理解析错误',
          icon: 'none'
        })
      }
    })
  },
  catchtouchmove() {

  },
  /**
   * @description: 返回上一页
   * @return: none
   */
  back() {
    wx.navigateBack({});
  }
})