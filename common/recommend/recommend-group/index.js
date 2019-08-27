Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    externalClasses: ['custom-class'],
    properties: {
        title: String,
        list: Array,
        height: {
            type: String,
            value: '1200rpx'
        }
    },
    methods: {
        itemClick(e) {
            let id = e.currentTarget.dataset.id;
            let type = e.currentTarget.dataset.type;
            let index = e.currentTarget.dataset.index;
            const myEventDetail = {// detail对象，提供给事件监听函数
                id, type, index
            };
            this.triggerEvent('itemclick', myEventDetail, {});
        }
    }
})