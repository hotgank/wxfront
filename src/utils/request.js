// utils/request.js

export const BASE_URL = 'https://zeropw.cn:8081'; // 后端部署测试端口
// export const BASE_URL = 'https://localhost:8081'; // 本地测试端口
// export const BASE_URL = 'http://192.168.45.50:8080'; // 本地真机测试

const request = (options) => {
  const token = uni.getStorageSync('token'); // 获取存储的 token
  const { url, method = 'GET', data, params } = options;

  // 构建请求的 URL，如果是 GET 请求且有 params，转换为查询字符串
  let requestUrl = BASE_URL + url;
  if (method.toUpperCase() === 'GET' && params) {
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    requestUrl += `?${queryString}`;
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: requestUrl,
      method,
      data: method.toUpperCase() !== 'GET' ? data : undefined, // GET 请求不需要 data
      header: {
        'Authorization': `Bearer ${token}`, // 设置 token
        'Content-Type': 'application/json',
        ...options.header,
      },
      success: (res) => {
        console.log(`${method} 请求成功:`, requestUrl, res);
        const { statusCode, data: resData } = res;

        if (statusCode === 200) {
          resolve([null, resData]);
        } else if (statusCode !== 200) {
          // 认证失败，跳转到登录页面
          handleAuthError();
          reject([resData, null]);
        } else {
          console.error(`${method} 请求失败:`, requestUrl, res);
          reject([resData, null]);
        }
      },
      fail: (err) => {
        console.error(`${method} 请求失败:`, requestUrl, err);
        reject([err, null]);
      },
    });
  });
};

// 处理认证错误的函数
const handleAuthError = () => {
  // 清除存储的 token
  uni.removeStorageSync('token');

  // 获取当前页面路径，避免在登录页触发跳转
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const currentPagePath = `/${currentPage.route}`;

  // 定义登录页面的路径
  const loginPagePath = '/pages/Login/Login'; // 根据实际情况修改路径

  if (currentPagePath !== loginPagePath) {
    // 跳转到登录页面，并销毁所有其他页面
    uni.reLaunch({
      url: loginPagePath,
      success: () => {
        console.log('跳转到登录页面');
      },
      fail: (err) => {
        console.error('跳转登录页面失败:', err);
      },
    });
  }
};

export default request;
