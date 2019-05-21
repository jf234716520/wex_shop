// page/component/new-pages/cart/cart.js
const app = getApp()

Page({
  data: {
    cart: {},               // 购物车列表
    hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    obj: {name: "hello"},
    goodList:[]
  },

  onLoad(e) {
    wx.showLoading({
      title: '加载中',
    })
  },

  onShow:function() {
    var self = this
    app.getInfoWhereInOrder("cart", { 'openid': app.globalData.openid }, 'openid', 'asc', function (e) {
      self.setData({
        cart: e.result.data[0]
      });
      
      wx.cloud.callFunction({
        name: 'selectAll',
        data: {
          setName: "goods_list"
        },
        complete: function (e2) {
          self.setData({
            goodList: e2.result.data
          });
          //遍历购物车商品
          let cart_good = self.data.cart.good;
          let all_good = self.data.goodList;
          cart_good.forEach(function (cart_value,cart_index){
            all_good.forEach(function (all_value, all_index) {
              if (all_value._id == cart_value.good_id){
                cart_value.name = all_value.good_name;
                cart_value.price = all_value.good_price;
                cart_value.unit = all_value.good_unit;
                cart_value.type = all_value.good_type;
                cart_value.onSale = all_value.is_show;
                cart_value.img = all_value.good_img[0];
                
              }
            })
          })
          if (self.data.cart.good.length!=0){
            self.setData({
              hasList: true
            });
          }
          self.getTotalPrice();
          wx.hideLoading()
        }
      })
    })    
  },
 
  onHide: function () {
    var cartId = this.data.cart._id;
    delete (this.data.cart._id);
    app.updateDB('cart', cartId, this.data.cart,function(e){
      console.log(e)
    });
  },

  /**
   * 当前商品选中事件
   */
  selectList(e) {
    var self = this
    const index = e.currentTarget.dataset.index;
    let cart = this.data.cart;
    const selected = cart.good[index].sel;
    cart.good[index].sel = !selected;
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
    let good = this.data.cart.good;
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
    let good = this.data.cart.good;
    let num = good[index].num;
    num = num + 1;
    good[index].num = num;   
    this.getTotalPrice();
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    let good = this.data.cart.good;
    let num = good[index].num;
    if (num == 0){
    }else{
      num = num - 1;
    }
    good[index].num = num;
    this.getTotalPrice();
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let cart = this.data.cart;                  // 获取购物车列表
    let good = cart.good;
    let total = 0;
    for (let i = 0; i < good.length; i++) {         // 循环列表得到每个数据
      if(good[i].num==0){
        good[i].sel=false;
      }
      if (good[i].sel) {                     // 判断选中才会计算价格
        total += good[i].num * good[i].price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      cart: cart,
      totalPrice: total.toFixed(1)
    });
      
  }

})