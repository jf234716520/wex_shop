// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  
    const Max_limit = 100
    // 先取出集合记录总数
  const countResult = await db.collection(event.setName).count()
    const total = countResult.total
    // 计算需分几次取
    const batchTimes = Math.ceil(total / Max_limit)
    var data = [];
    for (let i = 0; i < batchTimes; i++) {
      var pageData = await new Promise(function(resolve,reject){
        var result = db.collection(event.setName).where(event.condition).skip(i * Max_limit).limit(Max_limit).get();
        resolve(result.data)
      })
      data=data.concat(pageData);
    }

  return data;    
   
}
