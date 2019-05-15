// pages/logo/logo.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:''
  },

  // 获取用户openid
  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'add',
      complete: res => {
        console.log('云函数获取到的openid: ', res.result.openId)
        var openid = res.result.openId;
        that.setData({
          openid: openid
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户openid
    this.getOpenid();
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
    let that = this;
    setTimeout(function () {
      app.getInfoWhere('customers', { "openid": 'qt-H5MP6rdZqLlR1wXj_IUlBCmg'},
        e => {
          //获取不到openId
          if(that.data.openid==''){
            wx.showModal({
              title: 'sorry',
              content: '网络似乎不够快哦~',
              showCancel:false
            });
            return;
          }
          //未注册
          if (e.data.length==0){
            wx.navigateTo({
              url: '../register/register',
            })
          }
          wx.switchTab({
            url: '../homepage/homepage',
          })
          
        }
      ) 
    }, 5000)
    
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