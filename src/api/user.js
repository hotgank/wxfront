import request from '../utils/request';
import { BASE_URL } from '../utils/request';
/**
 * 获取用户信息
 * @returns {Promise<object>} 直接返回用户信息对象
 */
export const getUserInfo = async () => {
  try {
    const [err, res] = await request({
      url: '/api/user/getUserInfo',
      method: 'GET',
    });
    if (err) {
      throw new Error('获取用户信息失败');
    }
    console.log('获取用户信息成功:', res);
    if(res.avatarUrl)
      return {...res, avatarUrl: res.avatarUrl.replace('http://localhost:8080', `${BASE_URL}`)}

    return res; // 假设接口直接返回用户对象
  } catch (error) {
    console.error('获取用户信息时发生错误:', error);
    throw error; // 抛出错误供调用者处理
  }
};

/**
 * 上传用户昵称
 * @param {string} username - 新的用户名
 * @returns {Promise<string>} - 返回操作结果消息
 */
export const uploadUsername = async (username) => {
    if (!username) {
      throw new Error("Username is required");
    }
  
    try {
      const res = await request({
        url: "/api/user/uploadUsername",
        method: "POST",
        data: { username }, // 直接传递 JSON 对象
      });
  
      console.log("上传用户名成功:", res[1]);
      return res.message; // 假设接口返回 `message` 字段作为成功提示
    } catch (error) {
      console.error("上传用户名发生错误:", error);
      throw error; // 抛出错误，方便调用方处理
    }
  };
  

