// miniprogram/pages/XyApprove/XyList.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    all_not_applied_users: [],
    hasList: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAllUserInfo()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getAllUserInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  getAllUserInfo: function() {
    var that = this;
    var xystat = 0;

    app.getInfoWhereInOrder('customers', {
      "xypay.status": xystat
    }, 'name', 'asc', function(e) {
      //console.log(e.result.data.length)
      if (e.result.data.length >= 1) {
        that.setData({
          all_not_applied_users: e.result.data,
          hasList: true,
        })
      } else {

      }
    })
  },

  gotoUpdate(e) {
    var self = this
    const index = e.currentTarget.dataset.index;
    let xyuserid = self.data.all_not_applied_users[index]._id
    app.updateDB("customers", xyuserid, {
      xypay: {
        status: 1
      }
    }, function(d) {
      wx.showToast({
        title: '审核通过',
      })


      wx.startPullDownRefresh()

      wx.stopPullDownRefresh()
      
    })
  },

})