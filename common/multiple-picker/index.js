Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    externalClasses: ['custom-class'],
    properties: {
        title: String,
        show: {
            type: Boolean,
            value: false
        },
        defaultStr: String,//默认选中  以逗号隔开
        infoArray: Array,//多选数组
        flag: String //多选标识
    },
    data: {
        orginArray: []//原始数据
    },
    observers: {
        'defaultStr,infoArray': function (defaultStr, infoArray) {
            let arr = [];
            infoArray.forEach(item => {
                let obj = {
                    name: item,
                    value: false
                }
                let selectArr = defaultStr.split(',');
                if (selectArr.indexOf(item) != -1) {
                    obj.value = true;
                }
                arr.push(obj);
            })
            this.setData({
                orginArray: arr
            })
        }
    },
    lifetimes: {
        attached() {
            // 在组件实例进入页面节点树时执行
        },
        ready() {
            //在组件在视图层布局完成后执行
        },
        detached() {
            // 在组件实例被从页面节点树移除时执行
        },
    },
    methods: {
        cancalMethod() {
            this.setData({
                show: false
            })
            const myEventDetail = {} // detail对象，提供给事件监听函数
            const myEventOption = {} // 触发事件的选项
            this.triggerEvent('cancal', myEventDetail, myEventOption)
        },
        sure() {
            let selectArr = [];
            this.data.orginArray.forEach(item => {
                if (item.value) {
                    selectArr.push(item.name);
                }
            })
            const myEventDetail = {
                select: selectArr.join(),
                flag: this.properties.flag
            } // detail对象，提供给事件监听函数
            const myEventOption = {} // 触发事件的选项
            this.triggerEvent('sure', myEventDetail, myEventOption);
        },

        selectOrCancal(e) {
            let index = e.currentTarget.dataset.index;
            let value = this.data.orginArray[index].value;
            value = !value;
            this.setData({
                [`orginArray[${index}].value`]: value
            })
        }
    }
})