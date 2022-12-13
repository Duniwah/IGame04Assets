// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database();
const collection = db.collection("IGame04_Rank");
const MAX_LIMIT = 100;


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
  let userInfo;
  await wx.getUserProfile({
    desc: 'desc',
  })
  let info = {
    wxgame: {
      score: userInfo.wxgame.score,
      update_time: userInfo.wxgame.update_time,
    },
    coin: userInfo.coin,
    // name:
    // url
    _serverDate = db.serverDate()
  }
  let msg;
  await collection.doc(_openid).set({
    data: info
  }).then(res => {
    msg = res
  })
  return {
    data: info,
    msg = msg,
  }
}

const getScoreRankInfo = async (_openid, data) => {
  // //orderBy 排序
  // const all_data = await collection.orderBy('wxgame.score', 'desc')
  //   //偏移量
  //   .skip(data.offset)
  //   //数量
  //   .limit(data.count)
  //   .get();
  // const all_data_data = all_data.data;
  // return all_data_data;
  let count = data.count;
  let offset = data.offset;
  let batchTimes = Math.ceil(count / MAX_LIMIT);
  let tasks = [];
  for (let i = 0; i < batchTimes; i++) {
    let skipCount = i * MAX_LIMIT;
    let limitCount;
    if (count - skipCount > MAX_LIMIT) {
      limitCount = MAX_LIMIT;
    } else {
      limitCount = count - skipCount;
    }
    let promis = collection.orderBy('wxgame.score', 'desc')
      .skip(skipCount + offset)
      .limit(limitCount)
      .get();
    tasks.push(promis);
  }
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}