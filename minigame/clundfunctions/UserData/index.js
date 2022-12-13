
// 云函数入口函数
exports.main = async (event, context) => {
  let { OPENID, APPID, UNIONID } = cloud.getWXContext();
  let { func, data } = event;
  let res;
  if (func === 'reportData') {
    res = await reportData(OPENID, data);
    return {
      succeed: res.succeed
    }
  } else if (func === 'getData') {
    res = await getData(OPENID, data);
    return {
      succeed: res.successed,
      KVDataList: res.KVDataList,
      openId: OPENID,
      appId: APPID,
      unionId: UNIONID
    }
  }
}

const reportData = async (openId, data) => {
  await wx.setUserCloudStorage({
    KVDataList: data.KVDataList,
  }).then(
    () => {
      return {
        succeed: true
      }
    },
    () => {
      return {
        succeed: false
      }
    })
}

const getData = async (openId, keyList) => {
  await wx.getUserCloudStorage({
    keyList: keyList,
  }).then(
    (res) => {
      return {
        succeed: true,
        KVDataList: res.KVDataList,
      }
    },
    () => {
      return {
        succeed: false
      }
    }
  )
}