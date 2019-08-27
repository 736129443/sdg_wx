require('../../module/shopcart.js')
require('../../module/depot.js')
//获取应用实例
var app = getApp()
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};
Page({
    _event: com.lightningdog.rrq.event,
    _depot: com.lightningdog.rrq.depot,
    _pattern: com.lightningdog.rrq.pattern,
    data: {
        depotName: '',//仓库名称
        area: [],// 区域
        address: '',//仓库详细地址
        depotThumbnails: [],//仓库图片
        depotType: '',//仓库类型
        depotTypeArray: ['平库', '高台库', '立体库', '楼库', '其它'],// 仓库类型数组
        strorageType: '',//存储类型
        strorageTypeArray: ['普通仓', '冷藏仓', '冷冻仓', '露天堆场'],//存储类型数组
        startRentArea: '',//起租面积
        rentAvailableArea: '',//可租面积
        totalArea: '',//总面积
        rentPrice: '',//租金
        unit: '',//租金单位
        unitArray: ['元/平米/天', '元/平米/月'],//租金单位数组
        payway: '',//付费方式
        paywayArray: ['月付', '季付', '半年付', '年付'],//付费方式数组
        invoice: '',//发票
        invoiceArray: ['专票', '普票'],//发票数组
        contractor: '',//联系人
        contractorPhone: '',//联系电话
        depotWidth: '',//主干宽度
        unloadPlatform: '',//卸货平台
        unloadPlatformArray: ['单面', '双面'],
        buildingStructure: '',//建筑结构
        buildingStructureArray: ['钢架', '混砖结构', '钢混结构'],//建筑结构数组
        terrace: '',// 地坪
        terraceArray: ['水泥', '金刚砂', '环痒'],//地坪数组
        depotHeight: '',//库高
        flowHeight: '',//层高
        bearing: '',//底层承重
        bearingTwice: '',//二次承重
        supportingFacility: '',//配套设施
        supportingFacilityArray: ['叉车', '托盘', '宿舍', '食堂', '办公室', '停车场'],//配套设施数组
        entrypointNum: '',//出入口数量
        pavement: '',// 路面
        pavementArray: ['水泥路面', '沥青混凝土', '沙石路'],//路面数组
        facilities: '',// 消防设备
        facilitiesArray: ['应急照明', '紧急疏散标志', '通风设备', '隔热层', '喷淋', '消防联动设备(灭火器、消防栓、消防沙桶)'],//消防设备数组
        security: '',//安保设施
        securityArray: ['园区保安', '视频监控', '电子围栏', '报警器'],//安保设施数组
        showMultiple: false,
        defaultMultipleStr: '',//默认多选值
        multipleData: [],// 多选数组
        flag: '', // 多选标识
        depotId: '',// 仓库Id
    },
    onLoad: function () {
        // 监听商品发布
        this.bindPublish();
        // 监听图片上传
        this.bindImageUpload();
    },
    /**
     * @description: 发布
     * @return: none
     */
    submit() {
        let self = this;
        let verifyObj = ['depotName', 'area', 'address', 'depotType', 'strorageType', 'startRentArea', 'rentAvailableArea', 'totalArea', 'rentPrice', 'unit', 'payway', 'invoice', 'contractor', 'contractorPhone', 'depotWidth', 'unloadPlatform', 'buildingStructure', 'terrace', 'depotHeight', 'flowHeight', 'bearing', 'bearingTwice', 'supportingFacility', 'entrypointNum', 'pavement', 'facilities', 'security'];
        let verifyName = ['请输入仓库名称', '请选择仓库区域', '请输入仓库具体地址', '请选择仓库类型', '请选择存储类型', '请输入起租面积', '请输入可租面积', '请输入总面积', '请输入租金', '请选择租金单位', '请选择付费方式', '请选择发票类型', '请输入联系人', '请输入联系电话', '请输入主干宽度', '请选择卸货平台', '请选择建筑结构', '请选择地坪', '请输入库高', '请输入层高', '请输入底层承重', '请输入二次承重', '请选择配套设施', '请输入出入口数量', '请选择路面', '请选择消防设备', '请选择安保设施'];
        let pass = verifyObj.every((item, index) => {
            return verifyTips(item, index);
        })
        function verifyTips(item, index) {
            if (!self.data[item] || self.data[item].length == 0) {
                wx.showToast({
                    title: verifyName[index] + '！',
                    icon: 'none'
                })
                return false;
            }
            return true;
        }
        if (!pass) return;

        if (!self._pattern.check(self._pattern.regex.phone, self.data.contractorPhone)) {
            wx.showToast({
                title: '请输入正确手机号码！',
                icon: 'none'
            })
            return;
        }

        console.log('提交成功');
        if (this.data.depotId.length) {
            this.imageApiRequest();
            return;
        }
        this.publishTextApiRequest();
    },
    /**
   * @description: 绑定发布事件
   * @return: none
   */
    bindPublish() {
        this.loading = true;
        this._event.on("onCreate", "com.lightningdog.rrq.depot", "publish-form", (event, data) => {
            this.setData({
                depotId: data
            })
            wx.hideLoading();
            this.imageApiRequest();
        });
    },
    /**
     * @description: 绑定图片上传事件
     * @return: none
     */
    bindImageUpload() {
        this._event.on('mall', "com.lightningdog.rrq.depot", "image", (event, data) => {
            this.backAndRefresh();
        })
    },
    /**
   * @description: 返回并刷新
   * @return: 
   */
    backAndRefresh() {
        wx.showToast({
            title: '发布成功',
            icon: 'none'
        });
        app.globalData.needRefresh = true;
        wx.navigateBack();
    },
    publishTextApiRequest() {
        wx.showLoading({
            title: '发布中'
        });
        let depotDetails = {
            depotName: this.data.depotName,
            province: this.data.area[0],
            city: this.data.area[1],
            region: this.data.area[2],
            depotType: this.data.depotType,
            strorageType: this.data.strorageType,
            depotWidth: this.data.depotWidth,
            unloadPlatform: this.data.unloadPlatform,
            buildingStructure: this.data.buildingStructure,
            terrace: this.data.terrace,
            depotHeight: this.data.depotHeight,
            flowHeight: this.data.flowHeight,
            bearing: this.data.bearing,
            bearingTwice: this.data.bearingTwice,
            supportingFacility: this.data.supportingFacility,
        };
        let depotPark = {
            entrypointNum: this.data.entrypointNum,
            pavement: this.data.pavement,
            facilities: this.data.facilities,
            security: this.data.security
        };
        let depotRent = {
            address: this.data.address,
            startRentArea: this.data.startRentArea,
            rentAvailableArea: this.data.rentAvailableArea,
            totalArea: this.data.totalArea,
            rentPrice: this.data.rentPrice,
            unit: this.data.unit,
            payway: this.data.payway,
            invoice: this.data.invoice,
            contractor: this.data.contractor,
            contractorPhone: this.data.contractorPhone
        };
        let params = {
            depotDetails, depotPark, depotRent
        }
        this._depot.publish(params);
    },
    /**
     * @description: 图片上传请求
     * @return: 
     */
    imageApiRequest() {
        console.log(this.data.depotThumbnails);
        if (this.data.depotThumbnails.length) {
            this._depot.upload(this.data.depotThumbnails, this.data.depotId);
            return;
        }
        this.backAndRefresh();
    },
    setDepotName(e) {
        this.setData({
            depotName: e.detail
        })
    },
    setAddress(e) {
        this.setData({
            address: e.detail
        })
    },
    setStartRentArea(e) {
        this.setData({
            startRentArea: e.detail
        })
    },
    setRentAvailableArea(e) {
        this.setData({
            rentAvailableArea: e.detail
        })
    },
    setTotalArea(e) {
        this.setData({
            totalArea: e.detail
        })
    },
    setRentPrice(e) {
        this.setData({
            rentPrice: e.detail
        })
    },
    setUnit(e) {
        this.setData({
            unit: this.data.unitArray[e.detail.value]
        })
    },
    setContractor(e) {
        this.setData({
            contractor: e.detail
        })
    },
    setContractorPhone(e) {
        this.setData({
            contractorPhone: e.detail
        })
    },
    setDepotWidth(e) {
        this.setData({
            depotWidth: e.detail
        })
    },
    setDepotHeight(e) {
        this.setData({
            depotHeight: e.detail
        })
    },
    setFlowHeight(e) {
        this.setData({
            flowHeight: e.detail
        })
    },
    setBearing(e) {
        this.setData({
            bearing: e.detail
        })
    },
    setBearingTwice(e) {
        this.setData({
            bearingTwice: e.detail
        })
    },
    setEntrypointNum(e) {
        this.setData({
            entrypointNum: e.detail
        })
    },
    setFacilities() {
        this.setData({
            showMultiple: true,
            multipleData: this.data.facilitiesArray,
            defaultMultipleStr: this.data.facilities,
            flag: 'facilities'
        })
    },
    setSecurity() {
        this.setData({
            showMultiple: true,
            multipleData: this.data.securityArray,
            defaultMultipleStr: this.data.security,
            flag: 'security'
        })
    },
    setSupportingFacility() {
        this.setData({
            showMultiple: true,
            multipleData: this.data.supportingFacilityArray,
            defaultMultipleStr: this.data.supportingFacility,
            flag: 'supportingFacility'
        })
    },
    multipleSure(e) {
        let flag = e.detail.flag;
        if (flag == 'facilities') {
            this.setData({
                showMultiple: false,
                facilities: e.detail.select
            })
        } else if (flag == 'security') {
            this.setData({
                showMultiple: false,
                security: e.detail.select
            })
        } else if (flag == 'supportingFacility') {
            this.setData({
                showMultiple: false,
                supportingFacility: e.detail.select
            })
        }
    },
    /**
     * @description: 设置省市区
     * @param {Object} e 事件对象 
     * @return: none
     */
    setArea(e) {
        console.log(e.detail);
        this.setData({
            area: e.detail.value
        })
    },
    /**
     * @description: 设置仓库类型
     * @param {Object} e 事件对象 
     * @return: none
     */
    setDepotType(e) {
        console.log(e.detail);
        this.setData({
            depotType: this.data.depotTypeArray[e.detail.value]
        })
    },
    /**
     * @description: 设置存储类型
     * @param {Object} e 事件对象 
     * @return: none
     */
    setStrorageType(e) {
        console.log(e.detail);
        this.setData({
            strorageType: this.data.strorageTypeArray[e.detail.value]
        })
    },
    /**
     * @description: 设置付费方式
     * @param {Object} e 事件对象 
     * @return: none
     */
    setPayway(e) {
        console.log(e.detail);
        this.setData({
            payway: this.data.paywayArray[e.detail.value]
        })
    },
    /**
     * @description: 设置建筑结构
     * @param {Object} e 事件对象 
     * @return: none
     */
    setBuildingStructure(e) {
        console.log(e.detail);
        this.setData({
            buildingStructure: this.data.buildingStructureArray[e.detail.value]
        })
    },
    /**
     * @description: 设置发票
     * @param {Object} e 事件对象 
     * @return: none
     */
    setInvoice(e) {
        console.log(e.detail);
        this.setData({
            invoice: this.data.invoiceArray[e.detail.value]
        })
    },
    /**
     * @description: 设置路面
     * @param {Object} e 事件对象 
     * @return: none
     */
    setPavement(e) {
        console.log(e.detail);
        this.setData({
            pavement: this.data.pavementArray[e.detail.value]
        })
    },
    /**
     * @description: 设置卸货平台
     * @param {Object} e 事件对象 
     * @return: none
     */
    setUnloadPlatform(e) {
        console.log(e.detail);
        this.setData({
            unloadPlatform: this.data.unloadPlatformArray[e.detail.value]
        })
    },
    /**
     * @description: 设置地坪
     * @param {Object} e 事件对象 
     * @return: none
     */
    setTerrace(e) {
        console.log(e.detail);
        this.setData({
            terrace: this.data.terraceArray[e.detail.value]
        })
    },
    change(e) {
        this.setData({
            depotThumbnails: e.detail.imgArray
        })
    }
})