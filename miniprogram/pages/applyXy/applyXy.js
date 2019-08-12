// miniprogram/pages/applyXy/applyXy.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userIfo:{},
    openid:'',
    files:[],
    tempFileArr:[]
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
    var that = this;
    const value = e.detail.value;
    if (value.xypay && that.data.tempFileArr.length!=0){
      app.updateDB("customers", this.data.userInfo._id, { xypay: {status:0,amt: new Number(value.xypay),fileArr:   that.data.tempFileArr}},function(d){
        wx.showToast({
          title: '添加成功',
        })
        wx.navigateBack({
          delta: 1
        })
      });
    }else{
      wx.showToast({
        title: '信息不完全',
      })
    }
  },
  //选择照片并预览（预览地址在files，上传后的地址在tmpUrlArr）
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      success: function (res) {
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
        res.tempFilePaths.forEach(function (v) {
          app.upToClound("imgSwiper", that.data.
            name + Math.random().toString(),
            v, tmpUrl => {
              console.log(tmpUrl)
              that.data.tempFileArr.push(tmpUrl)
              // console.log(getCurrentPages())
            })
        })

      }
    })
    // console.log(getCurrentPages())
  },
})