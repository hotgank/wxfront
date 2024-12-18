// utils/request.js
// export const BASE_URL = 'https://localhost:8081'; // 本地测试端口
export const BASE_URL='https://zeropw.cn:8081';//后端部署测试端口
// export const BASE_URL='http://192.168.45.50:8080';//本地真机测试
const request = (options) => {
  const token = uni.getStorageSync('token'); // 获取存储的 token
  const { url, method = 'GET', data, params } = options;
 
  // 构建请求的 URL，如果是 GET 请求且有 params，转换为查询字符串
  let requestUrl = BASE_URL + url;
  if (method === 'GET' && params) {
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    requestUrl += `?${queryString}`;
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: requestUrl,
      method,
      data: method !== 'GET' ? data : undefined, // GET 请求不需要 data
      header: {
        'Authorization': `Bearer ${token}`, // 设置 token
        'Content-Type': 'application/json',
        ...options.header,
      },
      success: (res) => {
        console.log(`${method} 请求成功:`, requestUrl, res);
        if (res.statusCode === 200) {
          resolve([null, res.data]);
        } else {
          console.error(`${method} 请求失败:`, requestUrl, res);
          reject([res.data, null]);
        }
      },
      fail: (err) => {
        console.error(`${method} 请求失败:`, requestUrl, err);
        reject([err, null]);
      },
    });
  });
};

export default request;
