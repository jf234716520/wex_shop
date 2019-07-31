const app = getApp()

Page({
  data: {
    orderList:{},
    sendingList:{},
    
    cardNum:2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAllList()
  },

  // --------------------!!!  选项卡切换  !!!----------------------
  tapTo1: function () {  //添加
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
  tapTo4: function () {
    var that = this
    that.setData({
      cardNum: 4
    })
  },

  // ----------------------!!!  订单管理  !!!----------------------
  // 已支付-发货
  boxFruit: function(e) {
    
   
   
  },

  // 已发货-送达
  sendingFruit: function(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认订单已完成？',
      success(res) {
        if (res.confirm) {
          app.updateDB('order_manage', e.currentTarget.id, {
            'isFinished': '1',
            'finishedTime': app.CurrentTime_show()
          }, e => {
            that.getAllList()
          })
        } else if (res.cancel) {
          return;
        }
      }
    })
  },
  
  // 获取所有订单信息
  getAllList:function(){
    var that = this
   
    app.getInfoWhereInOrder('order_manage', { 'isFinished': 0 }, 'orderTime', 'desc', e => {
      console.log(e)
      that.setData({
        sendingList: e.result.data
      })
    })
    app.getInfoWhereInOrder('order_manage', {'isFinished':"1"},'orderTime', 'asc', e => {
      console.log(e)
      that.setData({
        orderList: e.result.data
      })
    })
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