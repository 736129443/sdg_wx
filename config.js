module.exports = {
  version: "0.0.1",
  note: '小程序转发到微信群，可获赠积分',
  appid: "wxe8ea4fea9aab10b9", // 您的小程序的appid，购物单功能需要使用
  shareProfile: '百款精品商品，总有一款适合您', // 首页转发的时候话术
  port: "8031",// 端口
  baseURL: "http://192.168.50.88",
  staticUrl: "http://www.sdgwl.com:32575"
}
/*
根据自己需要修改下单时候的模板消息内容设置，可增加关闭订单、收货时候模板消息提醒；
1、/pages/to-pay-order/index.js 中已添加关闭订单、商家发货后提醒消费者；
2、/pages/order-details/index.js 中已添加用户确认收货后提供用户参与评价；评价后提醒消费者好评奖励积分已到账；
3、请自行修改上面几处的模板消息ID，参数为您自己的变量设置即可。
*/