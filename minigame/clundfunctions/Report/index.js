// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 上报数据
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const gameDB = wx.cloud.database({
    env: "clound1"
  });
  const db = gameDB.collection("IGame04");
  
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}