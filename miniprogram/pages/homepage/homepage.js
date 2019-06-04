// miniprogram/pages/homepage/homepage.js


const app = getApp()

Page({
  data: {
    swiperImgNo: 1,
    imgSwiperUrl: '',
    goodInfo: [],
    activeTypeId: 0,
    isShow:true, 
    openid: '',   
    offLine:null  //是否维护
  },

  // ------------生命周期函数------------
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中'
    })
    that.setData({
      isShow: false
    })
    
  },

  onShow: function () {
    var that = this;

    app.getInfoWhereInOrder('goods_list', { "good_type": "1", "is_show": "1" }, 'create_time', 'asc', function (e) {
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


  /********************本地方法 ***************************/
  // ------------加入购物车------------
  addCartByHome: function (e) {
    var that = this

    //遍历
    var isRepete = false;
    app.globalData.carts.forEach(function (v) {
      console.log(v);
      console.log(e.currentTarget.dataset._id);
      if (v._id == e.currentTarget.dataset._id) {
        isRepete = true;
      }
    });
    if (isRepete) {
      wx.showToast({
        title: '已经添加过了~',
      })
    } else {
      var goodList = app.globalData.goodList;
      goodList.forEach(function(v){
        if (v._id == e.currentTarget.dataset._id){
          var good = v; 
          good.num =1;
          good.sel = false;
          app.globalData.carts.push(good);
          wx.showToast({
            title: '已添加至购物车',
          });
          return;
        }
      })
    }
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