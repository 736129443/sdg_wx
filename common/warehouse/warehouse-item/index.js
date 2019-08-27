Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    data: {
        cover: '' ///图片封面
    },
    externalClasses: ['custom-class'],
    properties: {
        data: {
            type: Object,
            value: {}
        },
        imgUrl: String,
    },
    methods: {
        itemClick() {
            const myEventDetail = { item: this.properties.data };
            this.triggerEvent('click', myEventDetail, {});
        }
    },
    observers: {
        'data.details.depotThumbnails': function (val) {
            if (val && val.length) {
                let imgArr = JSON.parse(val);
                if (imgArr.length) {
                    this.setData({
                        cover: imgArr[0]
                    })
                }
            }
        }
    }
})