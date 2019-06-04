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
      app.getInfoWhere('customers', { "openid": app.globalData.openid},
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

  //初始化商品
  initGoods(){
    app.getInfoWhereInOrder('goods_list', {"is_show": "1" }, 'create_time', 'asc', function (e) {
      console.log(e)
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

      }
    })
  },
})