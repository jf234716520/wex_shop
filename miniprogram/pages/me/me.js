// page/component/new-pages/user/user.js
const app = getApp();

Page({
  data: {
    orders: [],
    userInfo:{},
    needXy:false,
    hasAddress: false,
    address: {},
    isAdmin: -1,
    openid: '',
    adiminArr: [
      'oO0KL5WAb-qZAYCh7vMIOm4h1N3k',
      'oqt-H5MP6rdZqLlR1wXj_IUlBCmg',
      'oA9Ke4rH2nnqFgFbWIhyQu5bCXPA'
    ]
  },
  onLoad() {
    var that = this;
  },

  onShow() {
    this.getOpenidAndOrders();
    
    var self = this;
    // console.log(self.data)
    /**
     * 获取本地缓存 地址信息
     */
    wx.getStorage({
      key: 'address',
      success: function (res) {
        self.setData({
          hasAddress: true,
          address: res.data
        })
      }
    })
  },
  onPullDownRefresh: function () {
    var that = this
    that.getOpenidAndOrders()
    var timer

    (timer = setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 500));

  },

  // 获取用户openid
  getOpenidAndOrders() {
    var that = this;
    wx.cloud.callFunction({
      name: 'add',
      complete: res => {
        var openid = res.result.openId;
        var isAdmin = null;
        that.setData({
          openid: openid,
          isAdmin: that.data.adiminArr.indexOf(openid)
        })
        this.getUserInfo();
        app.getInfoWhere('order_manage',{
          openid: openid
        },e=>{
          
          var tmp = []
          var len = e.data.length
          for (var i = 0; i < len;i++){
            tmp.push(e.data.pop())
          }
          that.setData({
            orders: tmp
          })
          
        })
      }
    })
  },
  //获取用户注册信息
  getUserInfo:function(){
    var that = this;
    var openid = that.data.openid;

    app.getInfoWhereInOrder('customers', { "openid": openid  }, 'openid', 'asc', function (e)    {
      if (e.result.data[0].xypay!=-1){
        that.setData({
          userInfo: e.result.data[0],
          needXy:false
        })
      }else{
        that.setData({
          userInfo: e.result.data[0],
          needXy: true
        })
      }
      
    })
  },

  goToBgInfo: function() {
    wx.navigateTo({
      url: '/pages/bgInfo/bgInfo',
    })
  },

  goToBgManage: function () {
    wx.navigateTo({
      url: '/pages/bgManage/bgManage',
    })
  },

  goToUserInfo: function(){
    wx.navigateTo({
      url: '/pages/userInfo/userInfo',
    })
  },
  //申请额度
  applyXy:function(){
    console.log(this.data.needXy)
    if(this.data.needXy){
      wx.navigateTo({
        url: '/pages/applyXy/applyXy',
      })
    }
  }
})