// miniprogram/pages/swiperManage/swiperManage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasList:false,
    imgUrls:[],
   
    tempFileArr:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getInfoWhereInOrder('swiper_pic', { status: 1 }, 'status', 'desc', function (e) {
      if (e.result.data.length!=0){
        that.setData({
          hasList: true
        })
      }
      that.setData({
        imgUrls: e.result.data
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
  gotoUpdate:function(e){
    var that =this;
    var index = e.currentTarget.dataset.index;
    app.updateDB('swiper_pic',that.data.imgUrls[index]._id,{status:0},function(r){
      
      that.data.imgUrls[index].status=0;
      that.setData({
        imgUrls: that.data.imgUrls
      })
    });
  },

  //选择照片并预览（预览地址在files，上传后的地址在tmpUrlArr）
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      success: function (res) {
      
        res.tempFilePaths.forEach(function (v) {
          app.upToClound("imgSwiper", that.data.
            name + Math.random().toString(),
            v, tmpUrl => {
              var d = { _id: tmpUrl, pic_url: tmpUrl, status: 1 };
                app.addRows('swiper_pic', d,function(re){
                that.data.imgUrls.push(d);
                that.setData({
                  imgUrls: that.data.imgUrls,
                  hasList:true
                })
              })
              
            })
        })

      }
    })
    // console.log(getCurrentPages())
  },
})