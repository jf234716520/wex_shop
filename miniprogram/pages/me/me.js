// page/component/new-pages/user/user.js
const app = getApp()
const md5 = require("../../utils/md5.js")


Page({
  data: {
    orders: [],
    spbill_create_ip: '',
    userInfo:{},
    needXy:false,
    hasAddress: false,
    address: {},
    isAdmin: -1,
    openid: '',
    adiminArr: [],
    xypayShow:"加载中"
  },
  onLoad() {
    var that = this;
  },

  onShow() {
    this.getOpenidAndOrders();
    this.setData({
      adiminArr: app.globalData.adiminArr
    })
  },
  onPullDownRefresh: function () {
    var that = this
    that.getOpenidAndOrders()
    var timer

    (timer = setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 500));

  },

  // 获取用户openid
  getOpenidAndOrders() {
    var that = this;
    wx.cloud.callFunction({
      name: 'add',
      complete: res => {
        var openid = res.result.openId;
        var isAdmin = null;
        that.setData({
          openid: openid,
          isAdmin: that.data.adiminArr.indexOf(openid)
        })
        this.getUserInfo();
        app.getInfoWhereInOrder('order_manage',{
          openid: openid
        },"create_time","desc",e=>{
          var curTime = new Date();
          for (var index = 0; index < e.result.data.length; index++){
           
            if (e.result.data[index].isPay == 0 && e.result.data[index].order_type==2){
              var createTime = e.result.data[index].create_time+"";
              var orderDate = new Date(createTime.substr(0, 4), Number(createTime.substr(4, 2))-1, createTime.substr(6, 2));
              
              var intime = Date.parse(orderDate) + app.globalData.maxXyDay * 86400000 - Date.parse(curTime);
              e.result.data[index].leftDay = Math.ceil(intime / 86400000);
            }
          }
         
          that.setData({
            orders: e.result.data
          })
          
        })
      }
    })
  },
  //获取用户注册信息
  getUserInfo:function(){
    var that = this;
    var openid = that.data.openid;

    app.getInfoWhereInOrder('customers', { "openid": openid  }, 'openid', 'asc', function (e)    {
      console.log(e)
      if (e.result.data[0].xypay.status == 1 || e.result.data[0].xypay.status == 0 ){
        that.setData({
          userInfo: e.result.data[0],
          needXy:false
        })
      }else{
        that.setData({
          userInfo: e.result.data[0],
          needXy: true
        })
      }
      
      //用户额度显示
      if (e.result.data[0].xypay.status == -1 ){
        that.setData({
          xypayShow: "点击申请额度"
        })
      } else if (e.result.data[0].xypay.status == 0 ){
        that.setData({
          xypayShow: "等待审批"
        })
      } else if (e.result.data[0].xypay.status == 1 ){
        that.setData({
          xypayShow: "￥" + e.result.data[0].xypay.amt
        })
      }

      //判断是否已注册
      if(e.result.data[0].addressd!=undefined){
        that.setData({
          hasAddress: true
        })
      }
    })
  },

  goToBgInfo: function() {
    wx.navigateTo({
      url: '/pages/bgInfo/bgInfo',
    })
  },

  goToBgManage: function () {
    wx.navigateTo({
      url: '/pages/bgManage/bgManage',
    })
  },

  goToUserInfo: function(){
    wx.navigateTo({
      url: '/pages/userInfo/userInfo',
    })
  },

  goToPay(fontData) {
    var out_trade_no = (new Date().getTime() + app.RndNum(6)).toString()
    var nonce_str = app.RndNum()
    console.log("fontdata:")
    console.log(fontData)
    var that = this

      // ------获取prepay_id，所需的签名字符串------
      var p = new Promise((resolve, reject) => {
        // 生成订单号
        

        // -----生成字符串------

        var stringA =
          "appid=" + app.globalData.appid
          + "&attach=xcx"
          + "&body=JSAPI"
          + "&device_info=WEB"
          + "&mch_id=" + app.globalData.mch_id
          + "&nonce_str=" + nonce_str  //to modify
          + "&notify_url=127.0.0.1"
          + "&openid=" + that.data.openid
          + "&out_trade_no=" + out_trade_no  //to do
          + "&spbill_create_ip=" + app.globalData.myIP
          + "&time_expire=" + app.beforeNowtimeByMin(-15)
          + "&time_start=" + app.CurrentTime()
          + "&total_fee=" + parseInt(fontData.currentTarget.dataset.id.price) * 100 //todo
          + "&trade_type=JSAPI";

          //console.log(stringA)

        var stringSignTemp = stringA + "&key=" + app.globalData.apikey
        // 签名MD5加密
        var sign = md5.md5(stringSignTemp).toUpperCase()
        // openid
        var openid = app.globalData.openid

        resolve([sign, openid, out_trade_no])

      })
      p.then(e => {
        // 生成获取prepay_id请求的xml参数
        var xmlData = '<xml>' +
          '<appid>' + app.globalData.appid + '</appid>' +
          '<attach>xcx</attach>' +
          '<body>JSAPI</body>' +
          '<device_info>WEB</device_info>' +
          '<mch_id>' + app.globalData.mch_id + '</mch_id>' +
          '<nonce_str>' + nonce_str + '</nonce_str>' +
          '<notify_url>127.0.0.1</notify_url>' +
          '<openid>' + that.data.openid + '</openid>' +
          '<out_trade_no>' + e[2] + '</out_trade_no>' +
          '<spbill_create_ip>' + app.globalData.myIP + '</spbill_create_ip>' +
          '<time_expire>' + app.beforeNowtimeByMin(-15) + '</time_expire>' +
          '<time_start>' + app.CurrentTime() + '</time_start>' +
          '<total_fee>' + parseInt(fontData.currentTarget.dataset.id.price) * 100 + '</total_fee>' +  //to mod
          '<trade_type>JSAPI</trade_type>' +
          '<sign>' + e[0] + '</sign>' +
          '</xml>'

        var tmpOutNum = e[2]
        // 获取prepay_id,发送支付请求
        wx.cloud.callFunction({
          name: 'pay',
          data: {
            xmlData: xmlData
          }
        })
          .then(res => {
            console.log(res)
            if (res) {
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
                success: function (e3) {
                  app.updateDB("order_manage", fontData.currentTarget.dataset.id._id, { isPay: 1 }, function (e2) {
                    var curXypay = that.data.userInfo.xypay;
                    curXypay.amt = parseInt(fontData.currentTarget.dataset.id.price) + parseInt(curXypay.amt);
                    app.updateDB("customers", that.data.userInfo._id, { xypay: curXypay},function(e3){
                      wx.showModal({
                        title: '支付成功',
                        content: '支付成功！',
                        showCancel: false,
                        complete: function () {
                          wx.switchTab({
                            url: "../homepage/homepage"
                          })
                        }
                      })
                    })
              
                  })
                }
              })
            }
          })
          .catch(err => {
            if (err) {
              wx.showModal({
                title: '错误',
                content: '请重新点击支付~',
              })
            }
          })

        // end获取openid
      })

      // end if 地址  
    
  },


  //申请额度
  applyXy:function(){
    if(this.data.needXy){
      wx.navigateTo({
        url: '/pages/applyXy/applyXy',
      })
    }
  },
  //
  goToXyList:function(){
    wx.navigateTo({
      url: '/pages/XyApprove/XyList',
    })
  },
  goToSwiper:function(){
    wx.navigateTo({
      url: '/pages/swiperManage/swiperManage',
    })
  }
})