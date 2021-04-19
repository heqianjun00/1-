// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'test-3g4ioyvm714c6661'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    openid: wxContext.OPENID
  }
}