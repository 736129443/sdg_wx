const app = getApp();
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    data: {
        baseUrl: app.staticUrl
    },
    externalClasses: ['custom-class'],
    properties: {
        title: String,
        picUrl: String,
        spellNum: String,
        price: String
    },
    observers: {
        // 'picUrl': function (val) {
        //     this.
        // }
    },
    methods: {
    }
})