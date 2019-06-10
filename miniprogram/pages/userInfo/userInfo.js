Page({
  data: {
    userInfo: {
      name: '',
      phone: '',
      school: '',
      confirmImage: ''
    }
  },

  onLoad() {
    var self = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        self.setData({
          userInfo: res.data
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