// pages/logo/logo.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //初始化商品信息
    this.initGoods();
    //获取用户openid
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
      app.getInfoWhereInOrder('customers', { "openid": app.globalData.openid },"openid","asc",
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
          if (e.result.data.length==0){
            wx.navigateTo({
              url: '../guide/guide',
            })
          }
          wx.switchTab({
            url: '../homepage/homepage',
          })
          
        }
      ) 
    }, 2000)
    
  },

  //初始化商品
  initGoods(){
    app.getInfoWhereInOrder('goods_list', {"is_show": "1" }, 'create_time', 'asc', function (e) {
      app.globalData.goodList = e.result.data;
    })
  },

  // 获取用户openid
  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'add',
      complete: res => {
        console.log('云函数获取到的openid: ', res.result.openId)
        var openid = res.result.openId;
        app.globalData.openid = openid;
        //判断用户是否初次使用小程序
        app.getInfoWhereInOrder("customers", { "openid": openid }, "openid", "asc", function (e) {
          //用户首次使用
          if (e.result.data.length==0){
            //customers表添加用户openid
            app.addRows("customers", { openid: app.globalData.openid ,xypay:[-1,0]},function(e2){
              console.log("欢迎使用小程序");
            })
          }
        })
      }
    })
  },
})