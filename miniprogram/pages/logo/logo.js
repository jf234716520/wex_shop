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
    this.getManagerList();
    this.getGlobalIP();
   
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取用户openid
    
    let that = this;
    setTimeout(function () {
      that.getOpenid()
    }, 1500)
    
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
    
          if (e.result.data.length == 0 ||e.result.data[0].hasRead==false){
            //customers表添加用户openid
            if (e.result.data.length == 0){
              app.addRows("customers", { hasRead: false, openid: app.globalData.openid, xypay: { status: -1, amt: 0, fileArr: [] } }, function (e2) {})
            }
            wx.navigateTo({
              url: '../guide/guide',
            })
            
          } else {
            wx.switchTab({
              url: '../homepage/homepage',
            })
          }
        })
      }
    })
  },
  //获取管理员列表
  getManagerList(){
    app.getInfoWhereInOrder("manager_list", { "mark": "1" }, "mark", "asc",function(e){
      for (var i = 0; i < e.result.data.length;i++){
        app.globalData.adiminArr.push(e.result.data[i].openid);
      }
      
    })
  },
  getGlobalIP(){
    wx.cloud.callFunction({
      name: 'getIP'
    }).then(e => {
      if (e) {
        let myIP = e.result.body.split("query\"\:\"")[1].split("\"\,\"")[0]
        console.log("IP地址为：" + myIP)
        app.globalData.myIP = myIP
      }
    }).catch(err => {
      if (err) {
          console.log("ip获取错误！")
      }
    })
  }
})