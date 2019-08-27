require('../../module/order.js');
const app = getApp();
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};
Page({
  _order: com.lightningdog.rrq.order,
  _event: com.lightningdog.rrq.event,
  data: {
    detail: null,
    locArray: [{
      address: '鹏博大厦',
      province: '陕西省',
      area: '西安市',
      county: '碑林区'
    }, {
      address: '鹏博大厦',
      province: '陕西省',
      area: '西安市',
      county: '碑林区'
    }, {
      address: '鹏博大厦',
      province: '陕西省',
      area: '西安市',
      county: '碑林区'
    }],
    traceArray: [
      {
        statusInfo: '到达装货点',
        time: '09-10:10:30:00'
      },
      {
        statusInfo: '到达装货点',
        time: '09-10:10:30:00'
      },
      {
        statusInfo: '到达装货点',
        time: '09-10:10:30:00'
      }
    ],
  },
  onLoad(options) {
    this.bindDetailEvent()
    if (options.id) {
      this.apiDetailFetch(options.id);
    }
  },
  bindDetailEvent() {
    this._event.on('onDetail', "com.lightningdog.rrq.order", "detail", (event, data) => {
      if (data) {
        this.setData({
          detail: data
        })
        if (data.params.roadLine.locations && data.params.roadLine.locations.length) {
          this.setData({
            locArray: data.params.roadLine.locations
          })
        }
      }
    });
  },
  apiDetailFetch(id) {
    this._order.detail(id);
  }
})