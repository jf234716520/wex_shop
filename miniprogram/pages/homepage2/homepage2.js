// miniprogram/pages/homepage/homepage.js


const app = getApp()

Page({
  data: {
    swiperImgNo: 1,
    imgSwiperUrl: '',
    goodInfo: [],
    typeCat: [
      { id: 0, name: "美味鲜果" },
      { id: 1, name: "今日特惠" },
      { id: 2, name: "新鲜上架" },
      { id: 3, name: "店主推荐" },
    ],
    activeTypeId: 0,
    isShow:true, 
    openid: '',   
    offLine:null  //是否维护
  },

  // ------------生命周期函数------------
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      isShow: false
    })
    // 获取openId
    //this.getOpenid();
  },

  onReady: function () {
   
  },

  onShow: function () {
    var that = this;
    app.getInfoWhereInOrder('goods_list', { "good_type": "2","is_show":"1" }, 'create_time', 'asc',function(e){
      that.setData({
        goodInfo: e.result.data,
        isShow: true
      })
      wx.hideLoading()
    })
    
    // 是否下线
    app.getInfoWhere('setting', { "option": "offLine" },
      e => {
        that.setData({
          offLine: e.data["0"].offLine
        })
      }
    )
  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {
  
  },

  /********************本地方法 ***************************/
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

  // ------------加入购物车------------
  addCartByHome: function (e) {
    // console.log(e.currentTarget.dataset._id)
    var self = this
    let newItem = {}
    app.getInfoWhere('goods_list', { _id: e.currentTarget.dataset._id },
      e => {

        var newCartItem = e.data["0"]
        newCartItem.num = 1
        app.isNotRepeteToCart(newCartItem)
        wx.showToast({
          title: '已添加至购物车',
        })
      }
    )
  },


  // ------------分类展示切换---------
  typeSwitch: function (e) {
    // console.log(e.currentTarget.id)
    getCurrentPages()["0"].setData({
      activeTypeId: parseInt(e.currentTarget.id)
    })
    switch (e.currentTarget.id) {
      // 全部展示
      case '0':
        app.getInfoByOrder('goods_list', 'time', 'desc',
          e => {
            getCurrentPages()["0"].setData({
              fruitInfo: e.data
            })
          }
        )
        break;
      // 今日特惠
      case '1':
        app.getInfoWhere('fruit-board', { is_show: '1' },
          e => {
            getCurrentPages()["0"].setData({
              goodInfo: e.data
            })
          }
        )
        break;
      // 销量排行
      case '2':
        app.getInfoWhere('fruit-board', { myClass: '2' },
          e => {
            getCurrentPages()["0"].setData({
              fruitInfo: e.data
            })
          }
        )
        break;
      // 店主推荐
      case '3':
        app.getInfoWhere('fruit-board', { recommend: '1' },
          e => {
            getCurrentPages()["0"].setData({
              fruitInfo: e.data
            })
          }
        )
        break;
    }
  },


  // ---------点击跳转至详情页面-------------
  tapToDetail: function (e) {
    wx.navigateTo({
      url: '../detail/detail?_id=' + e.currentTarget.dataset.fid,
    })
  },

})