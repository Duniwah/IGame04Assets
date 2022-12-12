// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database();
const collection = db.collection("IGame04_Rank");

// 云函数入口函数
exports.main = async (event, context) => {
  let { OPENID, APPID, UNIONID } = cloud.getWXContext();
  let { func, data } = event;
  let res;
  if (func === 'uploadScore') {
    res = await uploadScore(OPENID, data);
  } else if (func === 'getScoreRankInfo') {
    res = await getScoreRankInfo(OPENID, data);
  }
  return res;
}

const uploadScore = async (_openid, userInfo) => {
  const id = userInfo._id;
  delete userInfo._id;
  userInfo._serverDate = db.serverDate();
  await collection.doc(_openid).set({
    data: userInfo
  });
  userInfo._id = id;
  return userInfo;
}

const getScoreRankInfo = async (_openid, data) => {
  const all_data = await collection.orderBy('score', 'desc')
    .skip(data.offset)
    //偏移量
    .limit(data.count)
    //数量
    .get();
  const all_data_data = all_data.data;
  return all_data_data;
}