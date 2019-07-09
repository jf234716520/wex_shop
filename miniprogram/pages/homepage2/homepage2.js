// miniprogram/pages/homepage/homepage.js


const app = getApp()

Page({
  data: {
    swiperImgNo: 1,
    imgSwiperUrl: '',
    goodInfo: [],
    typeCat: [
      { id: 0, name: "水果" },
      { id: 1, name: "零食" },
      { id: 2, name: "文具" },
      { id: 3, name: "数码" },
    ],
    imgUrls: [],
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
    app.getInfoWhereInOrder('swiper_pic', { status: 1 }, 'status', 'desc', function (e) {
      console.log(e)
      that.setData({
        imgUrls: e.result.data
      })
    })
    // 获取openId
    //this.getOpenid();
  },

  onReady: function () {
   
  },

  onShow: function () {
    var that = this;
    // that.typeSwitch()
    app.getInfoWhereInOrder('goods_list', {
      "good_type": "2",
      "is_show": "1",
      "good_cat": this.data.activeTypeId
    }, 'create_time', 'asc', function (e) {
      that.setData({
        goodInfo: e.result.data,
        isShow: true
      })
      //console.log(that.data.activeTypeId)
      wx.hideLoading()
    })
    
    // 是否下线
    // app.getInfoWhere('setting', { "option": "offLine" },
    //   e => {
    //     that.setData({
    //       offLine: e.data["0"].offLine
    //     })
    //   }
    // )
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
    var that = this

    //遍历
    var isRepete = false;
    var good_v = null;
    app.globalData.carts2.forEach(function (v) {
      console.log(v);
      console.log(e.currentTarget.dataset._id);
      if (v._id == e.currentTarget.dataset._id) {
        isRepete = true;
        good_v = v;
      }
    });
    if (isRepete) {
      app.globalData.carts2[app.globalData.carts2.indexOf(good_v)].num += 1;
    } else {
      var goodList = app.globalData.goodList;
      goodList.forEach(function (v) {
        if (v._id == e.currentTarget.dataset._id) {
          var good = v;
          good.num = 1;
          good.sel = false;
          app.globalData.carts2.push(good);
         
          return;
        }
      })
    }
    wx.showToast({
      title: '已添加至购物车',
    });
  },


  // ------------分类展示切换---------
  typeSwitch: function (e) {
    // console.log(e.currentTarget.id)
    getCurrentPages()["0"].setData({
      activeTypeId: parseInt(e.currentTarget.id)
    })
    var that = this;
    switch (e.currentTarget.id) {
      // 全部展示
      case '0':


        app.getInfoWhereInOrder('goods_list', {
          "good_type": "2",
          "is_show": "1",
          "good_cat": 0
        }, 'create_time', 'asc', function (e) {
          that.setData({
            goodInfo: e.result.data,
            isShow: true
          })
          wx.hideLoading()
        })
        break;
      // 今日特惠
      case '1':
        app.getInfoWhereInOrder('goods_list', {
          "good_type": "2",
          "is_show": "1",
          "good_cat": 1
        }, 'create_time', 'asc', function (e) {
          that.setData({
            goodInfo: e.result.data,
            isShow: true
          })
          wx.hideLoading()
        })
        break;
        break;
      // 销量排行
      case '2':
        app.getInfoWhereInOrder('goods_list', {
          "good_type": "2",
          "is_show": "1",
          "good_cat": 2
        }, 'create_time', 'asc', function (e) {
          that.setData({
            goodInfo: e.result.data,
            isShow: true
          })
          wx.hideLoading()
        })
        break;
        break;
      // 店主推荐
      case '3':
        app.getInfoWhereInOrder('goods_list', {
          "good_type": "2",
          "is_show": "1",
          "good_cat": 3
        }, 'create_time', 'asc', function (e) {
          that.setData({
            goodInfo: e.result.data,
            isShow: true
          })
          wx.hideLoading()
        })
        break;
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