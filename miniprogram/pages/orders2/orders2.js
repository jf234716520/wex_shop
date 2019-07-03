const app = getApp()
const md5 = require("../../utils/md5.js")

Page({
  data: {
    address: {},
    hasAddress: false,
    total: 0,//商品总价
    orders: [],
    myList: [],
    openid: '',
    nonce_str: ''
  },

  onReady() {
    this.checkXyOrder();
    const self = this;
    // 32位随机字符串
    var nonce_str = app.RndNum()

    // 获取ip地址
    wx.cloud.callFunction({
      name: 'getIP'
    }).then(e => {
      if (e) {
        let spbill_create_ip = e.result.body.split("query\"\:\"")[1].split("\"\,\"")[0]
        console.log("IP地址为：" + spbill_create_ip)
        self.setData({
          spbill_create_ip: spbill_create_ip
        })
      }
    }).catch(err => {
      if (err) {
        wx.showModal({
          title: '错误',
          content: '请您重新下单~',
        })
      }
    })

    // 获取总价和openid
    var orders = [];
    app.globalData.carts2.forEach(function (v) {
      if (v.sel) {
        orders.push(v);
      }
    })
    self.setData({
      orders: orders,
      nonce_str: nonce_str
    })
    this.getOpenid();
    this.getTotalPrice();
  },
  // onReady↑

  onShow: function () {
    var self = this;
    var openid = app.globalData.openid;
    app.getInfoWhereInOrder("customers", { "openid": openid }, "openid", "asc", function (e) {
      self.setData({
        address: e.result.data[0]
      })
      if (e.result.data[0].addressd!=null){
        self.setData({
          hasAddress: true
        })
      }
    })
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    var orders = app.globalData.carts2;
    let total = 0;
    for (let i = 0; i < orders.length; i++) {
      //商品总价
      if (orders[i].sel ) {
        total += orders[i].num * orders[i].good_price;
      } 
    }
    this.setData({
      total: total.toFixed(2)  
    })

  },

  // 获取用户openid
  getOpenid() {
    var that = this;
    wx.cloud.callFunction({
      name: 'add',
      complete: res => {
        console.log('云函数获取到的openid: ', res.result.openId)
        var openid = res.result.openId;
        that.setData({
          openid: openid,
        })
      }
    })
  },

  // -------------!! 支付！！------------------
  toPay() {
    var that = this
    if (that.data.address.xypay.status!=1){
      wx.showModal({
        title: 'Oh No',
        content: '您还没有信用额度，快去《我的》申请吧~',
      })
      return;
    }
    if (that.data.address.xypay.amt < that.data.total){
      wx.showModal({
        title: 'Oh No',
        content: '信用额度不够了，是否有订单未支付呢~',
      })
      return;
    }
    //未及时还款
    










    if (that.data.hasAddress) {
      var left = that.data.address.xypay.amt - that.data.total;
      app.addRows("order_manage", { openid: that.data.address.openid, order_type: 2, address: that.data.address, price: that.data.total, create_time: app.CurrentTime(),isFinished:0,isPay:0},function(e1){
        console.log(e1)
        app.updateDB("customers", that.data.address._id, { xypay: { amt: left } }, function (e2) {
          wx.showModal({
            title: '支付成功',
            content: '支付成功！',
            showCancel:false,
            complete:function(){
              wx.switchTab({
                url:"../homepage/homepage"
              })
            }
          })
        })
      })
      
    }else {
      wx.showModal({
        title: 'Oh No',
        content: '请填写收货地址~',
      })
    }
  },

  // 支付后的订单信息
  getListAfterPay: function (that) {
    var p = new Promise((resolve, reject) => {
      let theList = []
      that.data.orders.forEach((val, idx, obj) => {
        var { name, num, price } = val
        var tmpInfo = { name, num, price }
        theList.push(tmpInfo)
      })
      resolve(theList)
    }).then(res => {
      that.setData({
        myList: res
      })
    })
  },
  //检查是否有逾期记录
  checkXyOrder:function(){
    app.getInfoWhereInOrder("order_manage", { openid: app.globalData.openid,order_type:2},"openid","asc",function(e){
      var curDate = new Date();
      y=curDate.getFullYear();
      m = curDate.getMonth() > 10 ? curDate.getMonth()+ : ("0" + (curDate.getMonth()+1));

      e.result.data.forEach(function(v){
        var date = v.create_time.substr(0,8);
        
        Number(date)+
      })
    })

  }
})