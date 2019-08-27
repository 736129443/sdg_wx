Component({
    data: {
        showTabbar: true,
        selected: 0,
        color: "#999999",
        selectedColor: "#e64340",
        list: [
            {
                pagePath: "/pages/home/index",
                iconPath: "/images/nav/home-off.png",
                selectedIconPath: "/images/nav/home-on.png",
                text: "首页"
            },
            {
                pagePath: "/pages/categorys/category",
                iconPath: "/images/nav/tabbar-search.png",
                selectedIconPath: "/images/nav/tabbar-search.png",
                text: "搜索"
            },
            {
                pagePath: "/pages/my/index",
                iconPath: "/images/nav/my-off.png",
                selectedIconPath: "/images/nav/my-on.png",
                text: "个人中心"
            }
        ]
    },
    attached() {},
    methods: {
        switchTab(e) {
            const data = e.currentTarget.dataset
            const url = data.path
            wx.switchTab({ url })
            this.setData({
                selected: data.index
            })
        }
    }
})