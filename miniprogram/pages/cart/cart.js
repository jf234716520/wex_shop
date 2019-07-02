// page/component/new-pages/cart/cart.js
const app = getApp()

Page({
  data: {
    currentTab:0,
    cart:[],
    cart2:[],
    hasList: false,          // 列表是否有数据
    hasList2:false,
    totalPrice: 0,           // 总价，初始为0
    totalPrice2: 0,
  },

  onLoad(e) {
   
  },

  onShow:function() {
   
    this.setData({
      cart: app.globalData.carts
    })
    this.setData({
      cart2: app.globalData.carts2
    })
    if (this.data.cart.length!=0){
      this.setData({
        hasList: true
      })
    }
    if (this.data.cart2.length != 0) {
      this.setData({
        hasList2: true
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
  selectList2(e) {
    var self = this
    const index = e.currentTarget.dataset.index;
    let cart2 = app.globalData.carts2;
    const selected = cart2[index].sel;
    cart2[index].sel = !selected;
    this.setData({
      cart2: cart2
    });

    this.getTotalPrice2();
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
  deleteList2(e) {
    const index = e.currentTarget.dataset.index;
    let good = app.globalData.carts2;
    good.splice(index, 1);
    this.setData({
      cart2: this.data.cart2
    });

    if (!good.length) {
      this.setData({
        hasList2: false
      });
    } else {
      this.getTotalPrice2();
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
  addCount2(e) {
    const index = e.currentTarget.dataset.index;
    let good = app.globalData.carts2;
    let num = good[index].num;
    num = num + 1;
    good[index].num = num;
    this.setData({
      cart2: good
    });
    this.getTotalPrice2();
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
  gotoOrder2() {
    if (this.data.totalPrice2 == 0) {
      wx.showModal({
        title: '提示',
        content: '你尚未选择任何商品哦',
      })
    } else {
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
  minusCount2(e) {
    const index = e.currentTarget.dataset.index;
    let good = app.globalData.carts2;
    let num = good[index].num;
    if (num == 0) {
    } else {
      num = num - 1;
    }
    good[index].num = num;
    this.setData({
      cart2: good
    });
    this.getTotalPrice2();
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
  getTotalPrice2() {
    let good = app.globalData.carts2;                // 获取购物车列表
    let total = 0;
    for (let i = 0; i < good.length; i++) {         // 循环列表得到每个数据
      if (good[i].num == 0) {
        good[i].sel = false;
      }
      if (good[i].sel) {                     // 判断选中才会计算价格
        total += good[i].num * good[i].good_price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      cart2: good,
      totalPrice2: total.toFixed(1)
    });

  },
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  }

  

})