const app = getApp();
Page({
  data: {
    address: {
    name: '',
    school:'',
    phone: '',
    addressd:'',
    remark:''   
    },

    school: 0,
    school_Arr: [
      "交大",
      "华师大"
    ],

    // address: 0,
    address_Arr:[
      "宿舍楼","学院","图书馆","餐厅","教学楼","其他"
    ],

    // apartment:0,
    // apartment_Arr:[0,1,2,3]

  },
  onLoad() {
    

  },
  onShow(){
    var self = this;
    var openid = app.globalData.openid;
    app.getInfoWhereInOrder("customers", { "openid": openid }, "openid", "asc", function (e) {
      self.setData({
        address: e.result.data[0]
      })
    })
  },

  formSubmit(e) {
    const value = e.detail.value;
    if (value.name && value.phone.length === 11 && value.addressd) {
      app.updateDB("customers", this.data.address._id, value, function (e) {
        wx.navigateBack();
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写完整资料',
        showCancel: false
      })
    }
  }
})