Page({
  data: {
    address: {
    name: '',
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
    var self = this;
    wx.getStorage({
      key: 'address',
      success: function (res) {
        self.setData({
          address: res.data
        })
      }
    })

  },

  formSubmit(e) {
    const value = e.detail.value;
    // console.log(value)
    if (value.name && value.phone.length === 11 && value.addressd) {
      wx.setStorage({
        key: 'address',
        data: value,
        success() {
          wx.navigateBack();
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写完整资料',
        showCancel: false
      })
    }
  }
})