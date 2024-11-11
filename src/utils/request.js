// utils/request.js
const BASE_URL = 'http://localhost:8080';//本地测试端口

const request = (options) => {
  const token = uni.getStorageSync('token'); // 获取存储的 token

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Authorization': `Bearer ${token}`, // 设置 token
        'Content-Type': 'application/json',
        ...options.header,
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve([null, res.data]);
        } else {
          reject([res.data, null]);
        }
      },
      fail: (err) => {
        reject([err, null]);
      },
    });
  });
};

export default request;
