// miniprogram/pages/bgInfo/bgInfo.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fruitInfo: {},
    tmpUrlArr: [],
    delFruitId: "",
    cardNum: 1,
    files: [],
    time:0,
    manageList:[], //管理页面信息列表

    // 上传的信息
    fruitID:null, 
    good_type_s:0,
    create_time:'', 
    good_img:[],    
    good_name:null,   
    good_price:null,    
    good_type:'1',    
    good_unit:'',    
    is_show:'1',  
    remark:'',  

    myClass_Arr: [
      '否',
      '是'
    ],
    myType_Arr: [
      '是',
      '否'
    ],
    reFresh:null
  },

  //------------------------!!! 获取信息 !!!------------------------
  // 获取水果编号
  getFruitID: function (e) {
    this.setData({
      fruitID: parseInt(e.detail.value)
    })
  },

  // 获取水果名称
  getName: function (e) {
    this.setData({
      good_name: e.detail.value
    })
  },

  // 获取价格
  getPrice: function (e) {
    this.setData({
      good_price: e.detail.value
    })
  },

  // 获取单位
  getUnit: function (e) {
    this.setData({
      good_unit: e.detail.value
    })
  },

  //选择照片并预览（预览地址在files，上传后的地址在tmpUrlArr）
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      success: function (res) {
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
        res.tempFilePaths.forEach(function(v){
          app.upToClound("imgSwiper", that.data.
            name + Math.random().toString(),
            v, tmpUrl => {
              console.log(tmpUrl)
              that.data.good_img.push(tmpUrl)
              // console.log(getCurrentPages())
          })
        })
        
      }
    })
    // console.log(getCurrentPages())
  },

  //预览图片
  previewImage: function (e) {
    var that = this
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: that.data.good_img // 需要预览的图片http链接列表
    })
  },

  //水果详细信息
  getInfoText: function (e) {
    var that = this
    that.setData({
      remark : e.detail.value
    })
    
  },

  // 今日特惠
  getMyClass: function (e) {
    var that = this
    this.setData({
      myClass: e.detail.value.toString()
    })
  },

  // 类型
  getMyType: function (e) {
    var that = this
    this.setData({
      good_type_s: e.detail.value
    })
    this.setData({
      good_type: (Number(that.data.good_type_s)+1)+''
    })
  },
  // --------------------!!!  选项卡切换  !!!----------------------
  tapTo1: function() {  //添加
    var that = this
    that.setData({
      cardNum: 1
    })
  },
  tapTo2: function () { //修改和删除
    var that = this
    that.setData({
      cardNum: 2
    })
    // console.log(getCurrentPages())
  }, 
  tapTo3: function () {
    var that = this
    that.setData({
      cardNum: 3
    })
  },

  // ----------------------!!!  提交操作  !!!---------------------
  // 添加水果信息表单
  addFruitInfo: function(e){
    const that = this
    if (that.data.good_name && that.data.good_price){
      new Promise((resolve, reject) => {
        const { create_time, good_img, good_name, good_price, good_type, good_unit, is_show, remark } = that.data
        const theInfo = { create_time, good_img, good_name, good_price, good_type, good_unit, is_show, remark }
        theInfo['create_time'] = parseInt(app.CurrentTime())
        resolve(theInfo)
      }).then(theInfo => {
        // 上传所有信息
        console.log(theInfo);
        app.addRowToSet('goods_list', theInfo, e => {
          console.log(e)
          wx.showToast({
            title: '添加成功',
          })
        })
        app.getInfoByOrder('goods_list', 'create_time', 'desc',
          e => {
            that.setData({
              manageList: e.data
            })
          }
        )
      })
    }
    else{
      wx.showToast({
        title: '信息不完全',
      })
    }
    
  },

  // ----------------------!!!  修改水果参数  !!!----------------------
  // 上架水果
  upToLine:function(e){
    var that = this
    // console.log(e.currentTarget.id)
    app.updateInfo('fruit-board', e.currentTarget.id,{
      onShow: true
    },e=>{
      that.getManageList()
      wx.showToast({
        title: '已上架',
      })
    })
  },
  
  // 下架水果
  downFromLine: function (e) {
    var that = this
    // console.log(e.currentTarget.id)
    app.updateInfo('fruit-board', e.currentTarget.id, {
      onShow: false
    }, e => {
      that.getManageList()
      wx.showToast({
        title: '已下架',
      })
    })
  },

  // 绑定删除水果名称参数
  getDelFruitId: function(e) {
    var that = this
    app.getInfoWhere('fruit-board',{
      name: e.detail.value
    },res=>{
      that.setData({
        delFruitId: res.data["0"]._id
      })
    })
  },

  // 删除水果
  deleteFruit: function() {
    // app.deleteInfoFromSet('fruit-board',"葡萄")
    var that = this
    console.log(that.data.delFruitId)
    new Promise((resolve,reject)=>{
      app.deleteInfoFromSet('fruit-board', that.data.delFruitId)
    })
    .then(that.getManageList())
  },

  // 程序下线打烊
  offLine: function () {
    var that = this
    app.getInfoWhere('setting', {
      option: "offLine"
    }, res => {
      let ch = !res.data["0"].offLine
      app.updateInfo('setting', res.data["0"]._id,{
        offLine: ch
      },e=>{
        wx.showToast({
          title: '操作成功',
        })
      })
      // console.log(res)
    })
  },


  /**
   * ----------------------!!!  生命周期函数--监听页面加载  !!!----------------------
   */
  getManageList:function(){
    var that = this
    app.getInfoByOrder('fruit-board', 'time', 'desc',
      e => {
        that.setData({
          manageList: e.data
        })
      }
    )
  },

  onLoad: function (options) {
    //this.getManageList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //this.getManageList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    (timer = setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 500));

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})