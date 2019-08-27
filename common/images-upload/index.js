// common/images-upload/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    add: String,
    close: String,
    total: {
      type: Number,
      value: 9
    },
    upWidth: {
      type: Number,
      value: 226
    },
    upHeight: {
      type: Number,
      value: 226
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgH: 0,
    imgbox: ''//上传图片
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
    },
    ready() {
      //在组件在视图层布局完成后执行 
      const query = this.createSelectorQuery()
      query.select('.add-pic').boundingClientRect();
      query.exec(
        (res) => {
          this.setData({
            imgH: res[0].width,
          })
        });
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 删除照片 &&
    imgDelete: function (e) {
      let that = this;
      let index = e.currentTarget.dataset.deindex;
      let imgbox = this.data.imgbox;
      imgbox.splice(index, 1)
      that.setData({
        imgbox: imgbox
      });
      const myEventDetail = { imgArray: imgbox } // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('onchange', myEventDetail, myEventOption)
    },
    //展示图片
    showImg: function (e) {
      var that = this;
      wx.previewImage({
        urls: that.data.imgbox,
        current: that.data.imgbox[e.currentTarget.dataset.index]
      })
    },
    // 上传图片 &&&
    addPic: function (e) {
      var imgbox = this.data.imgbox;
      var that = this;
      if (imgbox.length >= this.data.total) {
        wx.showToast({
          title: '最多选择' + this.data.total + '张！'
        })
        return;
      }
      console.log(this.data.total, imgbox.length)
      var n = this.data.total;
      if (this.data.total > imgbox.length) {
        n = this.data.total - imgbox.length;
      }
      wx.chooseImage({
        count: n, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          // console.log(res.tempFilePaths)
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths
          console.log(res)
          if (imgbox.length == 0) {
            imgbox = tempFilePaths
          } else if (imgbox.length < this.data.total) {
            imgbox = imgbox.concat(tempFilePaths);
          }
          that.setData({
            imgbox: imgbox
          });
          const myEventDetail = { imgArray: imgbox } // detail对象，提供给事件监听函数
          const myEventOption = {} // 触发事件的选项
          this.triggerEvent('onchange', myEventDetail, myEventOption)
        }
      })
    }
  }
})
