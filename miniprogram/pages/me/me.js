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
      'oA9Ke4rH2nnqFgFbWIhyQu5bCXPA',
      'oO0KL5Qz1yyjVn59fcpUsY0MChRY'
    ],
    xypayShow:"加载中"
  },
  onLoad() {
    var that = this;
  },

  onShow() {
    this.getOpenidAndOrders();
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
        app.getInfoWhereInOrder('order_manage',{
          openid: openid
        },"create_time","desc",e=>{
          that.setData({
            orders: e.result.data
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
      if (e.result.data[0].xypay.status == 1 ){
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
      console.log(e.result.data[0])
      //用户额度显示
      if (e.result.data[0].xypay.status == -1 ){
        that.setData({
          xypayShow: "点击申请额度"
        })
      } else if (e.result.data[0].xypay.status == 0 ){
        that.setData({
          xypayShow: "等待审批"
        })
      } else if (e.result.data[0].xypay.status == 1 ){
        that.setData({
          xypayShow: "￥" + e.result.data[0].xypay.amt
        })
      }

      //判断是否已注册
      if(e.result.data[0].addressd!=undefined){
        that.setData({
          hasAddress: true
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
    if(this.data.needXy){
      wx.navigateTo({
        url: '/pages/applyXy/applyXy',
      })
    }
  },
  //
  goToXyList:function(){
    wx.navigateTo({
      url: '/pages/XyApprove/XyList',
    })
  },
  goToSwiper:function(){
    wx.navigateTo({
      url: '/pages/swiperManage/swiperManage',
    })
  }
})