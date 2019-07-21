// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection(event.setName).where({
    good_name:db.RegExp({
      regexp: event.good_name,
      options:'i'
    }),
    good_type: event.good_type,
    is_show:"1"
  }).get();
}
