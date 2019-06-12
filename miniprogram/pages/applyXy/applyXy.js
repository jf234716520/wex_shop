// miniprogram/pages/applyXy/applyXy.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userIfo:{},
    openid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getUserInfo();
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
  getUserInfo: function () {
    var that = this;
    var openid = app.globalData.openid;
    app.getInfoWhereInOrder('customers', { "openid": openid }, 'openid', 'asc', function (e) {
      that.setData({
        userInfo: e.result.data[0]
      })
    })
  },
  //申请
  formSubmit(e) {
    console.log()
    const value = e.detail.value;
    app.updateDB("customers", this.data.userInfo._id, { xypay: value.xypay},function(d){
      console.log(d)
    });
  }
})