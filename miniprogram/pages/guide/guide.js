// miniprogram/pages/guide/guide.js
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haha_id:null,
    check: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getInfoWhereInOrder("customers", { "openid": app.globalData.openid }, "openid", "asc", function (e1) {
      that.setData({
        haha_id: e1.result.data[0]._id
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

  },
  changestat_tk() {
    wx.navigateTo({
      url: './showtk',
    })
  },
  checked: function (e) {
    var that = this

    console.log(that.data.haha_id)
    if (e.detail.value == '') {
      that.setData({
        check: 0
        //addrow
      })
      app.updateDB('customers',that.data.haha_id,{hasRead:false},function(ea){
        // console.log(ea)
      })

    }

    else {

      that.setData({
        check: 1
        //addrow
      }
      )
      app.updateDB('customers', that.data.haha_id, { hasRead: true }, function (ee) {
        // console.log(ee)
      })

    }

    console.log(e.detail.value);

    console.log(that.data.check);

  },


  toHomePage2() {
    if (this.data.check == 1) {
      wx.switchTab({
        url: '../homepage2/homepage2',
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: "请先阅读并同意条款"
      })
    }
  },

  toHomePage1() {
    if (this.data.check == 1) {
      wx.switchTab({
        url: '../homepage/homepage',
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: "请先阅读并同意条款"
      })
    }
  },
  toRegister() {
    if (this.data.check == 1) {
      wx.navigateTo({
        url: '../register/register',
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: "请先阅读并同意条款"
      })
    }
  },
  showVideo() {
    wx.navigateTo({
      url: './play',
    })

  }
})