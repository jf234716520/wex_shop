// page/component/new-pages/cart/cart.js
const app = getApp()

Page({
  data: {
    cart:[],
    hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
  },

  onLoad(e) {
   
  },

  onShow:function() {
   
    this.setData({
      cart: app.globalData.carts
    })
    if (this.data.cart.length!=0){
      this.setData({
        hasList: true
      })
    }
  },
 

  /**
   * 当前商品选中事件
   */
  selectList(e) {
    var self = this
    const index = e.currentTarget.dataset.index;
    let cart = app.globalData.carts;
    const selected = cart[index].sel;
    cart[index].sel = !selected;
    this.setData({
      cart: cart
    });
    
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let good = app.globalData.carts;
    good.splice(index, 1);
    this.setData({
      cart: this.data.cart
    });
    
    if (!good.length) {
      this.setData({
        hasList: false
      });
    } else {
      this.getTotalPrice();
    }
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let good = this.data.cart.good;

    for (let i = 0; i < good.length; i++) {
      good[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    app.globalData.carts = carts
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let good = app.globalData.carts;
    let num = good[index].num;
    num = num + 1;
    good[index].num = num;
    this.setData({
      cart: good
    });
    this.getTotalPrice();
  },

  gotoOrder(){
    if (this.data.totalPrice==0){
      wx.showModal({
        title: '提示',
        content: '你尚未选择任何商品哦',
      })
    }else{
      wx.navigateTo({
        url: '../orders/orders',
      })
    }
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    let good = app.globalData.carts;
    let num = good[index].num;
    if (num == 0){
    }else{
      num = num - 1;
    }
    good[index].num = num;
    this.setData({
      cart: good
    });
    this.getTotalPrice();
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let good = app.globalData.carts;                // 获取购物车列表
    let total = 0;
    for (let i = 0; i < good.length; i++) {         // 循环列表得到每个数据
      if(good[i].num==0){
        good[i].sel=false;
      }
      if (good[i].sel) {                     // 判断选中才会计算价格
        total += good[i].num * good[i].good_price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      cart: good,
      totalPrice: total.toFixed(1)
    });
      
  },
  

})