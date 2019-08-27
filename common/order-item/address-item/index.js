Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    properties: {
        status: {// 0:起点  1:经过点  2:终点
            type: String,
            value: '0'
        },
        info: Object,
        title: String,
        isAppointment: {
            type: Boolean,
            value: false
        }
    }
})