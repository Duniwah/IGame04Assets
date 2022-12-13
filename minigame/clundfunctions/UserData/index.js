
// 云函数入口函数
exports.main = async (event, context) => {
  let { OPENID, APPID, UNIONID } = cloud.getWXContext();
  let { func, data } = event;
  let res;
  if (func === 'reportData') {
    res = await reportData();
  } else if (func === 'getData') {

  }

}

const reportData = async () => {

}

const getData = async () => {

}