// miniprogram/pages/detail/detail.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodDetail: {}, //水果信息
    popUpHidden: true, //是否隐藏弹窗
    popCartCount: 1, //购物车数量
    curIndex: 0,
    articleID: "",
    openid:'',
    cart:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this
    that.setData({
      articleID: e._id
    })
    app.getInfoWhereInOrder('goods_list', { "_id": that.data.articleID }, '_id', 'asc', function (e) {
      that.setData({
        goodDetail: e.result.data[0],
        isShow: true
      })
      wx.hideLoading()
    });
    app.getInfoWhereInOrder("cart", { 'openid': app.globalData.openid }, 'openid', 'asc', function (e) {
      that.setData({
        cart: e.result.data[0]
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


  /********************本地方法********************************* */
  // 跳转至购物车
  goToCart: function () {
    // console.log('hhhh')
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  },

  // 弹出购物车选项
  addToCart: function () {
    var that = this
    that.setData({
      popUpHidden: false
    })
  },

  // 关闭弹窗
  popCancel: function () {
    var that = this
    that.setData({
      popUpHidden: true
    })
  },

  // 数量加减
  plusCount: function () {
    var that = this
    var tmp = that.data.popCartCount + 1
    that.setData({
      popCartCount: tmp
    })
  },
  minusCount: function () {
    var that = this
    var tmp = that.data.popCartCount - 1
    if (tmp === 0) tmp = 1
    that.setData({
      popCartCount: tmp
    })
  },


  // 添加购物车
  toCart: function () {
    var that = this
    
    //遍历
    var isRepete=false;
    that.data.cart.good.forEach(function (v) {
        if (v.good_id == that.data.articleID){
          isRepete=true;
        }
    });
    if (isRepete){
      wx.showToast({
        title: '已经添加过了~',
      })
    }else{
      that.data.cart.good.push({
        "good_id":that.data.articleID,
        "num": that.data.popCartCount
      });
      delete (that.data.cart._id);
      app.updateDB("cart", that.data.cart._id, that.data.cart, function (e) {
        wx.showToast({
          title: '已添加至购物车',
        });
        that.setData({
          popUpHidden: true
        });
      })
    }
  },

  // 立即购买
  toBuy: function () {
    var that = this
    var newCartItem = that.data.fruitDetail
    newCartItem.num = that.data.popCartCount
    // console.log(newCartItem)
    // app.globalData.carts.push(newCartItem)
    app.isNotRepeteToCart(newCartItem)
    // console.log(app.globalData.carts) 
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  },

  // 详细信息切换
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },
})