// miniprogram/pages/homepage/homepage.js


const app = getApp()

Page({
  data: {
    swiperImgNo: 1,
    imgSwiperUrl: '',
    goodInfo: [], //类1
    goodInfo2: [], //类2
    goodInfo3: [], //类3
    goodInfo4: [], //类4
    typeCat: [{
        id: 0,
        name: "乳料饮品"
      },
      {
        id: 1,
        name: "坚果炒货"
      },
      {
        id: 2,
        name: "卤味小吃"
      },
      {
        id: 3,
        name: "饼干膨化"
      },
      {
        id: 4,
        name: "甜品甜食"
      },
      {
        id: 5,
        name: "豆干辣条"
      },
      {
        id: 6,
        name: "方便速食"
      },
      {
        id: 7,
        name: "糖巧果冻"
      },
      {
        id: 8,
        name: "水果冻干"
      },

    ],
    imgUrls: [],
    activeTypeId: 0,
    isShow: true,
    openid: '',
    offLine: null //是否维护
  },

  // ------------生命周期函数------------
  onLoad: function(options) {
    var that = this
    wx.showLoading({
      title: '加载中'
    })
    that.setData({
      isShow: false
    })

  },

  onShow: function() {
    var that = this;
    app.getInfoWhereInOrder('swiper_pic', { status: 1 },'status','desc',function(e){
      that.setData({
        imgUrls:e.result.data
      })
    })
    // that.typeSwitch()
    app.getInfoWhereInOrder('goods_list', {
      "good_type": "1",
      "is_show": "1",
      "good_cat": this.data.activeTypeId
    }, 'create_time', 'asc', function(e) {
      that.setData({
        goodInfo: e.result.data,
        isShow: true
      })
      //console.log(that.data.activeTypeId)
      wx.hideLoading()
    })
    
  },


  /********************本地方法 ***************************/
  // ------------加入购物车------------
  addCartByHome: function(e) {
    var that = this

    //遍历
    var isRepete = false;
    var good_v = null;
    app.globalData.carts.forEach(function(v) {
      
      console.log(e.currentTarget.dataset._id);
      if (v._id == e.currentTarget.dataset._id) {
        isRepete = true;
        good_v = v;
      }
    });
    if (isRepete) {
      app.globalData.carts[app.globalData.carts.indexOf(good_v)].num += 1;
    } else {
      var goodList = app.globalData.goodList;
      console.log(e.currentTarget.dataset._id)
      goodList.forEach(function(v) {
        if (v._id == e.currentTarget.dataset._id) {
          
          var good = v;
          good.num = 1;
          good.sel = false;
          app.globalData.carts.push(good);

          return;
        }
      })
    }
    wx.showToast({
      title: '已添加至购物车',
    });
    console.log(app.globalData)
  },


  // ------------分类展示切换---------
  typeSwitch: function(e) {
    // console.log(e.currentTarget.id)
    getCurrentPages()["0"].setData({
      activeTypeId: parseInt(e.currentTarget.id)
    })
    var that = this;
    switch (e.currentTarget.id) {
      // 全部展示
      case '0':
        

        app.getInfoWhereInOrder('goods_list', {
          "good_type": "1",
          "is_show": "1",
          "good_cat": 0
        }, 'create_time', 'asc', function(e) {
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
          "good_type": "1",
          "is_show": "1",
          "good_cat": 1
        }, 'create_time', 'asc', function(e) {
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
          "good_type": "1",
          "is_show": "1",
          "good_cat": 2
        }, 'create_time', 'asc', function(e) {
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
          "good_type": "1",
          "is_show": "1",
          "good_cat": 3
        }, 'create_time', 'asc', function(e) {
          that.setData({
            goodInfo: e.result.data,
            isShow: true
          })
          wx.hideLoading()
        })
      case '4':


        app.getInfoWhereInOrder('goods_list', {
          "good_type": "1",
          "is_show": "1",
          "good_cat": 4
        }, 'create_time', 'asc', function (e) {
          that.setData({
            goodInfo: e.result.data,
            isShow: true
          })
          wx.hideLoading()
        })
        break;
      // 今日特惠
      case '5':
        app.getInfoWhereInOrder('goods_list', {
          "good_type": "1",
          "is_show": "1",
          "good_cat": 5
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
      case '6':
        app.getInfoWhereInOrder('goods_list', {
          "good_type": "1",
          "is_show": "1",
          "good_cat": 6
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
      case '7':
        app.getInfoWhereInOrder('goods_list', {
          "good_type": "1",
          "is_show": "1",
          "good_cat": 7
        }, 'create_time', 'asc', function (e) {
          that.setData({
            goodInfo: e.result.data,
            isShow: true
          })
          wx.hideLoading()
        })
        break;
        break;
      case '8':


        app.getInfoWhereInOrder('goods_list', {
          "good_type": "1",
          "is_show": "1",
          "good_cat": 8
        }, 'create_time', 'asc', function (e) {
          that.setData({
            goodInfo: e.result.data,
            isShow: true
          })
          wx.hideLoading()
        })
        break;
      // 今日特惠
    }
  },


  // ---------点击跳转至详情页面-------------
  tapToDetail: function(e) {
    wx.navigateTo({
      url: '../detail/detail?_id=' + e.currentTarget.dataset.fid,
    })
  },

})