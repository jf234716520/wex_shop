const app = getApp()
const md5 = require("../../utils/md5.js")

Page({
  data: {
    address: {},
    hasAddress: false,
    total1: 0,//临期商品总价
    total2: 0,//信用商品总价
    orders: [],
    myList: [],
    openid: '',
    nonce_str: '',
    spbill_create_ip: ''
  },

  onReady() {
    const self = this; 
    // 32位随机字符串
    var nonce_str = app.RndNum()

    // 获取ip地址
    wx.cloud.callFunction({
      name: 'getIP'
    }).then(e=>{
      if(e){
        let spbill_create_ip = e.result.body.split("query\"\:\"")[1].split("\"\,\"")[0]
        console.log("IP地址为：" + spbill_create_ip)
        self.setData({
          spbill_create_ip: spbill_create_ip
        })
      }
    }).catch(err=>{
      if (err) {
        wx.showModal({
          title: '错误',
          content: '请您重新下单~',
        })
      }
    })

    // 获取总价和openid
    var orders = [];
    app.globalData.carts.forEach(function(v){
      if(v.sel){
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
      console.log(e.result.data[0])
      self.setData({
        address: e.result.data[0],
        hasAddress: true
      })
    })
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    var orders = app.globalData.carts; 
    let total1 = 0;
    for (let i = 0; i < orders.length; i++) {
      //临期商品总价
        total1 += orders[i].num * orders[i].good_price;   
    }
    this.setData({
      total1: total1.toFixed(2)
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
    
    if (that.data.address.addressd!=undefined) {

      // ------获取prepay_id，所需的签名字符串------
      var p = new Promise((resolve,reject)=>{
      // 生成订单号
      var out_trade_no = (new Date().getTime() + app.RndNum(6)).toString()

      // -----生成字符串------
      
      var stringA = 
        "appid="+app.globalData.appid
      + "&attach=xcx"
        + "&body=JSAPI"
      + "&device_info=WEB"
      + "&mch_id="+app.globalData.mch_id
      + "&nonce_str="+that.data.nonce_str
        + "&notify_url=127.0.0.1"
      + "&openid="+that.data.openid
      + "&out_trade_no="+out_trade_no
      + "&spbill_create_ip="+that.data.spbill_create_ip
      + "&time_expire="+app.beforeNowtimeByMin(-15)
      + "&time_start="+app.CurrentTime()
      + "&total_fee="+parseInt(that.data.total1*100)
      + "&trade_type=JSAPI";

      var stringSignTemp = stringA +"&key="+app.globalData.apikey
      // 签名MD5加密
      var sign = md5.md5(stringSignTemp).toUpperCase()
      // openid
      var openid = that.data.openid

      resolve([sign,openid,out_trade_no])

      })
      p.then(e => {
        // 生成获取prepay_id请求的xml参数
        var xmlData = '<xml>'+
          '<appid>'+app.globalData.appid+'</appid>'+
          '<attach>xcx</attach>'+
          '<body>JSAPI</body>'+
          '<device_info>WEB</device_info>'+
          '<mch_id>'+app.globalData.mch_id+'</mch_id>' +
          '<nonce_str>'+that.data.nonce_str+'</nonce_str>' +
          '<notify_url>127.0.0.1</notify_url>' +
          '<openid>'+that.data.openid+'</openid>'+
          '<out_trade_no>'+e[2]+'</out_trade_no>'+
          '<spbill_create_ip>'+that.data.spbill_create_ip+'</spbill_create_ip>'+
          '<time_expire>'+app.beforeNowtimeByMin(-15)+'</time_expire>'+
          '<time_start>'+app.CurrentTime()+'</time_start>'+
          '<total_fee>'+parseInt(that.data.total1 * 100)+'</total_fee>'+
          '<trade_type>JSAPI</trade_type>'+
          '<sign>'+e[0]+'</sign>'+
          '</xml>'

        var tmpOutNum = e[2]
        // 获取prepay_id,发送支付请求
       wx.cloud.callFunction({
          name:'pay',
          data:{
            xmlData:xmlData
          }
        })
        .then(res=>{
          console.log(res)
          if(res){
            var prepay_id = res.result.body.split("<prepay_id><![CDATA[")[1].split("]]></prepay_id>")[0];
            var timeStamp = Math.round((Date.now() / 1000)).toString()
            var nonceStr = app.RndNum()
            var stringB =
              "appId=" + app.globalData.appid
              + "&nonceStr=" + nonceStr
              + "&package=" + 'prepay_id=' + prepay_id
              + "&signType=MD5"
              + "&timeStamp=" + timeStamp
            var paySignTemp = stringB + "&key=" + app.globalData.apikey
            // 签名MD5加密
            var paySign = md5.md5(paySignTemp).toUpperCase()
            // 调起请求
            wx.requestPayment({
              appId: app.globalData.appid,
              timeStamp: timeStamp,
              nonceStr: nonceStr,
              package: 'prepay_id=' + prepay_id,
              signType: 'MD5',
              paySign: paySign,
              success: function (e) {
                app.getInfoWhere('order_master',{
                  'out_trade_no': tmpOutNum
                },e=>{
                  var orderId = e.data["0"]._id
                  app.updateInfo('order_master', orderId,{
                    'paySuccess':true,
                    'payTime': app.CurrentTime_show()
                  },e=>{
                    console.log("订单状态已修改：【支付成功】"+e)
                    wx.showToast({
                      title: '支付成功',
                    })
                    wx.switchTab({
                      url: '../me/me',
                    })
                  })
                })
              }
            })
          }
        })
        .catch(err=>{
          if(err){
            wx.showModal({
              title: '错误',
              content: '请重新点击支付~',
            })
          }
        })

      // end获取openid
      })

    // end if 地址  
    }

    else{
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
      // console.log(res)
      that.setData({
        myList: res
      })
    })
  },
})